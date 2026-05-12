import * as React from 'react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Token-driven breadcrumb trail. The last segment renders as the current page (no link); preceding segments are links with a primary-colour hover.

### When to use
- Three or more levels of hierarchy where users need to navigate back without the browser Back button.
- Omit on top-level pages — a single-item breadcrumb adds noise without value.

### Usage
\`\`\`tsx
import { Breadcrumbs } from '@winniekagendo/componentiq';

<Breadcrumbs
  items={[
    { label: 'Home',     href: '/' },
    { label: 'Settings', href: '/settings' },
    { label: 'Billing' },
  ]}
/>
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`items\` | \`BreadcrumbItem[]\` | **required** | Array of \`{ label, href? }\` — last item is current page |
| \`className\` | string | — | Extra classes on the outer \`<nav>\` |

### Accessibility
- Renders as \`<nav aria-label="Breadcrumb">\` with an inner \`<ol>\`.
- Last item gets \`aria-current="page"\`. Separator chevrons are \`aria-hidden\`.
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => <div className='w-[min(560px,calc(100vw-32px))]'><Story /></div>,
  ],
  argTypes: {
    items: {
      control: false,
      description: 'Array of `{ label, href? }` segments. Last item is always the current page.',
      table: { type: { summary: 'BreadcrumbItem[]' } },
    },
    className: {
      control: 'text',
      description: 'Extra classes on the outer `<nav>` element.',
      table: { type: { summary: 'string' } },
    },
  },
  args: {
    items: [
      { label: 'Dashboard', href: '#' },
      { label: 'Components', href: '#' },
      { label: 'Breadcrumbs' },
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;

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
    <VariantShowcase title='Breadcrumbs' variants={[
      {
        label: '3 levels (default)',
        code: `<Breadcrumbs items={[\n  { label: 'Dashboard', href: '#' },\n  { label: 'Settings', href: '#' },\n  { label: 'Billing' },\n]} />`,
        node: <Breadcrumbs items={[{ label: 'Dashboard', href: '#' }, { label: 'Settings', href: '#' }, { label: 'Billing' }]} />,
      },
      {
        label: '2 levels',
        code: `<Breadcrumbs items={[\n  { label: 'Home', href: '#' },\n  { label: 'Components' },\n]} />`,
        node: <Breadcrumbs items={[{ label: 'Home', href: '#' }, { label: 'Components' }]} />,
      },
      {
        label: '4 levels',
        code: `<Breadcrumbs items={[\n  { label: 'Home', href: '#' },\n  { label: 'Docs', href: '#' },\n  { label: 'Forms', href: '#' },\n  { label: 'Input' },\n]} />`,
        node: <Breadcrumbs items={[{ label: 'Home', href: '#' }, { label: 'Docs', href: '#' }, { label: 'Forms', href: '#' }, { label: 'Input' }]} />,
      },
      {
        label: 'Long labels',
        code: `<Breadcrumbs items={[\n  { label: 'Component Library', href: '#' },\n  { label: 'Design tokens', href: '#' },\n  { label: 'Color contract' },\n]} />`,
        node: <Breadcrumbs items={[{ label: 'Component Library', href: '#' }, { label: 'Design tokens', href: '#' }, { label: 'Color contract' }]} />,
      },
    ]} />
  ),
  parameters: { layout: 'padded' },
  decorators: [Story => <div className='w-full max-w-2xl'><Story /></div>],
};

export const Default: Story = {};
export const TwoLevels: Story = { args: { items: [{ label: 'Home', href: '#' }, { label: 'Dashboard' }] } };
export const FourLevels: Story = {
  args: { items: [{ label: 'Home', href: '#' }, { label: 'Docs', href: '#' }, { label: 'Components', href: '#' }, { label: 'Button' }] },
};
