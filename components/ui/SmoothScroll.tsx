'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Lenis smooth scrolling, kept in lockstep with GSAP's ScrollTrigger so pinned
 * sections stay in sync. Disabled entirely for reduced-motion visitors.
 */
export function SmoothScroll() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    /**
     * Touch devices keep native scrolling.
     *
     * Lenis replaces the browser's own momentum with a JS rAF loop and pushes a
     * ScrollTrigger update on every frame. Desktop absorbs that; phones do not —
     * it competes with the compositor-driven scroll they already do well, which
     * is felt as stutter and delayed input. A coarse pointer is the signal, not
     * viewport width, because that is what actually distinguishes touch.
     */
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let frame = 0;
    let lenis: Lenis | null = null;
    let cancelled = false;

    const start = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6,
      });

      lenis.on('scroll', ScrollTrigger.update);

      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
      ScrollTrigger.refresh();
    };

    void start();

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, [reducedMotion]);

  return null;
}

export default SmoothScroll;
