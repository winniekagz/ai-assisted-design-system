import type { Preview } from '@storybook/nextjs-vite';
import React from 'react';
import '../src/styles/globals.css';
import {
  ComponentIqProvider,
  componentIqThemes,
} from 'componentiq';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'ComponentIQ token theme',
      defaultValue: 'default',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default' },
          { value: 'ocean', title: 'Ocean' },
          { value: 'editorial', title: 'Editorial' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },

    // Add design tokens documentation
    docs: {
      source: {
        type: 'dynamic',
        language: 'tsx',
      },
      canvas: {
        sourceState: 'shown',
      },
      description: {
        component:
          'All components use our design token system for consistent styling.',
      },
    },

    // Add viewport options for responsive testing
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
      },
    },
  },

  // Global decorators
  decorators: [
    (Story, context) => {
      const themeName = context.globals.theme as
        | keyof typeof componentIqThemes
        | undefined;
      const tokens = componentIqThemes[themeName ?? 'default'];

      return (
        <ComponentIqProvider
          tokens={tokens}
          className='min-h-screen bg-background text-foreground'
        >
          <Story />
        </ComponentIqProvider>
      );
    },
  ],
};

export default preview;
