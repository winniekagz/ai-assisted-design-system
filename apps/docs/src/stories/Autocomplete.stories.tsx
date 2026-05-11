'use client';

import * as React from 'react';
import { Autocomplete } from '@/components/ui/form-fields/autocomplete';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

// ---------------------------------------------------------------------------
// Shared option fixtures
// ---------------------------------------------------------------------------
const frameworkOptions = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
];

const skillOptions = [
  { value: 'js', label: 'JavaScript' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'react', label: 'React' },
  { value: 'node', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'graphql', label: 'GraphQL' },
];

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
  title: 'Components/FormFields/Autocomplete',
  component: Autocomplete,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Filterable combobox that supports both single selection and multi-select (chips). Type to narrow results, click or press **Enter** to select, press **Escape** to close.

### When to use
- Choosing from a list of **more than ~15 items** or when users benefit from typing to filter.
- **Multi-select** when multiple simultaneous values are valid (e.g. skills, tags, team members).
- For short, static lists use **Select** — it is simpler and has native browser behaviour.

### Single selection
\`\`\`tsx
import { Autocomplete } from '@winniekagendo/componentiq';

// Uncontrolled (use defaultValue)
<Autocomplete
  label="Framework"
  placeholder="Search…"
  options={frameworkOptions}
  defaultValue="react"
/>

// Controlled
const [val, setVal] = useState('');
<Autocomplete
  label="Framework"
  value={val}
  onChange={setVal}
  options={frameworkOptions}
/>
\`\`\`

### Multi-select
\`\`\`tsx
const [values, setValues] = useState<string[]>([]);
<Autocomplete
  label="Skills"
  multiple
  selectedValues={values}
  onSelectedValuesChange={setValues}
  options={skillOptions}
/>
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`options\` | \`{ value: string; label: string }[]\` | **required** | The full option list |
| \`label\` | string | — | Visible label above the input |
| \`placeholder\` | string | — | Input placeholder text |
| \`helperText\` | string | — | Hint below the field |
| \`error\` | boolean | false | Red border + helper text |
| \`success\` | boolean | false | Green border + helper text |
| \`required\` | boolean | false | Adds \`*\` to label |
| \`size\` | \`"sm" \\| "default" \\| "lg"\` | "default" | Height: 36 / 44 / 48 px |
| \`disabled\` | boolean | false | Disables the field |
| \`multiple\` | boolean | false | Enables multi-select chip mode |
| \`value\` | string | — | Controlled single value |
| \`onChange\` | \`(val: string) => void\` | — | Single value change handler |
| \`selectedValues\` | string[] | — | Controlled multi values |
| \`onSelectedValuesChange\` | \`(vals: string[]) => void\` | — | Multi value change handler |

### Keyboard navigation
| Key | Action |
|-----|--------|
| ↑ / ↓ | Move through options |
| Enter | Select focused option |
| Escape | Close dropdown |
| Backspace | Remove last chip (multi mode) |
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label rendered above the input.',
      table: { type: { summary: 'string' } },
    },
    placeholder: {
      control: 'text',
      description: 'Input placeholder text shown when empty.',
      table: { type: { summary: 'string' } },
    },
    helperText: {
      control: 'text',
      description: 'Hint or validation message below the field.',
      table: { type: { summary: 'string' } },
    },
    error: {
      control: 'boolean',
      description: 'Error state — red border + `aria-invalid`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    success: {
      control: 'boolean',
      description: 'Success state — green border.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    required: {
      control: 'boolean',
      description: 'Marks the field required. Appends `*` to the label.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: 'Height: sm = 36 px, default = 44 px, lg = 48 px.',
      table: { type: { summary: "'sm' | 'default' | 'lg'" }, defaultValue: { summary: "'default'" } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the combobox.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    multiple: {
      control: 'boolean',
      description: 'Enables multi-select chip mode. Use `selectedValues` + `onSelectedValuesChange` when controlled.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    options: { table: { disable: true } },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
    selectedValues: { table: { disable: true } },
    onSelectedValuesChange: { table: { disable: true } },
    variant: { table: { disable: true } },
  },
  args: {
    options: frameworkOptions,
    placeholder: 'Search frameworks…',
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// AllVariants — interactive showcase
// ---------------------------------------------------------------------------
export const AllVariants: Story = {
  render: () => (
    <VariantShowcase
      title='Autocomplete'
      variants={[
        {
          label: 'Default',
          code: `<Autocomplete
  label="Framework"
  placeholder="Search frameworks…"
  options={options}
/>`,
          node: (
            <Autocomplete
              label='Framework'
              placeholder='Search frameworks…'
              options={frameworkOptions}
            />
          ),
        },
        {
          label: 'With helper text',
          code: `<Autocomplete
  label="Framework"
  placeholder="Search…"
  helperText="Choose your primary framework."
  options={options}
/>`,
          node: (
            <Autocomplete
              label='Framework'
              placeholder='Search…'
              helperText='Choose your primary framework.'
              options={frameworkOptions}
            />
          ),
        },
        {
          label: 'Error',
          code: `<Autocomplete
  label="Framework"
  error
  placeholder="Search…"
  helperText="Please select a framework."
  options={options}
/>`,
          node: (
            <Autocomplete
              label='Framework'
              error
              placeholder='Search…'
              helperText='Please select a framework.'
              options={frameworkOptions}
            />
          ),
        },
        {
          label: 'Success',
          code: `<Autocomplete
  label="Framework"
  success
  defaultValue="react"
  helperText="Great choice!"
  options={options}
/>`,
          node: (
            <Autocomplete
              label='Framework'
              success
              defaultValue='react'
              helperText='Great choice!'
              options={frameworkOptions}
            />
          ),
        },
        {
          label: 'Required',
          code: `<Autocomplete
  label="Framework"
  placeholder="Search…"
  required
  options={options}
/>`,
          node: (
            <Autocomplete
              label='Framework'
              placeholder='Search…'
              required
              options={frameworkOptions}
            />
          ),
        },
        {
          label: 'Disabled',
          code: `<Autocomplete
  label="Framework"
  disabled
  defaultValue="react"
  options={options}
/>`,
          node: (
            <Autocomplete
              label='Framework'
              disabled
              defaultValue='react'
              options={frameworkOptions}
            />
          ),
        },
        {
          label: 'Small',
          code: `<Autocomplete size="sm" label="Framework" placeholder="Search…" options={options} />`,
          node: (
            <Autocomplete
              size='sm'
              label='Framework'
              placeholder='Search…'
              options={frameworkOptions}
            />
          ),
        },
        {
          label: 'Large',
          code: `<Autocomplete size="lg" label="Framework" placeholder="Search…" options={options} />`,
          node: (
            <Autocomplete
              size='lg'
              label='Framework'
              placeholder='Search…'
              options={frameworkOptions}
            />
          ),
        },
        {
          label: 'Multi-select (empty)',
          code: `<Autocomplete
  label="Skills"
  multiple
  placeholder="Select skills…"
  options={skillOptions}
/>`,
          node: (
            <Autocomplete
              label='Skills'
              multiple
              placeholder='Select skills…'
              options={skillOptions}
            />
          ),
        },
        {
          label: 'Multi-select (pre-filled)',
          code: `<Autocomplete
  label="Skills"
  multiple
  selectedValues={['ts', 'react', 'node']}
  placeholder="Select skills…"
  options={skillOptions}
/>`,
          node: (
            <Autocomplete
              label='Skills'
              multiple
              selectedValues={['ts', 'react', 'node']}
              placeholder='Select skills…'
              options={skillOptions}
            />
          ),
        },
        {
          label: 'Multi-select error',
          code: `<Autocomplete
  label="Skills"
  multiple
  error
  helperText="Select at least one skill."
  options={skillOptions}
/>`,
          node: (
            <Autocomplete
              label='Skills'
              multiple
              error
              helperText='Select at least one skill.'
              options={skillOptions}
            />
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
  args: { label: 'Framework', placeholder: 'Search frameworks…' },
};

export const WithHelperText: Story = {
  decorators: fieldDecorator,
  args: {
    label: 'Framework',
    placeholder: 'Search frameworks…',
    helperText: 'Choose your primary frontend framework.',
  },
};

export const ErrorState: Story = {
  decorators: fieldDecorator,
  args: {
    label: 'Framework',
    error: true,
    placeholder: 'Search frameworks…',
    helperText: 'Please select a framework to continue.',
  },
};

export const SuccessState: Story = {
  decorators: fieldDecorator,
  args: { label: 'Framework', success: true, defaultValue: 'react', helperText: 'Great choice!' },
};

export const Required: Story = {
  decorators: fieldDecorator,
  args: { label: 'Framework', placeholder: 'Search frameworks…', required: true },
};

export const Disabled: Story = {
  decorators: fieldDecorator,
  args: { label: 'Framework', disabled: true, defaultValue: 'react', helperText: 'Contact your admin to change this.' },
};

export const Small: Story = {
  decorators: fieldDecorator,
  args: { size: 'sm', label: 'Framework', placeholder: 'Search…' },
};

export const Large: Story = {
  decorators: fieldDecorator,
  args: { size: 'lg', label: 'Framework', placeholder: 'Search…' },
};

export const MultiSelect: Story = {
  args: {
    label: 'Skills',
    multiple: true,
    placeholder: 'Select skills…',
    options: skillOptions,
    helperText: 'Select all skills that apply.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use `multiple` with `selectedValues` + `onSelectedValuesChange` for controlled multi-select. Type to filter, click to add, click the × chip to remove.',
      },
    },
  },
};

export const MultiSelectPreFilled: Story = {
  args: {
    label: 'Skills',
    multiple: true,
    selectedValues: ['ts', 'react', 'node'],
    placeholder: 'Select skills…',
    options: skillOptions,
  },
  parameters: {
    docs: {
      description: {
        story: 'Pass `selectedValues` to pre-select items. Each chip shows a remove (×) button.',
      },
    },
  },
};
