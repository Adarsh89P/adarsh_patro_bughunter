import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Github } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { GlassBed } from '@/components/ui/GlassBed';
import { CardGrid, FlowDiagram, HighlightStrip, OutcomePanel, Tags } from '@/components/projects/CaseStudyBlocks';
import { projects } from '@/lib/content';

type PageProps = { params: Promise<{ slug: string }> };

/** Static export: only the slugs below exist, everything else is a 404. */
export const dynamicParams = false;

/** Planned projects have no repo or write-up yet, so no route is generated for them. */
const shippedProjects = projects.filter((project) => project.status !== 'planned');

export function generateStaticParams() {
  return shippedProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = shippedProjects.find((item) => item.slug === slug);
  if (!project) return { title: 'Write-up not found' };

  return {
    title: project.name,
    description: project.tagline,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.name, description: project.tagline },
  };
}

function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{index}</span>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = shippedProjects.find((item) => item.slug === slug);
  if (!project) notFound();

  const { detail } = project;

  return (
    <article className="pb-20 pt-28 sm:pb-32 sm:pt-32">
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
            Framework write-up
          </p>
          <h1 className="mt-5 text-[clamp(1.75rem,7vw,3.25rem)] font-semibold leading-[1.08] break-words">
            {project.name}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{project.tagline}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href={project.repo} target="_blank" rel="noreferrer" className="btn-ghost w-full sm:w-auto">
              <Github className="h-4 w-4" aria-hidden />
              View on GitHub
            </a>
          </div>

          <GlassBed className="mt-8 rounded-3xl">
            <HighlightStrip items={project.highlights} />
          </GlassBed>
        </header>

        <div className="mt-14 space-y-12 sm:mt-16 sm:space-y-14">
          <Reveal as="section" className="border-t border-line pt-8 sm:pt-10">
            <SectionLabel index="01" title="Overview" />
            <p className="mt-5 text-base leading-relaxed text-muted">{detail.overview}</p>
          </Reveal>

          <section className="border-t border-line pt-8 sm:pt-10">
            <SectionLabel index="02" title="Approach" />
            <GlassBed className="mt-5 rounded-3xl">
              <CardGrid items={detail.goals} />
            </GlassBed>
          </section>

          <section className="border-t border-line pt-8 sm:pt-10">
            <SectionLabel index="03" title="How it's built" />
            <GlassBed className="mt-5 rounded-3xl">
              <CardGrid items={detail.architecture} />
            </GlassBed>
          </section>

          <section className="border-t border-line pt-8 sm:pt-10">
            <SectionLabel index="04" title="Process" />
            <GlassBed className="mt-5 rounded-3xl">
              <FlowDiagram steps={detail.flow} />
            </GlassBed>
          </section>

          <section className="border-t border-line pt-8 sm:pt-10">
            <SectionLabel index="05" title="Key features" />
            <div className="mt-5">
              <Tags items={project.features} />
            </div>
          </section>

          <section className="border-t border-line pt-8 sm:pt-10">
            <SectionLabel index="06" title="Outcome" />
            <GlassBed className="mt-5 rounded-3xl">
              <OutcomePanel text={detail.outcome} />
            </GlassBed>
          </section>
        </div>

        <nav className="mt-16 border-t border-line pt-8" aria-label="Other write-ups">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">Next mission</p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {shippedProjects
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
