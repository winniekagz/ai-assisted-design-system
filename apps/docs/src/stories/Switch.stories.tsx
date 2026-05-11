import * as React from 'react';
import { Switch } from '@/components/ui/form-fields/switch';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/FormFields/Switch',
  component: Switch,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Token-driven toggle switch built on Radix UI \`Switch\` primitive. Represents a binary on/off state with an animated thumb that slides between positions.

### When to use
- Instantly enabling or disabling a **single setting** (no confirmation needed).
- Prefer Switch over Checkbox when the change takes effect immediately (dark mode, notifications on/off, feature flags).
- Use Checkbox when the value is part of a form that is submitted later.

### Usage
\`\`\`tsx
import { Switch } from '@winniekagendo/componentiq';

// Uncontrolled
<Switch label="Dark mode" defaultChecked />

// Controlled
const [on, setOn] = useState(false);
<Switch label="Notifications" checked={on} onCheckedChange={setOn} />
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`label\` | string | — | Text rendered beside the toggle |
| \`labelPosition\` | \`"right" \\| "left"\` | "right" | Side the label appears on |
| \`checked\` | boolean | — | Controlled checked state |
| \`defaultChecked\` | boolean | — | Initial state (uncontrolled) |
| \`onCheckedChange\` | \`(checked: boolean) => void\` | — | Called when the state changes |
| \`disabled\` | boolean | false | Prevents interaction and reduces opacity |

### Checked accent colour
The filled (on) background uses \`--color-primary\` from the design token system. Update the theme via \`ComponentIqProvider\` to change it globally across all switches.
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
      description: 'Text label rendered beside the switch.',
      table: { type: { summary: 'string' } },
    },
    labelPosition: {
      control: { type: 'select' },
      options: ['right', 'left'],
      description: 'Which side of the toggle the label appears on.',
      table: { type: { summary: "'right' | 'left'" }, defaultValue: { summary: "'right'" } },
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
    disabled: {
      control: 'boolean',
      description: 'Disables the switch.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onCheckedChange: { table: { disable: true } },
  },
  args: {
    label: 'Enable rule',
  },
} satisfies Meta<typeof Switch>;

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
            <div>{v.node}</div>
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
      title='Switch'
      variants={[
        {
          label: 'Off',
          code: `<Switch label="Dark mode" />`,
          node: <Switch label='Dark mode' />,
        },
        {
          label: 'On',
          code: `<Switch label="Notifications" defaultChecked />`,
          node: <Switch label='Notifications' defaultChecked />,
        },
        {
          label: 'Label left',
          code: `<Switch label="Auto-save" labelPosition="left" />`,
          node: <Switch label='Auto-save' labelPosition='left' />,
        },
        {
          label: 'Label left on',
          code: `<Switch label="Auto-save" labelPosition="left" defaultChecked />`,
          node: <Switch label='Auto-save' labelPosition='left' defaultChecked />,
        },
        {
          label: 'Disabled off',
          code: `<Switch label="Locked" disabled />`,
          node: <Switch label='Locked' disabled />,
        },
        {
          label: 'Disabled on',
          code: `<Switch label="Locked on" disabled defaultChecked />`,
          node: <Switch label='Locked on' disabled defaultChecked />,
        },
      ]}
    />
  ),
};

export const Default: Story = {
  args: {
    label: 'Dark mode',
  },
};

export const Checked: Story = {
  args: {
    label: 'Notifications',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Locked setting',
    disabled: true,
  },
};
