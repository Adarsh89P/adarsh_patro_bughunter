'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, MousePointerClick, MoveDown } from 'lucide-react';
import type { CharacterState } from './Character';
import { CharacterArt } from './CharacterArt';
import { BugArt } from './BugArt';
import { Arrow } from './Arrow';
import { Clouds, Flora, Ground } from './HeroScenery';
import {
  BUG_BY_PHASE,
  CHARACTER_BY_PHASE,
  useHeroCinematic,
  type HeroPhase,
  type HeroRefs,
} from './HeroTimeline';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useHasFinePointer, useIsDesktop } from '@/hooks/useMediaQuery';
import { ease, fadeUp, stagger } from '@/lib/animations';
import { profile } from '@/lib/content';

/** Deterministic PRNG so particle layout is identical on every render. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Particle = {
  id: number;
  angle: number;
  distance: number;
  spin: number;
  size: number;
  shape: 'bug' | 'dot' | 'square' | 'shard';
  glow: boolean;
};

/**
 * The blast is mostly miniature bugs, with debris mixed in: the beat reads as
 * the bug splitting into copies of itself rather than as generic confetti.
 */
function buildParticles(count: number): Particle[] {
  const random = mulberry32(0x5eed);
  return Array.from({ length: count }, (_, id) => {
    const roll = random();
    const shape: Particle['shape'] =
      roll < 0.62 ? 'bug' : roll < 0.75 ? 'dot' : roll < 0.88 ? 'square' : 'shard';
    return {
      id,
      angle: random() * Math.PI * 2,
      distance: 120 + random() * 320,
      spin: (random() - 0.5) * 540,
      // Bugs need a little more room than a speck of debris to stay readable.
      size: (shape === 'bug' ? 11 : 5) + random() * 13,
      shape,
      glow: random() > 0.65,
    };
  });
}

/** A bug reduced to its silhouette — legible even at ~12px across. */
function MiniBug({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <g fill="currentColor">
        <ellipse cx="12" cy="13.5" rx="6.5" ry="7" />
        <circle cx="12" cy="6.5" r="3.6" />
        <rect x="11.4" y="7" width="1.2" height="12" rx="0.6" opacity="0.45" />
      </g>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none">
        <path d="M5.5 10 L1.5 7.5M5.5 13.5 L1 13.5M5.5 17 L1.5 19.5" />
        <path d="M18.5 10 L22.5 7.5M18.5 13.5 L23 13.5M18.5 17 L22.5 19.5" />
        <path d="M10 4 L8 1M14 4 L16 1" />
      </g>
    </svg>
  );
}

const CHIPS = ['About', 'Skills', 'Experience', 'Projects'] as const;

export function BugHunterHero() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const finePointer = useHasFinePointer();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<HeroPhase>('intro');
  const [greeting, setGreeting] = useState(true);

  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const character = useRef<HTMLDivElement>(null);
  const bug = useRef<HTMLDivElement>(null);
  const arrow = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const outro = useRef<HTMLDivElement>(null);
  const parallax = useRef<HTMLDivElement>(null);

  const refs = useMemo<HeroRefs>(
    () => ({ root, stage, intro, scene, character, bug, arrow, bubble, flash, particles: particlesRef, outro, parallax }),
    [],
  );

  const onPhase = useCallback((next: HeroPhase) => setPhase(next), []);

  useEffect(() => setMounted(true), []);

  /**
   * The opening beat: the speech bubble greets the visitor while the hunter
   * holds his standing pose. It ends on a timer, or the moment the visitor
   * starts the story by scrolling.
   */
  useEffect(() => {
    if (reducedMotion) {
      setGreeting(false);
      return;
    }

    const stop = () => setGreeting(false);
    const timer = window.setTimeout(stop, 5200);
    const onScroll = () => {
      if (window.scrollY > 40) stop();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [reducedMotion]);

  /**
   * The pinned, scroll-scrubbed cinematic is desktop-only — which is what
   * `useIsDesktop` always claimed, but the check was missing, so phones were
   * running a 560vh pinned timeline with ~30 scrubbed tweens and a particle
   * burst. That is what made mobile hang. Below `lg` the hero renders as the
   * compact static scene instead, matching the storyboard's mobile panel.
   *
   * The pointer check covers tablets, which clear 1024px but scroll on a touch
   * compositor the scrubbed timeline fights with.
   */
  const cinematic = mounted && !reducedMotion && isDesktop && finePointer;
  useHeroCinematic(refs, { enabled: cinematic, isDesktop, onPhase });

  // Particles only exist inside the cinematic, so building them otherwise is
  // pure waste on the devices that can least afford it.
  const particles = useMemo(() => (cinematic ? buildParticles(46) : []), [cinematic]);


  /**
   * Publish the shot line as `--shot`: the height, measured up from the scene's
   * bottom, at which the arrow leaves the bow.
   *
   * The hunt has to read horizontally. Before this the bug, arrow and impact sat
   * on hardcoded viewport percentages that had nothing to do with the character,
   * so they fanned out into a wedge that got worse as the character resized.
   *
   * The line cannot be written as static CSS: the character sits in a grid row
   * that is vertically centred, so the ground's position depends on the row's
   * own content height. Measuring is the honest way to get it.
   *
   * `offsetTop`/`offsetHeight` are used rather than getBoundingClientRect
   * because the scene carries GSAP's pan and zoom during the timeline, and
   * offsets ignore transforms — so the value stays correct mid-scroll.
   */
  useEffect(() => {
    if (!mounted) return;
    const sceneEl = scene.current;
    const charEl = character.current;
    if (!sceneEl || !charEl) return;

    // Where the arrow sits in the pose art, as a fraction of the box height
    // above its bottom edge. Measured off aim.png (tip centre y=110.6 of 320).
    const ARROW_FROM_BOTTOM = 0.654;

    const apply = () => {
      let top = 0;
      for (let n: HTMLElement | null = charEl; n && n !== sceneEl; n = n.offsetParent as HTMLElement | null) {
        top += n.offsetTop;
      }
      const shotFromTop = top + charEl.offsetHeight * (1 - ARROW_FROM_BOTTOM);
      sceneEl.style.setProperty('--shot', `${Math.round(sceneEl.offsetHeight - shotFromTop)}px`);
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(charEl);
    ro.observe(sceneEl);
    window.addEventListener('resize', apply);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', apply);
    };
  }, [mounted, cinematic]);

  // The greeting drives the speech bubble only. The hunter holds his standing
  // pose throughout the intro, matching the storyboard's opening panel.
  const characterState: CharacterState = CHARACTER_BY_PHASE[phase];
  const bugMood = BUG_BY_PHASE[phase];

  const replayGreeting = useCallback(() => {
    if (reducedMotion || phase !== 'intro') return;
    setGreeting(true);
    window.setTimeout(() => setGreeting(false), 4200);
  }, [phase, reducedMotion]);

  return (
    <section
      id="home"
      ref={root}
      aria-label="Introduction"
      className={cinematic ? 'relative h-[560vh] lg:h-[620vh]' : 'relative'}
    >
      <div
        ref={stage}
        className="relative flex h-[100svh] min-h-[560px] w-full items-center overflow-hidden"
      >
        {/* backdrop */}
        <div ref={parallax} className="pointer-events-none absolute inset-0 -z-10">
          <div className="grid-backdrop absolute inset-0" />
          <div className="absolute left-1/2 top-1/3 hidden h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px] lg:block" />
          <Clouds className="absolute inset-0" />
        </div>

        {/*
          Everything the camera pans and zooms. The hero copy and the character
          live in one grid row aligned to a shared baseline (`items-end`), which
          is also where the ground is drawn — so the hunter stands on the same
          line the text sits on rather than floating independently of it.
        */}
        <div ref={scene} className="pointer-events-none absolute inset-0 z-10 origin-center">
          <div className="container flex h-full items-center pt-20 lg:pt-24">
            <div className="relative grid w-full items-end gap-y-3 sm:gap-y-6 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:gap-x-10">
              {/* the ground, on the row's baseline — wider than the viewport so
                  the camera pan never reveals its edge */}
              <div className="pointer-events-none absolute bottom-0 left-1/2 h-[70px] w-[200vw] -translate-x-1/2">
                <Ground className="absolute inset-0 h-full w-full" />
                <Flora className="absolute inset-0 h-full w-full" />
              </div>

              {/* ── Scene 1: the greeting ─────────────────────────────────── */}
              <motion.div
                ref={intro}
                variants={stagger(0.09, 0.15)}
                initial="hidden"
                animate="show"
                className="pointer-events-auto pb-8 lg:pb-10"
              >
                <motion.p variants={fadeUp} className="eyebrow">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {profile.role}
                </motion.p>

                <motion.h1
                  variants={fadeUp}
                  className="mt-5 text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.06]"
                >
                  <span className="block">Hi,</span>
                  <span className="block">I&rsquo;m {profile.name.split(' ')[0]}</span>
                  <span className="block text-gradient">{profile.tagline}</span>
                </motion.h1>

                <motion.p variants={fadeUp} className="mt-5 max-w-sm text-sm leading-relaxed text-muted sm:text-base">
                  {profile.summary}
                </motion.p>

                <motion.div variants={fadeUp} className="mt-7 flex flex-wrap items-center gap-3">
                  <Link href="/#about" className="btn-primary">
                    Explore My Journey
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <a href={profile.resume} className="btn-ghost" target="_blank" rel="noreferrer">
                    <FileText className="h-4 w-4" aria-hidden />
                    View Resume
                  </a>
                </motion.div>

                <motion.p variants={fadeUp} className="mt-8 hidden items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-faint sm:flex">
                  <MoveDown className="h-3.5 w-3.5 animate-bounce" aria-hidden />
                  {cinematic ? 'Scroll to begin the hunt' : 'Scroll to explore'}
                </motion.p>
              </motion.div>

              {/* ── the hunter, standing on that same line ─────────────────── */}
              {/* The pose art is trimmed to the figure, so its feet already sit
                  on the box's bottom edge — no nudge needed to meet the ground.

                  Only the base (phone) size is enlarged, to match the storyboard's
                  mobile panel where the hunter stands tall beneath the heading.
                  The sm and lg widths are the originals, so tablet and desktop
                  are untouched. */}
              <div className="relative justify-self-center lg:justify-self-start">
                <div ref={character} className="relative w-[74%] min-w-[190px] max-w-[300px] sm:w-[44%] sm:max-w-[220px] lg:w-[330px] lg:max-w-none">
                  <div className="pointer-events-auto" onMouseEnter={replayGreeting} onFocus={replayGreeting}>
                    <CharacterArt
                      state={characterState}
                      reducedMotion={reducedMotion}
                      // Without the cinematic the hunter never leaves his
                      // standing pose, so phones fetch one drawing, not five.
                      states={cinematic ? undefined : ['IDLE']}
                      className="h-auto w-full"
                    />
                  </div>

                  {/* "Hi 👋" bubble — shown while the character waves */}
                  <motion.div
                    aria-hidden={!greeting}
                    initial={false}
                    animate={greeting && phase === 'intro' ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 6 }}
                    transition={{ duration: 0.4, ease: ease.out }}
                    className="absolute left-[56%] top-[2%] w-max max-w-[150px] rounded-2xl rounded-bl-md border border-line
                      bg-elevated px-3.5 py-2.5 text-[13px] font-medium leading-snug shadow-lift sm:left-[82%]
                      sm:top-[4%] sm:max-w-[180px] sm:px-4 sm:py-3 sm:text-sm"
                  >
                    <span aria-hidden className="mr-1">👋</span>
                    Hi! Let&rsquo;s hunt some <span className="text-accent">bugs!</span>
                  </motion.div>

                  {/* scroll-driven bubble for scene 2 */}
                  {cinematic && (
                    <div
                      ref={bubble}
                      className="absolute left-[56%] top-[2%] w-max max-w-[150px] rounded-2xl rounded-bl-md border border-line
                        bg-elevated px-3.5 py-2.5 text-[13px] font-medium leading-snug shadow-lift sm:left-[82%]
                        sm:top-[4%] sm:max-w-[180px] sm:px-4 sm:py-3 sm:text-sm"
                    >
                      Wait&hellip; is that a bug?
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* bug — parked beside the hunter when the cinematic is off.
              The wrapper owns the position so its centre sits on the shot line;
              the inner element is what GSAP drives, since GSAP overwrites the
              whole transform and would otherwise wipe out the centring. */}
          <div
            className={
              cinematic
                ? 'absolute bottom-[var(--shot,30%)] left-[40%] w-[20%] max-w-[130px] translate-y-1/2 sm:left-[44%] sm:w-[10%] lg:left-[46%] lg:w-[8%]'
                : 'absolute bottom-[var(--shot,30%)] left-[78%] w-[16%] max-w-[110px] translate-y-1/2 sm:left-[84%] sm:w-[10%] lg:w-[8%]'
            }
          >
            <div ref={bug} className={cinematic ? 'opacity-0' : undefined}>
              <BugArt mood={bugMood} reducedMotion={reducedMotion} facingLeft className="h-auto w-full" />
            </div>
          </div>

          {/* arrow + explosion only exist while the timeline can drive them */}
          {cinematic && (
            <>
              <div className="absolute bottom-[var(--shot,30%)] left-[46%] w-[14%] max-w-[110px] translate-y-1/2 sm:left-[58%] sm:w-[8%] lg:left-[60%] lg:w-[7%]">
                <div ref={arrow}>
                  <Arrow className="h-auto w-full" />
                </div>
              </div>

              <div className="absolute bottom-[var(--shot,32%)] left-[88%] lg:left-[97%]">
                <div
                  ref={flash}
                  className="absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full
                    bg-[radial-gradient(circle,rgb(var(--bug-soft))_0%,rgb(var(--bug))_35%,transparent_70%)] blur-[2px]"
                />
                <div ref={particlesRef} className="absolute -translate-x-1/2 -translate-y-1/2">
                  {particles.map((particle) => (
                    <span
                      key={particle.id}
                      data-particle
                      data-angle={particle.angle}
                      data-distance={particle.distance}
                      data-spin={particle.spin}
                      className={[
                        'absolute block',
                        // A bug carries its own shape, so it takes the colour as
                        // `currentColor` instead of a background fill.
                        particle.shape === 'bug'
                          ? 'text-[rgb(var(--bug))]'
                          : 'bg-[rgb(var(--bug))]',
                        particle.shape === 'dot' ? 'rounded-full' : '',
                        particle.shape === 'square' ? 'rounded-[3px]' : '',
                        particle.shape === 'shard' ? '[clip-path:polygon(50%_0%,100%_100%,0%_100%)]' : '',
                        particle.glow
                          ? particle.shape === 'bug'
                            ? 'drop-shadow-[0_0_10px_rgb(var(--bug)/0.7)]'
                            : 'shadow-[0_0_14px_rgb(var(--bug)/0.7)]'
                          : 'opacity-80',
                      ].join(' ')}
                      style={{ width: particle.size, height: particle.size }}
                    >
                      {particle.shape === 'bug' && <MiniBug className="h-full w-full" />}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Scene 6: the portfolio forms ───────────────────────────────── */}
        {cinematic && (
          <div
            ref={outro}
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
          >
            <p className="text-[clamp(1.75rem,5vw,3.25rem)] font-semibold leading-tight">
              Hi, I&rsquo;m <span className="text-gradient">{profile.name.split(' ')[0]}</span>
            </p>
            <p className="mt-2 text-base text-muted sm:text-lg">{profile.role}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {CHIPS.map((chip) => (
              <span
                key={chip}
                data-chip
                className="rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-accent"
              >
                {chip}
              </span>
            ))}
            </div>
          </div>
        )}

        {!cinematic && mounted && (
          <p className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            <MousePointerClick className="mr-1.5 inline h-3.5 w-3.5" aria-hidden />
            Reduced motion — the story continues below
          </p>
        )}
      </div>
    </section>
  );
}

export default BugHunterHero;
