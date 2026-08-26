import type { Transition, Variants } from 'framer-motion';

/** Premium easing curves — fast in, long settle. */
export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  soft: [0.33, 1, 0.68, 1],
} as const;

export const springSoft: Transition = { type: 'spring', stiffness: 220, damping: 28, mass: 0.9 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.68, ease: ease.out } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: ease.out } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: ease.out } },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/**
 * Shared viewport config so every section reveals at the same point.
 * `amount: 'some'` rather than a fraction — a tall list (the skills grid on a
 * phone) would otherwise need to be scrolled well past before it ever revealed,
 * leaving a blank gap. The negative bottom margin holds the trigger until the
 * element is properly in frame.
 */
export const viewportOnce = { once: true, amount: 'some', margin: '0px 0px -80px 0px' } as const;

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/** Maps `value` from [inMin, inMax] onto [outMin, outMax], clamped at both ends. */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => {
  if (inMax === inMin) return outMin;
  const t = clamp((value - inMin) / (inMax - inMin));
  return outMin + t * (outMax - outMin);
};
