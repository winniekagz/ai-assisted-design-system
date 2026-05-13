import * as React from 'react';
import { Progress } from '@/components/ui/progress';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Token-driven linear progress bar. Track uses \`--bg-secondary\`; fill uses \`--color-primary\`. Fully accessible with \`role="progressbar"\`, \`aria-valuenow\`, \`aria-valuemin\`, and \`aria-valuemax\`.

### When to use
- Background tasks with a known completion percentage (upload, analysis, build).
- Multi-step form completion percentage.
- Always pair with a \`label\` so users know what is progressing.
- For unknown duration use a spinner — do not fake indeterminate progress.

### Usage
\`\`\`tsx
import { Progress } from 'componentiq';

<Progress value={65} label="Upload progress" showValue />

// Custom max — percentage computed automatically
<Progress value={3} max={5} label="Step 3 of 5" showValue />
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`value\` | number | 0 | Current value |
| \`max\` | number | 100 | Maximum value — percentage = value / max × 100 |
| \`label\` | ReactNode | — | Descriptive text shown above the bar |
| \`showValue\` | boolean | false | Display computed percentage beside the label |
      `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => <div className='w-[min(420px,calc(100vw-32px))]'><Story /></div>,
  ],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current progress value.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    max: {
      control: { type: 'number', min: 1 },
      description: 'Maximum value. Percentage = value / max × 100.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '100' } },
    },
    label: {
      control: 'text',
      description: 'Label displayed above the bar.',
      table: { type: { summary: 'ReactNode' } },
    },
    showValue: {
      control: 'boolean',
      description: 'Show the computed percentage next to the label.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
  },
  args: { value: 65, label: 'Audit progress', showValue: true },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

function VariantShowcase({ title, variants }: {
  title: string;
  variants: Array<{ label: string; code: string; node: React.ReactNode }>;
}) {
  const [sel, setSel] = React.useState(0);
  return (
    <div className='w-full space-y-[var(--spacing-md)]'>
      <h2 className='font-[family-name:var(--font-heading)] font-[var(--font-weight-bold)] text-[color:var(--text-title)] text-[length:var(--font-size-heading-6)]'>{title}</h2>
      <div className='grid grid-cols-1 gap-[var(--spacing-sm)] sm:grid-cols-2'>
        {variants.map((v, i) => (
          <div key={v.label} onClick={() => setSel(i)}
            className={`flex flex-col gap-[var(--spacing-sm)] rounded-[var(--radius-md)] border p-[var(--spacing-md)] transition-colors cursor-pointer ${sel === i ? 'bg-[color:var(--bg-hover)] border-[color:var(--color-primary)]' : 'bg-[color:var(--bg-surface)] border-[color:var(--border-subtle)] hover:bg-[color:var(--bg-hover)]'}`}
          >
            <span className='text-[length:var(--font-size-xs)] text-[color:var(--text-muted)] font-[family-name:var(--font-rubik)]'>{v.label}</span>
            <div onClick={e => e.stopPropagation()}>{v.node}</div>
          </div>
        ))}
      </div>
      <div className='rounded-[var(--radius-md)] bg-[color:var(--bg-secondary)] border border-[color:var(--border-subtle)] p-[var(--spacing-md)]'>
        <p className='text-[length:var(--font-size-xs)] text-[color:var(--text-muted)] font-[family-name:var(--font-rubik)] mb-[var(--spacing-sm)]'>{variants[sel].label}</p>
        <pre className='text-[length:var(--font-size-xs)] text-[color:var(--text-paragraph)] font-mono overflow-x-auto whitespace-pre-wrap'><code>{variants[sel].code}</code></pre>
      </div>
    </div>
  );
}

export const AllVariants: Story = {
  render: () => (
    <VariantShowcase title='Progress' variants={[
      { label: 'Label + value', code: `<Progress value={65} label="Upload progress" showValue />`, node: <Progress value={65} label='Upload progress' showValue /> },
      { label: 'Label only', code: `<Progress value={40} label="Processing…" />`, node: <Progress value={40} label='Processing…' /> },
      { label: 'No label', code: `<Progress value={80} />`, node: <Progress value={80} /> },
      { label: '0% — start', code: `<Progress value={0} label="Queued" showValue />`, node: <Progress value={0} label='Queued' showValue /> },
      { label: '100% — complete', code: `<Progress value={100} label="Complete" showValue />`, node: <Progress value={100} label='Complete' showValue /> },
      { label: 'Custom max (3/5)', code: `<Progress value={3} max={5} label="Step 3 of 5" showValue />`, node: <Progress value={3} max={5} label='Step 3 of 5' showValue /> },
    ]} />
  ),
  parameters: { layout: 'padded' },
  decorators: [Story => <div className='w-full max-w-xl'><Story /></div>],
};

export const Default: Story = {};
export const Complete: Story = { args: { value: 100, label: 'Upload complete', showValue: true } };
export const NoLabel: Story = { args: { value: 55, label: undefined, showValue: false } };
export const CustomMax: Story = {
  args: { value: 3, max: 5, label: 'Step 3 of 5', showValue: true },
  parameters: { docs: { description: { story: 'Set `max` to any integer — percentage is computed as `value / max × 100`.' } } },
};
