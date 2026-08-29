import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * The site is fully static, so it exports to plain HTML and ships to GitHub Pages.
 *
 * A GitHub Pages *project* site is served from https://<user>.github.io/<repo>/,
 * so every asset and route needs that prefix. CI sets NEXT_PUBLIC_BASE_PATH;
 * locally it stays empty and the site runs at the root.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// An unrelated lockfile further up the drive makes Next infer the wrong workspace
// root, which breaks module resolution during the export. Pin it to this project.
const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  outputFileTracingRoot: projectRoot,
  basePath,
  assetPrefix: basePath || undefined,
  // Pages serves directories, not rewrites — emit /route/index.html.
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // No image optimisation server exists on Pages.
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
