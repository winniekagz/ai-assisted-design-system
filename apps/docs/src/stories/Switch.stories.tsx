import { Switch } from '@/components/ui/form-fields/switch';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Switch> = {
  title: 'Components/FormFields/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    label: 'Enable rule',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
    label: 'Run audit automatically',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Locked setting',
  },
};
