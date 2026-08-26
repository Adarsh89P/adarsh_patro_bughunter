import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Github } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { projects } from '@/lib/content';

type PageProps = { params: Promise<{ slug: string }> };

/** Static export: only the slugs below exist, everything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: 'Write-up not found' };

  return {
    title: project.name,
    description: project.tagline,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.name, description: project.tagline },
  };
}

function Block({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <Reveal as="section" className="border-t border-line pt-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{index}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-5 text-base leading-relaxed text-muted">{children}</div>
    </Reveal>
  );
}

function List({ items }: { items: readonly string[] }) {
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

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const { detail } = project;

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
            Framework write-up
          </p>
          <h1 className="mt-5 text-[clamp(2rem,5.5vw,3.25rem)] font-semibold leading-[1.06]">
            {project.name}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{project.tagline}</p>

          <div className="mt-7">
            <a href={project.repo} target="_blank" rel="noreferrer" className="btn-ghost">
              <Github className="h-4 w-4" aria-hidden />
              View on GitHub
            </a>
          </div>

          <ul className="mt-8 grid grid-cols-3 gap-3">
            {project.highlights.map((highlight) => (
              <li key={highlight.label} className="surface-card px-4 py-3.5">
                <p className="text-base font-semibold tracking-tight sm:text-lg">{highlight.value}</p>
                <p className="mt-0.5 text-xs text-muted">{highlight.label}</p>
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
            <p>{detail.overview}</p>
            <p className="mt-4">{project.summary}</p>
          </Block>

          <Block index="02" title="Design goals">
            <List items={detail.goals} />
          </Block>

          <Block index="03" title="Architecture">
            <List items={detail.architecture} />
          </Block>

          <Block index="04" title="Test execution flow">
            <div className="overflow-x-auto rounded-2xl border border-line bg-elevated p-6">
              <ol className="flex min-w-max items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em]">
                {detail.flow.map((step, index) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 text-accent">
                      {step}
                    </span>
                    {index < detail.flow.length - 1 && <span aria-hidden className="text-faint">→</span>}
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-faint">
                How a run moves through the framework, from trigger to published report.
              </p>
            </div>
          </Block>

          <Block index="05" title="Key features">
            <List items={project.features} />
          </Block>

          <Block index="06" title="Testing practices">
            <List items={detail.practices} />
          </Block>

          <Block index="07" title="Technology stack">
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li key={tech} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm">
                  {tech}
                </li>
              ))}
            </ul>
          </Block>
        </div>

        <nav className="mt-16 border-t border-line pt-8" aria-label="Other write-ups">
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
