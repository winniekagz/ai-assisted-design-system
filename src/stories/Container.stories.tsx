import { Container } from '@/components/ui/container';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Container',
  component: Container,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A highly reusable container component with customizable styling and layout options. Features include flexible width, customizable styling, pixel-perfect control, and full TypeScript support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: { type: 'select' },
      options: ['full', 'fit'],
      description: 'The width variant of the container',
    },
    variant: {
      control: { type: 'select' },
      options: ['white', 'transparent', 'gray', 'primary', 'secondary'],
      description: 'The background color variant',
    },
    gap: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'The gap between child elements in pixels',
    },
    padding: {
      control: { type: 'number', min: 0, max: 50 },
      description: 'The padding in pixels',
    },
    radius: {
      control: { type: 'number', min: 0, max: 50 },
      description: 'The border radius in pixels',
    },
    bordered: {
      control: { type: 'boolean' },
      description: 'Whether to show a border',
    },
    shadowed: {
      control: { type: 'boolean' },
      description: 'Whether to show a shadow',
    },
    children: {
      control: 'text',
      description: 'Container content',
    },
  },
  args: {
    children: (
      <>
        <div
          style={{ padding: '8px', background: '#f0f0f0', borderRadius: '4px' }}
        >
          Content Item 1
        </div>
        <div
          style={{ padding: '8px', background: '#f0f0f0', borderRadius: '4px' }}
        >
          Content Item 2
        </div>
        <div
          style={{ padding: '8px', background: '#f0f0f0', borderRadius: '4px' }}
        >
          Content Item 3
        </div>
      </>
    ),
    width: 'fit',
    variant: 'white',
    gap: 16,
    padding: 2,
    radius: 10,
    bordered: false,
    shadowed: false,
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Usage
export const Default: Story = {
  args: {
    width: 'fit',
    variant: 'white',
    gap: 16,
    padding: 2,
    radius: 10,
  },
};

// Full Width
export const FullWidth: Story = {
  args: {
    width: 'full',
    variant: 'white',
    gap: 16,
    padding: 8,
    radius: 10,
  },
};

// Different Variants
export const WhiteBackground: Story = {
  args: {
    variant: 'white',
    bordered: true,
    shadowed: true,
    padding: 16,
  },
};

export const TransparentBackground: Story = {
  args: {
    variant: 'transparent',
    bordered: true,
    padding: 16,
  },
};

export const GrayBackground: Story = {
  args: {
    variant: 'gray',
    bordered: true,
    padding: 16,
  },
};

export const PrimaryBackground: Story = {
  args: {
    variant: 'primary',
    padding: 16,
  },
};

export const SecondaryBackground: Story = {
  args: {
    variant: 'secondary',
    padding: 16,
  },
};

// Custom Spacing
export const LargeGap: Story = {
  args: {
    gap: 32,
    padding: 16,
    radius: 16,
  },
};

export const SmallGap: Story = {
  args: {
    gap: 8,
    padding: 4,
    radius: 8,
  },
};

// With Border and Shadow
export const WithBorderAndShadow: Story = {
  args: {
    bordered: true,
    shadowed: true,
    padding: 16,
    radius: 12,
  },
};

// Custom Styling
export const CustomStyling: Story = {
  args: {
    width: 'full',
    variant: 'gray',
    gap: 24,
    padding: 20,
    radius: 20,
    bordered: true,
    shadowed: true,
    className: 'hover:scale-105 transition-transform',
  },
};

// Minimal Styling
export const Minimal: Story = {
  args: {
    width: 'fit',
    variant: 'transparent',
    gap: 8,
    padding: 0,
    radius: 0,
    bordered: false,
    shadowed: false,
  },
};

// Nested Containers
export const NestedContainers: Story = {
  args: {
    width: 'full',
    gap: 16,
    padding: 16,
    children: (
      <>
        <Container width='fit' variant='gray' gap={8} padding={8} radius={8}>
          <div style={{ padding: '4px' }}>Nested Container 1</div>
        </Container>
        <Container width='fit' variant='primary' gap={8} padding={8} radius={8}>
          <div style={{ padding: '4px' }}>Nested Container 2</div>
        </Container>
        <Container
          width='fit'
          variant='secondary'
          gap={8}
          padding={8}
          radius={8}
        >
          <div style={{ padding: '4px' }}>Nested Container 3</div>
        </Container>
      </>
    ),
  },
};

// Interactive Example
export const Interactive: Story = {
  args: {
    width: 'full',
    variant: 'white',
    gap: 16,
    padding: 16,
    radius: 12,
    bordered: true,
    shadowed: true,
    className: 'hover:shadow-lg transition-shadow cursor-pointer',
    children: (
      <>
        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
          Interactive Container
        </div>
        <div style={{ color: '#666' }}>
          Hover over this container to see the shadow effect
        </div>
        <div
          style={{ padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}
        >
          Click me!
        </div>
      </>
    ),
  },
};
