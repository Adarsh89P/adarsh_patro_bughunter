'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, MousePointerClick, MoveDown } from 'lucide-react';
import { Character, type CharacterState } from './Character';
import { Bug } from './Bug';
import { Arrow } from './Arrow';
import {
  BUG_BY_PHASE,
  CHARACTER_BY_PHASE,
  useHeroCinematic,
  type HeroPhase,
  type HeroRefs,
} from './HeroTimeline';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsDesktop } from '@/hooks/useMediaQuery';
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
  shape: 'dot' | 'square' | 'shard';
  glow: boolean;
};

function buildParticles(count: number): Particle[] {
  const random = mulberry32(0x5eed);
  return Array.from({ length: count }, (_, id) => ({
    id,
    angle: random() * Math.PI * 2,
    distance: 120 + random() * 320,
    spin: (random() - 0.5) * 540,
    size: 5 + random() * 13,
    shape: (['dot', 'square', 'shard'] as const)[Math.floor(random() * 3)],
    glow: random() > 0.65,
  }));
}

const CHIPS = ['About', 'Skills', 'Experience', 'Projects'] as const;

export function BugHunterHero() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
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

  const particles = useMemo(() => buildParticles(isDesktop ? 46 : 20), [isDesktop]);
  const onPhase = useCallback((next: HeroPhase) => setPhase(next), []);

  useEffect(() => setMounted(true), []);

  /**
   * The opening beat: the character waves hello while the greeting is on screen.
   * It ends on a timer, or the moment the visitor starts the story by scrolling.
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

  const cinematic = mounted && !reducedMotion;
  useHeroCinematic(refs, { enabled: cinematic, isDesktop, onPhase });

  // The wave outranks the idle pose, but only before the story starts.
  const characterState: CharacterState =
    greeting && phase === 'intro' ? 'WAVE' : CHARACTER_BY_PHASE[phase];
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
          <div className="absolute left-1/2 top-1/3 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
          <div className="absolute inset-x-0 bottom-[8%] h-px bg-gradient-to-r from-transparent via-line to-transparent" />
        </div>

        {/* ── Scene 1: the greeting ─────────────────────────────────────── */}
        <div className="container relative z-20">
          <motion.div
            ref={intro}
            variants={stagger(0.09, 0.15)}
            initial="hidden"
            animate="show"
            className="max-w-xl pb-[26vh] sm:pb-0"
          >
            <motion.p variants={fadeUp} className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {profile.role}
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-[clamp(2.5rem,7vw,4.5rem)] font-semibold leading-[1.02]"
            >
              Hi, I&rsquo;m {profile.name.split(' ')[0]}
              <span className="block text-gradient">{profile.tagline}</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              {profile.summary}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/#about" className="btn-primary">
                Explore My Journey
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a href={profile.resume} className="btn-ghost" target="_blank" rel="noreferrer">
                <FileText className="h-4 w-4" aria-hidden />
                View Resume
              </a>
            </motion.div>

            <motion.p variants={fadeUp} className="mt-12 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-faint">
              <MoveDown className="h-3.5 w-3.5 animate-bounce" aria-hidden />
              {cinematic ? 'Scroll to begin the hunt' : 'Scroll to explore'}
            </motion.p>
          </motion.div>
        </div>

        {/* ── The stage: character, bug, arrow, explosion ────────────────── */}
        <div ref={scene} className="pointer-events-none absolute inset-0 z-10 origin-center">
          {/* character */}
          <div
            ref={character}
            className="absolute bottom-[5%] left-[6%] w-[34%] max-w-[150px] sm:bottom-[8%] sm:left-[52%] sm:w-[30%] lg:left-[54%] lg:w-[22%] lg:max-w-[300px]"
          >
            <div className="pointer-events-auto" onMouseEnter={replayGreeting} onFocus={replayGreeting}>
              <Character state={characterState} reducedMotion={reducedMotion} className="h-auto w-full" />
            </div>

            {/* "Hi 👋" bubble — shown while the character waves */}
            <motion.div
              aria-hidden={!greeting}
              initial={false}
              animate={greeting && phase === 'intro' ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 6 }}
              transition={{ duration: 0.4, ease: ease.out }}
              className="absolute -top-4 left-[58%] w-max max-w-[190px] rounded-2xl rounded-bl-sm border
                border-line bg-surface px-4 py-2.5 text-sm font-medium shadow-lift"
            >
              <span aria-hidden className="mr-1">👋</span>
              Hi! Let&rsquo;s hunt some bugs.
            </motion.div>

            {/* scroll-driven bubble for scene 2 */}
            {cinematic && (
              <div
                ref={bubble}
                className="absolute -top-4 left-[58%] w-max max-w-[190px] rounded-2xl rounded-bl-sm border
                  border-line bg-surface px-4 py-2.5 text-sm font-medium shadow-lift"
              >
                Wait&hellip; is that a bug?
              </div>
            )}
          </div>

          {/* bug — parked beside the hunter when the cinematic is off */}
          <div
            ref={bug}
            className={
              cinematic
                ? 'absolute bottom-[26%] left-[40%] w-[20%] max-w-[130px] opacity-0 sm:bottom-[30%] sm:left-[44%] sm:w-[10%] lg:left-[46%] lg:w-[8%]'
                : 'absolute bottom-[30%] left-[78%] w-[16%] max-w-[110px] sm:bottom-[34%] sm:left-[84%] sm:w-[10%] lg:w-[8%]'
            }
          >
            <Bug mood={bugMood} reducedMotion={reducedMotion} facingLeft className="h-auto w-full" />
          </div>

          {/* arrow + explosion only exist while the timeline can drive them */}
          {cinematic && (
            <>
              <div
                ref={arrow}
                className="absolute bottom-[30%] left-[46%] w-[14%] max-w-[110px] sm:bottom-[34%] sm:left-[58%] sm:w-[8%] lg:left-[60%] lg:w-[7%]"
              >
                <Arrow className="h-auto w-full" />
              </div>

              <div className="absolute bottom-[32%] left-[88%] sm:bottom-[36%] lg:left-[97%]">
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
                        'absolute block bg-[rgb(var(--bug))]',
                        particle.shape === 'dot' ? 'rounded-full' : '',
                        particle.shape === 'square' ? 'rounded-[3px]' : '',
                        particle.shape === 'shard' ? '[clip-path:polygon(50%_0%,100%_100%,0%_100%)]' : '',
                        particle.glow ? 'shadow-[0_0_14px_rgb(var(--bug)/0.7)]' : 'opacity-80',
                      ].join(' ')}
                      style={{ width: particle.size, height: particle.size }}
                    />
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
