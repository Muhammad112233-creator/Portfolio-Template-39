import type { NextConfig } from 'next';

// When the site lives in a sub-folder (GitHub Pages project sites do:
// https://user.github.io/repo-name), set NEXT_PUBLIC_BASE_PATH=/repo-name.
// The deploy workflow in .github/workflows does this for you.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: basePath || undefined,
  images: { unoptimized: true },
  reactStrictMode: false,
  devIndicators: false,
};

export default nextConfig;
