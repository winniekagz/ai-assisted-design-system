import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Dashboard', href: '#' },
      { label: 'Audits', href: '#' },
      { label: 'Token compliance' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
