import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  output: isProd ? 'export' : undefined,
  basePath: '/notion-embeded-widgets',
  assetPrefix: '/notion-embeded-widgets',
  images: { unoptimized: true },
};

export default nextConfig;
