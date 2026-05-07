import type { Meta, StoryObj } from '@storybook/react';

import { Accordion } from '@/components/ui/accordion';

const faqItems = [
  {
    id: 'trial',
    title: 'Is there a free trial available?',
    content:
      "Yes, you can try us for free for 30 days. If you want, we'll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
  },
  {
    id: 'plan',
    title: 'Can I change my plan later?',
    content:
      'Yes. You can upgrade or downgrade your plan from billing settings. Changes are reflected in the next billing cycle.',
  },
  {
    id: 'cancellation',
    title: 'What is your cancellation policy?',
    content:
      'You can cancel at any time. Your workspace remains active until the end of the paid period.',
  },
  {
    id: 'invoice',
    title: 'Can other info be added to an invoice?',
    content:
      'Yes. Add billing details, tax IDs, and purchase order notes from your workspace billing profile.',
  },
  {
    id: 'billing',
    title: 'How does billing work?',
    content:
      'Plans are billed monthly or annually depending on your selected subscription.',
  },
  {
    id: 'email',
    title: 'How do I change my account email?',
    content:
      'Open account settings, update your email address, and confirm the change from the verification email.',
  },
  {
    id: 'affiliate',
    title: 'Do you have an affiliate program?',
    content:
      'Affiliate programs are available for approved partners. Contact support to request access.',
  },
];

const meta: Meta<typeof Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A reusable token-driven accordion built on HeroUI primitives. Expanded rows use surface tokens, panel bodies use background tokens, and text follows title and paragraph typography roles.',
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
      description: 'Accordion item data: id, title, content, and disabled.',
    },
    defaultExpandedKeys: {
      control: false,
      description: 'Initial expanded item ids.',
    },
    expandedKeys: {
      control: false,
      description: 'Controlled expanded item ids.',
    },
    onExpandedChange: {
      action: 'expanded changed',
      description: 'Called when expanded item ids change.',
    },
  },
  decorators: [
    Story => (
      <div className='w-[min(520px,calc(100vw-32px))]'>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

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
