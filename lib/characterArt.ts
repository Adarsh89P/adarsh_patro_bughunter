/**
 * Manifest for the illustrated (rendered) character art.
 *
 * The character art is cut from a pose sheet and lives in `public/art/character`.
 * The bug and boss have no rendered art yet, so they keep the hand-built SVG —
 * hence two flags rather than one. Turning on a flag whose files are missing
 * would show broken images, so each is switched on only when its art exists.
 *
 * The pose files are normalised to a common canvas, scale and baseline, aligned
 * by the figure's feet. That matters because the hero cross-fades between poses:
 * misaligned files make the character appear to jump between beats.
 */

import type { CharacterState } from '@/components/hero/Character';
import type { BugMood } from '@/components/hero/Bug';

export const CHARACTER_ART_READY = true;
export const BUG_ART_READY = false;

/**
 * The shared box every pose is trimmed to. Not square: the poses are cropped to
 * their union bounding box, so the element maps to the figure itself and the
 * layout can size the character directly.
 */
export const ART_W = 357;
export const ART_H = 320;

/**
 * The sheet supplies five drawings, so several states share one. States that
 * differ only in expression (LOOK, ALERT) or in a beat of timing (PULL_ARROW,
 * SHOOT) reuse the nearest pose; the whole-body motion carries the difference.
 */
export const CHARACTER_POSE: Record<CharacterState, string> = {
  IDLE: 'idle',
  WAVE: 'celebrate', // the salute reads as a greeting
  LOOK: 'idle',
  ALERT: 'idle',
  RUN: 'run',
  STOP: 'walk',
  AIM: 'aim',
  PULL_ARROW: 'aim',
  SHOOT: 'aim',
  CELEBRATE: 'celebrate',
};

export const BUG_POSE: Record<BugMood, string> = {
  CRAWL: 'crawl',
  TAUNT: 'taunt',
  FLEE: 'flee',
  PANIC: 'panic',
  HIT: 'hit',
};

/**
 * How many drawings each pose has.
 *
 * A single still cannot show a limb moving — cross-fading one drawing can only
 * bob the whole body. A pose listed with N frames is played as a loop instead,
 * which is what makes arms and legs actually swing. Frame files are named
 * `<pose>-1.png` … `<pose>-N.png`; a pose with one frame stays `<pose>.png`.
 *
 * Raise a count here only once the numbered files exist, or the pose will
 * request images that 404.
 */
export const POSE_FRAMES: Record<string, number> = {
  idle: 1,
  walk: 1,
  run: 1,
  aim: 1,
  celebrate: 1,
};

/** Frames per second for looping poses — a run cycle reads well around 12. */
export const POSE_FPS = 12;

/** The image files that make up a pose, in play order. */
export function poseFiles(pose: string): string[] {
  const count = POSE_FRAMES[pose] ?? 1;
  if (count <= 1) return [pose];
  return Array.from({ length: count }, (_, i) => `${pose}-${i + 1}`);
}

/** Every distinct pose file, for preloading and for the generation script. */
export const CHARACTER_POSES = [...new Set(Object.values(CHARACTER_POSE))];
export const CHARACTER_FILES = [...new Set(CHARACTER_POSES.flatMap(poseFiles))];
export const BUG_POSES = [...new Set(Object.values(BUG_POSE))];

/**
 * Plain <img> does not get the Next basePath prepended the way next/image does,
 * and the site deploys to a GitHub Pages project path — so the prefix has to be
 * applied here or every pose 404s once deployed.
 */
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const characterArtSrc = (pose: string) => `${base}/art/character/${pose}.png`;
export const bugArtSrc = (pose: string) => `${base}/art/bug/${pose}.png`;
export const bossArtSrc = (pose: 'idle' | 'alert') => `${base}/art/boss/${pose}.png`;
