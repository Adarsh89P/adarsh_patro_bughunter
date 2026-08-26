'use client';

import { memo } from 'react';

/** The arrow in flight — position is driven by the scroll timeline, not by CSS. */
function ArrowBase({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 24" className={className} aria-hidden="true" style={{ overflow: 'visible' }}>
      <line x1="14" y1="12" x2="98" y2="12" stroke="#b9a68f" strokeWidth="3" strokeLinecap="round" />
      <path d="M118 12 l-20 -7 v14 z" fill="rgb(var(--accent))" />
      <path d="M14 12 l12 -6 v12 z" fill="rgb(var(--accent-soft))" />
      <path d="M4 12 l12 -6 v12 z" fill="rgb(var(--accent-soft))" opacity="0.7" />
    </svg>
  );
}

export const Arrow = memo(ArrowBase);
export default Arrow;
