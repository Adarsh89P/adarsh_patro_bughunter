/**
 * Manifest for the illustrated (rendered) character art.
 *
 * The site ships with a hand-built SVG rig as its fallback. When rendered pose
 * art is dropped into `public/art/**`, flip `ART_READY` to true and every
 * character/bug/boss on the page swaps to the illustrations — the scroll
 * choreography in HeroTimeline is untouched, only the actor's skin changes.
 *
 * Each pose is a separate transparent PNG. Poses are cross-faded rather than
 * rigged, so the art must be drawn on a consistent baseline and scale: the
 * character's feet should sit at the same height in every file, and the figure
 * should occupy the same fraction of the canvas. Otherwise the figure appears
 * to jump between beats.
 */

import type { CharacterState } from '@/components/hero/Character';
import type { BugMood } from '@/components/hero/Bug';

/** Flip to true once the files below exist. */
export const ART_READY = false;

/** Square canvas every pose is drawn on, used to reserve layout space. */
export const ART_CANVAS = 1024;

/**
 * Several states share one drawing — AIM and PULL_ARROW differ only in how far
 * the string is drawn back, which the whole-body motion sells well enough.
 */
export const CHARACTER_POSE: Record<CharacterState, string> = {
  IDLE: 'idle',
  WAVE: 'wave',
  LOOK: 'look',
  ALERT: 'alert',
  RUN: 'run',
  STOP: 'stop',
  AIM: 'aim',
  PULL_ARROW: 'pull',
  SHOOT: 'shoot',
  CELEBRATE: 'celebrate',
};

export const BUG_POSE: Record<BugMood, string> = {
  CRAWL: 'crawl',
  TAUNT: 'taunt',
  FLEE: 'flee',
  PANIC: 'panic',
  HIT: 'hit',
};

/** Every distinct pose file, for preloading and for the generation script. */
export const CHARACTER_POSES = [...new Set(Object.values(CHARACTER_POSE))];
export const BUG_POSES = [...new Set(Object.values(BUG_POSE))];

export const characterArtSrc = (pose: string) => `/art/character/${pose}.png`;
export const bugArtSrc = (pose: string) => `/art/bug/${pose}.png`;
export const bossArtSrc = (pose: 'idle' | 'alert') => `/art/boss/${pose}.png`;
