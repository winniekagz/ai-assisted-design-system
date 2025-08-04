import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],
  viteFinal: async config => {
    // Add path alias resolution
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
      };
    }

    // Configure SVG handling
    config.define = {
      ...config.define,
      global: 'globalThis',
    };

    // Add SVGR plugin with proper configuration
    const { default: svgr } = await import('vite-plugin-svgr');
    config.plugins = config.plugins || [];
    config.plugins.push(
      svgr({
        svgrOptions: {
          icon: true,
          svgo: true,
        },
        include: '**/*.svg',
      })
    );

    // Ensure proper module resolution
    if (config.resolve) {
      config.resolve.extensions = [
        ...(config.resolve.extensions || []),
        '.svg',
        '.png',
        '.jpg',
        '.jpeg',
      ];
    }

    // Add module resolution for Next.js compatibility
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'next/dist/client/components/is-next-router-error': path.resolve(
          __dirname,
          '../src/lib/empty-module.js'
        ),
      };
    }

    return config;
  },
};

export default config;
