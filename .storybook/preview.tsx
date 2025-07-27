import type { Preview } from '@storybook/nextjs-vite';
import React from 'react';
import '../src/styles/globals.css';

const preview: Preview = {
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
    Story => (
      <div className='min-h-screen bg-background text-foreground'>
        <Story />
      </div>
    ),
  ],
};

export default preview;
