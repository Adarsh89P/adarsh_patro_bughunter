'use client';

import { memo, useEffect, useState } from 'react';
import { motion, type Transition, type Variants } from 'framer-motion';
import { Character, type CharacterState } from './Character';
import {
  ART_H,
  ART_W,
  CHARACTER_ART_READY,
  CHARACTER_FILES,
  CHARACTER_POSE,
  POSE_FPS,
  characterArtSrc,
  poseFiles,
} from '@/lib/characterArt';
import { ease } from '@/lib/animations';

type CharacterArtProps = {
  state?: CharacterState;
  reducedMotion?: boolean;
  className?: string;
  facingLeft?: boolean;
  halo?: boolean;
  title?: string;
  /**
   * The states this instance can ever display. Every listed pose is mounted so
   * beats can cross-fade, so a section that only shows one pose should say so —
   * otherwise it downloads the whole set for a picture that never changes.
   * Defaults to every state, which is what the hero needs.
   */
  states?: readonly CharacterState[];
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
  states,
}: CharacterArtProps) {
  const active = CHARACTER_POSE[state];
  const frames = poseFiles(active);
  const files = states
    ? [...new Set(states.flatMap((s) => poseFiles(CHARACTER_POSE[s])))]
    : CHARACTER_FILES;
  const [frame, setFrame] = useState(0);

  // A multi-frame pose loops so the limbs actually move; a single-frame pose
  // holds still and lets the whole-body motion carry it. Hooks stay above the
  // fallback return so the hook order never changes between renders.
  useEffect(() => {
    setFrame(0);
    if (reducedMotion || frames.length < 2) return;
    const id = window.setInterval(
      () => setFrame((f) => (f + 1) % frames.length),
      1000 / POSE_FPS,
    );
    return () => window.clearInterval(id);
  }, [active, reducedMotion, frames.length]);

  if (!CHARACTER_ART_READY) {
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

  const visible = frames[Math.min(frame, frames.length - 1)];

  return (
    <motion.div
      role="img"
      aria-label={title}
      className={className}
      style={{ aspectRatio: `${ART_W} / ${ART_H}`, scaleX: facingLeft ? -1 : 1 }}
      variants={reducedMotion ? undefined : bodyVariants}
      animate={reducedMotion ? undefined : state}
      initial={false}
    >
      <div className="relative h-full w-full">
        {halo && (
          <div className="pointer-events-none absolute inset-[12%] rounded-full bg-accent/10 blur-3xl dark:bg-accent/20" />
        )}
        {/*
          The SVG rig lightened its own palette in dark mode; fixed PNG art
          cannot, and this character is dressed in near-black. On the dark
          canvas the hair and boots would merge into the background, so a soft
          light pool sits behind the figure to hold its silhouette. Dark mode
          only — in light mode the art already separates cleanly.
        */}
        <div className="pointer-events-none absolute inset-[6%] hidden rounded-[45%] bg-[radial-gradient(ellipse_at_50%_60%,rgb(var(--ink)/0.16),transparent_70%)] blur-2xl dark:block" />
        {files.map((file) => (
          <motion.img
            key={file}
            src={characterArtSrc(file)}
            alt=""
            aria-hidden
            width={ART_W}
            height={ART_H}
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain"
            initial={false}
            animate={{ opacity: file === visible ? 1 : 0 }}
            // Beat changes cross-fade; frames within a looping pose cut hard,
            // because an 83ms frame under a 180ms fade would just smear.
            transition={{
              duration: reducedMotion || frames.length > 1 ? 0 : 0.18,
              ease: ease.out,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
});
