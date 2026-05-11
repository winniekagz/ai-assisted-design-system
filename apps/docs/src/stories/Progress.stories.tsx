import { Progress } from '@/components/ui/progress';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className='w-[min(420px,calc(100vw-32px))]'>
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Audit progress',
    value: 68,
    showValue: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Complete: Story = {
  args: {
    value: 100,
  },
};
