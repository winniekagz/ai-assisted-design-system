import * as React from 'react';
import { Checkbox } from '@/components/ui/form-fields/checkbox';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/FormFields/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Token-driven checkbox built on Radix UI \`Checkbox\` primitive. Supports three states: unchecked, checked, and indeterminate.

### When to use
- Selecting one or more independent options (non-exclusive).
- Form values that will be submitted (vs Switch which takes immediate effect).
- "Select all" patterns using the indeterminate state.

### Usage
\`\`\`tsx
import { Checkbox } from 'componentiq';

// Uncontrolled
<Checkbox label="Accept terms" defaultChecked />

// Controlled
const [checked, setChecked] = useState(false);
<Checkbox
  label="Subscribe to newsletter"
  checked={checked}
  onCheckedChange={setChecked}
/>

// Indeterminate (e.g. select-all)
<Checkbox label="Select all" indeterminate />
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`label\` | string | — | Text rendered beside the checkbox |
| \`checked\` | boolean | — | Controlled checked state |
| \`defaultChecked\` | boolean | — | Initial state (uncontrolled) |
| \`onCheckedChange\` | \`(val: boolean \\| "indeterminate") => void\` | — | State change handler |
| \`indeterminate\` | boolean | false | Renders a dash (–) instead of a tick; useful for "select all" |
| \`error\` | boolean | false | Red border and fill |
| \`success\` | boolean | false | Green border and fill |
| \`size\` | \`"sm" \\| "default" \\| "lg"\` | "default" | Box size: 16 / 20 / 24 px |
| \`required\` | boolean | false | Appends \`*\` to the label |
| \`disabled\` | boolean | false | Prevents interaction |

### Checked accent colour
The checked and indeterminate fill uses \`--color-primary\` from the design token system. Override it via \`ComponentIqProvider tokens\` to apply your brand colour globally.
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
      description: 'Text label rendered beside the checkbox.',
      table: { type: { summary: 'string' } },
    },
    checked: {
      control: 'boolean',
      description: 'Controlled checked state.',
      table: { type: { summary: 'boolean' } },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Initial checked state for uncontrolled usage.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    indeterminate: {
      control: 'boolean',
      description: 'Renders a dash indicator. Use for "select all" rows where only some children are checked.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    error: {
      control: 'boolean',
      description: 'Error state — red border and fill.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    success: {
      control: 'boolean',
      description: 'Success state — green border and fill.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: 'Box size. sm = 16 px, default = 20 px, lg = 24 px.',
      table: { type: { summary: "'sm' | 'default' | 'lg'" }, defaultValue: { summary: "'default'" } },
    },
    required: {
      control: 'boolean',
      description: 'Appends a red `*` to the label.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the checkbox.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onCheckedChange: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
} satisfies Meta<typeof Checkbox>;

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
      title='Checkbox'
      variants={[
        {
          label: 'Default unchecked',
          code: `<Checkbox label="Accept terms" />`,
          node: <Checkbox label='Accept terms' />,
        },
        {
          label: 'Checked',
          code: `<Checkbox label="Notifications" defaultChecked />`,
          node: <Checkbox label='Notifications' defaultChecked />,
        },
        {
          label: 'Error',
          code: `<Checkbox label="Required field" error />`,
          node: <Checkbox label='Required field' error />,
        },
        {
          label: 'Success',
          code: `<Checkbox label="Verified" success />`,
          node: <Checkbox label='Verified' success />,
        },
        {
          label: 'Indeterminate',
          code: `<Checkbox label="Select all" indeterminate />`,
          node: <Checkbox label='Select all' indeterminate />,
        },
        {
          label: 'Small',
          code: `<Checkbox label="Small" size="sm" />`,
          node: <Checkbox label='Small' size='sm' />,
        },
        {
          label: 'Large',
          code: `<Checkbox label="Large" size="lg" />`,
          node: <Checkbox label='Large' size='lg' />,
        },
        {
          label: 'Disabled',
          code: `<Checkbox label="Disabled" disabled />`,
          node: <Checkbox label='Disabled' disabled />,
        },
        {
          label: 'Disabled checked',
          code: `<Checkbox label="Locked on" disabled defaultChecked />`,
          node: <Checkbox label='Locked on' disabled defaultChecked />,
        },
        {
          label: 'Required',
          code: `<Checkbox label="I agree" required />`,
          node: <Checkbox label='I agree' required />,
        },
      ]}
    />
  ),
};

export const Default: Story = {
  args: {
    label: 'Accept terms',
  },
};

export const Checked: Story = {
  args: {
    label: 'Notifications',
    defaultChecked: true,
  },
};

export const Error: Story = {
  args: {
    label: 'Required field',
    error: true,
  },
};

export const Success: Story = {
  args: {
    label: 'Verified',
    success: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Select all',
    indeterminate: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
};
