'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { CharacterArt } from '@/components/hero/CharacterArt';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { fadeUp, stagger, viewportOnce } from '@/lib/animations';
import { experiences } from '@/lib/content';

export function Experience() {
  const reducedMotion = useReducedMotion();
  const timeline = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: timeline,
    offset: ['start 65%', 'end 60%'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.6 });
  const lineScale = useTransform(progress, [0, 1], [0, 1]);
  const walkerTop = useTransform(progress, [0, 1], ['0%', '100%']);

  return (
    <section id="experience" className="scroll-mt-24 border-t border-line py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Experience"
          title={
            <>
              My <span className="text-gradient">Journey</span>
            </>
          }
          description="Six years in IT, four of them moving quality further left — from service desk and structured manual testing to automation that gates every release."
        />

        <div ref={timeline} className="relative mt-14 pl-10 sm:pl-14">
          {/* the trail */}
          <div className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px bg-line sm:left-[15px]" aria-hidden />
          <motion.div
            aria-hidden
            style={{ scaleY: reducedMotion ? 1 : lineScale }}
            className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b
              from-accent via-accent to-accent/20 sm:left-[15px]"
          />

          {/* the hunter walking the trail */}
          {!reducedMotion && (
            <motion.div
              aria-hidden
              style={{ top: walkerTop }}
              className="absolute left-[-20px] hidden w-16 -translate-y-1/2 sm:block"
            >
              <CharacterArt state="IDLE" halo={false} className="h-auto w-full" />
            </motion.div>
          )}

          <motion.ol
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="space-y-6"
          >
            {experiences.map((item) => (
              <motion.li key={`${item.company}-${item.period}`} variants={fadeUp} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-10 top-6 grid h-[23px] w-[23px] place-items-center rounded-full
                    border border-line bg-canvas sm:-left-14"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                </span>

                <article className="surface-card p-6 transition-colors duration-300 hover:border-accent/30 sm:p-7">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">{item.period}</p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight">{item.role}</h3>
                  <p className="mt-1 text-sm text-muted">{item.company}</p>

                  <ul className="mt-5 space-y-2.5">
                    {item.points.map((point) => (
                      <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted">
                        <span aria-hidden className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {item.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-line bg-elevated px-2.5 py-1 font-mono text-[11px] text-muted"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </article>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

export default Experience;
