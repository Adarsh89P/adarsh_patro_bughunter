'use client';

import { memo } from 'react';
import { motion, type Transition, type Variants } from 'framer-motion';
import { ease } from '@/lib/animations';

/**
 * The character's state machine. Scroll progress (or a scripted intro) picks the
 * state; every limb group below declares a pose for each one, so transitions
 * between states are interpolated rather than cut.
 *
 * IDLE → WAVE → LOOK → ALERT → RUN → STOP → AIM → PULL_ARROW → SHOOT → CELEBRATE
 */
export type CharacterState =
  | 'IDLE'
  | 'WAVE'
  | 'LOOK'
  | 'ALERT'
  | 'RUN'
  | 'STOP'
  | 'AIM'
  | 'PULL_ARROW'
  | 'SHOOT'
  | 'CELEBRATE';

type CharacterProps = {
  state?: CharacterState;
  reducedMotion?: boolean;
  className?: string;
  /** Mirrors the character so it can face left. */
  facingLeft?: boolean;
  /** Ambient dark-mode glow — worth turning off for small, inline instances. */
  halo?: boolean;
  title?: string;
};

const limb: Transition = { duration: 0.55, ease: ease.out };
const snap: Transition = { duration: 0.28, ease: ease.out };

/**
 * Rotates around a point in the SVG's own coordinate system.
 * Framer Motion always writes `transform-origin` itself, so the pivot has to be
 * handed to it as `originX`/`originY` — a plain `transformOrigin` gets replaced.
 */
const pivot = (x: number, y: number) => ({
  transformBox: 'view-box' as const,
  originX: `${x}px`,
  originY: `${y}px`,
});

const bodyVariants: Variants = {
  IDLE: { y: [0, -2.5, 0], rotate: 0, transition: { y: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' } } },
  WAVE: { y: [0, -3, 0], rotate: 0, transition: { y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } } },
  LOOK: { y: [0, -2, 0], rotate: 0, transition: { y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } } },
  ALERT: { y: -4, rotate: -1, transition: snap },
  RUN: {
    y: [0, -7, 0],
    rotate: 6,
    transition: { y: { duration: 0.42, repeat: Infinity, ease: 'easeInOut' }, rotate: limb },
  },
  STOP: { y: 0, rotate: -3, transition: snap },
  AIM: { y: 0, rotate: 0, transition: limb },
  PULL_ARROW: { y: 0, rotate: 0, transition: limb },
  SHOOT: { y: [0, -2, 0], rotate: -2, transition: { duration: 0.34, ease: ease.out } },
  CELEBRATE: { y: [0, -3, 0], rotate: 0, transition: { y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' } } },
};

const headVariants: Variants = {
  IDLE: { rotate: [0, 2.5, 0, -2, 0], transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' } },
  WAVE: { rotate: [-3, 2, -3], transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } },
  LOOK: { rotate: 9, transition: limb },
  ALERT: { rotate: 12, transition: snap },
  RUN: { rotate: 7, transition: limb },
  STOP: { rotate: 5, transition: snap },
  AIM: { rotate: 6, transition: limb },
  PULL_ARROW: { rotate: 6, transition: limb },
  SHOOT: { rotate: 4, transition: snap },
  CELEBRATE: { rotate: [0, -3, 0], transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } },
};

/** Front arm: waves, then carries the bow forward for the shot. */
const armFrontVariants: Variants = {
  IDLE: { rotate: [8, 12, 8], transition: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' } },
  WAVE: {
    rotate: [-132, -158, -132],
    transition: { duration: 0.62, repeat: Infinity, ease: 'easeInOut' },
  },
  LOOK: { rotate: 10, transition: limb },
  ALERT: { rotate: -18, transition: snap },
  RUN: { rotate: [-46, 44, -46], transition: { duration: 0.42, repeat: Infinity, ease: 'easeInOut' } },
  STOP: { rotate: -30, transition: snap },
  AIM: { rotate: -88, transition: limb },
  PULL_ARROW: { rotate: -90, transition: limb },
  SHOOT: { rotate: -92, transition: snap },
  CELEBRATE: { rotate: -14, transition: limb },
};

/** Back arm: holds the bow at rest, draws the string during the shot. */
const armBackVariants: Variants = {
  IDLE: { rotate: [-8, -11, -8], transition: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' } },
  WAVE: { rotate: -10, transition: limb },
  LOOK: { rotate: -9, transition: limb },
  ALERT: { rotate: -14, transition: snap },
  RUN: { rotate: [50, -40, 50], transition: { duration: 0.42, repeat: Infinity, ease: 'easeInOut' } },
  STOP: { rotate: 26, transition: snap },
  AIM: { rotate: -70, transition: limb },
  PULL_ARROW: { rotate: -82, transition: { duration: 0.5, ease: ease.out } },
  SHOOT: { rotate: -84, transition: { duration: 0.16, ease: ease.out } },
  CELEBRATE: { rotate: [146, 162, 146], transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } },
};

const legFrontVariants: Variants = {
  IDLE: { rotate: 0, transition: limb },
  WAVE: { rotate: 0, transition: limb },
  LOOK: { rotate: 0, transition: limb },
  ALERT: { rotate: -4, transition: snap },
  RUN: { rotate: [42, -34, 42], transition: { duration: 0.42, repeat: Infinity, ease: 'easeInOut' } },
  STOP: { rotate: 26, transition: snap },
  AIM: { rotate: 16, transition: limb },
  PULL_ARROW: { rotate: 16, transition: limb },
  SHOOT: { rotate: 16, transition: limb },
  CELEBRATE: { rotate: 8, transition: limb },
};

const legBackVariants: Variants = {
  IDLE: { rotate: 0, transition: limb },
  WAVE: { rotate: 0, transition: limb },
  LOOK: { rotate: 0, transition: limb },
  ALERT: { rotate: 4, transition: snap },
  RUN: { rotate: [-38, 46, -38], transition: { duration: 0.42, repeat: Infinity, ease: 'easeInOut' } },
  STOP: { rotate: -22, transition: snap },
  AIM: { rotate: -18, transition: limb },
  PULL_ARROW: { rotate: -18, transition: limb },
  SHOOT: { rotate: -18, transition: limb },
  CELEBRATE: { rotate: -8, transition: limb },
};

/** The bow moves between the resting hand and the drawn, forward position. */
const bowPositionVariants: Variants = {
  IDLE: { x: 44, y: 170, transition: limb },
  WAVE: { x: 44, y: 170, transition: limb },
  LOOK: { x: 44, y: 170, transition: limb },
  ALERT: { x: 47, y: 162, transition: snap },
  RUN: { x: 46, y: 166, transition: limb },
  STOP: { x: 104, y: 150, transition: snap },
  AIM: { x: 182, y: 118, transition: limb },
  PULL_ARROW: { x: 182, y: 118, transition: limb },
  SHOOT: { x: 182, y: 118, transition: snap },
  CELEBRATE: { x: 42, y: 174, transition: limb },
};

const bowVariants: Variants = {
  IDLE: { rotate: 12, scale: 1, transition: limb },
  WAVE: { rotate: 12, scale: 1, transition: limb },
  LOOK: { rotate: 12, scale: 1, transition: limb },
  ALERT: { rotate: 6, scale: 1, transition: snap },
  RUN: { rotate: 42, scale: 1, transition: limb },
  STOP: { rotate: 8, scale: 1, transition: snap },
  AIM: { rotate: 0, scale: 1, transition: limb },
  PULL_ARROW: { rotate: 0, scale: 1.02, transition: limb },
  SHOOT: { rotate: 0, scale: 1, transition: snap },
  CELEBRATE: { rotate: 20, scale: 1, transition: limb },
};

/** The nocked arrow only exists while the bow is drawn. */
const nockVariants: Variants = {
  IDLE: { opacity: 0, x: 0, transition: snap },
  WAVE: { opacity: 0, x: 0, transition: snap },
  LOOK: { opacity: 0, x: 0, transition: snap },
  ALERT: { opacity: 0, x: 0, transition: snap },
  RUN: { opacity: 0, x: 0, transition: snap },
  STOP: { opacity: 0, x: 0, transition: snap },
  AIM: { opacity: 1, x: -6, transition: snap },
  PULL_ARROW: { opacity: 1, x: -27, transition: { duration: 0.5, ease: ease.out } },
  SHOOT: { opacity: 0, x: 34, transition: { duration: 0.14, ease: 'linear' } },
  CELEBRATE: { opacity: 0, x: 0, transition: snap },
};

const stringVariants: Variants = {
  IDLE: { d: 'M0 -55 L0 55', transition: snap },
  WAVE: { d: 'M0 -55 L0 55', transition: snap },
  LOOK: { d: 'M0 -55 L0 55', transition: snap },
  ALERT: { d: 'M0 -55 L0 55', transition: snap },
  RUN: { d: 'M0 -55 L0 55', transition: snap },
  STOP: { d: 'M0 -55 L0 55', transition: snap },
  AIM: { d: 'M0 -55 L-7 0 L0 55', transition: snap },
  PULL_ARROW: { d: 'M0 -55 L-28 0 L0 55', transition: { duration: 0.5, ease: ease.out } },
  SHOOT: { d: 'M0 -55 L4 0 L0 55', transition: { duration: 0.12, ease: 'linear' } },
  CELEBRATE: { d: 'M0 -55 L0 55', transition: snap },
};

const eyeVariants: Variants = {
  IDLE: { scaleY: [1, 1, 0.1, 1], transition: { duration: 4.6, repeat: Infinity, times: [0, 0.9, 0.94, 1] } },
  WAVE: { scaleY: [1, 1, 0.1, 1], transition: { duration: 3.6, repeat: Infinity, times: [0, 0.9, 0.94, 1] } },
  LOOK: { scaleY: 1, transition: snap },
  ALERT: { scaleY: 1.25, transition: snap },
  RUN: { scaleY: 0.86, transition: snap },
  STOP: { scaleY: 1, transition: snap },
  AIM: { scaleY: 0.6, transition: snap },
  PULL_ARROW: { scaleY: 0.5, transition: snap },
  SHOOT: { scaleY: 0.72, transition: snap },
  CELEBRATE: { scaleY: [1, 1, 0.1, 1], transition: { duration: 4, repeat: Infinity, times: [0, 0.9, 0.94, 1] } },
};

const pupilVariants: Variants = {
  IDLE: { x: [0, 1.6, 0, -1.6, 0], transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' } },
  WAVE: { x: 0, transition: snap },
  LOOK: { x: 2.4, transition: snap },
  ALERT: { x: 2.8, transition: snap },
  RUN: { x: 2.2, transition: snap },
  STOP: { x: 2.4, transition: snap },
  AIM: { x: 2.6, transition: snap },
  PULL_ARROW: { x: 2.8, transition: snap },
  SHOOT: { x: 2.8, transition: snap },
  CELEBRATE: { x: 0, transition: snap },
};

const browVariants: Variants = {
  IDLE: { y: 0, rotate: 0, transition: snap },
  WAVE: { y: -1, rotate: -2, transition: snap },
  LOOK: { y: -1.5, rotate: -3, transition: snap },
  ALERT: { y: -4, rotate: -7, transition: snap },
  RUN: { y: -1, rotate: -5, transition: snap },
  STOP: { y: -1, rotate: -5, transition: snap },
  AIM: { y: 1.5, rotate: -9, transition: snap },
  PULL_ARROW: { y: 2, rotate: -10, transition: snap },
  SHOOT: { y: 1, rotate: -9, transition: snap },
  CELEBRATE: { y: -2, rotate: -3, transition: snap },
};

const mouthVariants: Variants = {
  IDLE: { d: 'M92 74 Q100 79 108 74', transition: snap },
  WAVE: { d: 'M91 73 Q100 83 109 73', transition: snap },
  LOOK: { d: 'M93 75 Q100 78 107 75', transition: snap },
  ALERT: { d: 'M95 74 Q100 82 105 74 Q100 78 95 74', transition: snap },
  RUN: { d: 'M93 74 Q100 81 107 74', transition: snap },
  STOP: { d: 'M93 75 Q100 78 107 75', transition: snap },
  AIM: { d: 'M94 76 L106 76', transition: snap },
  PULL_ARROW: { d: 'M94 76 L106 76', transition: snap },
  SHOOT: { d: 'M94 75 Q100 80 106 75', transition: snap },
  CELEBRATE: { d: 'M90 72 Q100 84 110 72', transition: snap },
};

/** Static pose used when the visitor prefers reduced motion. */
const STILL = 'IDLE';

function CharacterBase({
  state = 'IDLE',
  reducedMotion = false,
  className,
  facingLeft = false,
  halo = true,
  title = 'Illustration of Adarsh, the bug hunter, holding a bow',
}: CharacterProps) {
  const pose = reducedMotion ? STILL : state;

  return (
    <svg
      viewBox="0 0 200 300"
      className={className}
      role="img"
      aria-label={title}
      style={{ transform: facingLeft ? 'scaleX(-1)' : undefined, overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="ch-jacket" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="rgb(var(--ch-coat-hi))" />
          <stop offset="55%" stopColor="rgb(var(--ch-coat-lo))" />
          <stop offset="100%" stopColor="rgb(var(--ch-coat-lo))" />
        </linearGradient>
        <linearGradient id="ch-sleeve" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="rgb(var(--ch-coat-hi))" />
          <stop offset="100%" stopColor="rgb(var(--ch-coat-lo))" />
        </linearGradient>
        <linearGradient id="ch-trouser" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgb(var(--ch-leg))" />
          <stop offset="100%" stopColor="rgb(var(--ch-leg-dark))" />
        </linearGradient>
        <linearGradient id="ch-hair" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#3a3550" />
          <stop offset="45%" stopColor="#1d1a2b" />
          <stop offset="100%" stopColor="#0e0c17" />
        </linearGradient>
        <linearGradient id="ch-skin" x1="0.3" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor="#fadcbe" />
          <stop offset="60%" stopColor="#f2c9a4" />
          <stop offset="100%" stopColor="#e0ad83" />
        </linearGradient>
        <linearGradient id="ch-bow" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0%" stopColor="#c08b52" />
          <stop offset="45%" stopColor="#8a5a2e" />
          <stop offset="100%" stopColor="#5d3a1c" />
        </linearGradient>
        <linearGradient id="ch-quiver" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6b4d33" />
          <stop offset="100%" stopColor="#3d2a1a" />
        </linearGradient>
        <linearGradient id="ch-boot" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="rgb(var(--ch-boot-alt))" />
          <stop offset="100%" stopColor="rgb(var(--ch-boot))" />
        </linearGradient>
      </defs>

      {/* ambient halo — only visible in dark mode, keeps the silhouette readable */}
      {halo && (
        <ellipse
          cx="100"
          cy="160"
          rx="80"
          ry="118"
          fill="rgb(var(--accent))"
          opacity="var(--ch-halo)"
          style={{ filter: 'blur(36px)' }}
        />
      )}

      {/* contact shadow */}
      <ellipse cx="100" cy="286" rx="46" ry="7.5" fill="rgb(17 16 28)" opacity="0.16" />

      <motion.g
        variants={bodyVariants}
        animate={pose}
        initial={false}
        style={pivot(100, 284)}
        className="scene-layer"
      >
        {/* ---------- quiver + arrows, slung across the back ---------- */}
        <g transform="rotate(-22 100 140)">
          <rect x="62" y="96" width="22" height="66" rx="9" fill="url(#ch-quiver)" />
          <rect x="62" y="96" width="8" height="66" rx="4" fill="#7d5a3c" opacity="0.7" />
          <rect x="60" y="110" width="26" height="6" rx="3" fill="#241a10" opacity="0.7" />
          <rect x="60" y="146" width="26" height="6" rx="3" fill="#241a10" opacity="0.7" />
          {[0, 8, 16].map((offset) => (
            <g key={offset} transform={`translate(${offset} ${offset * 0.35})`}>
              <line x1="66" y1="98" x2="66" y2="56" stroke="#cbbba6" strokeWidth="2.6" strokeLinecap="round" />
              <path d="M66 56 l-5 11 h10 z" fill="rgb(var(--accent))" />
              <path d="M66 66 l-4.5 9 h9 z" fill="rgb(var(--accent-soft))" opacity="0.85" />
            </g>
          ))}
        </g>

        {/* ---------- legs ---------- */}
        <motion.g variants={legBackVariants} animate={pose} initial={false} style={pivot(89, 168)}>
          <path d="M78 160 h22 l-3 54 l-2 48 h-16 l-2 -48 z" fill="rgb(var(--ch-leg-dark))" />
          <path d="M80 212 h17" stroke="rgb(17 16 28)" strokeWidth="1.6" opacity="0.25" fill="none" />
          {/* boot */}
          <path
            d="M78 254 h20 v13 l9 4 c4 1.5 5.5 3.5 5.5 6.5 h-38 c-1 -5 0 -8 3.5 -9.5 z"
            fill="url(#ch-boot)"
          />
          <path d="M74.5 271 h38 v5 h-38 z" fill="rgb(17 16 28)" opacity="0.55" />
          <path d="M80 258 h18 M80 264 h18" stroke="#8e8aa5" strokeWidth="1.4" opacity="0.4" />
        </motion.g>

        <motion.g variants={legFrontVariants} animate={pose} initial={false} style={pivot(111, 168)}>
          <path d="M100 160 h22 l-3 54 l-2 48 h-16 l-2 -48 z" fill="url(#ch-trouser)" />
          <path d="M102 212 h17" stroke="rgb(17 16 28)" strokeWidth="1.6" opacity="0.2" fill="none" />
          <path
            d="M100 254 h20 v13 l9 4 c4 1.5 5.5 3.5 5.5 6.5 h-38 c-1 -5 0 -8 3.5 -9.5 z"
            fill="url(#ch-boot)"
          />
          <path d="M96.5 271 h38 v5 h-38 z" fill="rgb(17 16 28)" opacity="0.55" />
          <path d="M102 258 h18 M102 264 h18" stroke="#9c98b3" strokeWidth="1.4" opacity="0.45" />
        </motion.g>

        {/* ---------- torso ---------- */}
        <g>
          <path
            d="M66 118 c0 -12 5 -19 14 -22 c6 -2 12 -3 20 -3 s14 1 20 3 c9 3 14 10 14 22 l-3 44 c-1 8 -3 13 -5 16 h-52 c-2 -3 -4 -8 -5 -16 z"
            fill="url(#ch-jacket)"
          />
          {/* shadow side */}
          <path
            d="M66 118 c0 -12 5 -19 14 -22 l6 -2 l-4 84 h-11 c-2 -3 -4 -8 -5 -16 z"
            fill="rgb(17 16 28)"
            opacity="0.16"
          />
          {/* zip opening */}
          <path d="M100 96 l-9 12 l9 70 l9 -70 z" fill="rgb(var(--ch-coat-lo))" />
          <path d="M100 98 v78" stroke="rgb(var(--accent))" strokeWidth="1.5" opacity="0.5" />
          {/* collar */}
          <path d="M100 94 l-17 6 l5 16 l12 -13 z" fill="rgb(var(--ch-coat-hi))" />
          <path d="M100 94 l17 6 l-5 16 l-12 -13 z" fill="rgb(var(--ch-coat-hi))" opacity="0.8" />
          {/* quiver strap */}
          <path d="M119 100 q-21 32 -35 70" stroke="rgb(var(--ch-strap))" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M119 100 q-21 32 -35 70" stroke="rgb(17 16 28)" strokeWidth="1.5" fill="none" opacity="0.25" />
          {/* belt */}
          <rect x="72" y="164" width="56" height="13" rx="4" fill="rgb(var(--ch-strap))" />
          <rect x="72" y="164" width="56" height="4" rx="2" fill="#ffffff" opacity="0.08" />
          <rect x="92" y="163" width="16" height="15" rx="3.5" fill="rgb(var(--accent))" />
          <rect x="96" y="167" width="8" height="7" rx="2" fill="rgb(var(--accent-strong))" opacity="0.55" />
        </g>

        {/* ---------- back arm (over the torso so the draw and the victory
            raise both stay visible) ---------- */}
        <motion.g variants={armBackVariants} animate={pose} initial={false} style={pivot(72, 110)}>
          <path
            d="M64 100 c-5 2 -8 7 -8 14 l3 40 c0 6 1 10 3 13 h13 c2 -3 3 -7 3 -13 l2 -40 c0 -7 -3 -12 -8 -14 z"
            fill="url(#ch-sleeve)"
          />
          <path d="M60 148 h18" stroke="rgb(17 16 28)" strokeWidth="1.6" opacity="0.25" fill="none" />
          <circle cx="69" cy="172" r="9" fill="url(#ch-skin)" />
          <path d="M62 170 q7 -5 14 0" stroke="#c9915f" strokeWidth="1.2" fill="none" opacity="0.5" />
        </motion.g>

        {/* ---------- head ---------- */}
        <motion.g variants={headVariants} animate={pose} initial={false} style={pivot(100, 100)}>
          {/* solid hair mass behind the head — the face sits on top of it, so
              only the rim reads as hair */}
          <path
            d="M68 52 V46 c0 -21 14 -36 32 -36 s32 15 32 36 v6 z"
            fill="#161320"
          />
          {/* neck */}
          <path d="M91 78 h18 v17 q-9 6 -18 0 z" fill="#d9a578" />
          <path d="M91 78 h18 v7 q-9 5 -18 0 z" fill="#c08f66" />
          {/* face */}
          <path
            d="M100 20 c16 0 27 11 27 27 v12 c0 11 -4 19 -11 23 c-5 3 -10 4 -16 4 s-11 -1 -16 -4 c-7 -4 -11 -12 -11 -23 V47 c0 -16 11 -27 27 -27 z"
            fill="url(#ch-skin)"
          />
          {/* ears */}
          <ellipse cx="73" cy="56" rx="5" ry="7" fill="#eec19f" />
          <ellipse cx="127" cy="56" rx="5" ry="7" fill="#f0c6a4" />
          {/* hair — swept fringe with separated locks */}
          <path
            d="M73 50 c-2 -21 11 -34 27 -34 s29 13 27 34 c-1 -7 -3 -12 -6 -15 c-1 6 -3 10 -6 13 c-2 -7 -5 -12 -9 -14 c-3 8 -10 13 -19 14 c-6 1 -11 -1 -14 -4 c-2 2 -4 6 -5 8 z"
            fill="url(#ch-hair)"
          />
          <path d="M82 28 q10 -10 22 -9 q-13 3 -19 13 z" fill="#4a4468" opacity="0.55" />
          <path d="M110 24 q9 5 12 15 q-6 -8 -13 -11 z" fill="#4a4468" opacity="0.35" />
          {/* brows */}
          <motion.g variants={browVariants} animate={pose} initial={false} style={pivot(100, 47)}>
            <path d="M83 47.5 q6.5 -3.5 13 -0.8 l0 2.8 q-6.5 -2.2 -13 0.8 z" fill="#2a2438" />
            <path d="M117 47.5 q-6.5 -3.5 -13 -0.8 l0 2.8 q6.5 -2.2 13 0.8 z" fill="#2a2438" />
          </motion.g>
          {/* eyes */}
          <motion.g variants={eyeVariants} animate={pose} initial={false} style={pivot(100, 58)}>
            <ellipse cx="88" cy="58" rx="6.6" ry="7.6" fill="#ffffff" />
            <ellipse cx="112" cy="58" rx="6.6" ry="7.6" fill="#ffffff" />
            <motion.g variants={pupilVariants} animate={pose} initial={false}>
              <circle cx="88.8" cy="58.6" r="4.2" fill="#3a2a1c" />
              <circle cx="112.8" cy="58.6" r="4.2" fill="#3a2a1c" />
              <circle cx="88.8" cy="58.6" r="2.1" fill="#140f1c" />
              <circle cx="112.8" cy="58.6" r="2.1" fill="#140f1c" />
              <circle cx="90.4" cy="56.4" r="1.5" fill="#ffffff" />
              <circle cx="114.4" cy="56.4" r="1.5" fill="#ffffff" />
            </motion.g>
            <path d="M81.4 55 q6.6 -5 13.2 0" stroke="#c9915f" strokeWidth="1.1" fill="none" opacity="0.55" />
            <path d="M105.4 55 q6.6 -5 13.2 0" stroke="#c9915f" strokeWidth="1.1" fill="none" opacity="0.55" />
          </motion.g>
          {/* nose + cheeks */}
          <path d="M100 63 q3.5 5 1 7.5 q-2 1.5 -4.5 -0.5" stroke="#cd9367" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <ellipse cx="81" cy="68" rx="5" ry="3" fill="#e88f7a" opacity="0.28" />
          <ellipse cx="119" cy="68" rx="5" ry="3" fill="#e88f7a" opacity="0.28" />
          {/* mouth */}
          <motion.path
            variants={mouthVariants}
            animate={pose}
            initial={false}
            fill="none"
            stroke="#8a5137"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </motion.g>

        {/* ---------- bow ---------- */}
        <motion.g variants={bowPositionVariants} animate={pose} initial={false}>
          <motion.g variants={bowVariants} animate={pose} initial={false} style={pivot(0, 0)}>
            {/* recurve limbs */}
            <path
              d="M0 -55 q10 -6 16 -2 q-9 12 -6 25 q3 14 12 22 q4 4 4 10 q0 6 -4 10 q-9 8 -12 22 q-3 13 6 25 q-6 4 -16 -2"
              fill="none"
              stroke="url(#ch-bow)"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* grip wrap */}
            <rect x="20" y="-11" width="9" height="22" rx="4" fill="#3f2a17" />
            <path d="M20 -6 h9 M20 0 h9 M20 6 h9" stroke="#6b4a2c" strokeWidth="1.2" />
            <motion.path
              variants={stringVariants}
              animate={pose}
              initial={false}
              fill="none"
              stroke="#ece6d8"
              strokeWidth="1.7"
            />
            <motion.g variants={nockVariants} animate={pose} initial={false}>
              <line x1="-8" y1="0" x2="52" y2="0" stroke="#cbbba6" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M52 0 l-10 -6 v12 z" fill="rgb(var(--accent))" />
              <path d="M-8 0 l9 -5.5 v11 z" fill="rgb(var(--accent-soft))" />
              <path d="M-2 0 l8 -5 v10 z" fill="rgb(var(--accent-soft))" opacity="0.7" />
            </motion.g>
          </motion.g>
        </motion.g>

        {/* ---------- front arm (waves hello, then holds the bow) ---------- */}
        <motion.g variants={armFrontVariants} animate={pose} initial={false} style={pivot(128, 110)}>
          <path
            d="M121 100 c-5 2 -8 7 -8 14 l2 40 c0 6 1 10 3 13 h13 c2 -3 3 -7 3 -13 l3 -40 c0 -7 -3 -12 -8 -14 z"
            fill="url(#ch-sleeve)"
          />
          <path d="M117 148 h18" stroke="rgb(17 16 28)" strokeWidth="1.6" opacity="0.2" fill="none" />
          <circle cx="131" cy="172" r="9.5" fill="url(#ch-skin)" />
          <path d="M124 170 q7 -5 14 0" stroke="#c9915f" strokeWidth="1.2" fill="none" opacity="0.5" />
        </motion.g>
      </motion.g>
    </svg>
  );
}

export const Character = memo(CharacterBase);
export default Character;
