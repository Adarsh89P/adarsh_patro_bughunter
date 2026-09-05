'use client';

import { useRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type GlassCardProps = HTMLMotionProps<'div'> & {
  children: ReactNode;
};

/**
 * A frosted "liquid glass" card whose highlight follows the pointer.
 * Falls back gracefully on touch: no pointermove means the highlight just sits
 * centered until `:active` lights it up on tap (see .glass-panel in globals.css).
 */
export function GlassCard({ children, className = '', ...motionProps }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node || event.pointerType !== 'mouse') return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    node.style.setProperty('--y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      whileTap={{ scale: 0.98 }}
      className={`glass-panel rounded-2xl ${className}`}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

export default GlassCard;
