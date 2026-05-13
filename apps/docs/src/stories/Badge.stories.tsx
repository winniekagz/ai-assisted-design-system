import * as React from 'react';
import { Badge } from '@/components/ui/badge/badge';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AlertCircle, CheckCircle, Clock, FileText, Info, Link2, MinusCircle, Shield, ShieldAlert, ShieldCheck, Star, Tag, XCircle } from 'lucide-react';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Token-driven badge for compact status, category, and metadata indicators. Colours map from the helper token set so they stay consistent across themes.

### When to use
- Showing the state of a record (stable, beta, needs_review, active…).
- Labelling items in a list or table with a short categorical tag.
- Use **Alert** for multi-line inline feedback — Badge is for single-word or short-phrase labels only.
- Do not use Badge as a primary action or navigation element.

### Usage
\`\`\`tsx
import { Badge } from 'componentiq';

// Status-driven (label auto-derived from status)
<Badge variant="pastel" status="active" />
<Badge variant="outlined" status="stable" />

// Custom label
<Badge variant="filled" status="success">Approved</Badge>

// With icon
<Badge variant="pastel" status="pending" icon={Clock} />
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`variant\` | \`"filled" \\| "outlined" \\| "pastel"\` | "pastel" | Visual treatment |
| \`status\` | string | — | Maps to a colour set; also sets the label if \`children\` is omitted |
| \`size\` | \`"sm" \\| "md" \\| "lg" \\| "xl"\` | "md" | Badge height and font size |
| \`icon\` | \`React.ElementType\` | — | Icon component rendered at \`iconPosition\` |
| \`iconPosition\` | \`"start" \\| "end"\` | "start" | Which side the icon appears on |
| \`children\` | ReactNode | — | Override the auto-derived status label |
| \`statusConfig\` | \`BadgeStatusConfig\` | — | Custom colour map keyed by status string |

### Checked accent colour
Status colours resolve from helper tokens (\`--helper-success\`, \`--helper-error\`, etc.). Pass \`statusConfig\` to override individual statuses with custom Tailwind classes.
      `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outlined', 'pastel'],
      description: 'Visual treatment of the badge.',
      table: { type: { summary: "'filled' | 'outlined' | 'pastel'" }, defaultValue: { summary: "'pastel'" } },
    },
    status: {
      control: 'text',
      description: 'Status key. Auto-generates label and colour from the helper token set.',
      table: { type: { summary: 'string' } },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Badge size.',
      table: { type: { summary: "'sm' | 'md' | 'lg' | 'xl'" }, defaultValue: { summary: "'md'" } },
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['start', 'end'],
      description: 'Which side of the label the icon is placed.',
      table: { type: { summary: "'start' | 'end'" }, defaultValue: { summary: "'start'" } },
    },
    icon: {
      control: false,
      description: 'Icon component (e.g. a Lucide icon). Sized automatically.',
      table: { type: { summary: 'React.ElementType' } },
    },
    statusConfig: {
      control: false,
      description: 'Custom status → colour map. Overrides defaults for listed statuses.',
      table: { type: { summary: 'BadgeStatusConfig' } },
    },
    children: {
      control: 'text',
      description: 'Label text. Overrides the label derived from `status`.',
      table: { type: { summary: 'ReactNode' } },
    },
  },
  args: {
    children: 'Badge',
    variant: 'pastel',
  },
} satisfies Meta<typeof Badge>;

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
            <div className='flex flex-wrap gap-2' onClick={e => e.stopPropagation()}>{v.node}</div>
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
      title='Badge'
      variants={[
        {
          label: 'Pastel (default)',
          code: `<Badge variant="pastel" status="stable">Stable</Badge>
<Badge variant="pastel" status="beta">Beta</Badge>
<Badge variant="pastel" status="active">Active</Badge>`,
          node: (
            <>
              <Badge variant='pastel' status='stable'>Stable</Badge>
              <Badge variant='pastel' status='beta'>Beta</Badge>
              <Badge variant='pastel' status='active'>Active</Badge>
            </>
          ),
        },
        {
          label: 'Outlined',
          code: `<Badge variant="outlined" status="stable">Stable</Badge>
<Badge variant="outlined" status="beta">Beta</Badge>
<Badge variant="outlined" status="active">Active</Badge>`,
          node: (
            <>
              <Badge variant='outlined' status='stable'>Stable</Badge>
              <Badge variant='outlined' status='beta'>Beta</Badge>
              <Badge variant='outlined' status='active'>Active</Badge>
            </>
          ),
        },
        {
          label: 'Filled',
          code: `<Badge variant="filled" status="stable">Stable</Badge>
<Badge variant="filled" status="beta">Beta</Badge>
<Badge variant="filled" status="active">Active</Badge>`,
          node: (
            <>
              <Badge variant='filled' status='stable'>Stable</Badge>
              <Badge variant='filled' status='beta'>Beta</Badge>
              <Badge variant='filled' status='active'>Active</Badge>
            </>
          ),
        },
        {
          label: 'Sizes',
          code: `<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
<Badge size="xl">X-Large</Badge>`,
          node: (
            <>
              <Badge size='sm'>Small</Badge>
              <Badge size='md'>Medium</Badge>
              <Badge size='lg'>Large</Badge>
              <Badge size='xl'>X-Large</Badge>
            </>
          ),
        },
        {
          label: 'With start icon',
          code: `<Badge variant="pastel" status="complete" icon={CheckCircle}>Complete</Badge>
<Badge variant="pastel" status="pending" icon={Clock}>Pending</Badge>`,
          node: (
            <>
              <Badge variant='pastel' status='complete' icon={CheckCircle}>Complete</Badge>
              <Badge variant='pastel' status='pending' icon={Clock}>Pending</Badge>
            </>
          ),
        },
        {
          label: 'With end icon',
          code: `<Badge variant="outlined" icon={Star} iconPosition="end">Featured</Badge>
<Badge variant="outlined" icon={Tag} iconPosition="end">Tagged</Badge>`,
          node: (
            <>
              <Badge variant='outlined' icon={Star} iconPosition='end'>Featured</Badge>
              <Badge variant='outlined' icon={Tag} iconPosition='end'>Tagged</Badge>
            </>
          ),
        },
        {
          label: 'Status auto-label',
          code: `<Badge variant="pastel" status="reviewed" />
<Badge variant="pastel" status="needs_review" />
<Badge variant="pastel" status="complete" />`,
          node: (
            <>
              <Badge variant='pastel' status='reviewed' />
              <Badge variant='pastel' status='needs_review' />
              <Badge variant='pastel' status='complete' />
            </>
          ),
        },
        {
          label: 'Error / warning',
          code: `<Badge variant="pastel" status="error">Error</Badge>
<Badge variant="pastel" status="warning">Warning</Badge>
<Badge variant="pastel" icon={XCircle} status="error">Failed</Badge>`,
          node: (
            <>
              <Badge variant='pastel' status='error'>Error</Badge>
              <Badge variant='pastel' status='warning'>Warning</Badge>
              <Badge variant='pastel' icon={XCircle} status='error'>Failed</Badge>
            </>
          ),
        },
        {
          label: 'Built-in colour statuses',
          code: `<Badge variant="pastel" status="success" />
<Badge variant="pastel" status="warning" />
<Badge variant="pastel" status="error" />
<Badge variant="pastel" status="info" />
<Badge variant="pastel" status="pending" />
<Badge variant="pastel" status="completed" />
<Badge variant="pastel" status="neutral" />
<Badge variant="pastel" status="link" />`,
          node: (
            <>
              <Badge variant='pastel' status='success' />
              <Badge variant='pastel' status='warning' />
              <Badge variant='pastel' status='error' />
              <Badge variant='pastel' status='info' />
              <Badge variant='pastel' status='pending' />
              <Badge variant='pastel' status='completed' />
              <Badge variant='pastel' status='neutral' />
              <Badge variant='pastel' status='link' />
            </>
          ),
        },
        {
          label: 'Component status',
          code: `{/* ComponentStatus */}
<Badge variant="pastel" status="stable">Stable</Badge>
<Badge variant="pastel" status="beta">Beta</Badge>
<Badge variant="pastel" status="needs_docs">Needs docs</Badge>

{/* AccessibilityStatus */}
<Badge variant="outlined" status="reviewed">Reviewed</Badge>
<Badge variant="outlined" status="needs_review">Needs review</Badge>

{/* DocumentationStatus */}
<Badge variant="outlined" status="complete">Complete</Badge>
<Badge variant="outlined" status="partial">Partial</Badge>
<Badge variant="outlined" status="missing">Missing</Badge>`,
          node: (
            <>
              <Badge variant='pastel' status='stable'>Stable</Badge>
              <Badge variant='pastel' status='beta'>Beta</Badge>
              <Badge variant='pastel' status='needs_docs'>Needs docs</Badge>
              <Badge variant='outlined' status='reviewed'>Reviewed</Badge>
              <Badge variant='outlined' status='needs_review'>Needs review</Badge>
              <Badge variant='outlined' status='complete'>Complete</Badge>
              <Badge variant='outlined' status='partial'>Partial</Badge>
              <Badge variant='outlined' status='missing'>Missing</Badge>
            </>
          ),
        },
      ]}
    />
  ),
  parameters: { layout: 'padded' },
  decorators: [Story => <div className='w-full max-w-3xl'><Story /></div>],
};

export const Pastel: Story = {
  args: { variant: 'pastel', status: 'stable', children: 'Stable' },
};

export const Outlined: Story = {
  args: { variant: 'outlined', status: 'beta', children: 'Beta' },
};

export const Filled: Story = {
  args: { variant: 'filled', status: 'active', children: 'Active' },
};

export const WithIcon: Story = {
  args: { variant: 'pastel', status: 'complete', icon: CheckCircle, children: 'Complete' },
};

export const Sizes: Story = {
  render: () => (
    <div className='flex items-center gap-3 flex-wrap'>
      <Badge size='sm'>Small</Badge>
      <Badge size='md'>Medium</Badge>
      <Badge size='lg'>Large</Badge>
      <Badge size='xl'>X-Large</Badge>
    </div>
  ),
};

export const BuiltInStatuses: Story = {
  render: () => (
    <div className='grid gap-4'>
      <p className='text-sm font-medium text-[color:var(--text-title)]'>Pastel</p>
      <div className='flex flex-wrap gap-2'>
        <Badge variant='pastel' status='success' icon={CheckCircle} />
        <Badge variant='pastel' status='warning' icon={AlertCircle} />
        <Badge variant='pastel' status='error' icon={XCircle} />
        <Badge variant='pastel' status='info' icon={Info} />
        <Badge variant='pastel' status='pending' icon={Clock} />
        <Badge variant='pastel' status='completed' icon={CheckCircle} />
        <Badge variant='pastel' status='neutral' />
        <Badge variant='pastel' status='link' icon={Link2} />
      </div>
      <p className='text-sm font-medium text-[color:var(--text-title)]'>Outlined</p>
      <div className='flex flex-wrap gap-2'>
        <Badge variant='outlined' status='success' />
        <Badge variant='outlined' status='warning' />
        <Badge variant='outlined' status='error' />
        <Badge variant='outlined' status='info' />
        <Badge variant='outlined' status='pending' />
        <Badge variant='outlined' status='completed' />
        <Badge variant='outlined' status='neutral' />
      </div>
      <p className='text-sm font-medium text-[color:var(--text-title)]'>Filled</p>
      <div className='flex flex-wrap gap-2'>
        <Badge variant='filled' status='success' />
        <Badge variant='filled' status='warning' />
        <Badge variant='filled' status='error' />
        <Badge variant='filled' status='info' />
        <Badge variant='filled' status='pending' />
        <Badge variant='filled' status='completed' />
        <Badge variant='filled' status='neutral' />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: `The eight built-in colour statuses. \`pending\` maps to the warning colour token; \`completed\` maps to the info token. All other unknown statuses fall back to \`neutral\`.`,
      },
    },
  },
};

export const DesignSystemStatuses: Story = {
  render: () => (
    <div className='grid gap-6'>
      <div className='grid gap-2'>
        <p className='text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]'>
          Component status
        </p>
        <div className='flex flex-wrap gap-2'>
          <Badge variant='pastel' status='stable'>Stable</Badge>
          <Badge variant='pastel' status='beta'>Beta</Badge>
          <Badge variant='pastel' status='needs_docs'>Needs docs</Badge>
        </div>
      </div>
      <div className='grid gap-2'>
        <p className='text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]'>
          Accessibility status
        </p>
        <div className='flex flex-wrap gap-2'>
          <Badge variant='outlined' status='reviewed' icon={ShieldCheck}>Reviewed</Badge>
          <Badge variant='outlined' status='needs_review' icon={ShieldAlert}>Needs review</Badge>
        </div>
      </div>
      <div className='grid gap-2'>
        <p className='text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]'>
          Documentation status
        </p>
        <div className='flex flex-wrap gap-2'>
          <Badge variant='outlined' status='complete' icon={FileText}>Complete</Badge>
          <Badge variant='outlined' status='partial' icon={FileText}>Partial</Badge>
          <Badge variant='outlined' status='missing' icon={MinusCircle}>Missing</Badge>
        </div>
      </div>
      <div className='grid gap-2'>
        <p className='text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]'>
          General state
        </p>
        <div className='flex flex-wrap gap-2'>
          <Badge variant='pastel' status='active'>Active</Badge>
          <Badge variant='pastel' status='inactive'>Inactive</Badge>
          <Badge variant='pastel' status='draft'>Draft</Badge>
          <Badge variant='pastel' status='published'>Published</Badge>
          <Badge variant='pastel' status='archived'>Archived</Badge>
          <Badge variant='pastel' status='deprecated'>Deprecated</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: `Status strings used across the design system catalog — component readiness, accessibility review state, documentation completeness, and general record state. Unknown statuses resolve to the \`neutral\` colour token automatically.`,
      },
    },
  },
};
