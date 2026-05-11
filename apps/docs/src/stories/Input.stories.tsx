'use client';

import * as React from 'react';
import { Input } from '@/components/ui/form-fields/input';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Eye, EyeOff, Lock, Mail, Search } from 'lucide-react';

// ---------------------------------------------------------------------------
// Shared showcase layout — used by AllVariants
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
      <div className='grid grid-cols-1 gap-[var(--spacing-sm)] sm:grid-cols-2'>
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
            <div className='w-full' onClick={e => e.stopPropagation()}>{v.node}</div>
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
// Password toggle — shows how to wire an end-icon click handler
// ---------------------------------------------------------------------------
function PasswordDemo() {
  const [visible, setVisible] = React.useState(false);
  return (
    <Input
      label='Password'
      type={visible ? 'text' : 'password'}
      placeholder='Enter your password'
      endIcon={
        visible
          ? <EyeOff className='size-4' aria-hidden />
          : <Eye className='size-4' aria-hidden />
      }
      onEndIconClick={() => setVisible(v => !v)}
    />
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------
const meta = {
  title: 'Components/FormFields/Input',
  component: Input,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Token-driven text input built on a native \`<input>\` element.

### When to use
- Collecting short free-form text: names, emails, search queries, URLs.
- When a single-line response is expected. For multi-line content use **Textarea**.

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`label\` | string | — | Renders a \`<label>\` wired with \`htmlFor\` |
| \`helperText\` | string | — | Hint or validation message below the field |
| \`error\` | boolean | false | Red border + red helper text + \`aria-invalid\` |
| \`success\` | boolean | false | Green border + green helper text |
| \`required\` | boolean | false | Adds a \`*\` to the label and native required attribute |
| \`size\` | \`"sm" \\| "default" \\| "lg"\` | "default" | Height: 36 / 44 / 48 px |
| \`startIcon\` | ReactNode | — | Left adornment; use a 16 px Lucide icon |
| \`endIcon\` | ReactNode | — | Right adornment; use a 16 px Lucide icon |
| \`onEndIconClick\` | () => void | — | Makes the end icon a clickable button (e.g. toggle password visibility) |
| \`disabled\` | boolean | false | Reduces opacity and blocks interaction |

### Accessibility
- Label is always linked to the input via \`id\` (auto-generated with \`useId\` if not provided).
- \`aria-invalid="true"\` is set in error state.
- \`aria-describedby\` links the input to its helper text element.
- Icon adornments have \`aria-hidden="true"\`; they are decorative.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label rendered above the input. Wired to the input via `htmlFor`.',
      table: { type: { summary: 'string' } },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder shown when the field is empty.',
      table: { type: { summary: 'string' } },
    },
    helperText: {
      control: 'text',
      description: 'Helper or validation message shown below the field. Color follows the variant (muted / red / green).',
      table: { type: { summary: 'string' } },
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'error', 'success'],
      description: 'Visual style. Prefer the `error` / `success` boolean props over setting this directly.',
      table: { type: { summary: "'default' | 'outline' | 'error' | 'success'" }, defaultValue: { summary: "'default'" } },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: 'Height of the input. sm = 36 px, default = 44 px, lg = 48 px.',
      table: { type: { summary: "'sm' | 'default' | 'lg'" }, defaultValue: { summary: "'default'" } },
    },
    error: {
      control: 'boolean',
      description: 'Shorthand for `variant="error"`. Also sets `aria-invalid="true"`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    success: {
      control: 'boolean',
      description: 'Shorthand for `variant="success"`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required. Appends a red `*` to the label.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and reduces opacity.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
      description: 'Native input type. Use `"password"` with an eye-icon `onEndIconClick` for reveal toggles.',
      table: { type: { summary: 'HTMLInputTypeAttribute' }, defaultValue: { summary: "'text'" } },
    },
    startIcon: { table: { disable: true } },
    endIcon: { table: { disable: true } },
    onStartIconClick: { table: { disable: true } },
    onEndIconClick: { table: { disable: true } },
  },
  args: {
    placeholder: 'Enter value…',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// AllVariants — interactive showcase grid
// ---------------------------------------------------------------------------
export const AllVariants: Story = {
  render: () => (
    <VariantShowcase
      title='Input'
      variants={[
        {
          label: 'Default',
          code: `<Input placeholder="Enter value…" />`,
          node: <Input placeholder='Enter value…' />,
        },
        {
          label: 'With label',
          code: `<Input label="Email address" placeholder="you@company.com" />`,
          node: <Input label='Email address' placeholder='you@company.com' />,
        },
        {
          label: 'Helper text',
          code: `<Input label="Username" placeholder="jdoe" helperText="Letters and numbers only." />`,
          node: (
            <Input
              label='Username'
              placeholder='jdoe'
              helperText='Letters and numbers only.'
            />
          ),
        },
        {
          label: 'Error',
          code: `<Input label="Email" error placeholder="you@company.com" helperText="Please enter a valid email address." />`,
          node: (
            <Input
              label='Email'
              error
              placeholder='you@company.com'
              helperText='Please enter a valid email address.'
            />
          ),
        },
        {
          label: 'Success',
          code: `<Input label="Username" success defaultValue="janedoe" helperText="Username is available." />`,
          node: (
            <Input
              label='Username'
              success
              defaultValue='janedoe'
              helperText='Username is available.'
            />
          ),
        },
        {
          label: 'Required',
          code: `<Input label="Full name" placeholder="Jane Doe" required />`,
          node: <Input label='Full name' placeholder='Jane Doe' required />,
        },
        {
          label: 'Disabled',
          code: `<Input label="Account ID" defaultValue="ACC-00123" disabled />`,
          node: (
            <Input label='Account ID' defaultValue='ACC-00123' disabled />
          ),
        },
        {
          label: 'Small',
          code: `<Input size="sm" placeholder="Search…" />`,
          node: <Input size='sm' placeholder='Search…' />,
        },
        {
          label: 'Large',
          code: `<Input size="lg" placeholder="Enter value…" />`,
          node: <Input size='lg' placeholder='Enter value…' />,
        },
        {
          label: 'Start icon',
          code: `<Input startIcon={<Search className="size-4" />} placeholder="Search…" />`,
          node: (
            <Input
              startIcon={<Search className='size-4' aria-hidden />}
              placeholder='Search…'
            />
          ),
        },
        {
          label: 'End icon',
          code: `<Input label="Email" endIcon={<Mail className="size-4" />} placeholder="you@company.com" type="email" />`,
          node: (
            <Input
              label='Email'
              endIcon={<Mail className='size-4' aria-hidden />}
              placeholder='you@company.com'
              type='email'
            />
          ),
        },
        {
          label: 'Password toggle',
          code: `// Manage visibility state yourself and swap icon + type
<Input
  label="Password"
  type={visible ? "text" : "password"}
  endIcon={visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
  onEndIconClick={() => setVisible(v => !v)}
/>`,
          node: <PasswordDemo />,
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
// Individual stories — usable in the Controls panel
// Each story is constrained to a readable form-field width.
// ---------------------------------------------------------------------------

const fieldDecorator = [
  (Story: React.ComponentType) => (
    <div className='w-[min(480px,calc(100vw-32px))]'>
      <Story />
    </div>
  ),
];

export const Default: Story = {
  decorators: fieldDecorator,
  args: { placeholder: 'Enter value…' },
};

export const WithLabel: Story = {
  decorators: fieldDecorator,
  args: { label: 'Email address', placeholder: 'you@company.com', type: 'email' },
};

export const WithHelperText: Story = {
  decorators: fieldDecorator,
  args: {
    label: 'Username',
    placeholder: 'jdoe',
    helperText: 'Must be 3–20 characters. Letters and numbers only.',
  },
};

export const ErrorState: Story = {
  decorators: fieldDecorator,
  args: {
    label: 'Email address',
    error: true,
    defaultValue: 'not-an-email',
    helperText: 'Please enter a valid email address.',
  },
};

export const SuccessState: Story = {
  decorators: fieldDecorator,
  args: {
    label: 'Username',
    success: true,
    defaultValue: 'janedoe',
    helperText: 'Username is available.',
  },
};

export const Required: Story = {
  decorators: fieldDecorator,
  args: { label: 'Full name', placeholder: 'Jane Doe', required: true, helperText: 'This field is required.' },
};

export const Disabled: Story = {
  decorators: fieldDecorator,
  args: { label: 'Account ID', defaultValue: 'ACC-00123', disabled: true, helperText: 'This field cannot be edited.' },
};

export const Small: Story = {
  decorators: fieldDecorator,
  args: { size: 'sm', label: 'Search', placeholder: 'Search…' },
};

export const Large: Story = {
  decorators: fieldDecorator,
  args: { size: 'lg', label: 'Full name', placeholder: 'Jane Doe' },
};

export const WithStartIcon: Story = {
  decorators: fieldDecorator,
  args: { placeholder: 'Search…', startIcon: <Search className='size-4' aria-hidden /> },
};

export const WithEndIcon: Story = {
  decorators: fieldDecorator,
  args: { label: 'Email', placeholder: 'you@company.com', type: 'email', endIcon: <Mail className='size-4' aria-hidden /> },
};

export const PasswordField: Story = {
  decorators: fieldDecorator,
  render: () => <PasswordDemo />,
  parameters: { docs: { description: { story: 'Wire `onEndIconClick` to toggle `type="password"` ↔ `type="text"` for a visibility toggle.' } } },
};

export const WithBothIcons: Story = {
  decorators: fieldDecorator,
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    startIcon: <Lock className='size-4' aria-hidden />,
    endIcon: <Eye className='size-4' aria-hidden />,
  },
};
