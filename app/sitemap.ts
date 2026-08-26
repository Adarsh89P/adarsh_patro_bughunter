import type { MetadataRoute } from 'next';
import { projects } from '@/lib/content';
import { siteUrl } from '@/lib/site';

const base = siteUrl;

// Required for `output: export` — these routes are emitted as static files.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...projects.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ];
}
