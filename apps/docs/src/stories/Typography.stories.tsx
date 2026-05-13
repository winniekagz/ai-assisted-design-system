import * as React from 'react';
import { Typography } from '@/components/ui/typography';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Token-driven text component with semantic heading, body, display, and code variants. All sizes, weights, and colours resolve from design tokens so they automatically reflect the active theme.

### When to use
- Use Typography variants instead of raw Tailwind \`text-*\` utilities — it keeps all text on the type scale.
- Use the \`as\` prop when the semantic HTML element must differ from the visual size (e.g. visual \`h3\` rendered as \`<p>\`).
- Use \`textColor\` for semantic colour intent (success, error, muted) rather than arbitrary colour classes.

### Usage
\`\`\`tsx
import { Typography } from '@winniekagz/componentiq';

<Typography variant="h1">Page title</Typography>
<Typography variant="body1">
  This is body text with good readability for paragraphs.
</Typography>
<Typography variant="caption" textColor="muted">Last updated 3 days ago</Typography>

// Semantic override — looks like h3 but renders as <p>
<Typography variant="h3" as="p">Section intro</Typography>

// Code snippet
<Typography variant="code">const x = 42;</Typography>
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`variant\` | see below | "body1" | Controls size, weight, line-height, and font family |
| \`textColor\` | \`"default" \\| "primary" \\| "secondary" \\| "muted" \\| "destructive" \\| "success" \\| "warning" \\| "info"\` | "default" | Semantic colour override |
| \`weight\` | \`"normal" \\| "medium" \\| "semibold" \\| "bold"\` | "normal" | Explicit weight override (overrides the variant default) |
| \`align\` | \`"left" \\| "center" \\| "right" \\| "justify"\` | "left" | Text alignment |
| \`truncate\` | boolean | false | Single-line truncate with ellipsis |
| \`as\` | HTML tag or component | Variant default | Override the rendered element |

### Variants
\`h1\`–\`h6\` · \`display1\`–\`display3\` · \`body1\` · \`body2\` · \`caption\` · \`small\` · \`link\` · \`code\` · \`pre\`
      `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className='w-[min(640px,calc(100vw-32px))] rounded-[var(--radius-md)] bg-[color:var(--bg-surface)] p-[var(--spacing-md)]'>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['h1','h2','h3','h4','h5','h6','body1','body2','caption','small','link','display1','display2','display3','code','pre'],
      description: 'Typography scale variant.',
      table: { type: { summary: 'TypographyVariant' }, defaultValue: { summary: "'body1'" } },
    },
    textColor: {
      control: { type: 'select' },
      options: ['default','primary','secondary','muted','destructive','success','warning','info'],
      description: 'Semantic colour token override.',
      table: { type: { summary: 'TypographyColor' }, defaultValue: { summary: "'default'" } },
    },
    weight: {
      control: { type: 'select' },
      options: ['normal','medium','semibold','bold'],
      description: 'Font weight override (overrides the variant default weight).',
      table: { type: { summary: "'normal' | 'medium' | 'semibold' | 'bold'" }, defaultValue: { summary: "'normal'" } },
    },
    align: {
      control: { type: 'select' },
      options: ['left','center','right','justify'],
      description: 'Text alignment.',
      table: { type: { summary: "'left' | 'center' | 'right' | 'justify'" }, defaultValue: { summary: "'left'" } },
    },
    truncate: {
      control: 'boolean',
      description: 'Clip overflow text with an ellipsis on a single line.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    as: {
      control: { type: 'select' },
      options: ['h1','h2','h3','h4','h5','h6','p','span','div','code','pre','label','a'],
      description: 'Override the rendered HTML element while keeping variant styles.',
      table: { type: { summary: 'ElementType' } },
    },
    children: {
      control: 'text',
      description: 'Text content.',
      table: { type: { summary: 'ReactNode' } },
    },
  },
  args: {
    children: 'Typography example',
    variant: 'body1',
    textColor: 'default',
    weight: 'normal',
    align: 'left',
    truncate: false,
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

const surface = 'rounded-[var(--radius-md)] bg-[color:var(--bg-surface)] p-[var(--spacing-md)]';

export const AllVariants: Story = {
  render: () => (
    <div className={`${surface} space-y-[var(--spacing-lg)] max-w-3xl`}>
      {/* Display */}
      <section className='space-y-[var(--spacing-sm)]'>
        <Typography variant='h6' textColor='muted'>Display</Typography>
        <Typography variant='display3'>Display 3</Typography>
        <Typography variant='display2'>Display 2</Typography>
        <Typography variant='display1'>Display 1</Typography>
      </section>

      {/* Headings */}
      <section className='space-y-[var(--spacing-sm)]'>
        <Typography variant='h6' textColor='muted'>Headings</Typography>
        <Typography variant='h1'>Heading 1</Typography>
        <Typography variant='h2'>Heading 2</Typography>
        <Typography variant='h3'>Heading 3</Typography>
        <Typography variant='h4'>Heading 4</Typography>
        <Typography variant='h5'>Heading 5</Typography>
        <Typography variant='h6'>Heading 6</Typography>
      </section>

      {/* Body */}
      <section className='space-y-[var(--spacing-sm)]'>
        <Typography variant='h6' textColor='muted'>Body</Typography>
        <Typography variant='body1'>
          Body 1 — Primary body text for paragraphs, descriptions, and general content. Good line-height for comfortable reading.
        </Typography>
        <Typography variant='body2'>
          Body 2 — Secondary body text, slightly smaller. Use for supporting copy or less prominent content.
        </Typography>
        <Typography variant='caption'>Caption — field labels, metadata, and helper text.</Typography>
        <Typography variant='small'>Small — fine print and secondary annotations.</Typography>
        <Typography variant='link'>Link — styled as a clickable hyperlink with hover underline.</Typography>
      </section>

      {/* Code */}
      <section className='space-y-[var(--spacing-sm)]'>
        <Typography variant='h6' textColor='muted'>Code</Typography>
        <div><Typography variant='code'>const x = 42;</Typography></div>
        <Typography variant='pre'>{`function greet(name: string) {\n  return \`Hello, \${name}!\`;\n}`}</Typography>
      </section>
    </div>
  ),
  parameters: { layout: 'padded' },
  decorators: [Story => <div className='w-full max-w-4xl'><Story /></div>],
};

export const ColourPalette: Story = {
  render: () => (
    <div className={`${surface} space-y-[var(--spacing-sm)] max-w-xl`}>
      <Typography variant='h5'>Text colour tokens</Typography>
      {(
        ['default','primary','secondary','muted','destructive','success','warning','info'] as const
      ).map(c => (
        <Typography key={c} variant='body1' textColor={c}>
          {c.charAt(0).toUpperCase() + c.slice(1)} — textColor="{c}"
        </Typography>
      ))}
    </div>
  ),
  parameters: { layout: 'padded' },
};

export const WeightScale: Story = {
  render: () => (
    <div className={`${surface} space-y-[var(--spacing-sm)] max-w-xl`}>
      <Typography variant='h5'>Weight scale</Typography>
      {(['normal','medium','semibold','bold'] as const).map(w => (
        <Typography key={w} variant='body1' weight={w}>
          {w.charAt(0).toUpperCase() + w.slice(1)} ({
            w === 'normal' ? '400' : w === 'medium' ? '500' : w === 'semibold' ? '600' : '700'
          })
        </Typography>
      ))}
    </div>
  ),
};

export const Heading1: Story = { args: { variant: 'h1', children: 'Heading 1 — Page Title' } };
export const Heading2: Story = { args: { variant: 'h2', children: 'Heading 2 — Section Title' } };
export const Heading3: Story = { args: { variant: 'h3', children: 'Heading 3 — Subsection' } };
export const Body1: Story = {
  args: {
    variant: 'body1',
    children: 'Body 1 — Primary body text used for paragraphs and general content with comfortable line-height.',
  },
};
export const Body2: Story = {
  args: {
    variant: 'body2',
    children: 'Body 2 — Secondary body text, slightly smaller. Perfect for supporting copy.',
  },
};
export const Caption: Story = { args: { variant: 'caption', children: 'Caption — field labels and helper text' } };
export const Link: Story = { args: { variant: 'link', children: 'Link — hover to see underline' } };
export const CodeVariant: Story = { args: { variant: 'code', children: 'const name = "ComponentIQ";' } };
export const Truncated: Story = {
  args: {
    variant: 'body1',
    truncate: true,
    children: 'This text is truncated with an ellipsis when it exceeds the container width — great for single-line data cells.',
  },
};
export const SemanticOverride: Story = {
  args: { variant: 'h3', as: 'p', children: 'Looks like h3 — rendered as <p>' },
  parameters: { docs: { description: { story: 'Use `as` when the semantic HTML must differ from the visual size.' } } },
};
