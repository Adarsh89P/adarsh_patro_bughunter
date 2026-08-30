'use client';

import { memo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Bug, type BugMood } from './Bug';
import { ART_H, ART_W, BUG_ART_READY, BUG_POSE, BUG_POSES, bugArtSrc } from '@/lib/characterArt';
import { ease } from '@/lib/animations';

type BugArtProps = {
  mood?: BugMood;
  reducedMotion?: boolean;
  className?: string;
  facingLeft?: boolean;
  title?: string;
};

/** Body motion per mood — the scuttle, the taunt, the flinch on impact. */
const bodyVariants: Variants = {
  CRAWL: { y: [0, -3, 0], rotate: 0, transition: { y: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' } } },
  TAUNT: { y: [0, -8, 0], rotate: [0, -6, 0], transition: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' } },
  FLEE: { y: [0, -5, 0], rotate: 0, transition: { y: { duration: 0.32, repeat: Infinity, ease: 'linear' } } },
  PANIC: { y: [0, -2, 0], rotate: [-4, 4, -4], transition: { duration: 0.22, repeat: Infinity, ease: 'linear' } },
  HIT: { y: 6, rotate: 18, transition: { duration: 0.3, ease: ease.out } },
};

/** Illustrated bug — same cross-fade approach as CharacterArt. */
export const BugArt = memo(function BugArt({
  mood = 'CRAWL',
  reducedMotion = false,
  className,
  facingLeft = false,
  title = 'Bug',
}: BugArtProps) {
  if (!BUG_ART_READY) {
    return <Bug mood={mood} reducedMotion={reducedMotion} className={className} facingLeft={facingLeft} />;
  }

  const active = BUG_POSE[mood];

  return (
    <motion.div
      role="img"
      aria-label={title}
      className={className}
      style={{ aspectRatio: '1 / 1', scaleX: facingLeft ? -1 : 1 }}
      variants={reducedMotion ? undefined : bodyVariants}
      animate={reducedMotion ? undefined : mood}
      initial={false}
    >
      <div className="relative h-full w-full">
        {BUG_POSES.map((pose) => (
          <motion.img
            key={pose}
            src={bugArtSrc(pose)}
            alt=""
            aria-hidden
            width={ART_W}
            height={ART_H}
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
