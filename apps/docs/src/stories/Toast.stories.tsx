import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BellRing, Sparkles } from 'lucide-react';
import { Button, Toast, Toaster, toast, type ToastVariant } from 'componentiq';

const variants: ToastVariant[] = [
  'success',
  'info',
  'warning',
  'error',
  'pending',
];

const variantCopy: Record<
  ToastVariant,
  { title: string; description: string }
> = {
  default: {
    title: 'Default toast message',
    description: 'General confirmation appears here.',
  },
  success: {
    title: 'Success toast message',
    description: 'Success toast message appears here.',
  },
  info: {
    title: 'Info toast message',
    description: 'Info toast message appears here.',
  },
  warning: {
    title: 'Warning toast message',
    description: 'Warning toast message appears here.',
  },
  error: {
    title: 'Error toast message',
    description: 'Error toast message appears here.',
  },
  pending: {
    title: 'Pending toast message',
    description: 'Pending toast message appears here.',
  },
};

const meta = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'dynamic',
        language: 'tsx',
      },
      canvas: {
        sourceState: 'shown',
      },
      description: {
        component: `
Token-driven transient toast for non-blocking feedback. Built with Sonner and styled with ComponentIQ CSS variables, including a horizontal pastel/50-to-surface gradient, severity icons, optional action, and a top-right close button.

### When to use
- Confirming that an action completed, failed, or needs attention.
- Communicating progress for a short async task.
- Providing a reversible or follow-up action after user input.
- Use **Alert** for persistent page-level feedback that should stay in the layout.

### Usage
\`\`\`tsx
import { Toaster, toast } from 'componentiq';
import { BellRing } from 'lucide-react';

<Toaster />

toast({
  variant: 'success',
  title: 'Changes saved',
  description: 'Your design tokens were published.',
});

toast({
  variant: 'warning',
  title: 'Review required',
  description: 'Two components need manual approval.',
  action: {
    label: 'Review',
    onClick: () => openReviewPanel(),
  },
});

toast({
  title: 'Brand notification',
  description: 'Custom icon and shared token colors.',
  icon: <BellRing />,
  colors: {
    accent: 'var(--color-secondary)',
    background: 'var(--secondary-50)',
  },
});
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`variant\` | \`"default" \\| "info" \\| "success" \\| "warning" \\| "error" \\| "pending"\` | "info" | Controls colour tokens and default icon |
| \`title\` | ReactNode | — | Bold heading rendered above the description |
| \`description\` | ReactNode | — | Supporting copy for the announcement |
| \`icon\` | ReactNode | Auto per variant | Override the default icon |
| \`colors\` | \`{ accent?, background?, border?, iconBackground? }\` | — | Shared custom token/CSS color values |
| \`action\` | \`{ label, onClick }\` | — | Optional action button rendered inside the toast |
| \`duration\` | number | Sonner default | Passed through to Sonner |

### Accessibility
- Sonner owns announcements through the persistent \`Toaster\` live-region container.
- The toast body does not render its own \`role\`, \`aria-live\`, or \`aria-atomic\` attributes, which avoids duplicate screen-reader announcements.
- Icons are decorative and hidden from assistive tech; message text must carry the meaning.
- The close button has an accessible name and is positioned in the top-right corner.
- Action buttons use visible labels and receive normal keyboard focus.
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className='min-h-[420px] w-[min(560px,calc(100vw-32px))]'>
        <Story />
        <Toaster />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'info', 'success', 'warning', 'error', 'pending'],
      description: 'Severity level — controls colour tokens and default icon.',
      table: {
        type: {
          summary:
            "'default' | 'info' | 'success' | 'warning' | 'error' | 'pending'",
        },
        defaultValue: { summary: "'info'" },
      },
    },
    title: {
      control: 'text',
      description: 'Bold heading rendered above the description.',
      table: { type: { summary: 'ReactNode' } },
    },
    description: {
      control: 'text',
      description: 'Supporting copy for the announcement.',
      table: { type: { summary: 'ReactNode' } },
    },
    icon: {
      control: false,
      description: 'Override the default variant icon with any React node.',
      table: { type: { summary: 'ReactNode' } },
    },
    colors: {
      control: false,
      description:
        'Override accent, background, border, or icon background with shared token values.',
      table: {
        type: {
          summary: '{ accent?: string; background?: string; border?: string }',
        },
      },
    },
    action: {
      control: false,
      description: 'Optional action button displayed below the description.',
      table: { type: { summary: '{ label: ReactNode; onClick: function }' } },
    },
    onDismiss: {
      control: false,
      description:
        'Displays the top-right close button and handles dismissal in custom render usage.',
      table: { type: { summary: '() => void' } },
    },
  },
  args: {
    variant: 'info',
    title: 'Toast title',
    description: 'This is the body of the toast with supporting detail.',
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

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
      <h2 className='text-[length:var(--font-size-heading-6)] font-[var(--font-weight-bold)] text-[color:var(--text-title)] [font-family:var(--font-heading)]'>
        {title}
      </h2>
      <div className='grid grid-cols-1 gap-[var(--spacing-sm)] sm:grid-cols-2'>
        {variants.map((v, i) => (
          <div
            key={v.label}
            className={`flex flex-col gap-[var(--spacing-sm)] rounded-[var(--radius-md)] border p-[var(--spacing-md)] text-left transition-colors ${
              sel === i
                ? 'border-[color:var(--color-primary)] bg-[color:var(--bg-hover)]'
                : 'border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] hover:bg-[color:var(--bg-hover)]'
            }`}
          >
            <div className='flex w-full items-center justify-between gap-[var(--spacing-sm)]'>
              <span className='text-[length:var(--font-size-xs)] text-[color:var(--text-muted)] [font-family:var(--font-rubik)]'>
                {v.label}
              </span>
              <button
                type='button'
                aria-pressed={sel === i}
                onClick={() => setSel(i)}
                className={`shrink-0 rounded-[var(--radius-sm)] border px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] ${
                  sel === i
                    ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-[color:var(--color-primary-fg)]'
                    : 'border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-hover)]'
                }`}
              >
                {sel === i ? 'Showing code' : 'Show code'}
              </button>
            </div>
            <div className='block'>{v.node}</div>
          </div>
        ))}
      </div>
      <div className='rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[color:var(--bg-secondary)] p-[var(--spacing-md)]'>
        <p className='mb-[var(--spacing-sm)] text-[length:var(--font-size-xs)] text-[color:var(--text-muted)] [font-family:var(--font-rubik)]'>
          {variants[sel].label}
        </p>
        <pre className='overflow-x-auto whitespace-pre-wrap font-mono text-[length:var(--font-size-xs)] text-[color:var(--text-paragraph)]'>
          <code>{variants[sel].code}</code>
        </pre>
      </div>
    </div>
  );
}

export const AllVariants: Story = {
  render: () => (
    <VariantShowcase
      title='Toast'
      variants={[
        ...variants.map(variant => ({
          label: variant[0].toUpperCase() + variant.slice(1),
          code: `toast({
  variant: '${variant}',
  title: '${variantCopy[variant].title}',
  description: '${variantCopy[variant].description}',
});`,
          node: (
            <Toast
              variant={variant}
              title={variantCopy[variant].title}
              description={variantCopy[variant].description}
              onDismiss={() => undefined}
            />
          ),
        })),
        {
          label: 'Custom colors and icon',
          code: `toast({
  title: 'Brand toast message',
  description: 'Pass an icon and shared color values.',
  icon: <Sparkles />,
  colors: {
    accent: 'var(--color-secondary)',
    background: 'var(--secondary-50)',
    border: 'color-mix(in oklab, var(--color-secondary) 22%, transparent)',
  },
});`,
          node: (
            <Toast
              variant='default'
              title='Brand toast message'
              description='Pass an icon and shared color values.'
              icon={<Sparkles className='size-4' aria-hidden='true' />}
              colors={{
                accent: 'var(--color-secondary)',
                background: 'var(--secondary-50)',
                border:
                  'color-mix(in oklab, var(--color-secondary) 22%, transparent)',
              }}
              onDismiss={() => undefined}
            />
          ),
        },
      ]}
    />
  ),
  decorators: [
    Story => (
      <div className='w-full max-w-4xl'>
        <Story />
      </div>
    ),
  ],
};

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Info toast message',
    description: 'Info toast message appears here.',
    onDismiss: () => undefined,
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success toast message',
    description: 'Success toast message appears here.',
    onDismiss: () => undefined,
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning toast message',
    description: 'Warning toast message appears here.',
    onDismiss: () => undefined,
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error toast message',
    description: 'Error toast message appears here.',
    onDismiss: () => undefined,
  },
};

export const Pending: Story = {
  args: {
    variant: 'pending',
    title: 'Pending toast message',
    description: 'Pending toast message appears here.',
    onDismiss: () => undefined,
  },
};

export const ImperativeTrigger: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      {variants.map(variant => (
        <Button
          key={variant}
          type='button'
          variant={variant === 'error' ? 'destructive' : 'outlined'}
          onClick={() =>
            toast({
              variant,
              title: variantCopy[variant].title,
              description:
                'This toast is created through the reusable Sonner API.',
            })
          }
        >
          Show {variant}
        </Button>
      ))}
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Button
      type='button'
      variant='contained'
      onClick={() =>
        toast({
          variant: 'success',
          title: 'Invite sent',
          description: 'Winnie can now review the component library.',
          action: {
            label: 'View',
            onClick: () => {
              toast({
                variant: 'info',
                title: 'Opening invite',
                description: 'Action callbacks can run any app behavior.',
              });
            },
          },
        })
      }
    >
      Show action toast
    </Button>
  ),
};

export const CustomColorsAndIcon: Story = {
  render: () => (
    <div className='grid max-w-[420px] gap-4'>
      <Toast
        variant='default'
        title='Brand toast message'
        description='Pass an icon and shared color values for a product-specific tone.'
        icon={<Sparkles className='size-4' aria-hidden='true' />}
        colors={{
          accent: 'var(--color-secondary)',
          background: 'var(--secondary-50)',
          border:
            'color-mix(in oklab, var(--color-secondary) 22%, transparent)',
        }}
        onDismiss={() => undefined}
      />
      <Button
        type='button'
        variant='outlined'
        onClick={() =>
          toast({
            title: 'Custom notification',
            description:
              'The horizontal pastel/50 gradient still comes from tokens.',
            icon: <BellRing className='size-4' aria-hidden='true' />,
            colors: {
              accent: 'var(--color-secondary)',
              background: 'var(--secondary-50)',
              border:
                'color-mix(in oklab, var(--color-secondary) 22%, transparent)',
            },
          })
        }
      >
        Show custom toast
      </Button>
    </div>
  ),
};
