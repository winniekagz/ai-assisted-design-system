import path from 'path';
import { fileURLToPath } from 'url';
import type { StorybookConfig } from '@storybook/nextjs-vite';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

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
  viteFinal: async (config) => {
    const docsRoot = path.resolve(dirname, '..');
    const dsRoot = path.resolve(dirname, '../../../packages/design-system/src');
    const aiRoot = path.resolve(dirname, '../../../packages/ai/src');

    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'componentiq': path.join(dsRoot, 'index.ts'),
      '@winniekagendo/componentiq-ai': path.join(aiRoot, 'index.ts'),
      // Cross-package @/ aliases so stories can keep their existing imports
      '@/components': path.join(dsRoot, 'components'),
      '@/lib': path.join(dsRoot, 'lib'),
      '@/hooks': path.join(dsRoot, 'hooks'),
      '@/types': path.join(dsRoot, 'types'),
      '@/theme': path.join(dsRoot, 'theme'),
      '@/ai': path.join(aiRoot, 'ai'),
      '@': path.join(docsRoot, 'src'),
    };
    return config;
  },
};

export default config;
