import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Activity, Bot, HeartPulse, Salad, User } from 'lucide-react';
import { ReusableTabs } from 'componentiq';

const productTabs = [
  { value: 'dashboard', label: 'Dashboard', content: 'Dashboard overview' },
  { value: 'settings', label: 'Settings', content: 'Account settings' },
  { value: 'payment', label: 'Payment', content: 'Payment methods' },
  { value: 'subscription', label: 'Subscription', content: 'Plan details' },
  {
    value: 'user',
    label: 'User',
    icon: <User />,
    badge: 12,
    content: 'User queue',
  },
];

const timeTabs = [
  { value: 'day', label: '1 day', content: 'Daily metrics' },
  { value: 'week', label: '1 week', content: 'Weekly metrics' },
  { value: 'month', label: '1 month', content: 'Monthly metrics' },
  { value: 'year', label: '1 year', content: 'Yearly metrics' },
  { value: 'all', label: 'All Time', content: 'All-time metrics' },
];

const healthTabs = [
  {
    value: 'health',
    label: 'Health Metrics',
    icon: <HeartPulse />,
    badge: 2,
    content: 'Health metric trends',
  },
  {
    value: 'activity',
    label: 'Activity',
    icon: <Activity />,
    content: 'Activity feed',
  },
  {
    value: 'nutrition',
    label: 'Nutrition',
    icon: <Salad />,
    content: 'Nutrition plan',
  },
  {
    value: 'assistant',
    label: 'AI Assistant',
    icon: <Bot />,
    content: 'Assistant insights',
  },
  {
    value: 'profile',
    label: 'Profile',
    icon: <User />,
    content: 'Profile details',
  },
];

const meta = {
  title: 'Components/Tabs',
  component: ReusableTabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Responsive tab navigation built on Radix Tabs. The list stays on one row and scrolls horizontally when there are more tabs than the viewport can fit.

### When to use
- Switch between peer views on the same page, such as Dashboard, Settings, and Payment.
- Filter a dense view by time period or category.
- Keep mobile layouts stable by allowing horizontal scrolling instead of wrapping tabs.

### Usage
\`\`\`tsx
import { ReusableTabs } from 'componentiq';
import { User } from 'lucide-react';

<ReusableTabs
  variant="pill"
  defaultValue="dashboard"
  items={[
    { value: 'dashboard', label: 'Dashboard', content: <Dashboard /> },
    { value: 'settings', label: 'Settings', content: <Settings /> },
    {
      value: 'user',
      label: 'User',
      icon: <User />,
      badge: 12,
      content: <UserQueue />,
    },
  ]}
/>
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`variant\` | \`"pill" \\| "segmented" \\| "underline" \\| "underlined" \\| "outlined" \\| "contained" \\| "rounded"\` | "underlined" | Visual treatment |
| \`size\` | \`"sm" \\| "default" \\| "lg"\` | "default" | Trigger height and padding |
| \`items\` | \`TabItem[]\` | — | Tabs to render |
| \`scrollable\` | boolean | true | Enables horizontal overflow for narrow screens |
| \`defaultValue\` | string | first item | Initially selected tab |
| \`triggerClassName\` | string | — | Extra classes for every trigger |
| \`listClassName\` | string | — | Extra classes for the list |
| \`contentClassName\` | string | — | Extra classes for tab panels |

### Tab item
\`{ value, label, content?, icon?, badge?, disabled? }\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'pill',
        'segmented',
        'underline',
        'underlined',
        'outlined',
        'contained',
        'rounded',
      ],
      description: 'Visual treatment for the tab list and triggers.',
      table: {
        type: {
          summary:
            "'pill' | 'segmented' | 'underline' | 'underlined' | 'outlined' | 'contained' | 'rounded'",
        },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
      description: 'Trigger height and horizontal padding.',
      table: {
        type: { summary: "'sm' | 'default' | 'lg'" },
        defaultValue: { summary: "'default'" },
      },
    },
    scrollable: {
      control: 'boolean',
      description: 'Keep tabs on one row and allow horizontal scrolling.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    items: {
      control: false,
      description:
        'Tab definitions with value, label, optional icon, badge, disabled state, and content.',
    },
    defaultValue: {
      control: 'text',
      description: 'Initial selected tab value.',
    },
  },
  args: {
    variant: 'pill',
    size: 'lg',
    defaultValue: 'user',
    items: productTabs,
  },
} satisfies Meta<typeof ReusableTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className='rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-[var(--spacing-md)] text-sm text-[color:var(--text-secondary)]'>
      {children}
    </div>
  );
}

export const Pill: Story = {
  args: {
    variant: 'pill',
    size: 'lg',
    defaultValue: 'user',
    items: productTabs.map(item => ({
      ...item,
      content: <Panel>{item.content}</Panel>,
    })),
  },
};

export const Segmented: Story = {
  args: {
    variant: 'segmented',
    size: 'lg',
    defaultValue: 'day',
    items: timeTabs.map(item => ({
      ...item,
      content: <Panel>{item.content}</Panel>,
    })),
  },
};

export const UnderlineWithBadges: Story = {
  args: {
    variant: 'underline',
    defaultValue: 'health',
    items: healthTabs.map(item => ({
      ...item,
      content: <Panel>{item.content}</Panel>,
    })),
  },
};

export const ResponsiveScrolling: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story:
          'The tab list keeps all triggers on a single line. On mobile or in narrow containers, users can scroll horizontally instead of the tabs wrapping.',
      },
    },
  },
  render: () => (
    <div className='w-[320px] max-w-full rounded-[var(--radius-md)] border border-dashed border-[color:var(--border-subtle)] p-[var(--spacing-sm)]'>
      <ReusableTabs
        variant='pill'
        size='lg'
        defaultValue='dashboard'
        items={productTabs.map(item => ({
          ...item,
          content: <Panel>{item.content}</Panel>,
        }))}
      />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className='grid gap-[var(--spacing-lg)]'>
      <ReusableTabs
        variant='pill'
        size='lg'
        defaultValue='user'
        items={productTabs.map(item => ({
          ...item,
          content: <Panel>{item.content}</Panel>,
        }))}
      />
      <ReusableTabs
        variant='segmented'
        size='lg'
        defaultValue='day'
        items={timeTabs.map(item => ({
          ...item,
          content: <Panel>{item.content}</Panel>,
        }))}
      />
      <ReusableTabs
        variant='underline'
        defaultValue='health'
        items={healthTabs.map(item => ({
          ...item,
          content: <Panel>{item.content}</Panel>,
        }))}
      />
    </div>
  ),
};
