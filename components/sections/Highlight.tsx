'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, TrendingUp, Wrench } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlassBed } from '@/components/ui/GlassBed';
import { fadeUp, stagger, viewportOnce } from '@/lib/animations';
import { missionHighlight } from '@/lib/content';

const BEATS = [
  { key: 'challenge', label: 'Challenge', icon: AlertTriangle, tone: 'text-bug' },
  { key: 'solution', label: 'Solution', icon: Wrench, tone: 'text-accent' },
  { key: 'impact', label: 'Impact', icon: TrendingUp, tone: 'text-accent' },
] as const;

/**
 * The storyboard's "project highlight" beat: one engagement told as
 * challenge → solution → impact.
 *
 * Laid out as three columns rather than as another illustrated card — the
 * Projects section directly above already stages the hunter-versus-boss
 * standoff, and repeating it here made the two sections read as one long
 * duplicate. The progression reads left to right, which also keeps it distinct
 * from the stacked cards elsewhere on the page.
 */
export function Highlight() {
  return (
    <section id="highlight" className="scroll-mt-24 border-t border-line py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          eyebrow={missionHighlight.eyebrow}
          title={
            <>
              The <span className="text-gradient">Boss Fight</span>
            </>
          }
          description="One engagement, start to finish — what was breaking, what I built, and what changed as a result."
        />

        <div className="mt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{missionHighlight.name}</h3>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-faint">
              {missionHighlight.context}
            </p>
          </div>

          {/* challenge → solution → impact, as a left-to-right progression */}
          <GlassBed className="mt-10 rounded-3xl">
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch lg:gap-0"
            >
              {BEATS.map((beat, index) => (
                <Fragment key={beat.key}>
                  <motion.div variants={fadeUp} whileTap={{ scale: 0.98 }} className="glass-panel h-full rounded-2xl p-6">
                    <div className="flex items-center gap-3">
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 ${beat.tone}`}>
                        <beat.icon className="h-4 w-4" aria-hidden />
                      </span>
                      <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
                        {beat.label}
                      </h4>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted">{missionHighlight[beat.key]}</p>
                  </motion.div>

                  {/* connector — only between cards, and only once they sit in a row */}
                  {index < BEATS.length - 1 && (
                    <div aria-hidden className="hidden items-center px-3 lg:flex">
                      <ArrowRight className="h-4 w-4 text-faint" />
                    </div>
                  )}
                </Fragment>
              ))}
            </motion.div>
          </GlassBed>

          {/* the numbers the fight produced */}
          <motion.dl
            variants={stagger(0.07)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-4 grid gap-4 sm:grid-cols-3"
          >
            {missionHighlight.metrics.map((metric) => (
              <motion.div
                key={metric.label}
                variants={fadeUp}
                whileTap={{ scale: 0.97 }}
                className="glass-panel-accent glass-panel rounded-2xl px-6 py-5"
              >
                <dt className="sr-only">{metric.label}</dt>
                <dd>
                  <p className="text-3xl font-semibold tracking-tight text-gradient">{metric.value}</p>
                  <p className="mt-1 text-xs leading-tight text-muted">{metric.label}</p>
                </dd>
              </motion.div>
            ))}
          </motion.dl>

          <ul className="mt-6 flex flex-wrap gap-2">
            {missionHighlight.stack.map((tech) => (
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
    </section>
  );
}

export default Highlight;
