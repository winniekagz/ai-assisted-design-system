import type { Meta, StoryObj } from '@storybook/react';
import { BadgeDemo } from '@/components/examples/badge-demo';

const meta = {
  title: 'Examples/Badge Demo',
  component: BadgeDemo,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BadgeDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
