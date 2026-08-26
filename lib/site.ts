/**
 * Deployment-aware URLs.
 *
 * On GitHub Pages the site lives under /<repo>/, so anything Next does not
 * prefix for us — raw <a href> targets, files served straight out of public/ —
 * has to be prefixed by hand. next/link and next/image handle basePath already.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://adarsh89p.github.io/adarsh_patro_bughunter'
).replace(/\/$/, '');

/** Prefixes a public/ asset path with the deployment's base path. */
export function asset(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('mailto:')) return path;
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`;
}
