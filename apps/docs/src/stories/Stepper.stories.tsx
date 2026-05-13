import * as React from 'react';
import { Stepper } from '@/components/ui/stepper';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const onboardingSteps = [
  { id: 'account',  label: 'Create account',     description: 'Set up your email and password.' },
  { id: 'profile',  label: 'Complete profile',    description: 'Add your name, role, and team.' },
  { id: 'tokens',   label: 'Configure tokens',    description: 'Import your brand colour palette.' },
  { id: 'publish',  label: 'Publish components',  description: 'Export and share your design system.' },
];

const auditSteps = [
  { id: 'scan',    label: 'Scan codebase',            description: 'Read component files and usage patterns.' },
  { id: 'match',   label: 'Match design system',      description: 'Compare implementation against ComponentIQ rules.' },
  { id: 'review',  label: 'Review recommendations',   description: 'Approve fixes before applying changes.' },
];

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Token-driven step indicator for multi-step workflows. Completed steps and the active step use the primary token; upcoming steps use neutral surface and border tokens.

### When to use
- Orienting users within a multi-step form or wizard (3–6 steps).
- Showing progress through a process that cannot be completed non-linearly.
- Avoid for processes with more than 6 steps — collapse into phases instead.

### Usage
\`\`\`tsx
import { Stepper } from '@winniekagz/componentiq';

const steps = [
  { id: 'account', label: 'Create account', description: 'Set up email and password.' },
  { id: 'profile', label: 'Complete profile', description: 'Add your name and role.' },
  { id: 'publish', label: 'Publish', description: 'Export your design system.' },
];

// currentStep is 0-based
<Stepper steps={steps} currentStep={1} />
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`steps\` | \`StepperStep[]\` | **required** | Array of \`{ id, label, description? }\` |
| \`currentStep\` | number | 0 | 0-based index of the active step. Steps before it are marked complete |
| \`className\` | string | — | Additional classes on the outer \`<ol>\` |

### Accessibility
- Renders as an \`<ol>\` to convey ordered progress to screen readers.
- Active step circle gets \`aria-current="step"\`.
- Step numbers are visible — do not remove them for icon-only indicators without providing an alternative label.
      `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className='w-[min(400px,calc(100vw-32px))]'>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    steps: {
      control: false,
      description: 'Array of step definitions. Each item needs a unique `id`, a `label`, and an optional `description`.',
      table: { type: { summary: 'StepperStep[]' } },
    },
    currentStep: {
      control: { type: 'number', min: 0, max: 5 },
      description: '0-based index of the active step. All steps before it are marked complete.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
  },
  args: {
    steps: onboardingSteps,
    currentStep: 1,
  },
} satisfies Meta<typeof Stepper>;

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
      title='Stepper'
      variants={[
        {
          label: 'Step 1 active (first)',
          code: `<Stepper steps={steps} currentStep={0} />`,
          node: <Stepper steps={onboardingSteps} currentStep={0} />,
        },
        {
          label: 'Step 2 active (mid-flow)',
          code: `<Stepper steps={steps} currentStep={1} />`,
          node: <Stepper steps={onboardingSteps} currentStep={1} />,
        },
        {
          label: 'Step 3 active',
          code: `<Stepper steps={steps} currentStep={2} />`,
          node: <Stepper steps={onboardingSteps} currentStep={2} />,
        },
        {
          label: 'All complete',
          code: `<Stepper steps={steps} currentStep={steps.length} />`,
          node: <Stepper steps={onboardingSteps} currentStep={onboardingSteps.length} />,
        },
        {
          label: '3 steps — audit flow',
          code: `<Stepper steps={auditSteps} currentStep={1} />`,
          node: <Stepper steps={auditSteps} currentStep={1} />,
        },
        {
          label: 'Without descriptions',
          code: `<Stepper
  steps={[
    { id: 'a', label: 'Select plan' },
    { id: 'b', label: 'Add payment' },
    { id: 'c', label: 'Confirm' },
  ]}
  currentStep={1}
/>`,
          node: (
            <Stepper
              steps={[
                { id: 'a', label: 'Select plan' },
                { id: 'b', label: 'Add payment' },
                { id: 'c', label: 'Confirm' },
              ]}
              currentStep={1}
            />
          ),
        },
      ]}
    />
  ),
  parameters: { layout: 'padded' },
  decorators: [Story => <div className='w-full max-w-3xl'><Story /></div>],
};

export const Default: Story = {
  parameters: { docs: { description: { story: 'Second step active; first step is marked complete.' } } },
};

export const FirstStep: Story = {
  args: { currentStep: 0 },
  parameters: { docs: { description: { story: 'No steps are complete; the first step is active.' } } },
};

export const MidFlow: Story = {
  args: { currentStep: 2 },
  parameters: { docs: { description: { story: 'Two steps complete, one active, one upcoming.' } } },
};

export const AllComplete: Story = {
  args: { currentStep: onboardingSteps.length },
  parameters: { docs: { description: { story: 'All steps are complete — `currentStep` equals `steps.length`.' } } },
};

export const WithoutDescriptions: Story = {
  args: {
    steps: [
      { id: 'plan',    label: 'Select plan' },
      { id: 'payment', label: 'Add payment' },
      { id: 'confirm', label: 'Confirm' },
    ],
    currentStep: 1,
  },
  parameters: { docs: { description: { story: 'The `description` field is optional — omit it for compact layouts.' } } },
};

export const AuditFlow: Story = {
  args: { steps: auditSteps, currentStep: 1 },
};
