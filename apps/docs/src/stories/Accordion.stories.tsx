import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Trash2 } from 'lucide-react';

import { Accordion } from '@/components/ui/accordion';

const faqItems = [
  {
    id: 'trial',
    title: 'Accordion Title',
    startIcon: (
      <Trash2
        className='size-[var(--spacing-sm)]'
        strokeWidth='var(--stroke-md)'
      />
    ),
    content:
      'This is the body of the accordion, you can insert your accordion text content in this section.',
  },
  {
    id: 'plan',
    title: 'Accordion Title',
    startIcon: (
      <Trash2
        className='size-[var(--spacing-sm)]'
        strokeWidth='var(--stroke-md)'
      />
    ),
    content:
      'Yes. You can upgrade or downgrade your plan from billing settings. Changes are reflected in the next billing cycle.',
  },
  {
    id: 'cancellation',
    title: 'Accordion Title',
    startIcon: (
      <Trash2
        className='size-[var(--spacing-sm)]'
        strokeWidth='var(--stroke-md)'
      />
    ),
    content:
      'You can cancel at any time. Your workspace remains active until the end of the paid period.',
  },
  {
    id: 'invoice',
    title: 'Accordion Title',
    startIcon: (
      <Trash2
        className='size-[var(--spacing-sm)]'
        strokeWidth='var(--stroke-md)'
      />
    ),
    content:
      'Yes. Add billing details, tax IDs, and purchase order notes from your workspace billing profile.',
  },
  {
    id: 'billing',
    title: 'Accordion Title',
    startIcon: (
      <Trash2
        className='size-[var(--spacing-sm)]'
        strokeWidth='var(--stroke-md)'
      />
    ),
    content:
      'Plans are billed monthly or annually depending on your selected subscription.',
  },
  {
    id: 'email',
    title: 'Accordion Title',
    startIcon: (
      <Trash2
        className='size-[var(--spacing-sm)]'
        strokeWidth='var(--stroke-md)'
      />
    ),
    content:
      'Open account settings, update your email address, and confirm the change from the verification email.',
  },
  {
    id: 'affiliate',
    title: 'Accordion Title',
    startIcon: (
      <Trash2
        className='size-[var(--spacing-sm)]'
        strokeWidth='var(--stroke-md)'
      />
    ),
    content:
      'Affiliate programs are available for approved partners. Contact support to request access.',
  },
];

const meta: Meta<typeof Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Token-driven accordion built on Radix UI. Items render as surface cards; the expanded row uses surface tokens, hover uses the hover token, and text follows the title and paragraph type roles.

### When to use
- FAQ sections, settings panels, or any grouped content where users only need one section at a time.
- Prefer \`allowsMultipleExpanded\` only when users genuinely need to compare sections side-by-side.

### Usage
\`\`\`tsx
import { Accordion } from '@winniekagendo/componentiq';

const items = [
  { id: 'billing', title: 'How does billing work?', content: 'Plans are billed monthly or annually.' },
  { id: 'cancel',  title: 'Can I cancel?',           content: 'Yes, at any time from account settings.' },
];

<Accordion items={items} defaultExpandedKeys={['billing']} />
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`items\` | \`AccordionItem[]\` | **required** | Array of \`{ id, title, content, startIcon?, endIcon?, disabled? }\` |
| \`defaultExpandedKeys\` | \`Iterable<string>\` | — | Item ids open on first render (uncontrolled) |
| \`expandedKeys\` | \`Iterable<string>\` | — | Controlled open ids |
| \`onExpandedChange\` | \`(keys: Set<string>) => void\` | — | Fires when open ids change |
| \`allowsMultipleExpanded\` | boolean | false | Allow more than one item open at a time |
        `,
      },
    },
  },
  tags: ['autodocs'],
  args: {
    items: faqItems,
    defaultExpandedKeys: ['trial'],
  },
  argTypes: {
    items: {
      control: false,
      description: 'Accordion item data: id, title, content, startIcon, endIcon, and disabled.',
      table: { type: { summary: 'AccordionItem[]' } },
    },
    defaultExpandedKeys: {
      control: false,
      description: 'Item ids expanded on first render (uncontrolled).',
      table: { type: { summary: 'Iterable<string>' } },
    },
    expandedKeys: {
      control: false,
      description: 'Controlled open ids — pair with onExpandedChange.',
      table: { type: { summary: 'Iterable<string>' } },
    },
    allowsMultipleExpanded: {
      control: 'boolean',
      description: 'Allow more than one item to be open simultaneously.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onExpandedChange: {
      action: 'expanded changed',
      description: 'Called with the new Set of open item ids.',
      table: { type: { summary: '(keys: Set<string>) => void' } },
    },
  },
  decorators: [
    Story => (
      <div className='w-[min(600px,calc(100vw-32px))] mx-auto'>
        <Story />
      </div>
    ),
  ],
};

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
      <div className='grid grid-cols-1 gap-[var(--spacing-sm)] sm:grid-cols-2'>
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
            <div className='w-full' onClick={e => e.stopPropagation()}>{v.node}</div>
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
      title='Accordion'
      variants={[
        {
          label: 'Single open (default)',
          code: `<Accordion items={faqItems} defaultExpandedKeys={['trial']} />`,
          node: <Accordion items={faqItems} defaultExpandedKeys={['trial']} />,
        },
        {
          label: 'Multiple open',
          code: `<Accordion items={faqItems} allowsMultipleExpanded defaultExpandedKeys={['trial','plan']} />`,
          node: (
            <Accordion
              items={faqItems}
              allowsMultipleExpanded
              defaultExpandedKeys={['trial', 'plan']}
            />
          ),
        },
        {
          label: 'Compact (4 items)',
          code: `<Accordion items={faqItems.slice(0, 4)} />`,
          node: <Accordion items={faqItems.slice(0, 4)} />,
        },
        {
          label: 'With custom icon',
          code: `<Accordion items={[{ id:'trial', title:'Accordion Title', startIcon: <Trash2 />, content:'...' }]} />`,
          node: (
            <Accordion
              items={[
                {
                  id: 'trial',
                  title: 'Accordion Title',
                  startIcon: (
                    <Trash2
                      className='size-[var(--spacing-sm)]'
                      strokeWidth='var(--stroke-md)'
                    />
                  ),
                  content:
                    'This is the body of the accordion, you can insert your accordion text content in this section.',
                },
              ]}
              defaultExpandedKeys={['trial']}
            />
          ),
        },
      ]}
    />
  ),
  parameters: { layout: 'padded' },
  decorators: [
    Story => (
      <div className='w-full max-w-3xl mx-auto'>
        <Story />
      </div>
    ),
  ],
};

export const Default: Story = {};

export const MultipleOpen: Story = {
  args: {
    allowsMultipleExpanded: true,
    defaultExpandedKeys: ['trial', 'plan'],
  },
};

export const CompactContent: Story = {
  args: {
    items: faqItems.slice(0, 4),
    defaultExpandedKeys: ['trial'],
  },
};
