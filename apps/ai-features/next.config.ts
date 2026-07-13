import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === 'production' ? '.next-build' : '.next',
  transpilePackages: ['componentiq', '@winniekagendo/componentiq-ai'],
  turbopack: {
    resolveAlias: { underscore: 'lodash' },
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      underscore: 'lodash',
    };
    return config;
  },
};

export default nextConfig;
