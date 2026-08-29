'use client';

import { memo } from 'react';
import { motion, type Transition, type Variants } from 'framer-motion';
import { Character, type CharacterState } from './Character';
import {
  ART_CANVAS,
  ART_READY,
  CHARACTER_POSE,
  CHARACTER_POSES,
  characterArtSrc,
} from '@/lib/characterArt';
import { ease } from '@/lib/animations';

type CharacterArtProps = {
  state?: CharacterState;
  reducedMotion?: boolean;
  className?: string;
  facingLeft?: boolean;
  halo?: boolean;
  title?: string;
};

const snap: Transition = { duration: 0.28, ease: ease.out };

/**
 * Whole-body motion for the illustrated art. The pose images carry the limbs,
 * so this only has to sell weight: breathing, the run bounce, the shot recoil.
 * It deliberately mirrors `bodyVariants` in Character.tsx so switching between
 * the SVG rig and the art doesn't change how the scene feels.
 */
const bodyVariants: Variants = {
  IDLE: { y: [0, -2.5, 0], rotate: 0, transition: { y: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' } } },
  WAVE: { y: [0, -3, 0], rotate: 0, transition: { y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } } },
  LOOK: { y: [0, -2, 0], rotate: 0, transition: { y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } } },
  ALERT: { y: -4, rotate: -1, transition: snap },
  RUN: {
    y: [0, -7, 0],
    rotate: 6,
    transition: { y: { duration: 0.42, repeat: Infinity, ease: 'easeInOut' }, rotate: snap },
  },
  STOP: { y: 0, rotate: -3, transition: snap },
  AIM: { y: 0, rotate: 0, transition: snap },
  PULL_ARROW: { y: 0, rotate: 0, transition: snap },
  SHOOT: { y: [0, -2, 0], x: [0, 6, 0], rotate: -2, transition: { duration: 0.34, ease: ease.out } },
  CELEBRATE: { y: [0, -3, 0], rotate: 0, transition: { y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' } } },
};

/**
 * The illustrated character: every pose is stacked on one canvas and only the
 * active one is opaque, so switching beats cross-fades instead of cutting — and
 * every file is decoded up front, which keeps the scroll cinematic from
 * stuttering on its first pass through a beat.
 *
 * Falls back to the SVG rig whenever the art hasn't been dropped in yet.
 */
export const CharacterArt = memo(function CharacterArt({
  state = 'IDLE',
  reducedMotion = false,
  className,
  facingLeft = false,
  halo = true,
  title = 'Bug hunter character',
}: CharacterArtProps) {
  if (!ART_READY) {
    return (
      <Character
        state={state}
        reducedMotion={reducedMotion}
        className={className}
        facingLeft={facingLeft}
        halo={halo}
        title={title}
      />
    );
  }

  const active = CHARACTER_POSE[state];

  return (
    <motion.div
      role="img"
      aria-label={title}
      className={className}
      style={{ aspectRatio: '1 / 1', scaleX: facingLeft ? -1 : 1 }}
      variants={reducedMotion ? undefined : bodyVariants}
      animate={reducedMotion ? undefined : state}
      initial={false}
    >
      <div className="relative h-full w-full">
        {halo && (
          <div className="pointer-events-none absolute inset-[12%] rounded-full bg-accent/10 blur-3xl dark:bg-accent/20" />
        )}
        {CHARACTER_POSES.map((pose) => (
          <motion.img
            key={pose}
            src={characterArtSrc(pose)}
            alt=""
            aria-hidden
            width={ART_CANVAS}
            height={ART_CANVAS}
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain"
            initial={false}
            animate={{ opacity: pose === active ? 1 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.18, ease: ease.out }}
          />
        ))}
      </div>
    </motion.div>
  );
});
