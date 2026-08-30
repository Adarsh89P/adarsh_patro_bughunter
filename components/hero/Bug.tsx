'use client';

import { memo } from 'react';
import { motion, type Variants } from 'framer-motion';

export type BugMood = 'CRAWL' | 'TAUNT' | 'FLEE' | 'PANIC' | 'HIT';

type BugProps = {
  mood?: BugMood;
  reducedMotion?: boolean;
  className?: string;
  facingLeft?: boolean;
};

const legVariants: Variants = {
  CRAWL: { rotate: [0, 12, 0, -12, 0], transition: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' } },
  TAUNT: { rotate: [0, 8, 0], transition: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' } },
  FLEE: { rotate: [0, 20, 0, -20, 0], transition: { duration: 0.32, repeat: Infinity, ease: 'linear' } },
  PANIC: { rotate: [0, 26, 0, -26, 0], transition: { duration: 0.22, repeat: Infinity, ease: 'linear' } },
  HIT: { rotate: 0, transition: { duration: 0.1 } },
};

const bodyVariants: Variants = {
  CRAWL: { y: [0, -2, 0], scale: 1, transition: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' } },
  TAUNT: { y: [0, -5, 0], scale: 1, transition: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' } },
  FLEE: { y: [0, -4, 0], scale: 1, transition: { duration: 0.32, repeat: Infinity, ease: 'easeInOut' } },
  PANIC: { y: [0, -3, 0], scale: 1.04, transition: { duration: 0.22, repeat: Infinity, ease: 'easeInOut' } },
  HIT: { y: 0, scale: 1.2, transition: { duration: 0.12 } },
};

const eyeVariants: Variants = {
  CRAWL: { scaleY: 1, x: 0 },
  TAUNT: { scaleY: 1, x: -1 },
  FLEE: { scaleY: 1, x: -1.5 },
  PANIC: { scaleY: 1.15, x: -2 },
  HIT: { scaleY: 0.2, x: 0 },
};

/**
 * The grin widens when the bug is taunting and gapes when it panics, so the
 * same drawing carries the mood without swapping shapes.
 */
const mouthVariants: Variants = {
  CRAWL: { scaleX: 1, scaleY: 1 },
  TAUNT: { scaleX: 1.12, scaleY: 1.1 },
  FLEE: { scaleX: 0.9, scaleY: 1.15 },
  PANIC: { scaleX: 0.8, scaleY: 1.5 },
  HIT: { scaleX: 0.7, scaleY: 0.6 },
};

function BugBase({ mood = 'CRAWL', reducedMotion = false, className, facingLeft = false }: BugProps) {
  const pose = reducedMotion ? 'TAUNT' : mood;

  return (
    <svg
      viewBox="0 0 140 110"
      className={className}
      role="img"
      aria-label="A stylised software bug"
      style={{ transform: facingLeft ? 'scaleX(-1)' : undefined, overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="bug-body" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="rgb(var(--bug-soft))" />
          <stop offset="55%" stopColor="rgb(var(--bug))" />
          <stop offset="100%" stopColor="rgb(var(--bug-strong))" />
        </radialGradient>
      </defs>

      <ellipse cx="70" cy="100" rx="30" ry="5" fill="rgb(17 16 28)" opacity="0.12" />

      <motion.g variants={bodyVariants} animate={pose} initial={false} className="scene-layer">
        {/* legs */}
        <motion.g variants={legVariants} animate={pose} initial={false} style={{ transformBox: 'view-box', originX: '70px', originY: '60px' }}>
          {[
            'M46 60 L24 46 L14 52',
            'M46 68 L22 68 L12 74',
            'M46 76 L26 90 L18 98',
            'M94 60 L116 46 L126 52',
            'M94 68 L118 68 L128 74',
            'M94 76 L114 90 L122 98',
          ].map((d) => (
            <path key={d} d={d} fill="none" stroke="rgb(var(--bug-strong))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </motion.g>

        {/* antennae */}
        <path d="M58 34 q-6 -16 -16 -20" fill="none" stroke="rgb(var(--bug-strong))" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M82 34 q6 -16 16 -20" fill="none" stroke="rgb(var(--bug-strong))" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="42" cy="14" r="4" fill="rgb(var(--accent))" />
        <circle cx="98" cy="14" r="4" fill="rgb(var(--accent))" />

        {/* body — a near-spherical carapace with a hard gloss, as in the reference */}
        <ellipse cx="70" cy="64" rx="29" ry="27" fill="url(#bug-body)" />
        <ellipse cx="70" cy="64" rx="29" ry="27" fill="none" stroke="rgb(var(--bug-strong))" strokeWidth="1.6" opacity="0.55" />
        {/* shell seam and plate speckles */}
        <path d="M70 38 v20" stroke="rgb(var(--bug-strong))" strokeWidth="1.6" opacity="0.3" />
        <circle cx="56" cy="82" r="3.2" fill="rgb(var(--bug-strong))" opacity="0.32" />
        <circle cx="84" cy="80" r="2.6" fill="rgb(var(--bug-strong))" opacity="0.32" />
        <circle cx="70" cy="87" r="2.2" fill="rgb(var(--bug-strong))" opacity="0.26" />
        {/* specular highlight — the glossy top-left sheen */}
        <ellipse cx="57" cy="48" rx="10" ry="6.5" fill="#ffffff" opacity="0.22" transform="rotate(-28 57 48)" />

        {/* eyes — oversized and googly, sitting proud of the shell */}
        <motion.g variants={eyeVariants} animate={pose} initial={false} style={{ transformBox: 'view-box', originX: '70px', originY: '54px' }}>
          <ellipse cx="58" cy="54" rx="12" ry="13" fill="#ffffff" />
          <ellipse cx="82" cy="54" rx="12" ry="13" fill="#ffffff" />
          <ellipse cx="58" cy="54" rx="12" ry="13" fill="none" stroke="rgb(var(--bug-strong))" strokeWidth="1.2" opacity="0.45" />
          <ellipse cx="82" cy="54" rx="12" ry="13" fill="none" stroke="rgb(var(--bug-strong))" strokeWidth="1.2" opacity="0.45" />
          <circle cx="58.5" cy="56" r="5.6" fill="#16121f" />
          <circle cx="82.5" cy="56" r="5.6" fill="#16121f" />
          <circle cx="60.8" cy="52.8" r="2.1" fill="#ffffff" />
          <circle cx="84.8" cy="52.8" r="2.1" fill="#ffffff" />
        </motion.g>

        {/* mouth — a wide toothy grin rather than a plain curve */}
        <motion.g variants={mouthVariants} animate={pose} initial={false} style={{ transformBox: 'view-box', originX: '70px', originY: '73px' }}>
          <path d="M58 71 q12 12 24 0 q-12 5 -24 0 z" fill="#2a0f3d" />
          <path d="M58 71 q12 12 24 0" fill="none" stroke="#16121f" strokeWidth="2" strokeLinecap="round" />
          {/* fangs */}
          <path d="M62.5 72.4 l3 5 l3 -4.2 z" fill="#ffffff" />
          <path d="M71.5 73.4 l3 4.6 l3 -5.4 z" fill="#ffffff" />
        </motion.g>
      </motion.g>
    </svg>
  );
}

export const Bug = memo(BugBase);
export default Bug;
