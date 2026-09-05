import type { ReactNode } from 'react';

/**
 * Two blurred color blobs behind a `glass-panel` group — without them,
 * backdrop-filter has nothing to refract and the cards just look like plain
 * translucent boxes. `overflow: hidden` is baked into `.glass-bed` so the
 * off-edge blobs never introduce a horizontal scrollbar on narrow screens.
 */
export function GlassBed({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`glass-bed ${className}`}>
      <span className="glass-bed-a" aria-hidden />
      <span className="glass-bed-b" aria-hidden />
      {children}
    </div>
  );
}

export default GlassBed;
