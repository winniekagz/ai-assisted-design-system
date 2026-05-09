import { Stepper } from '@/components/ui/stepper';
import type { Meta, StoryObj } from '@storybook/react';

const steps = [
  {
    id: 'scan',
    label: 'Scan codebase',
    description: 'Read component files and usage patterns.',
  },
  {
    id: 'match',
    label: 'Match design system',
    description: 'Compare implementation against ComponentIQ rules.',
  },
  {
    id: 'review',
    label: 'Review recommendations',
    description: 'Approve fixes before applying changes.',
  },
];

const meta: Meta<typeof Stepper> = {
  title: 'UI/Stepper',
  component: Stepper,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    steps,
    currentStep: 1,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Complete: Story = {
  args: {
    currentStep: 3,
  },
};
