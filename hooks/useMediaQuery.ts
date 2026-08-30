'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const list = window.matchMedia(query);
    const sync = () => setMatches(list.matches);

    sync();
    list.addEventListener('change', sync);
    return () => list.removeEventListener('change', sync);
  }, [query]);

  return matches;
}

/** Desktop gets the full pinned cinematic; below this we run the compact version. */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

/**
 * True for mouse-driven devices. Width alone is not enough to decide whether a
 * device can carry the pinned cinematic: a tablet in landscape clears 1024px
 * but scrolls on a touch compositor that the scrubbed timeline fights with.
 */
export function useHasFinePointer(): boolean {
  return useMediaQuery('(pointer: fine)');
}
