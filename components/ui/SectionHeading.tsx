'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, stagger, viewportOnce } from '@/lib/animations';

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
};

export function SectionHeading({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
  return (
    <motion.div
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      <motion.p variants={fadeUp} className="eyebrow">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {eyebrow}
      </motion.p>
      <motion.h2 variants={fadeUp} className="section-heading mt-5">
        {title}
      </motion.h2>
      {description ? (
        <motion.p variants={fadeUp} className="mt-4 text-base leading-relaxed text-muted">
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

export default SectionHeading;
