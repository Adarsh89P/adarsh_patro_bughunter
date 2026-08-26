'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted
        transition-colors hover:border-accent/45 hover:text-accent"
    >
      {/* Both icons render so the button never shifts during hydration. */}
      <Sun className={`h-4 w-4 ${isDark ? 'hidden' : 'block'}`} aria-hidden />
      <Moon className={`h-4 w-4 ${isDark ? 'block' : 'hidden'}`} aria-hidden />
    </button>
  );
}

export default ThemeToggle;
