'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { CharacterArt } from '@/components/hero/CharacterArt';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { fadeUp, stagger, viewportOnce } from '@/lib/animations';
import { profile } from '@/lib/content';

const links = [
  { label: 'LinkedIn', href: profile.linkedin, icon: Linkedin, external: true },
  { label: 'GitHub', href: profile.github, icon: Github, external: true },
  { label: 'Email', href: `mailto:${profile.email}`, icon: Mail, external: false },
  { label: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}`, icon: Phone, external: false },
  { label: 'Resume', href: profile.resume, icon: Download, external: true },
];

export function Contact() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden border-t border-line py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[420px]">
        <div className="absolute left-1/2 top-1/2 hidden h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px] lg:block" />
      </div>

      <div className="container">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.8fr]">
          <motion.div
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <motion.p variants={fadeUp} className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Contact
            </motion.p>

            <motion.h2 variants={fadeUp} className="mt-5 text-[clamp(2.25rem,6vw,3.75rem)] font-semibold leading-[1.04]">
              Mission
              <span className="block text-gradient">Complete.</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              Found all the bugs. Ready for the next challenge — let&rsquo;s build something reliable together.
            </motion.p>

            <motion.p variants={fadeUp} className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-faint">
              {profile.location}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9">
              <a href={`mailto:${profile.email}`} className="btn-primary">
                Let&rsquo;s Connect
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </motion.div>

            <motion.ul variants={fadeUp} className="mt-10 flex flex-wrap gap-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5
                      text-sm text-muted transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    <link.icon className="h-4 w-4" aria-hidden />
                    {link.label}
                  </a>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* the victorious hunter beside a flag */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="relative flex items-end justify-center gap-2"
          >
            <CharacterArt
              state="CELEBRATE"
              states={['CELEBRATE']}
              reducedMotion={reducedMotion}
              className="h-auto w-[52%] max-w-[230px]"
              title="Adarsh celebrating a completed mission"
            />

            <svg viewBox="0 0 120 220" className="h-auto w-[34%] max-w-[150px]" aria-hidden>
              <ellipse cx="34" cy="212" rx="30" ry="6" fill="rgb(17 16 28)" opacity="0.14" />
              <path d="M22 212 q0 -14 12 -16 q12 2 12 16 z" fill="rgb(var(--line))" />
              <rect x="31" y="24" width="5" height="176" rx="2.5" fill="rgb(var(--muted))" />
              <motion.path
                d="M36 30 q26 8 44 0 q-6 20 0 40 q-22 8 -44 0 z"
                fill="rgb(var(--accent))"
                animate={reducedMotion ? {} : { d: [
                  'M36 30 q26 8 44 0 q-6 20 0 40 q-22 8 -44 0 z',
                  'M36 30 q26 -6 44 2 q-8 20 -2 38 q-20 10 -42 2 z',
                  'M36 30 q26 8 44 0 q-6 20 0 40 q-22 8 -44 0 z',
                ] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <circle cx="33.5" cy="22" r="5" fill="rgb(var(--accent-soft))" />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
