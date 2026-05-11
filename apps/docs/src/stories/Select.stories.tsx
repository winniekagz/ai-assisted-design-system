'use client';

import * as React from 'react';
import { Select } from '@/components/ui/form-fields/select';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

// ---------------------------------------------------------------------------
// Shared option fixtures
// ---------------------------------------------------------------------------
const roleOptions = [
  { value: 'designer', label: 'Designer' },
  { value: 'engineer', label: 'Engineer' },
  { value: 'product', label: 'Product Manager' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
];

function RoleOptions() {
  return (
    <>
      {roleOptions.map(o => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </>
  );
}

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
            <div className='w-full'>{v.node}</div>
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
// Meta
// ---------------------------------------------------------------------------
const meta = {
  title: 'Components/FormFields/Select',
  component: Select,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Token-driven select built on the native \`<select>\` element — reliable cross-browser behaviour and full keyboard navigation out of the box.

### When to use
- Choosing one value from a **short, known list** (≤ ~15 items).
- When options do not need to be filtered/searched. For filterable lists use **Autocomplete**.

### Usage
Pass \`<option>\` elements as \`children\`. Provide a \`placeholder\` prop to render a disabled first option that prompts the user.

\`\`\`tsx
import { Select } from '@winniekagendo/componentiq';

<Select label="Role" placeholder="Select a role…">
  <option value="designer">Designer</option>
  <option value="engineer">Engineer</option>
</Select>
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`label\` | string | — | Visible label above the select |
| \`placeholder\` | string | — | Renders a disabled first option |
| \`helperText\` | string | — | Hint or validation message below |
| \`error\` | boolean | false | Red border + red helper text |
| \`success\` | boolean | false | Green border + green helper text |
| \`required\` | boolean | false | Adds \`*\` to label; native required attribute |
| \`size\` | \`"sm" \\| "default" \\| "lg"\` | "default" | Height: 36 / 44 / 48 px |
| \`disabled\` | boolean | false | Disables interaction |
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label rendered above the select.',
      table: { type: { summary: 'string' } },
    },
    placeholder: {
      control: 'text',
      description: 'Renders a disabled first `<option>` that prompts selection.',
      table: { type: { summary: 'string' } },
    },
    helperText: {
      control: 'text',
      description: 'Helper or validation message below the field.',
      table: { type: { summary: 'string' } },
    },
    error: {
      control: 'boolean',
      description: 'Error state — red border + red helper text + `aria-invalid`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    success: {
      control: 'boolean',
      description: 'Success state — green border + green helper text.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    required: {
      control: 'boolean',
      description: 'Marks the field required. Appends a red `*` to the label.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: 'Height of the select. sm = 36 px, default = 44 px, lg = 48 px.',
      table: { type: { summary: "'sm' | 'default' | 'lg'" }, defaultValue: { summary: "'default'" } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the select.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    children: { table: { disable: true } },
    variant: { table: { disable: true } },
  },
  args: {
    placeholder: 'Select…',
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// AllVariants — interactive showcase
// ---------------------------------------------------------------------------
export const AllVariants: Story = {
  render: () => (
    <VariantShowcase
      title='Select'
      variants={[
        {
          label: 'Default',
          code: `<Select label="Role" placeholder="Select a role…">
  <option value="designer">Designer</option>
  <option value="engineer">Engineer</option>
</Select>`,
          node: (
            <Select label='Role' placeholder='Select a role…'>
              <RoleOptions />
            </Select>
          ),
        },
        {
          label: 'Pre-selected',
          code: `<Select label="Role" defaultValue="engineer">
  <option value="designer">Designer</option>
  <option value="engineer">Engineer</option>
</Select>`,
          node: (
            <Select label='Role' defaultValue='engineer'>
              <RoleOptions />
            </Select>
          ),
        },
        {
          label: 'With helper text',
          code: `<Select label="Role" placeholder="Select…" helperText="You can change this later.">
  …
</Select>`,
          node: (
            <Select
              label='Role'
              placeholder='Select…'
              helperText='You can change this later.'
            >
              <RoleOptions />
            </Select>
          ),
        },
        {
          label: 'Error',
          code: `<Select label="Role" error placeholder="Select…" helperText="Please select a role.">
  …
</Select>`,
          node: (
            <Select
              label='Role'
              error
              placeholder='Select…'
              helperText='Please select a role.'
            >
              <RoleOptions />
            </Select>
          ),
        },
        {
          label: 'Success',
          code: `<Select label="Role" success defaultValue="engineer" helperText="Great choice!">
  …
</Select>`,
          node: (
            <Select
              label='Role'
              success
              defaultValue='engineer'
              helperText='Great choice!'
            >
              <RoleOptions />
            </Select>
          ),
        },
        {
          label: 'Required',
          code: `<Select label="Role" placeholder="Select…" required>
  …
</Select>`,
          node: (
            <Select label='Role' placeholder='Select…' required>
              <RoleOptions />
            </Select>
          ),
        },
        {
          label: 'Disabled',
          code: `<Select label="Role" disabled defaultValue="designer">
  …
</Select>`,
          node: (
            <Select label='Role' disabled defaultValue='designer'>
              <RoleOptions />
            </Select>
          ),
        },
        {
          label: 'Small',
          code: `<Select size="sm" label="Role" placeholder="Select…">
  …
</Select>`,
          node: (
            <Select size='sm' label='Role' placeholder='Select…'>
              <RoleOptions />
            </Select>
          ),
        },
        {
          label: 'Large',
          code: `<Select size="lg" label="Role" placeholder="Select…">
  …
</Select>`,
          node: (
            <Select size='lg' label='Role' placeholder='Select…'>
              <RoleOptions />
            </Select>
          ),
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

const fieldDecorator = [
  (Story: React.ComponentType) => (
    <div className='w-[min(480px,calc(100vw-32px))]'>
      <Story />
    </div>
  ),
];

export const Default: Story = {
  decorators: fieldDecorator,
  args: { placeholder: 'Select a role…', children: <RoleOptions /> },
};

export const WithLabel: Story = {
  decorators: fieldDecorator,
  args: { label: 'Role', placeholder: 'Select a role…', children: <RoleOptions /> },
};

export const WithHelperText: Story = {
  decorators: fieldDecorator,
  args: {
    label: 'Role',
    placeholder: 'Select a role…',
    helperText: 'Determines which features you can access.',
    children: <RoleOptions />,
  },
};

export const ErrorState: Story = {
  decorators: fieldDecorator,
  args: {
    label: 'Role',
    error: true,
    placeholder: 'Select a role…',
    helperText: 'Please select a role to continue.',
    children: <RoleOptions />,
  },
};

export const SuccessState: Story = {
  decorators: fieldDecorator,
  args: {
    label: 'Role',
    success: true,
    defaultValue: 'engineer',
    helperText: 'Selection saved.',
    children: <RoleOptions />,
  },
};

export const Required: Story = {
  decorators: fieldDecorator,
  args: { label: 'Role', placeholder: 'Select a role…', required: true, children: <RoleOptions /> },
};

export const Disabled: Story = {
  decorators: fieldDecorator,
  args: {
    label: 'Role',
    disabled: true,
    defaultValue: 'designer',
    helperText: 'Contact your admin to change this.',
    children: <RoleOptions />,
  },
};

export const Small: Story = {
  decorators: fieldDecorator,
  args: { size: 'sm', label: 'Role', placeholder: 'Select…', children: <RoleOptions /> },
};

export const Large: Story = {
  decorators: fieldDecorator,
  args: { size: 'lg', label: 'Role', placeholder: 'Select…', children: <RoleOptions /> },
};
