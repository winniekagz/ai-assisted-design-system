import * as React from 'react';
import { Alert } from '@/components/ui/alert';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Token-driven inline alert for persistent contextual feedback. Uses pastel background + accent border from the helper token set so severity is communicated through both colour and icon.

### When to use
- Displaying a persistent message that is relevant to the current page or action.
- Communicating the outcome of a system event (success, failure, warning, info).
- Use **Toast** for transient, non-blocking feedback after user actions.
- Do **not** use Alert inside a modal to stack feedback — place it above the form instead.

### Usage
\`\`\`tsx
import { Alert } from 'componentiq';

<Alert variant="info" title="Your session expires soon">
  Save your work to avoid losing changes.
</Alert>

<Alert variant="success" title="Changes saved">
  Your settings have been updated successfully.
</Alert>

<Alert variant="error" title="Upload failed">
  The file exceeded the 10 MB limit. Choose a smaller file and try again.
</Alert>
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`variant\` | \`"info" \\| "success" \\| "warning" \\| "error" \\| "neutral"\` | "info" | Controls colour tokens and default icon |
| \`title\` | ReactNode | — | Bold heading rendered above the body |
| \`icon\` | \`React.ElementType\` | Auto per variant | Override the default icon |
| \`children\` | ReactNode | — | Body copy rendered below the title |

### Accessibility
- Renders with \`role="status"\` for passive announcements.
- Use \`role="alert"\` (via className override) only for urgent, time-sensitive messages.
- Icon is \`aria-hidden\`; meaning must not be conveyed by colour alone.
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className='w-[min(560px,calc(100vw-32px))]'>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'error', 'neutral'],
      description: 'Severity level — controls colour tokens and default icon.',
      table: { type: { summary: "'info' | 'success' | 'warning' | 'error' | 'neutral'" }, defaultValue: { summary: "'info'" } },
    },
    title: {
      control: 'text',
      description: 'Bold heading rendered above the body copy.',
      table: { type: { summary: 'ReactNode' } },
    },
    icon: {
      control: false,
      description: 'Override the default variant icon with any React component.',
      table: { type: { summary: 'React.ElementType' } },
    },
    children: {
      control: 'text',
      description: 'Body text rendered below the title.',
      table: { type: { summary: 'ReactNode' } },
    },
  },
  args: {
    title: 'Alert title',
    children: 'This is the body of the alert with supporting detail.',
  },
} satisfies Meta<typeof Alert>;

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
      <h2 className='font-[family-name:var(--font-heading)] font-[var(--font-weight-bold)] text-[color:var(--text-title)] text-[length:var(--font-size-heading-6)]'>
        {title}
      </h2>
      <div className='grid grid-cols-1 gap-[var(--spacing-sm)] sm:grid-cols-2'>
        {variants.map((v, i) => (
          <div
            key={v.label}
            onClick={() => setSel(i)}
            className={`flex flex-col gap-[var(--spacing-sm)] rounded-[var(--radius-md)] border p-[var(--spacing-md)] transition-colors cursor-pointer ${
              sel === i
                ? 'bg-[color:var(--bg-hover)] border-[color:var(--color-primary)]'
                : 'bg-[color:var(--bg-surface)] border-[color:var(--border-subtle)] hover:bg-[color:var(--bg-hover)]'
            }`}
          >
            <span className='text-[length:var(--font-size-xs)] text-[color:var(--text-muted)] font-[family-name:var(--font-rubik)]'>
              {v.label}
            </span>
            <div onClick={e => e.stopPropagation()}>{v.node}</div>
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
    <VariantShowcase
      title='Alert'
      variants={[
        {
          label: 'Info',
          code: `<Alert variant="info" title="New update available">
  Refresh the page to load the latest version.
</Alert>`,
          node: (
            <Alert variant='info' title='New update available'>
              Refresh the page to load the latest version.
            </Alert>
          ),
        },
        {
          label: 'Success',
          code: `<Alert variant="success" title="Changes saved">
  Your settings have been updated successfully.
</Alert>`,
          node: (
            <Alert variant='success' title='Changes saved'>
              Your settings have been updated successfully.
            </Alert>
          ),
        },
        {
          label: 'Warning',
          code: `<Alert variant="warning" title="Human review required">
  Some recommendations need approval before applying changes.
</Alert>`,
          node: (
            <Alert variant='warning' title='Human review required'>
              Some recommendations need approval before applying changes.
            </Alert>
          ),
        },
        {
          label: 'Error',
          code: `<Alert variant="error" title="Upload failed">
  The file exceeded the 10 MB limit. Choose a smaller file.
</Alert>`,
          node: (
            <Alert variant='error' title='Upload failed'>
              The file exceeded the 10 MB limit. Choose a smaller file.
            </Alert>
          ),
        },
        {
          label: 'Neutral',
          code: `<Alert variant="neutral" title="Maintenance window">
  Scheduled downtime on Sunday 02:00–04:00 UTC.
</Alert>`,
          node: (
            <Alert variant='neutral' title='Maintenance window'>
              Scheduled downtime on Sunday 02:00–04:00 UTC.
            </Alert>
          ),
        },
        {
          label: 'Title only',
          code: `<Alert variant="success" title="Token usage is within limits." />`,
          node: <Alert variant='success' title='Token usage is within limits.' />,
        },
        {
          label: 'Body only',
          code: `<Alert variant="info">
  Your session will expire in 5 minutes. Save your work.
</Alert>`,
          node: (
            <Alert variant='info'>
              Your session will expire in 5 minutes. Save your work.
            </Alert>
          ),
        },
        {
          label: 'Long body',
          code: `<Alert variant="warning" title="Breaking changes detected">
  Two components use deprecated token names. Update --color-brand to
  --color-primary and --bg-paper to --bg-surface before the next release.
</Alert>`,
          node: (
            <Alert variant='warning' title='Breaking changes detected'>
              Two components use deprecated token names. Update --color-brand to
              --color-primary and --bg-paper to --bg-surface before the next release.
            </Alert>
          ),
        },
      ]}
    />
  ),
  parameters: { layout: 'padded' },
  decorators: [Story => <div className='w-full max-w-3xl'><Story /></div>],
};

export const Info: Story = {
  args: { variant: 'info', title: 'New update available', children: 'Refresh the page to load the latest version.' },
};

export const Success: Story = {
  args: { variant: 'success', title: 'Changes saved', children: 'Your settings have been updated successfully.' },
};

export const Warning: Story = {
  args: { variant: 'warning', title: 'Human review required', children: 'Some recommendations need approval before applying changes.' },
};

export const Error: Story = {
  args: { variant: 'error', title: 'Upload failed', children: 'The file exceeded the 10 MB limit. Choose a smaller file.' },
};

export const Neutral: Story = {
  args: { variant: 'neutral', title: 'Maintenance window', children: 'Scheduled downtime on Sunday 02:00–04:00 UTC.' },
};

export const TitleOnly: Story = {
  args: { variant: 'success', title: 'Token usage is within limits.' },
  parameters: { docs: { description: { story: 'Omit `children` when a short title communicates the full message.' } } },
};
