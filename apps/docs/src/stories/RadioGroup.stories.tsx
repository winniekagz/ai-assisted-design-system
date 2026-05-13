import * as React from 'react';
import { RadioGroup } from '@/components/ui/form-fields/radio-group';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const planOptions = [
  { value: 'starter', label: 'Starter' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
];

const meta = {
  title: 'Components/FormFields/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Token-driven radio group built on Radix UI \`RadioGroup\` primitives. Renders a set of mutually exclusive options with full keyboard navigation and ARIA support.

### When to use
- Choosing **exactly one** option from a short list (2–6 items) that should all be visible at once.
- For longer lists or a single on/off toggle use **Select** or **Switch** respectively.

### Usage
\`\`\`tsx
import { RadioGroup } from 'componentiq';

const options = [
  { value: 'starter', label: 'Starter' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
];

<RadioGroup
  label="Plan"
  options={options}
  defaultValue="pro"
/>
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`options\` | \`{ value, label, disabled? }[]\` | **required** | The list of radio items |
| \`label\` | string | — | Group label rendered above the items |
| \`defaultValue\` | string | — | Initially selected value (uncontrolled) |
| \`value\` | string | — | Controlled selected value |
| \`onValueChange\` | \`(val: string) => void\` | — | Called on selection change |
| \`error\` | boolean | false | Red indicator dot + red border |
| \`success\` | boolean | false | Green indicator dot + green border |
| \`size\` | \`"sm" \\| "default" \\| "lg"\` | "default" | Radio circle size |
| \`orientation\` | \`"vertical" \\| "horizontal"\` | "vertical" | Layout direction |
| \`disabled\` | boolean | false | Disables all items |
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className='w-[min(360px,calc(100vw-32px))]'>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: {
      control: 'text',
      description: 'Group label rendered above the radio items.',
      table: { type: { summary: 'string' } },
    },
    orientation: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
      description: 'Layout direction of the radio items.',
      table: { type: { summary: "'vertical' | 'horizontal'" }, defaultValue: { summary: "'vertical'" } },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: 'Size of the radio circle.',
      table: { type: { summary: "'sm' | 'default' | 'lg'" }, defaultValue: { summary: "'default'" } },
    },
    error: {
      control: 'boolean',
      description: 'Error state — red indicator and border.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    success: {
      control: 'boolean',
      description: 'Success state — green indicator and border.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all radio items.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    options: { table: { disable: true } },
    value: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
  },
  args: {
    options: planOptions,
    defaultValue: 'pro',
  },
} satisfies Meta<typeof RadioGroup>;

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
            className={`flex flex-col items-start gap-[var(--spacing-sm)] rounded-[var(--radius-md)] border p-[var(--spacing-md)] transition-colors text-left cursor-pointer ${
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
      <div className='rounded-[var(--radius-md)] bg-[color:var(--bg-secondary,#F9FAFB)] border border-[color:var(--border-subtle)] p-[var(--spacing-md)]'>
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
      title='RadioGroup'
      variants={[
        {
          label: 'Default vertical',
          code: `<RadioGroup options={planOptions} defaultValue="pro" />`,
          node: <RadioGroup options={planOptions} defaultValue='pro' />,
        },
        {
          label: 'Horizontal',
          code: `<RadioGroup options={planOptions} orientation="horizontal" />`,
          node: <RadioGroup options={planOptions} orientation='horizontal' />,
        },
        {
          label: 'Error state',
          code: `<RadioGroup options={planOptions} error={true} />`,
          node: <RadioGroup options={planOptions} error={true} />,
        },
        {
          label: 'Success state',
          code: `<RadioGroup options={planOptions} success={true} />`,
          node: <RadioGroup options={planOptions} success={true} />,
        },
        {
          label: 'Small',
          code: `<RadioGroup options={planOptions} size="sm" />`,
          node: <RadioGroup options={planOptions} size='sm' />,
        },
        {
          label: 'Large',
          code: `<RadioGroup options={planOptions} size="lg" />`,
          node: <RadioGroup options={planOptions} size='lg' />,
        },
        {
          label: 'With group label',
          code: `<RadioGroup options={planOptions} label="Choose plan" />`,
          node: <RadioGroup options={planOptions} label='Choose plan' />,
        },
        {
          label: 'Disabled',
          code: `<RadioGroup options={planOptions} disabled={true} />`,
          node: <RadioGroup options={planOptions} disabled={true} />,
        },
      ]}
    />
  ),
};

export const Default: Story = {};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
};

export const WithError: Story = {
  args: {
    error: true,
  },
};

export const WithSuccess: Story = {
  args: {
    success: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
