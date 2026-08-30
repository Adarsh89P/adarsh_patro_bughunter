'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { CharacterState } from './Character';
import type { BugMood } from './Bug';

/**
 * Scroll positions (0 → 1 of the pinned sequence) where each beat of the story
 * lands. Keeping them in one table makes the choreography readable and lets the
 * character/bug state machines share the same source of truth as the tweens.
 */
export const BEATS = {
  intro: 0,
  bugAppears: 0.12,
  notice: 0.2,
  hunt: 0.28,
  stop: 0.46,
  aim: 0.52,
  pull: 0.6,
  shoot: 0.68,
  explode: 0.72,
  spread: 0.78,
  portfolio: 0.88,
} as const;

export type HeroPhase = keyof typeof BEATS;

export function phaseFor(progress: number): HeroPhase {
  const entries = Object.entries(BEATS) as [HeroPhase, number][];
  let current: HeroPhase = 'intro';
  for (const [name, at] of entries) {
    if (progress >= at) current = name;
  }
  return current;
}

export const CHARACTER_BY_PHASE: Record<HeroPhase, CharacterState> = {
  intro: 'IDLE',
  bugAppears: 'LOOK',
  notice: 'ALERT',
  hunt: 'RUN',
  stop: 'STOP',
  aim: 'AIM',
  pull: 'PULL_ARROW',
  shoot: 'SHOOT',
  // After the shot the hunter simply stands, as the storyboard has him — the
  // salute is kept for the Contact section, where "Mission Complete" earns it.
  explode: 'IDLE',
  spread: 'IDLE',
  portfolio: 'IDLE',
};

export const BUG_BY_PHASE: Record<HeroPhase, BugMood> = {
  intro: 'CRAWL',
  bugAppears: 'CRAWL',
  notice: 'TAUNT',
  hunt: 'FLEE',
  stop: 'PANIC',
  aim: 'PANIC',
  pull: 'PANIC',
  shoot: 'PANIC',
  explode: 'HIT',
  spread: 'HIT',
  portfolio: 'HIT',
};

export type HeroRefs = {
  root: RefObject<HTMLDivElement | null>;
  stage: RefObject<HTMLDivElement | null>;
  intro: RefObject<HTMLDivElement | null>;
  scene: RefObject<HTMLDivElement | null>;
  character: RefObject<HTMLDivElement | null>;
  bug: RefObject<HTMLDivElement | null>;
  arrow: RefObject<HTMLDivElement | null>;
  bubble: RefObject<HTMLDivElement | null>;
  flash: RefObject<HTMLDivElement | null>;
  particles: RefObject<HTMLDivElement | null>;
  outro: RefObject<HTMLDivElement | null>;
  parallax: RefObject<HTMLDivElement | null>;
};

type Options = {
  enabled: boolean;
  isDesktop: boolean;
  onPhase: (phase: HeroPhase) => void;
  onProgress?: (progress: number) => void;
};

/**
 * Builds the pinned, scroll-scrubbed hero cinematic:
 * hero → bug appears → chase → aim → shoot → explosion → particles → portfolio.
 */
export function useHeroCinematic(refs: HeroRefs, { enabled, isDesktop, onPhase, onProgress }: Options) {
  useEffect(() => {
    if (!enabled) return;
    const root = refs.root.current;
    const stage = refs.stage.current;
    if (!root || !stage) return;

    gsap.registerPlugin(ScrollTrigger);

    const particles = refs.particles.current
      ? Array.from(refs.particles.current.querySelectorAll<HTMLElement>('[data-particle]'))
      : [];
    const chips = refs.outro.current
      ? Array.from(refs.outro.current.querySelectorAll<HTMLElement>('[data-chip]'))
      : [];

    // Positions are xPercent values (percentages of each actor's own width), so
    // the choreography scales with the responsive widths set on the markup.
    const pos = isDesktop
      ? {
          charRun: 56,
          bugStart: 850,
          bugIn: 500,
          bugFlee: 600,
          bugStop: 612,
          arrowStart: 300,
          arrowFly: 480,
          camera: -18,
          parallax: -8,
          zoom: 1.06,
        }
      : {
          charRun: 16,
          bugStart: 380,
          bugIn: 200,
          bugFlee: 190,
          bugStop: 196,
          arrowStart: 0,
          arrowFly: 290,
          camera: -8,
          parallax: -3,
          zoom: 1.02,
        };
    let lastPhase: HeroPhase | null = null;

    const ctx = gsap.context(() => {
      gsap.set(refs.bug.current, { xPercent: pos.bugStart, opacity: 0 });
      gsap.set(refs.arrow.current, { opacity: 0, xPercent: pos.arrowStart });
      gsap.set(refs.bubble.current, { autoAlpha: 0, scale: 0.85, y: 8 });
      gsap.set(refs.flash.current, { opacity: 0, scale: 0.2 });
      gsap.set(refs.outro.current, { opacity: 0, y: 24 });
      gsap.set(particles, { opacity: 0, x: 0, y: 0, scale: 0 });
      gsap.set(chips, { opacity: 0, scale: 0.7, y: 10 });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          pin: stage,
          pinSpacing: false,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            onProgress?.(self.progress);
            const phase = phaseFor(self.progress);
            if (phase !== lastPhase) {
              lastPhase = phase;
              onPhase(phase);
            }
          },
        },
      });

      // ── Scene 1 → 2: the hero copy steps aside, the bug crawls in ──────────
      tl.to(refs.intro.current, { opacity: 0, y: -40, duration: 0.12 }, 0.04)
        .to(refs.bug.current, { xPercent: pos.bugIn, opacity: 1, duration: 0.14, ease: 'power1.out' }, BEATS.bugAppears)
        .to(refs.bubble.current, { autoAlpha: 1, scale: 1, y: 0, duration: 0.05 }, BEATS.notice)
        .to(refs.bubble.current, { autoAlpha: 0, scale: 0.9, duration: 0.04 }, BEATS.hunt)

        // ── Scene 3: the hunt — both move, background parallaxes ─────────────
        .to(refs.bug.current, { xPercent: pos.bugFlee, duration: 0.18, ease: 'none' }, BEATS.hunt)
        .to(refs.character.current, { xPercent: pos.charRun, duration: 0.18, ease: 'none' }, BEATS.hunt)
        .to(refs.parallax.current, { xPercent: pos.parallax, duration: 0.18, ease: 'none' }, BEATS.hunt)
        // camera pan — the frame follows the hunter, so the backdrop streaks past
        .to(refs.scene.current, { xPercent: pos.camera, duration: 0.2, ease: 'power1.inOut' }, BEATS.hunt)

        // ── Scene 4: stop, aim, draw ─────────────────────────────────────────
        .to(refs.bug.current, { xPercent: pos.bugStop, duration: 0.06 }, BEATS.stop)
        .to(refs.scene.current, { scale: pos.zoom, duration: 0.16, ease: 'power1.inOut' }, BEATS.aim)

        // ── Scene 4b: the shot ───────────────────────────────────────────────
        .to(refs.arrow.current, { opacity: 1, duration: 0.005 }, BEATS.shoot)
        .fromTo(
          refs.arrow.current,
          { xPercent: pos.arrowStart },
          { xPercent: pos.arrowFly, duration: 0.04, ease: 'power2.in' },
          BEATS.shoot,
        )
        .to(refs.arrow.current, { opacity: 0, duration: 0.004 }, BEATS.explode)

        // ── Scene 5: the explosion ───────────────────────────────────────────
        .to(refs.bug.current, { scale: 1.25, duration: 0.012 }, BEATS.explode)
        .to(refs.bug.current, { scale: 0, opacity: 0, duration: 0.02, ease: 'power2.in' }, BEATS.explode + 0.012)
        .to(refs.flash.current, { opacity: 0.9, scale: 1, duration: 0.016, ease: 'power2.out' }, BEATS.explode)
        .to(refs.flash.current, { opacity: 0, scale: 1.9, duration: 0.05, ease: 'power2.out' }, BEATS.explode + 0.016)
        .to(refs.scene.current, { scale: 1, duration: 0.08 }, BEATS.explode);

      // ── Scene 6: particles spread, then become the portfolio ───────────────
      particles.forEach((particle, index) => {
        const angle = Number(particle.dataset.angle ?? 0);
        const distance = Number(particle.dataset.distance ?? 200);
        const spin = Number(particle.dataset.spin ?? 180);
        const dx = Math.cos(angle) * distance * (isDesktop ? 1 : 0.6);
        const dy = Math.sin(angle) * distance * (isDesktop ? 1 : 0.6);

        tl.to(
          particle,
          { opacity: 1, scale: 1, duration: 0.01 },
          BEATS.explode + index * 0.0004,
        ).to(
          particle,
          { x: dx, y: dy, rotate: spin, duration: 0.14, ease: 'power2.out' },
          BEATS.explode + index * 0.0004,
        ).to(
          particle,
          { opacity: 0, scale: 0.2, duration: 0.06, ease: 'power1.in' },
          BEATS.spread + index * 0.0006,
        );
      });

      // A few fragments settle into the section chips — the visual link between
      // the exploded bug and the portfolio.
      tl.to(refs.scene.current, { opacity: 0, duration: 0.07, ease: 'power1.out' }, BEATS.spread + 0.03).to(
        refs.outro.current,
        { opacity: 1, y: 0, duration: 0.06 },
        BEATS.spread + 0.02,
      );
      chips.forEach((chip, index) => {
        tl.to(
          chip,
          { opacity: 1, scale: 1, y: 0, duration: 0.05, ease: 'back.out(1.7)' },
          BEATS.portfolio - 0.05 + index * 0.012,
        );
      });

      // Pin the timeline's length to exactly 1 so every BEATS value lines up with
      // scroll progress — otherwise the last tween's end defines the duration and
      // the whole story drifts out of sync with the phase thresholds.
      tl.set({}, {}, 1);
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, [enabled, isDesktop, onPhase, onProgress, refs]);
}
