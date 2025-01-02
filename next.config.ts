import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  output: isProd ? 'export' : undefined,
  basePath: isProd ? '/notion-embedded-widgets' : '',
  assetPrefix: isProd ? '/notion-embedded-widgets' : '',
};

export default nextConfig;
