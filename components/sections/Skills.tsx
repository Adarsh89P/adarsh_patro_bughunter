'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { fadeUp, stagger, viewportOnce } from '@/lib/animations';
import { skillGroups } from '@/lib/content';

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 border-t border-line py-24 sm:py-32">
      <div className="container">
        <SectionHeading
          eyebrow="Skills"
          title={
            <>
              My <span className="text-gradient">Arsenal</span>
            </>
          }
          description="The tools I reach for when a release needs to be proven, not hoped for."
        />

        <motion.ul
          variants={stagger(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skillGroups.map((group) => (
            <motion.li key={group.name} variants={fadeUp}>
              <article
                className="group relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-5
                  transition-[transform,border-color,box-shadow] duration-300 will-change-transform
                  hover:-translate-y-1 hover:border-accent/35 hover:shadow-lift focus-within:-translate-y-1"
                tabIndex={0}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent/0
                    blur-2xl transition-colors duration-500 group-hover:bg-accent/20"
                />

                <div className="relative flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent
                    transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                    <group.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="text-base font-medium leading-tight">{group.name}</h3>
                </div>

                <ul className="relative mt-5 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line bg-elevated px-2.5 py-1 font-mono text-[11px] text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

export default Skills;
