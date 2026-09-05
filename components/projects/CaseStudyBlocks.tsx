'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { fadeUp, scaleIn, stagger, viewportOnce } from '@/lib/animations';

/** Header stat strip — round-cornered glass tiles, 2-up on phones so long labels never squeeze. */
export function HighlightStrip({ items }: { items: readonly { value: string; label: string }[] }) {
  return (
    <motion.ul
      variants={stagger(0.06)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      {items.map((highlight) => (
        <motion.li key={highlight.label} variants={fadeUp}>
          <GlassCard className="px-4 py-3.5">
            <p className="text-base font-semibold tracking-tight sm:text-lg">{highlight.value}</p>
            <p className="mt-0.5 text-xs text-muted">{highlight.label}</p>
          </GlassCard>
        </motion.li>
      ))}
    </motion.ul>
  );
}

/** The round-badge-in-square-card motif, now glass and staggered in on scroll (mobile included). */
export function CardGrid({ items }: { items: readonly string[] }) {
  return (
    <motion.div
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="grid gap-4 sm:grid-cols-2"
    >
      {items.map((item, index) => (
        <motion.div key={item} variants={fadeUp}>
          <GlassCard className="h-full p-5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/10 font-mono text-xs text-accent">
              {String(index + 1).padStart(2, '0')}
            </span>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item}</p>
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function Tags({ items }: { items: readonly string[] }) {
  return (
    <motion.ul
      variants={stagger(0.04)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="flex flex-wrap gap-2"
    >
      {items.map((item) => (
        <motion.li
          key={item}
          variants={fadeUp}
          whileTap={{ scale: 0.95 }}
          className="rounded-full border border-line bg-elevated px-3 py-1.5 text-sm text-muted
            transition-colors duration-200 active:border-accent/40 active:text-accent"
        >
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}

/** Process pills — horizontally scrollable on phones, each step pops in with a tap-friendly bounce. */
export function FlowDiagram({ steps }: { steps: readonly string[] }) {
  return (
    <GlassCard className="overflow-x-auto p-6">
      <motion.ol
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="flex min-w-max items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em]"
      >
        {steps.map((step, index) => (
          <motion.li key={step} variants={scaleIn} className="flex items-center gap-3">
            <span className="rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 text-accent">
              {step}
            </span>
            {index < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-faint" aria-hidden />}
          </motion.li>
        ))}
      </motion.ol>
    </GlassCard>
  );
}

export function OutcomePanel({ text }: { text: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      <GlassCard className="glass-panel-accent flex items-start gap-4 p-6">
        <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
          <span className="absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-accent/40" aria-hidden />
          <Sparkles className="h-4 w-4" aria-hidden />
        </span>
        <p className="text-base leading-relaxed text-muted">{text}</p>
      </GlassCard>
    </motion.div>
  );
}
