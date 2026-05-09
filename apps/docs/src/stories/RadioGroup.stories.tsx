import { RadioGroup } from '@/components/ui/form-fields/radio-group';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/FormFields/RadioGroup',
  component: RadioGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    label: 'Framework',
    defaultValue: 'react',
    options: [
      { value: 'react', label: 'React' },
      { value: 'next', label: 'Next.js' },
      { value: 'vue', label: 'Vue' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    error: true,
  },
};
