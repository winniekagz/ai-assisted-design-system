import * as React from 'react';
import { Textarea } from '@/components/ui/form-fields/textarea';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MessageSquare, Send } from 'lucide-react';

const meta = {
  title: 'Components/FormFields/Textarea',
  component: Textarea,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Token-driven multi-line text input. Supports validation states, size variants, optional icons, and an auto-grow mode that expands as the user types.

### When to use
- Collecting descriptions, notes, comments, or any input expected to exceed one line.
- Use **Input** for single-line values (email, search, name).
- Pair with a visible \`<label>\` — placeholder text alone is not sufficient.

### Usage
\`\`\`tsx
import { Textarea } from '@winniekagendo/componentiq';

// Basic
<label>Notes<Textarea placeholder="Add notes…" rows={4} /></label>

// Validation states
<Textarea error placeholder="This field has an error" />
<Textarea success placeholder="Looks good" />

// Auto-grow
<Textarea autoGrow placeholder="Expands as you type…" />

// With icon
<Textarea startIcon={<MessageSquare className="size-4" />} placeholder="Message" />
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`variant\` | \`"default" \\| "error" \\| "success"\` | "default" | Border colour |
| \`size\` | \`"sm" \\| "default" \\| "lg"\` | "default" | Height and font size |
| \`error\` | boolean | false | Shorthand for \`variant="error"\` |
| \`success\` | boolean | false | Shorthand for \`variant="success"\` |
| \`autoGrow\` | boolean | false | Height expands with content |
| \`rows\` | number | — | Initial visible row count |
| \`startIcon\` | ReactNode | — | Left adornment icon |
| \`endIcon\` | ReactNode | — | Right adornment icon |
| \`disabled\` | boolean | false | Prevents interaction |
| \`readOnly\` | boolean | false | Shows value, prevents editing |
      `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'error', 'success'],
      description: 'Border colour variant.',
      table: { type: { summary: "'default' | 'error' | 'success'" }, defaultValue: { summary: "'default'" } },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: 'Height and font size.',
      table: { type: { summary: "'sm' | 'default' | 'lg'" }, defaultValue: { summary: "'default'" } },
    },
    error: {
      control: 'boolean',
      description: 'Shorthand for `variant="error"` — red border.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    success: {
      control: 'boolean',
      description: 'Shorthand for `variant="success"` — green border.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    autoGrow: {
      control: 'boolean',
      description: 'Textarea height expands as content grows.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    rows: {
      control: { type: 'number', min: 1 },
      description: 'Initial visible row count.',
      table: { type: { summary: 'number' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    placeholder: {
      control: 'text',
      description: 'Hint text shown when empty.',
      table: { type: { summary: 'string' } },
    },
    startIcon: { control: false, table: { type: { summary: 'ReactNode' } } },
    endIcon:   { control: false, table: { type: { summary: 'ReactNode' } } },
  },
  args: { placeholder: 'Enter your text here…' },
} satisfies Meta<typeof Textarea>;

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
            <div className='w-full' onClick={e => e.stopPropagation()}>{v.node}</div>
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
    <VariantShowcase title='Textarea' variants={[
      { label: 'Default', code: `<Textarea placeholder="Enter your message…" />`, node: <Textarea placeholder='Enter your message…' /> },
      { label: 'Error', code: `<Textarea error placeholder="This field has an error" />`, node: <Textarea error placeholder='This field has an error' /> },
      { label: 'Success', code: `<Textarea success placeholder="Looks good" />`, node: <Textarea success placeholder='Looks good' /> },
      { label: 'Disabled', code: `<Textarea disabled placeholder="Disabled" />`, node: <Textarea disabled placeholder='Disabled' /> },
      { label: 'Small', code: `<Textarea size="sm" placeholder="Small textarea" />`, node: <Textarea size='sm' placeholder='Small textarea' /> },
      { label: 'Large', code: `<Textarea size="lg" placeholder="Large textarea" />`, node: <Textarea size='lg' placeholder='Large textarea' /> },
      { label: 'Auto-grow', code: `<Textarea autoGrow placeholder="Grows as you type…" />`, node: <Textarea autoGrow placeholder='Grows as you type…' /> },
      { label: 'With start icon', code: `<Textarea startIcon={<MessageSquare />} placeholder="Message…" />`, node: <Textarea startIcon={<MessageSquare className='size-4' />} placeholder='Message…' /> },
      { label: 'With end icon', code: `<Textarea endIcon={<Send />} placeholder="Type and send…" />`, node: <Textarea endIcon={<Send className='size-4' />} placeholder='Type and send…' /> },
    ]} />
  ),
  parameters: { layout: 'padded' },
  decorators: [Story => <div className='w-full max-w-3xl'><Story /></div>],
};

const fieldDecorator = [(Story: React.ComponentType) => <div className='w-[min(480px,calc(100vw-32px))]'><Story /></div>];

export const Default: Story = { decorators: fieldDecorator, args: { placeholder: 'Enter your message…' } };
export const ErrorState: Story = { decorators: fieldDecorator, args: { error: true, placeholder: 'This field has an error' } };
export const SuccessState: Story = { decorators: fieldDecorator, args: { success: true, defaultValue: 'Looks good.' } };
export const Disabled: Story = { decorators: fieldDecorator, args: { disabled: true, placeholder: 'Disabled textarea' } };
export const Small: Story = { decorators: fieldDecorator, args: { size: 'sm', placeholder: 'Small textarea' } };
export const Large: Story = { decorators: fieldDecorator, args: { size: 'lg', placeholder: 'Large textarea' } };
export const AutoGrow: Story = {
  decorators: fieldDecorator,
  args: { autoGrow: true, placeholder: 'Grows as you type…' },
  parameters: { docs: { description: { story: 'Height expands automatically as content exceeds the initial row count.' } } },
};
export const WithIcons: Story = {
  decorators: fieldDecorator,
  args: { startIcon: <MessageSquare className='size-4' />, endIcon: <Send className='size-4' />, placeholder: 'Message…' },
};
