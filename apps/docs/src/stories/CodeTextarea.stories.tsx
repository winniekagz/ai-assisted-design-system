import * as React from 'react';
import { CodeTextarea } from '@/components/ui/code-textarea';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/CodeTextarea',
  component: CodeTextarea,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Monospace textarea designed for code input. Uses \`--font-mono\`, \`--bg-secondary\` background, and \`--border-focus\` focus ring. Disables spell-check automatically.

### When to use
- Collecting code snippets, JSON configs, or rule definitions from users.
- Displaying editable source code inside a form.
- For **read-only** code display prefer a \`<pre>\` block — CodeTextarea is for input.

### Usage
\`\`\`tsx
import { CodeTextarea } from 'componentiq';

<CodeTextarea label="Component source" placeholder="// paste your code here" />

// Uncontrolled with default value
<CodeTextarea
  label="Token overrides"
  defaultValue='{ "color": { "primary": "#8D493A" } }'
/>

// Controlled
const [code, setCode] = useState('');
<CodeTextarea label="Rule" value={code} onChange={e => setCode(e.target.value)} />
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`label\` | ReactNode | — | Visible label linked to the textarea |
| \`placeholder\` | string | — | Hint shown when the field is empty |
| \`readOnly\` | boolean | false | Prevent edits while showing the value |
| \`disabled\` | boolean | false | Prevents interaction |
| \`rows\` | number | — | Initial visible row count |
| All \`<textarea>\` HTML attrs | — | — | Forwarded to the underlying element |
      `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => <div className='w-[min(640px,calc(100vw-32px))]'><Story /></div>,
  ],
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label linked to the textarea.',
      table: { type: { summary: 'ReactNode' } },
    },
    placeholder: {
      control: 'text',
      description: 'Hint shown when the field is empty.',
      table: { type: { summary: 'string' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Prevent edits while showing the value.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
  },
  args: {
    label: 'Source code',
    defaultValue: `function Button() {\n  return <button className="bg-primary">Save</button>;\n}`,
  },
} satisfies Meta<typeof CodeTextarea>;

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
    <VariantShowcase title='CodeTextarea' variants={[
      {
        label: 'With label',
        code: `<CodeTextarea label="Source code" defaultValue="function Button() { … }" />`,
        node: <CodeTextarea label='Source code' defaultValue={`function Button() {\n  return <button>Save</button>;\n}`} />,
      },
      {
        label: 'Placeholder',
        code: `<CodeTextarea label="Token overrides" placeholder="// paste JSON here" />`,
        node: <CodeTextarea label='Token overrides' placeholder='// paste JSON here' />,
      },
      {
        label: 'Read-only',
        code: `<CodeTextarea label="Generated output" readOnly defaultValue="const x = 42;" />`,
        node: <CodeTextarea label='Generated output' readOnly defaultValue='const x = 42;' />,
      },
      {
        label: 'Disabled',
        code: `<CodeTextarea label="Locked" disabled defaultValue="// locked" />`,
        node: <CodeTextarea label='Locked' disabled defaultValue='// locked' />,
      },
    ]} />
  ),
  parameters: { layout: 'padded' },
  decorators: [Story => <div className='w-full max-w-3xl'><Story /></div>],
};

export const Default: Story = {};
export const ReadOnly: Story = { args: { readOnly: true }, parameters: { docs: { description: { story: 'Use `readOnly` to display code without allowing edits.' } } } };
export const Placeholder: Story = { args: { label: 'Token overrides', defaultValue: undefined, placeholder: '// paste your JSON overrides here' } };
export const Disabled: Story = { args: { disabled: true } };
