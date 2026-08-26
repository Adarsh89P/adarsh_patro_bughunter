'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Target } from 'lucide-react';
import { BugBoss } from '@/components/hero/BugBoss';
import { Character } from '@/components/hero/Character';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { fadeUp, scaleIn, stagger, viewportOnce } from '@/lib/animations';
import { projects } from '@/lib/content';

export function Projects() {
  const reducedMotion = useReducedMotion();
  const [armed, setArmed] = useState(false);
  const [featured, ...rest] = projects;

  return (
    <section id="projects" className="scroll-mt-24 border-t border-line py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Projects"
          title={
            <>
              Featured <span className="text-gradient">Missions</span>
            </>
          }
          description="Each one started as a quality problem worth solving. Open a mission for the full case study."
        />

        {/* ── featured mission: the boss battle ─────────────────────────── */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          onMouseEnter={() => setArmed(true)}
          onMouseLeave={() => setArmed(false)}
          className="relative mt-14 overflow-hidden rounded-3xl border border-line bg-elevated"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/12 blur-3xl" />

          <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="eyebrow">
                <Target className="h-3 w-3" aria-hidden />
                Boss battle
              </p>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">{featured.name}</h3>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted">{featured.tagline}</p>

              <dl className="mt-8 space-y-5">
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">Challenge</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted">{featured.challenge}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">Solution</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted">{featured.solution}</dd>
                </div>
              </dl>

              <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                {featured.metrics.map((metric) => (
                  <li key={metric.label} className="rounded-2xl border border-line bg-surface px-4 py-3">
                    <p className="text-xl font-semibold tracking-tight">{metric.value}</p>
                    <p className="mt-0.5 text-xs text-muted">{metric.label}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href={`/projects/${featured.slug}`} className="btn-primary">
                  View Case Study
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
                <ul className="flex flex-wrap gap-2">
                  {featured.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[11px] text-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* the standoff */}
            <div className="relative flex min-h-[240px] items-end justify-between gap-4 sm:min-h-[300px]">
              <Character
                state={armed && !reducedMotion ? 'AIM' : 'IDLE'}
                reducedMotion={reducedMotion}
                className="h-auto w-[38%] max-w-[170px]"
                title="Adarsh taking aim at the bug boss"
              />
              <BugBoss alert={armed} reducedMotion={reducedMotion} className="h-auto w-[54%] max-w-[240px]" />
            </div>
          </div>
        </motion.div>

        {/* ── the rest of the missions ──────────────────────────────────── */}
        <motion.ul
          variants={stagger(0.09)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-6 grid gap-6 md:grid-cols-2"
        >
          {rest.map((project) => (
            <motion.li key={project.slug} variants={fadeUp}>
              <Link
                href={`/projects/${project.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-7
                  transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1
                  hover:border-accent/35 hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold tracking-tight">{project.name}</h3>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 text-faint transition-[transform,color] duration-300
                      group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden
                  />
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted">{project.tagline}</p>

                <ul className="mt-6 grid grid-cols-3 gap-3">
                  {project.metrics.map((metric) => (
                    <li key={metric.label}>
                      <p className="text-base font-semibold tracking-tight">{metric.value}</p>
                      <p className="mt-0.5 text-[11px] leading-tight text-faint">{metric.label}</p>
                    </li>
                  ))}
                </ul>

                <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-line bg-elevated px-2.5 py-1 font-mono text-[11px] text-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

export default Projects;
