'use client';

import { memo } from 'react';

/**
 * The ground the hunter stands on: grass tufts, pebbles and a soft horizon,
 * drawn along the same baseline the hero copy sits on. Purely decorative.
 */
function GroundBase({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1600 70"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* horizon */}
      <defs>
        <linearGradient id="hero-horizon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgb(var(--line))" stopOpacity="0" />
          <stop offset="25%" stopColor="rgb(var(--line))" stopOpacity="1" />
          <stop offset="75%" stopColor="rgb(var(--line))" stopOpacity="1" />
          <stop offset="100%" stopColor="rgb(var(--line))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="68" width="1600" height="1.4" fill="url(#hero-horizon)" />
    </svg>
  );
}

const TUFTS = [
  { x: 60, s: 0.62 },
  { x: 128, s: 0.48 },
  { x: 244, s: 0.7 },
  { x: 300, s: 0.5 },
  { x: 430, s: 0.58 },
  { x: 566, s: 0.72 },
  { x: 612, s: 0.46 },
  { x: 742, s: 0.54 },
  { x: 880, s: 0.66 },
  { x: 934, s: 0.44 },
  { x: 1058, s: 0.6 },
  { x: 1190, s: 0.5 },
  { x: 1256, s: 0.68 },
  { x: 1388, s: 0.56 },
  { x: 1512, s: 0.64 },
] as const;

const PEBBLES = [
  { x: 196, s: 0.6 },
  { x: 508, s: 0.42 },
  { x: 826, s: 0.5 },
  { x: 1142, s: 0.38 },
  { x: 1444, s: 0.55 },
] as const;

/** Grass and pebbles, positioned in the same 1600-wide space as the horizon. */
function FloraBase({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1600 70" className={className} aria-hidden="true" focusable="false">
      {PEBBLES.map(({ x, s }) => (
        <g key={`p${x}`} transform={`translate(${x} 69) scale(${s})`}>
          <path d="M0 0 c-9 0 -15 -3 -15 -7 c0 -5 7 -10 15 -10 s15 5 15 10 c0 4 -6 7 -15 7 z" fill="rgb(var(--pebble))" opacity="0.4" />
          <path d="M-7 -11 c3 -3 10 -5 15 -2 c-5 -1 -11 0 -15 2 z" fill="rgb(var(--surface))" opacity="0.55" />
        </g>
      ))}

      {TUFTS.map(({ x, s }) => (
        <g key={`t${x}`} transform={`translate(${x} 69) scale(${s})`} className="text-[rgb(var(--flora))]">
          <path d="M0 0 c-1 -12 -5 -20 -11 -26 c8 3 12 11 13 22 z" fill="currentColor" opacity="0.42" />
          <path d="M2 0 c1 -16 5 -27 12 -34 c-6 9 -8 21 -8 34 z" fill="currentColor" opacity="0.5" />
          <path d="M-2 0 c-3 -10 -10 -16 -18 -19 c6 6 10 12 12 19 z" fill="currentColor" opacity="0.32" />
          <path d="M5 0 c4 -9 11 -14 19 -16 c-7 5 -12 9 -15 16 z" fill="currentColor" opacity="0.36" />
        </g>
      ))}
    </svg>
  );
}

/** Very soft background blobs, sitting behind everything else. */
function CloudsBase({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <div className="absolute left-[42%] top-[38%] h-24 w-56 rounded-full bg-accent/[0.07] blur-2xl" />
      <div className="absolute left-[48%] top-[34%] h-16 w-32 rounded-full bg-accent/[0.06] blur-2xl" />
      <div className="absolute right-[6%] top-[32%] h-24 w-64 rounded-full bg-accent/[0.07] blur-2xl" />
      <div className="absolute right-[14%] top-[28%] h-14 w-32 rounded-full bg-accent/[0.05] blur-2xl" />
    </div>
  );
}

export const Ground = memo(GroundBase);
export const Flora = memo(FloraBase);
export const Clouds = memo(CloudsBase);
