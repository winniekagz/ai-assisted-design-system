import { Container } from '@/components/ui/container';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Container',
  component: Container,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Token-driven layout wrapper with configurable background, spacing, radius, border, and shadow. Use it when you need consistent token-based surface styling without writing one-off Tailwind utilities.

### When to use
- Wrapping a group of related content that needs a distinct background or elevation.
- Building card-like surfaces that aren't full **Card** components (no header/content structure).
- Use **Card** instead when the content has a title/body structure — Container is the lower-level primitive.

### Usage
\`\`\`tsx
import { Container } from 'componentiq';

// Surface card
<Container variant="surface" padding="md" radius="lg" bordered>
  <p>Content here</p>
</Container>

// Full-width section with shadow
<Container width="full" variant="secondary" padding="lg" shadowed>
  <Stats />
</Container>

// Brand highlight panel
<Container variant="primary" padding="lg" radius="md">
  <h2>Call to action</h2>
</Container>
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`variant\` | \`"surface" \\| "transparent" \\| "secondary" \\| "primary"\` | "surface" | Background colour token |
| \`width\` | \`"full" \\| "fit"\` | "fit" | Stretch to parent or shrink to content |
| \`padding\` | \`SpacingToken\` | "xs" | Inner spacing from the token scale |
| \`gap\` | \`SpacingToken\` | "md" | Gap between direct children |
| \`radius\` | \`RadiusToken\` | "md" | Corner rounding from the token scale |
| \`bordered\` | boolean | false | Show a 1 px \`border-default\` border |
| \`shadowed\` | boolean | false | Apply \`shadow-md\` elevation |
      `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: { type: 'select' },
      options: ['full', 'fit'],
      description: 'Stretch to fill the parent (`full`) or shrink to content (`fit`).',
      table: { type: { summary: "'full' | 'fit'" }, defaultValue: { summary: "'fit'" } },
    },
    variant: {
      control: { type: 'select' },
      options: ['surface', 'transparent', 'secondary', 'primary', 'white', 'gray', 'brand'],
      description: 'Background colour token.',
      table: { type: { summary: "'surface' | 'transparent' | 'secondary' | 'primary'" }, defaultValue: { summary: "'surface'" } },
    },
    gap: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Gap between direct child elements (accepts token name or legacy px value).',
      table: { type: { summary: 'SpacingToken | number' }, defaultValue: { summary: "'md'" } },
    },
    padding: {
      control: { type: 'number', min: 0, max: 50 },
      description: 'Inner padding (accepts token name or legacy px value).',
      table: { type: { summary: 'SpacingToken | number' }, defaultValue: { summary: "'xs'" } },
    },
    radius: {
      control: { type: 'number', min: 0, max: 50 },
      description: 'Corner radius (accepts token name or legacy px value).',
      table: { type: { summary: 'RadiusToken | number' }, defaultValue: { summary: "'md'" } },
    },
    bordered: {
      control: 'boolean',
      description: 'Show a 1 px border using the `border-default` token.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    shadowed: {
      control: 'boolean',
      description: 'Apply `shadow-md` elevation.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    children: {
      control: 'text',
      description: 'Container children.',
      table: { type: { summary: 'ReactNode' } },
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
