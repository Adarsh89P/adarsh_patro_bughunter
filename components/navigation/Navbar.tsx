'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useActiveSection } from '@/hooks/useActiveSection';
import { ease } from '@/lib/animations';
import { navSections, profile } from '@/lib/content';

const SECTION_IDS = navSections.map((section) => section.id);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The mobile sheet must never leave the page scroll-locked.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled ? 'nav-glass' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="container flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${profile.name} — home`}>
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-[13px] font-semibold text-white">
            AP
          </span>
          <span className="hidden text-sm font-medium sm:block">{profile.name}</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navSections.map((section) => {
            const isActive = active === section.id;
            return (
              <li key={section.id}>
                <Link
                  href={`/#${section.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative inline-flex rounded-full px-3.5 py-2 text-sm transition-colors ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-accent/12"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {section.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white
              transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            <FileText className="h-3.5 w-3.5" aria-hidden />
            Resume
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="glass-panel inline-flex h-9 w-9 items-center justify-center rounded-full
              text-muted transition-colors hover:text-accent md:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: ease.out }}
            className="nav-glass border-t-0 md:hidden"
          >
            <ul className="container flex flex-col py-3">
              {navSections.map((section) => (
                <li key={section.id}>
                  <Link
                    href={`/#${section.id}`}
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-3 py-3 text-base transition-colors ${
                      active === section.id ? 'bg-accent/10 text-accent' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {section.label}
                  </Link>
                </li>
              ))}
              <li className="px-3 pb-2 pt-3">
                <a href={profile.resume} target="_blank" rel="noreferrer" className="btn-primary w-full">
                  <FileText className="h-4 w-4" aria-hidden />
                  Resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
