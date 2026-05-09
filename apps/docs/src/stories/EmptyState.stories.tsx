import { EmptyState } from '@/components/ui/empty-state';
import { Search } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof EmptyState> = {
  title: 'UI/Empty State',
  component: EmptyState,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    icon: (
      <Search
        className='size-[var(--spacing-lg)]'
        strokeWidth='var(--stroke-md)'
      />
    ),
    title: 'No issues found',
    description: 'Try changing the filters or running a new audit.',
    actionLabel: 'Run audit',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutAction: Story = {
  args: {
    actionLabel: undefined,
    onAction: undefined,
  },
};
