import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  output: isProd ? 'export' : undefined,
  basePath: '/notion-embedded-widgets',
  assetPrefix: '/notion-embedded-widgets',
};

export default nextConfig;
