import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { projects } from '@/lib/content';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: 'Case study not found' };

  return {
    title: project.name,
    description: project.tagline,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.name, description: project.tagline },
  };
}

/** Ordered sections of every case study — keeps all three pages consistent. */
function Block({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <Reveal as="section" className="border-t border-line pt-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{index}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-5 text-base leading-relaxed text-muted">{children}</div>
    </Reveal>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const { caseStudy } = project;

  return (
    <article className="pb-24 pt-32 sm:pb-32">
      <div className="container max-w-3xl">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All missions
        </Link>

        <header className="mt-8">
          <p className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Case study
          </p>
          <h1 className="mt-5 text-[clamp(2rem,5.5vw,3.25rem)] font-semibold leading-[1.06]">
            {project.name}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{project.tagline}</p>

          <ul className="mt-8 grid grid-cols-3 gap-3">
            {project.metrics.map((metric) => (
              <li key={metric.label} className="surface-card px-4 py-3.5">
                <p className="text-xl font-semibold tracking-tight sm:text-2xl">{metric.value}</p>
                <p className="mt-0.5 text-xs text-muted">{metric.label}</p>
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-line bg-elevated px-3 py-1 font-mono text-[11px] text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>
        </header>

        <div className="mt-14 space-y-10">
          <Block index="01" title="Overview">
            <p>{caseStudy.overview}</p>
          </Block>

          <Block index="02" title="Problem">
            <p>{caseStudy.problem}</p>
          </Block>

          <Block index="03" title="Challenge">
            <p>{caseStudy.challenge}</p>
          </Block>

          <Block index="04" title="Solution">
            <p>{caseStudy.solution}</p>
          </Block>

          <Block index="05" title="Architecture">
            <List items={caseStudy.architecture} />
            <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-elevated p-6">
              <ol className="flex min-w-max items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em]">
                {['Trigger', 'Setup', 'Execute', 'Assert', 'Report'].map((step, index, all) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 text-accent">
                      {step}
                    </span>
                    {index < all.length - 1 && <span aria-hidden className="text-faint">→</span>}
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-faint">Test execution flow, from CI trigger to published report.</p>
            </div>
          </Block>

          <Block index="06" title="Technology stack">
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li key={tech} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm">
                  {tech}
                </li>
              ))}
            </ul>
          </Block>

          <Block index="07" title="Automation strategy">
            <List items={caseStudy.strategy} />
          </Block>

          <Block index="08" title="Results">
            <List items={caseStudy.results} />
          </Block>

          <Block index="09" title="Key metrics">
            <ul className="grid gap-3 sm:grid-cols-3">
              {project.metrics.map((metric) => (
                <li key={metric.label} className="surface-card px-4 py-4">
                  <p className="text-2xl font-semibold tracking-tight">{metric.value}</p>
                  <p className="mt-1 text-xs text-muted">{metric.label}</p>
                </li>
              ))}
            </ul>
            <ul className="mt-6 space-y-3">
              {project.impact.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </Block>

          <Block index="10" title="Lessons learned">
            <List items={caseStudy.lessons} />
          </Block>
        </div>

        <nav className="mt-16 border-t border-line pt-8" aria-label="Other case studies">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">Next mission</p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {projects
              .filter((item) => item.slug !== project.slug)
              .map((item) => (
                <li key={item.slug}>
                  <Link href={`/projects/${item.slug}`} className="btn-ghost">
                    {item.name}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </article>
  );
}
