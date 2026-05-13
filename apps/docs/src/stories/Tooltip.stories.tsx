import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  AlertCircle,
  Copy,
  Info,
  Settings,
  Trash2,
  User,
} from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Token-driven tooltip built on Radix UI \`Tooltip\` primitive. Appears on hover or focus after a configurable delay and dismisses on pointer-leave or Escape.

### When to use
- Clarifying icon-only buttons that have no visible label.
- Surfacing supplemental detail that would clutter the main UI if always shown.
- Do **not** use tooltips to hold essential information — users on touch devices may never see them.

### Usage
\`\`\`tsx
import { Tooltip, TooltipProvider } from 'componentiq';

// Wrap your app (once) with TooltipProvider
<TooltipProvider>
  <App />
</TooltipProvider>

// Then use Tooltip anywhere inside
<Tooltip content="Save changes" side="top">
  <Button size="icon" aria-label="Save"><Save /></Button>
</Tooltip>
\`\`\`

### Composing with primitives
\`\`\`tsx
import { TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider } from 'componentiq';

<TooltipProvider>
  <TooltipRoot delayDuration={0}>
    <TooltipTrigger asChild>
      <button>Hover me</button>
    </TooltipTrigger>
    <TooltipContent side="right" variant="light">
      <p className="font-semibold">Custom content</p>
      <p className="text-xs text-muted-foreground">Any JSX works here.</p>
    </TooltipContent>
  </TooltipRoot>
</TooltipProvider>
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`content\` | ReactNode | **required** | Text or JSX shown inside the tooltip |
| \`side\` | \`"top" \\| "right" \\| "bottom" \\| "left"\` | "right" | Preferred side (flips if out of viewport) |
| \`sideOffset\` | number | 6 | Gap in px between trigger and tooltip |
| \`delayDuration\` | number | 300 | ms before the tooltip opens |
| \`variant\` | \`"dark" \\| "light"\` | "dark" | Dark pill (default) or surface-coloured popover |

### Accessibility
- Tooltip content is announced by screen readers as a description of the trigger.
- Tooltip opens on keyboard focus as well as hover.
- Pressing Escape closes any open tooltip.
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <TooltipProvider>
        <div className='flex flex-wrap gap-6 p-8'>
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  argTypes: {
    content: {
      control: 'text',
      description: 'Text or ReactNode shown inside the tooltip.',
      table: { type: { summary: 'ReactNode' } },
    },
    side: {
      control: { type: 'select' },
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Preferred side relative to the trigger.',
      table: { type: { summary: "'top' | 'right' | 'bottom' | 'left'" }, defaultValue: { summary: "'right'" } },
    },
    sideOffset: {
      control: { type: 'number', min: 0, max: 24 },
      description: 'Gap in px between trigger and tooltip.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '6' } },
    },
    delayDuration: {
      control: { type: 'number', min: 0, max: 1000 },
      description: 'Delay in ms before the tooltip opens.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '300' } },
    },
    variant: {
      control: { type: 'select' },
      options: ['dark', 'light'],
      description: 'Visual style of the tooltip.',
      table: { type: { summary: "'dark' | 'light'" }, defaultValue: { summary: "'dark'" } },
    },
  },
  args: {
    content: 'Tooltip label',
    side: 'top',
    delayDuration: 300,
    variant: 'dark',
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── AllVariants showcase ─────────────────────────────────────────────────────

function VariantShowcase({
  title,
  variants,
}: {
  title: string;
  variants: Array<{ label: string; code: string; node: React.ReactNode }>;
}) {
  const [sel, setSel] = React.useState(0);
  return (
    <div className='w-full space-y-[var(--spacing-md)]'>
      <h2 className='font-[family-name:var(--font-heading)] font-[var(--font-weight-bold)] text-[color:var(--text-title)] text-[length:var(--font-size-heading-6)]'>
        {title}
      </h2>
      <div className='grid grid-cols-2 gap-[var(--spacing-sm)] sm:grid-cols-3'>
        {variants.map((v, i) => (
          <div
            key={v.label}
            onClick={() => setSel(i)}
            className={`flex flex-col items-start gap-[var(--spacing-sm)] rounded-[var(--radius-md)] border p-[var(--spacing-md)] transition-colors cursor-pointer ${
              sel === i
                ? 'bg-[color:var(--bg-hover)] border-[color:var(--color-primary)]'
                : 'bg-[color:var(--bg-surface)] border-[color:var(--border-subtle)] hover:bg-[color:var(--bg-hover)]'
            }`}
          >
            <span className='text-[length:var(--font-size-xs)] text-[color:var(--text-muted)] font-[family-name:var(--font-rubik)]'>
              {v.label}
            </span>
            <div className='flex items-center justify-center w-full py-4' onClick={e => e.stopPropagation()}>
              {v.node}
            </div>
          </div>
        ))}
      </div>
      <div className='rounded-[var(--radius-md)] bg-[color:var(--bg-secondary)] border border-[color:var(--border-subtle)] p-[var(--spacing-md)]'>
        <p className='text-[length:var(--font-size-xs)] text-[color:var(--text-muted)] font-[family-name:var(--font-rubik)] mb-[var(--spacing-sm)]'>
          {variants[sel].label}
        </p>
        <pre className='text-[length:var(--font-size-xs)] text-[color:var(--text-paragraph)] font-mono overflow-x-auto whitespace-pre-wrap'>
          <code>{variants[sel].code}</code>
        </pre>
      </div>
    </div>
  );
}

export const AllVariants: Story = {
  render: () => (
    <TooltipProvider>
      <VariantShowcase
        title='Tooltip'
        variants={[
          {
            label: 'Dark (default)',
            code: `<Tooltip content="Save changes" side="top">
  <Button size="icon" aria-label="Save"><Save /></Button>
</Tooltip>`,
            node: (
              <Tooltip content='Save changes' side='top'>
                <Button size='icon' aria-label='Save'><Copy className='size-4' /></Button>
              </Tooltip>
            ),
          },
          {
            label: 'Light variant',
            code: `<Tooltip content="Account settings" side="top" variant="light">
  <Button size="icon" aria-label="Settings"><Settings /></Button>
</Tooltip>`,
            node: (
              <Tooltip content='Account settings' side='top' variant='light'>
                <Button variant='outlined' size='icon' aria-label='Settings'><Settings className='size-4' /></Button>
              </Tooltip>
            ),
          },
          {
            label: 'Side — top',
            code: `<Tooltip content="Top tooltip" side="top">…</Tooltip>`,
            node: (
              <Tooltip content='Top tooltip' side='top'>
                <Button variant='outlined'>Hover · top</Button>
              </Tooltip>
            ),
          },
          {
            label: 'Side — right',
            code: `<Tooltip content="Right tooltip" side="right">…</Tooltip>`,
            node: (
              <Tooltip content='Right tooltip' side='right'>
                <Button variant='outlined'>Hover · right</Button>
              </Tooltip>
            ),
          },
          {
            label: 'Side — bottom',
            code: `<Tooltip content="Bottom tooltip" side="bottom">…</Tooltip>`,
            node: (
              <Tooltip content='Bottom tooltip' side='bottom'>
                <Button variant='outlined'>Hover · bottom</Button>
              </Tooltip>
            ),
          },
          {
            label: 'Side — left',
            code: `<Tooltip content="Left tooltip" side="left">…</Tooltip>`,
            node: (
              <Tooltip content='Left tooltip' side='left'>
                <Button variant='outlined'>Hover · left</Button>
              </Tooltip>
            ),
          },
          {
            label: 'No delay',
            code: `<Tooltip content="Instant" side="top" delayDuration={0}>…</Tooltip>`,
            node: (
              <Tooltip content='Appears instantly' side='top' delayDuration={0}>
                <Button variant='ghost'><Info className='size-4' /></Button>
              </Tooltip>
            ),
          },
          {
            label: 'Icon-only button',
            code: `<Tooltip content="Delete item" side="top">
  <Button size="icon" variant="destructive" aria-label="Delete">
    <Trash2 />
  </Button>
</Tooltip>`,
            node: (
              <Tooltip content='Delete item' side='top'>
                <Button size='icon' variant='destructive' aria-label='Delete'>
                  <Trash2 className='size-4' />
                </Button>
              </Tooltip>
            ),
          },
          {
            label: 'Rich content',
            code: `<TooltipRoot>
  <TooltipTrigger asChild>
    <button><AlertCircle /></button>
  </TooltipTrigger>
  <TooltipContent side="top" variant="light">
    <p className="font-semibold">Attention needed</p>
    <p className="text-xs opacity-70">Review the flagged items…</p>
  </TooltipContent>
</TooltipRoot>`,
            node: (
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <button className='flex size-9 items-center justify-center rounded-md border border-[color:var(--border-default)] hover:bg-[color:var(--bg-hover)] transition-colors'>
                    <AlertCircle className='size-4 text-[color:var(--helper-warning)]' />
                  </button>
                </TooltipTrigger>
                <TooltipContent side='top' variant='light'>
                  <p className='font-semibold text-[color:var(--text-title)]'>Attention needed</p>
                  <p className='text-xs text-[color:var(--text-muted)] mt-0.5'>Review the flagged items before publishing.</p>
                </TooltipContent>
              </TooltipRoot>
            ),
          },
        ]}
      />
    </TooltipProvider>
  ),
  parameters: { layout: 'padded' },
  decorators: [Story => <div className='w-full max-w-3xl'><Story /></div>],
};

// ─── Individual stories ───────────────────────────────────────────────────────

export const Default: Story = {
  render: args => (
    <TooltipProvider>
      <Tooltip {...args}>
        <Button size='icon' aria-label='User'><User className='size-4' /></Button>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const DarkVariant: Story = {
  args: { content: 'Dark tooltip', side: 'top', variant: 'dark' },
  render: args => (
    <TooltipProvider>
      <Tooltip {...args}>
        <Button variant='outlined'>Hover me</Button>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const LightVariant: Story = {
  args: { content: 'Light tooltip', side: 'top', variant: 'light' },
  render: args => (
    <TooltipProvider>
      <Tooltip {...args}>
        <Button variant='outlined'>Hover me</Button>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const InstantDelay: Story = {
  args: { content: 'No delay', side: 'top', delayDuration: 0 },
  render: args => (
    <TooltipProvider>
      <Tooltip {...args}>
        <Button variant='ghost'><Info className='size-4' /></Button>
      </Tooltip>
    </TooltipProvider>
  ),
  parameters: { docs: { description: { story: 'Set `delayDuration={0}` for tooltips that should appear immediately — useful for icon toolbars.' } } },
};

export const RichContent: Story = {
  render: () => (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <button className='flex size-9 items-center justify-center rounded-md border border-[color:var(--border-default)] hover:bg-[color:var(--bg-hover)] transition-colors'>
            <AlertCircle className='size-4 text-[color:var(--helper-warning)]' />
          </button>
        </TooltipTrigger>
        <TooltipContent side='top' variant='light'>
          <p className='font-semibold text-[color:var(--text-title)] text-sm'>Attention needed</p>
          <p className='text-xs text-[color:var(--text-muted)] mt-0.5'>Review the flagged items before publishing.</p>
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  ),
  parameters: { docs: { description: { story: 'Use the primitive `TooltipRoot / TooltipTrigger / TooltipContent` API for multi-line or structured tooltip content.' } } },
};

export const DestructiveAction: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip content='Permanently delete this item' side='top' delayDuration={0}>
        <Button size='icon' variant='destructive' aria-label='Delete'>
          <Trash2 className='size-4' />
        </Button>
      </Tooltip>
    </TooltipProvider>
  ),
  parameters: { docs: { description: { story: 'Tooltip on a destructive icon button — the label makes the action clear without adding visible text.' } } },
};
