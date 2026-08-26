'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

type BugBossProps = {
  className?: string;
  /** Set while the project card is hovered — the boss braces for the shot. */
  alert?: boolean;
  reducedMotion?: boolean;
};

/** The "boss" that sits beside a featured mission. Decorative only. */
function BugBossBase({ className, alert = false, reducedMotion = false }: BugBossProps) {
  const float = reducedMotion ? {} : { y: [0, -6, 0] };

  return (
    <svg viewBox="0 0 200 180" className={className} aria-hidden="true" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="boss-body" cx="38%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#4c4360" />
          <stop offset="60%" stopColor="#2a2438" />
          <stop offset="100%" stopColor="#141020" />
        </radialGradient>
        <linearGradient id="boss-crown" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="166" rx="56" ry="8" fill="rgb(17 16 28)" opacity="0.16" />

      <motion.g
        animate={float}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* legs */}
        {[
          'M58 108 L26 96 L14 106',
          'M58 122 L22 126 L10 138',
          'M142 108 L174 96 L186 106',
          'M142 122 L178 126 L190 138',
        ].map((d) => (
          <path key={d} d={d} fill="none" stroke="#241e33" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        ))}

        {/* body */}
        <ellipse cx="100" cy="112" rx="48" ry="44" fill="url(#boss-body)" />
        {/* spikes */}
        {[-46, -28, -10, 10, 28, 46].map((offset) => (
          <path
            key={offset}
            d={`M${100 + offset} ${76 + Math.abs(offset) * 0.22} l-6 -16 l14 6 z`}
            fill="#3b3350"
          />
        ))}
        <path d="M62 128 q38 22 76 0" fill="none" stroke="#0f0c1a" strokeWidth="3" opacity="0.6" />

        {/* eyes */}
        <motion.g
          animate={reducedMotion ? {} : { opacity: alert ? [1, 0.6, 1] : [0.85, 1, 0.85] }}
          transition={{ duration: alert ? 0.5 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ellipse cx="82" cy="104" rx="12" ry="9" fill="#ef4444" />
          <ellipse cx="118" cy="104" rx="12" ry="9" fill="#ef4444" />
          <ellipse cx="82" cy="104" rx="5" ry="7" fill="#7f1d1d" />
          <ellipse cx="118" cy="104" rx="5" ry="7" fill="#7f1d1d" />
        </motion.g>

        {/* mouth */}
        <path d="M80 130 q20 14 40 0 q-10 6 -20 6 q-10 0 -20 -6 z" fill="#0d0a16" />
        {[86, 96, 106, 116].map((x) => (
          <path key={x} d={`M${x} 131 l4 7 l4 -7 z`} fill="#f5f0ff" opacity="0.85" />
        ))}

        {/* crown */}
        <path d="M70 62 l8 -30 l14 16 l8 -24 l8 24 l14 -16 l8 30 z" fill="url(#boss-crown)" />
        <rect x="70" y="60" width="60" height="9" rx="4" fill="#b45309" />
        <circle cx="86" cy="64.5" r="2.6" fill="#fff7ed" />
        <circle cx="100" cy="64.5" r="2.6" fill="#fff7ed" />
        <circle cx="114" cy="64.5" r="2.6" fill="#fff7ed" />
      </motion.g>
    </svg>
  );
}

export const BugBoss = memo(BugBossBase);
export default BugBoss;
