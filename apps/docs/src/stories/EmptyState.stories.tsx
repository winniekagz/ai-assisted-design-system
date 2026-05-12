import * as React from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { FileSearch, Inbox, Plus, Search, Users } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Placeholder shown when a list, table, or data view has no content. Centers an icon, title, description, and optional CTA inside a dashed-border panel.

### When to use
- Replacing a list or table when there are no items to display.
- After applying a filter that returns zero results.
- Keep the message actionable — always tell users what to do next.
- Do **not** show an empty state while data is still loading — use a skeleton instead.

### Usage
\`\`\`tsx
import { EmptyState } from '@winniekagendo/componentiq';
import { Inbox } from 'lucide-react';

<EmptyState
  icon={<Inbox />}
  title="No messages"
  description="New messages will appear here."
  actionLabel="Compose"
  onAction={openCompose}
/>
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`title\` | ReactNode | **required** | Short heading describing the empty context |
| \`icon\` | ReactNode | — | Decorative icon centred above the title |
| \`description\` | ReactNode | — | Supplemental copy with guidance |
| \`actionLabel\` | string | — | CTA button label |
| \`onAction\` | () => void | — | CTA click handler |
      `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => <div className='w-[min(480px,calc(100vw-32px))]'><Story /></div>,
  ],
  argTypes: {
    title: {
      control: 'text',
      description: 'Short heading describing the empty context.',
      table: { type: { summary: 'ReactNode' } },
    },
    description: {
      control: 'text',
      description: 'Supplemental copy with guidance or next steps.',
      table: { type: { summary: 'ReactNode' } },
    },
    actionLabel: {
      control: 'text',
      description: 'CTA button label. Requires `onAction` to be clickable.',
      table: { type: { summary: 'string' } },
    },
    icon: { control: false, description: 'Decorative icon above the title.', table: { type: { summary: 'ReactNode' } } },
    onAction: { table: { disable: true } },
  },
  args: {
    icon: <Search className='size-[var(--spacing-lg)]' strokeWidth='var(--stroke-md)' />,
    title: 'No issues found',
    description: 'Try changing the filters or running a new audit.',
    actionLabel: 'Run audit',
  },
} satisfies Meta<typeof EmptyState>;

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
    <VariantShowcase title='EmptyState' variants={[
      {
        label: 'With icon and CTA',
        code: `<EmptyState\n  icon={<Inbox />}\n  title="No messages"\n  description="New messages appear here."\n  actionLabel="Compose"\n  onAction={() => {}}\n/>`,
        node: <EmptyState icon={<Inbox className='size-[var(--spacing-lg)]' />} title='No messages' description='New messages will appear here.' actionLabel='Compose' onAction={() => {}} />,
      },
      {
        label: 'Search / filter result',
        code: `<EmptyState\n  icon={<Search />}\n  title="No results"\n  description="Try a different search term."\n/>`,
        node: <EmptyState icon={<Search className='size-[var(--spacing-lg)]' />} title='No results' description='Try a different search term or clear the filters.' />,
      },
      {
        label: 'No team members',
        code: `<EmptyState\n  icon={<Users />}\n  title="No team members"\n  description="Invite people to collaborate."\n  actionLabel="Invite"\n  onAction={() => {}}\n/>`,
        node: <EmptyState icon={<Users className='size-[var(--spacing-lg)]' />} title='No team members' description='Invite people to collaborate on this project.' actionLabel='Invite' onAction={() => {}} />,
      },
      {
        label: 'Title only',
        code: `<EmptyState title="Nothing here yet" />`,
        node: <EmptyState title='Nothing here yet' />,
      },
      {
        label: 'No action',
        code: `<EmptyState\n  icon={<FileSearch />}\n  title="No audit results"\n  description="Run an audit to see results here."\n/>`,
        node: <EmptyState icon={<FileSearch className='size-[var(--spacing-lg)]' />} title='No audit results' description='Run an audit to see results here.' />,
      },
      {
        label: 'Create first item',
        code: `<EmptyState\n  icon={<Plus />}\n  title="No components yet"\n  description="Add your first component."\n  actionLabel="Add component"\n  onAction={() => {}}\n/>`,
        node: <EmptyState icon={<Plus className='size-[var(--spacing-lg)]' />} title='No components yet' description='Add your first component to get started.' actionLabel='Add component' onAction={() => {}} />,
      },
    ]} />
  ),
  parameters: { layout: 'padded' },
  decorators: [Story => <div className='w-full max-w-3xl'><Story /></div>],
};

export const Default: Story = {};
export const WithoutAction: Story = { args: { actionLabel: undefined, onAction: undefined } };
export const TitleOnly: Story = { args: { icon: undefined, title: 'Nothing here yet', description: undefined, actionLabel: undefined } };
