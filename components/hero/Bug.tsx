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

        {/* body */}
        <ellipse cx="70" cy="64" rx="27" ry="26" fill="url(#bug-body)" />
        <ellipse cx="70" cy="64" rx="27" ry="26" fill="none" stroke="rgb(var(--bug-strong))" strokeWidth="1.5" opacity="0.5" />
        <path d="M70 40 v46" stroke="rgb(var(--bug-strong))" strokeWidth="1.6" opacity="0.35" />
        <circle cx="58" cy="80" r="3" fill="rgb(var(--bug-strong))" opacity="0.35" />
        <circle cx="82" cy="78" r="2.4" fill="rgb(var(--bug-strong))" opacity="0.35" />

        {/* eyes */}
        <motion.g variants={eyeVariants} animate={pose} initial={false} style={{ transformBox: 'view-box', originX: '70px', originY: '56px' }}>
          <ellipse cx="60" cy="56" rx="9" ry="10" fill="#ffffff" />
          <ellipse cx="80" cy="56" rx="9" ry="10" fill="#ffffff" />
          <circle cx="60" cy="57" r="4.4" fill="#16121f" />
          <circle cx="80" cy="57" r="4.4" fill="#16121f" />
          <circle cx="61.8" cy="54.6" r="1.6" fill="#ffffff" />
          <circle cx="81.8" cy="54.6" r="1.6" fill="#ffffff" />
        </motion.g>

        {/* mouth */}
        <path d="M62 72 q8 7 16 0" fill="none" stroke="#16121f" strokeWidth="2.2" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

export const Bug = memo(BugBase);
export default Bug;
