'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, Github, Target } from 'lucide-react';
import { BugBoss } from '@/components/hero/BugBoss';
import { CharacterArt } from '@/components/hero/CharacterArt';
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
          description="Open-source automation frameworks I build and maintain. Open a mission for the full write-up, or read the code on GitHub."
        />

        {/* ── featured mission: the boss battle ─────────────────────────── */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          onMouseEnter={() => setArmed(true)}
          onMouseLeave={() => setArmed(false)}
          className="glass-panel relative mt-14 rounded-3xl"
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

              <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted">{featured.summary}</p>

              <ul className="mt-7 grid gap-3 sm:grid-cols-3">
                {featured.highlights.map((highlight) => (
                  <li key={highlight.label} className="glass-panel rounded-2xl px-4 py-3">
                    <p className="text-lg font-semibold tracking-tight">{highlight.value}</p>
                    <p className="mt-0.5 text-xs text-muted">{highlight.label}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href={`/projects/${featured.slug}`} className="btn-primary">
                  Read the write-up
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
                <a href={featured.repo} target="_blank" rel="noreferrer" className="btn-ghost">
                  <Github className="h-4 w-4" aria-hidden />
                  View on GitHub
                </a>
              </div>

              <ul className="mt-6 flex flex-wrap gap-2">
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

            {/* the standoff */}
            <div className="relative flex min-h-[240px] items-end justify-between gap-4 sm:min-h-[300px]">
              <CharacterArt
                state={armed && !reducedMotion ? 'AIM' : 'IDLE'}
                states={['AIM', 'IDLE']}
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
          {rest.map((project) => {
            const isPlanned = project.status === 'planned';

            return (
              <motion.li key={project.slug} variants={fadeUp}>
                <article
                  className={`glass-panel group relative flex h-full flex-col rounded-3xl p-7 ${
                    isPlanned ? 'opacity-90' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold tracking-tight">
                      {isPlanned ? (
                        project.name
                      ) : (
                        <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
                          {project.name}
                        </Link>
                      )}
                    </h3>
                    {isPlanned ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                        <Clock className="h-3 w-3" aria-hidden />
                        Coming soon
                      </span>
                    ) : (
                      <ArrowUpRight
                        className="h-5 w-5 shrink-0 text-faint transition-[transform,color] duration-300
                          group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                        aria-hidden
                      />
                    )}
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-muted">{project.tagline}</p>

                  {project.highlights.length > 0 && (
                    <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {project.highlights.map((highlight) => (
                        <li key={highlight.label}>
                          <p className="text-sm font-semibold tracking-tight">{highlight.value}</p>
                          <p className="mt-0.5 text-[11px] leading-tight text-faint">{highlight.label}</p>
                        </li>
                      ))}
                    </ul>
                  )}

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

                  {!isPlanned && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="relative z-10 mt-5 inline-flex w-max items-center gap-1.5 text-sm text-muted
                        transition-colors hover:text-accent"
                    >
                      <Github className="h-4 w-4" aria-hidden />
                      GitHub
                    </a>
                  )}
                </article>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}

export default Projects;
