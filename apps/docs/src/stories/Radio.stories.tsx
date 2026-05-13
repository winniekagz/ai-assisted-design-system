import * as React from 'react';
import { Radio } from '@/components/ui/form-fields/radio';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

// ---------------------------------------------------------------------------
// Shared showcase layout
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Interactive group demo — shows mutually exclusive selection
// ---------------------------------------------------------------------------
function RadioGroupDemo() {
  const [value, setValue] = React.useState('');
  const options = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'sms',   label: 'SMS'   },
  ];
  return (
    <div className='flex flex-col gap-[var(--spacing-sm)]'>
      {options.map(o => (
        <Radio
          key={o.value}
          name='contact-demo'
          value={o.value}
          label={o.label}
          checked={value === o.value}
          onChange={e => setValue(e.target.value)}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------
const meta = {
  title: 'Components/FormFields/Radio',
  component: Radio,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Token-driven standalone radio button built on Radix UI \`RadioGroup\` primitives. Use **Radio** when you need a single independently-controlled option. For a full mutually-exclusive set use **RadioGroup** instead.

### When to use
- A single "I agree" acknowledgement checkbox-equivalent where radio semantics are required.
- Hand-rolling a custom group where you need per-item controlled state.
- Use **RadioGroup** for standard mutually-exclusive sets — it is less boilerplate and handles ARIA automatically.

### Radio vs RadioGroup
| | Radio | RadioGroup |
|---|---|---|
| Use case | One standalone option (e.g. "I agree") or a hand-rolled group | A complete list of mutually exclusive choices |
| Controlled via | \`checked\` + \`onChange\` per item | \`value\` + \`onValueChange\` on the group |
| Built-in label | ✓ | ✓ per option |
| Group label | ✗ | ✓ |

### Building a group with Radio
Each \`Radio\` must share the same \`name\` attribute (native radio behaviour) and be controlled against the same state:

\`\`\`tsx
import { Radio } from '@winniekagz/componentiq';

const [value, setValue] = useState('');

<Radio name="plan" value="starter" label="Starter"
  checked={value === 'starter'} onChange={e => setValue(e.target.value)} />
<Radio name="plan" value="pro"     label="Pro"
  checked={value === 'pro'}     onChange={e => setValue(e.target.value)} />
<Radio name="plan" value="enterprise" label="Enterprise"
  checked={value === 'enterprise'} onChange={e => setValue(e.target.value)} />
\`\`\`

Prefer **RadioGroup** for this pattern — it is less boilerplate and handles ARIA roles automatically.

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`value\` | string | \`""\` | The value this radio represents |
| \`label\` | string | — | Text rendered beside the radio |
| \`checked\` | boolean | — | Controlled checked state |
| \`defaultChecked\` | boolean | — | Initial state (uncontrolled) |
| \`onChange\` | \`(e: { target: { checked, value } }) => void\` | — | Called when selected |
| \`name\` | string | — | Links radios into a group (native HTML) |
| \`error\` | boolean | false | Red indicator dot + red border |
| \`success\` | boolean | false | Green indicator dot + green border |
| \`size\` | \`"sm" \\| "default" \\| "lg"\` | "default" | Circle size: 16 / 20 / 24 px |
| \`required\` | boolean | false | Appends \`*\` to the label |
| \`disabled\` | boolean | false | Prevents interaction |

### Checked accent colour
The selected dot uses \`--color-primary\` from the design token system. Change it globally by passing custom tokens to \`ComponentIqProvider\`.
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
      description: 'Text rendered beside the radio button.',
      table: { type: { summary: 'string' } },
    },
    value: {
      control: 'text',
      description: 'The value this radio represents. Used to identify which option is selected in a group.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '""' } },
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
    error: {
      control: 'boolean',
      description: 'Error state — red border and dot.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    success: {
      control: 'boolean',
      description: 'Success state — green border and dot.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: 'Circle size. sm = 16 px, default = 20 px, lg = 24 px.',
      table: { type: { summary: "'sm' | 'default' | 'lg'" }, defaultValue: { summary: "'default'" } },
    },
    required: {
      control: 'boolean',
      description: 'Appends a red `*` to the label.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the radio button.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onChange: { table: { disable: true } },
    variant: { table: { disable: true } },
  },
  args: {
    label: 'Option label',
    value: 'option',
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// AllVariants — interactive showcase
// ---------------------------------------------------------------------------
export const AllVariants: Story = {
  render: () => (
    <VariantShowcase
      title='Radio'
      variants={[
        {
          label: 'Default (unchecked)',
          code: `<Radio label="Starter plan" value="starter" name="plan" />`,
          node: <Radio label='Starter plan' value='starter' name='av-1' />,
        },
        {
          label: 'Checked',
          code: `<Radio label="Pro plan" value="pro" name="plan" defaultChecked />`,
          node: <Radio label='Pro plan' value='pro' name='av-2' defaultChecked />,
        },
        {
          label: 'Error',
          code: `<Radio label="Option" value="x" name="plan" error />`,
          node: <Radio label='Option' value='x' name='av-3' error />,
        },
        {
          label: 'Error checked',
          code: `<Radio label="Option" value="x" name="plan" error defaultChecked />`,
          node: <Radio label='Option' value='x' name='av-4' error defaultChecked />,
        },
        {
          label: 'Success',
          code: `<Radio label="Option" value="x" name="plan" success />`,
          node: <Radio label='Option' value='x' name='av-5' success />,
        },
        {
          label: 'Success checked',
          code: `<Radio label="Option" value="x" name="plan" success defaultChecked />`,
          node: <Radio label='Option' value='x' name='av-6' success defaultChecked />,
        },
        {
          label: 'Required',
          code: `<Radio label="I agree" value="agree" name="terms" required />`,
          node: <Radio label='I agree' value='agree' name='av-7' required />,
        },
        {
          label: 'Disabled',
          code: `<Radio label="Locked option" value="x" name="plan" disabled />`,
          node: <Radio label='Locked option' value='x' name='av-8' disabled />,
        },
        {
          label: 'Disabled checked',
          code: `<Radio label="Locked option" value="x" name="plan" disabled defaultChecked />`,
          node: <Radio label='Locked option' value='x' name='av-9' disabled defaultChecked />,
        },
        {
          label: 'Small',
          code: `<Radio label="Small" value="x" name="plan" size="sm" />`,
          node: <Radio label='Small' value='x' name='av-10' size='sm' />,
        },
        {
          label: 'Large',
          code: `<Radio label="Large" value="x" name="plan" size="lg" />`,
          node: <Radio label='Large' value='x' name='av-11' size='lg' />,
        },
        {
          label: 'Interactive group',
          code: `const [value, setValue] = useState('');
['email','phone','sms'].map(opt => (
  <Radio key={opt} name="contact" value={opt} label={opt}
    checked={value === opt}
    onChange={e => setValue(e.target.value)}
  />
))`,
          node: <RadioGroupDemo />,
        },
      ]}
    />
  ),
  parameters: { layout: 'padded' },
  decorators: [
    Story => (
      <div className='w-full max-w-3xl'>
        <Story />
      </div>
    ),
  ],
};

// ---------------------------------------------------------------------------
// Individual stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: { label: 'Default option', value: 'default', name: 'ind-1' },
};

export const Checked: Story = {
  args: { label: 'Selected option', value: 'checked', name: 'ind-2', defaultChecked: true },
};

export const ErrorState: Story = {
  args: { label: 'Error option', value: 'error', name: 'ind-3', error: true },
  parameters: { docs: { description: { story: 'Use `error` when a radio option is part of a group with a validation failure.' } } },
};

export const SuccessState: Story = {
  args: { label: 'Success option', value: 'success', name: 'ind-4', success: true, defaultChecked: true },
};

export const Required: Story = {
  args: { label: 'I agree to the terms', value: 'agree', name: 'ind-5', required: true },
};

export const Disabled: Story = {
  args: { label: 'Disabled option', value: 'disabled', name: 'ind-6', disabled: true },
};

export const DisabledChecked: Story = {
  args: { label: 'Locked selection', value: 'locked', name: 'ind-7', disabled: true, defaultChecked: true },
};

export const Small: Story = {
  args: { label: 'Small', value: 'sm', name: 'ind-8', size: 'sm' },
};

export const Large: Story = {
  args: { label: 'Large', value: 'lg', name: 'ind-9', size: 'lg' },
};

export const InteractiveGroup: Story = {
  render: () => <RadioGroupDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Three Radio buttons sharing the same `name` and controlled by a single piece of state. Clicking one deselects the others. For a cleaner API with the same behaviour, see the **RadioGroup** component.',
      },
    },
  },
};
