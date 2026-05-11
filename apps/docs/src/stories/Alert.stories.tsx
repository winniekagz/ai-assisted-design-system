import { Alert } from '@/components/ui/alert';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    title: 'Audit completed',
    children: 'ComponentIQ found token usage issues that need review.',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Ready to publish',
    children: 'All required checks passed.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Human review required',
    children: 'Some recommendations need approval before applying changes.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Audit failed',
    children: 'The source file could not be parsed.',
  },
};
