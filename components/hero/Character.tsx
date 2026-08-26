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
  AIM: { rotate: -58, transition: limb },
  PULL_ARROW: { rotate: -74, transition: { duration: 0.5, ease: ease.out } },
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
  IDLE: { x: 44, y: 160, transition: limb },
  WAVE: { x: 44, y: 160, transition: limb },
  LOOK: { x: 44, y: 160, transition: limb },
  ALERT: { x: 50, y: 150, transition: snap },
  RUN: { x: 48, y: 152, transition: limb },
  STOP: { x: 96, y: 132, transition: snap },
  AIM: { x: 168, y: 110, transition: limb },
  PULL_ARROW: { x: 168, y: 110, transition: limb },
  SHOOT: { x: 168, y: 110, transition: snap },
  CELEBRATE: { x: 42, y: 162, transition: limb },
};

const bowVariants: Variants = {
  IDLE: { rotate: 22, scale: 1, transition: limb },
  WAVE: { rotate: 22, scale: 1, transition: limb },
  LOOK: { rotate: 22, scale: 1, transition: limb },
  ALERT: { rotate: 6, scale: 1, transition: snap },
  RUN: { rotate: 54, scale: 1, transition: limb },
  STOP: { rotate: 8, scale: 1, transition: snap },
  AIM: { rotate: 0, scale: 1, transition: limb },
  PULL_ARROW: { rotate: 0, scale: 1.02, transition: limb },
  SHOOT: { rotate: 0, scale: 1, transition: snap },
  CELEBRATE: { rotate: 34, scale: 1, transition: limb },
};

/** The nocked arrow only exists while the bow is drawn. */
const nockVariants: Variants = {
  IDLE: { opacity: 0, x: 0, transition: snap },
  WAVE: { opacity: 0, x: 0, transition: snap },
  LOOK: { opacity: 0, x: 0, transition: snap },
  ALERT: { opacity: 0, x: 0, transition: snap },
  RUN: { opacity: 0, x: 0, transition: snap },
  STOP: { opacity: 0, x: 0, transition: snap },
  AIM: { opacity: 1, x: -4, transition: snap },
  PULL_ARROW: { opacity: 1, x: -20, transition: { duration: 0.5, ease: ease.out } },
  SHOOT: { opacity: 0, x: 26, transition: { duration: 0.14, ease: 'linear' } },
  CELEBRATE: { opacity: 0, x: 0, transition: snap },
};

const stringVariants: Variants = {
  IDLE: { d: 'M0 -40 L0 40', transition: snap },
  WAVE: { d: 'M0 -40 L0 40', transition: snap },
  LOOK: { d: 'M0 -40 L0 40', transition: snap },
  ALERT: { d: 'M0 -40 L0 40', transition: snap },
  RUN: { d: 'M0 -40 L0 40', transition: snap },
  STOP: { d: 'M0 -40 L0 40', transition: snap },
  AIM: { d: 'M0 -40 L-5 0 L0 40', transition: snap },
  PULL_ARROW: { d: 'M0 -40 L-21 0 L0 40', transition: { duration: 0.5, ease: ease.out } },
  SHOOT: { d: 'M0 -40 L3 0 L0 40', transition: { duration: 0.12, ease: 'linear' } },
  CELEBRATE: { d: 'M0 -40 L0 40', transition: snap },
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
  IDLE: { d: 'M92 70 Q100 75 108 70', transition: snap },
  WAVE: { d: 'M91 69 Q100 79 109 69', transition: snap },
  LOOK: { d: 'M93 71 Q100 74 107 71', transition: snap },
  ALERT: { d: 'M95 70 Q100 78 105 70 Q100 74 95 70', transition: snap },
  RUN: { d: 'M93 70 Q100 77 107 70', transition: snap },
  STOP: { d: 'M93 71 Q100 74 107 71', transition: snap },
  AIM: { d: 'M94 72 L106 72', transition: snap },
  PULL_ARROW: { d: 'M94 72 L106 72', transition: snap },
  SHOOT: { d: 'M94 71 Q100 76 106 71', transition: snap },
  CELEBRATE: { d: 'M90 68 Q100 80 110 68', transition: snap },
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
      viewBox="0 0 200 264"
      className={className}
      role="img"
      aria-label={title}
      style={{ transform: facingLeft ? 'scaleX(-1)' : undefined, overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="ch-jacket" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgb(var(--ch-coat-hi))" />
          <stop offset="100%" stopColor="rgb(var(--ch-coat-lo))" />
        </linearGradient>
        <linearGradient id="ch-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#272335" />
          <stop offset="100%" stopColor="#101019" />
        </linearGradient>
        <linearGradient id="ch-bow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a9713d" />
          <stop offset="100%" stopColor="#6f4522" />
        </linearGradient>
      </defs>

      {/* ambient halo — only visible in dark mode, keeps the silhouette readable */}
      {halo && (
        <ellipse
          cx="100"
          cy="142"
          rx="76"
          ry="98"
          fill="rgb(var(--accent))"
          opacity="var(--ch-halo)"
          style={{ filter: 'blur(34px)' }}
        />
      )}

      {/* contact shadow */}
      <ellipse cx="100" cy="250" rx="44" ry="7.5" fill="rgb(17 16 28)" opacity="0.14" />

      <motion.g
        variants={bodyVariants}
        animate={pose}
        initial={false}
        style={pivot(100, 240)}
        className="scene-layer"
      >
        {/* ---------- quiver + arrows (slung across the back) ---------- */}
        <g transform="rotate(-24 100 120)">
          <rect x="66" y="84" width="19" height="58" rx="8" fill="#4b3524" />
          <rect x="66" y="84" width="7" height="58" rx="3.5" fill="#5d4430" opacity="0.85" />
          {[0, 7, 14].map((offset) => (
            <g key={offset} transform={`translate(${offset} 0)`}>
              <line x1="68" y1="86" x2="68" y2="52" stroke="#c8b7a5" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M68 52 l-4.5 9 h9 z" fill="rgb(var(--accent))" />
            </g>
          ))}
        </g>

        {/* ---------- legs ---------- */}
        <motion.g variants={legBackVariants} animate={pose} initial={false} style={pivot(88, 156)}>
          <path d="M88 156 L86 206 L88 234" fill="none" stroke="rgb(var(--ch-leg-dark))" strokeWidth="19" strokeLinecap="round" />
          <path d="M78 228 h14 q12 1 14 9 q1 5 -5 5 h-23 q-5 0 -5 -6 z" fill="rgb(var(--ch-boot))" />
        </motion.g>
        <motion.g variants={legFrontVariants} animate={pose} initial={false} style={pivot(112, 156)}>
          <path d="M112 156 L114 206 L112 234" fill="none" stroke="rgb(var(--ch-leg))" strokeWidth="19" strokeLinecap="round" />
          <path d="M102 228 h14 q12 1 14 9 q1 5 -5 5 h-23 q-5 0 -5 -6 z" fill="rgb(var(--ch-boot-alt))" />
        </motion.g>

        {/* ---------- torso ---------- */}
        <g>
          <path
            d="M72 110 q0-12 11-14 h34 q11 2 11 14 l-2 44 q-1 11 -11 12 h-30 q-10 -1 -11 -12 z"
            fill="url(#ch-jacket)"
          />
          {/* jacket opening */}
          <path d="M100 96 l-7 16 l7 44 l7 -44 z" fill="rgb(var(--ch-coat-lo))" opacity="0.95" />
          <path d="M100 96 v60" stroke="rgb(var(--accent))" strokeWidth="1.4" opacity="0.55" />
          {/* strap + belt */}
          <path d="M116 97 q-22 26 -34 58" stroke="rgb(var(--ch-strap))" strokeWidth="7" fill="none" strokeLinecap="round" />
          <rect x="72" y="146" width="56" height="10" rx="4" fill="rgb(var(--ch-strap))" />
          <rect x="93" y="146" width="14" height="10" rx="3" fill="rgb(var(--accent))" opacity="0.9" />
        </g>

        {/* ---------- back arm (drawn over the torso so the draw and the
            victory raise both stay visible) ---------- */}
        <motion.g variants={armBackVariants} animate={pose} initial={false} style={pivot(76, 108)}>
          <path
            d="M76 108 q-8 22 -6 42"
            fill="none"
            stroke="rgb(var(--ch-coat-lo))"
            strokeWidth="15"
            strokeLinecap="round"
          />
          <circle cx="70" cy="152" r="8" fill="#f0c7a4" />
        </motion.g>

        {/* ---------- head ---------- */}
        <motion.g variants={headVariants} animate={pose} initial={false} style={pivot(100, 92)}>
          {/* neck */}
          <path d="M92 80 h16 v14 q-8 5 -16 0 z" fill="#dcab84" />
          {/* face */}
          <path
            d="M100 22 c17 0 29 11 29 27 v13 c0 17 -13 28 -29 28 s-29 -11 -29 -28 v-13 c0 -16 12 -27 29 -27 z"
            fill="#f4cdac"
          />
          {/* ears */}
          <circle cx="70" cy="58" r="5.5" fill="#eec19f" />
          <circle cx="130" cy="58" r="5.5" fill="#eec19f" />
          {/* hair */}
          <path
            d="M71 50 c-2 -20 12 -32 29 -32 s31 12 29 32 c-3 -6 -6 -9 -9 -11 c-1 5 -3 8 -6 10 c-2 -6 -5 -9 -8 -11 c-3 6 -8 10 -16 11 c-6 1 -12 -1 -14 -4 c-2 2 -4 5 -5 5 z"
            fill="url(#ch-hair)"
          />
          <path d="M78 30 q10 -12 24 -11 q-14 3 -21 14 z" fill="#3a3550" opacity="0.7" />
          {/* brows */}
          <motion.g variants={browVariants} animate={pose} initial={false} style={pivot(100, 52)}>
            <rect x="82" y="50" width="14" height="3.4" rx="1.7" fill="#241f33" />
            <rect x="104" y="50" width="14" height="3.4" rx="1.7" fill="#241f33" />
          </motion.g>
          {/* eyes */}
          <motion.g variants={eyeVariants} animate={pose} initial={false} style={pivot(100, 60)}>
            <ellipse cx="89" cy="60" rx="6.2" ry="7" fill="#ffffff" />
            <ellipse cx="111" cy="60" rx="6.2" ry="7" fill="#ffffff" />
            <motion.g variants={pupilVariants} animate={pose} initial={false}>
              <circle cx="89.8" cy="60.6" r="3.5" fill="#191524" />
              <circle cx="111.8" cy="60.6" r="3.5" fill="#191524" />
              <circle cx="91.2" cy="58.8" r="1.2" fill="#ffffff" />
              <circle cx="113.2" cy="58.8" r="1.2" fill="#ffffff" />
            </motion.g>
          </motion.g>
          {/* mouth */}
          <motion.path
            variants={mouthVariants}
            animate={pose}
            initial={false}
            fill="none"
            stroke="#7a4a35"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </motion.g>

        {/* ---------- bow ---------- */}
        <motion.g variants={bowPositionVariants} animate={pose} initial={false}>
          <motion.g variants={bowVariants} animate={pose} initial={false} style={pivot(0, 0)}>
            <path
              d="M0 -40 q22 20 22 40 q0 20 -22 40"
              fill="none"
              stroke="url(#ch-bow)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <motion.path
              variants={stringVariants}
              animate={pose}
              initial={false}
              fill="none"
              stroke="#e2dccd"
              strokeWidth="1.6"
            />
            <motion.g variants={nockVariants} animate={pose} initial={false}>
              <line x1="-6" y1="0" x2="42" y2="0" stroke="#c8b7a5" strokeWidth="2.6" strokeLinecap="round" />
              <path d="M42 0 l-8 -5 v10 z" fill="rgb(var(--accent))" />
              <path d="M-6 0 l7 -4.5 v9 z" fill="rgb(var(--accent-soft))" />
            </motion.g>
          </motion.g>
        </motion.g>

        {/* ---------- front arm (waves hello, then holds the bow) ---------- */}
        <motion.g variants={armFrontVariants} animate={pose} initial={false} style={pivot(124, 108)}>
          <path
            d="M124 108 q9 22 7 42"
            fill="none"
            stroke="rgb(var(--ch-leg))"
            strokeWidth="15"
            strokeLinecap="round"
          />
          <circle cx="131" cy="152" r="8.5" fill="#f4cdac" />
        </motion.g>
      </motion.g>
    </svg>
  );
}

export const Character = memo(CharacterBase);
export default Character;
