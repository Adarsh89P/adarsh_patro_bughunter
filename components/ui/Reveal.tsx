'use client';

import type { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { fadeUp, viewportOnce } from '@/lib/animations';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  as?: 'div' | 'li' | 'article' | 'section';
};

/** Scroll-reveal wrapper — one place to keep every section's entrance identical. */
export function Reveal({ children, className, delay = 0, variants = fadeUp, as = 'div' }: RevealProps) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}

export default Reveal;
