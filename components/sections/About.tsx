'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Character } from '@/components/hero/Character';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ease, fadeUp, stagger, viewportOnce } from '@/lib/animations';
import { focusAreas, stats } from '@/lib/content';

export function About() {
  const reducedMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="about" className="scroll-mt-24 border-t border-line py-24 sm:py-32">
      <div className="container">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="About"
              title={
                <>
                  Behind the <span className="text-gradient">Bug Hunter</span>
                </>
              }
              description="I am an Automation QA Engineer focused on building reliable and scalable automation solutions. I enjoy solving complex problems, improving testing processes, and ensuring high-quality digital experiences."
            />

            <Reveal className="mt-8" delay={0.05}>
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
                aria-controls="about-more"
                className="btn-ghost"
              >
                Know More About Me
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
            </Reveal>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  id="about-more"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.42, ease: ease.out }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
                    <p>
                      Most of my work sits where quality engineering meets developer experience: frameworks
                      that other engineers can read, extend and trust. A suite nobody trusts is worse than no
                      suite at all, so I optimise for signal — deterministic waits, isolated test data, and
                      failures that name the real cause.
                    </p>
                    <p>
                      Day to day that means designing page-object and fixture layers, pushing coverage down to
                      the API where it runs faster, wiring everything into CI as a real release gate, and
                      reporting readiness in a way the whole delivery team can act on.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.ul
              variants={stagger(0.07)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {stats.map((stat) => (
                <motion.li key={stat.label} variants={fadeUp} className="surface-card p-4">
                  <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
                  <p className="mt-1 text-xs leading-snug text-muted">{stat.label}</p>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <div className="space-y-6">
            <Reveal className="relative overflow-hidden rounded-3xl border border-line bg-elevated p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-accent/12 blur-3xl" />
              <div className="relative flex items-end justify-center">
                <Character
                  state="IDLE"
                  reducedMotion={reducedMotion}
                  className="h-auto w-[190px] sm:w-[220px]"
                  title="Adarsh at rest between hunts"
                />
              </div>
              <p className="relative mt-6 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
                Currently hunting regressions in insurance platforms
              </p>
            </Reveal>

            <motion.ul
              variants={stagger(0.06)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid gap-3"
            >
              {focusAreas.map((focus) => (
                <motion.li
                  key={focus.label}
                  variants={fadeUp}
                  className="group flex items-start gap-4 rounded-2xl border border-line bg-surface p-4
                    transition-colors duration-300 hover:border-accent/35"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent
                    transition-transform duration-300 group-hover:scale-105">
                    <focus.icon className="h-4.5 w-4.5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{focus.label}</span>
                    <span className="mt-0.5 block text-sm text-muted">{focus.description}</span>
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
