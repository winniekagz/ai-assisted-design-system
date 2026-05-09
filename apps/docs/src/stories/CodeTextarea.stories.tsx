import { CodeTextarea } from '@/components/ui/code-textarea';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CodeTextarea> = {
  title: 'UI/Code Textarea',
  component: CodeTextarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className='w-[min(640px,calc(100vw-32px))]'>
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Source code',
    defaultValue: `function Button() {
  return <button className="bg-primary">Save</button>;
}`,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
  },
};
