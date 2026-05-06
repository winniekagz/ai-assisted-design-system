import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DatePicker, {
  DatePickerValue,
} from '@/components/ui/form-fields/DatePicker';
import { lightColors } from '../styles/tokens';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['single', 'range'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    readOnly: {
      control: { type: 'boolean' },
    },
    showShortcuts: {
      control: { type: 'boolean' },
    },
    showFooter: {
      control: { type: 'boolean' },
    },
    placeholder: {
      control: { type: 'text' },
    },
    format: {
      control: { type: 'text' },
    },
    displayFormat: {
      control: { type: 'text' },
    },
    separator: {
      control: { type: 'text' },
    },
    primaryColor: {
      control: { type: 'color' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to handle state
const DatePickerWrapper = (args: any) => {
  const [value, setValue] = useState<DatePickerValue>({
    startDate: null,
    endDate: null,
  });

  return (
    <div className='w-80'>
      <DatePicker {...args} value={value} onChange={setValue} />
      <div className='mt-2 text-sm text-gray-500'>
        Selected:{' '}
        {value.startDate
          ? new Date(value.startDate).toLocaleDateString()
          : 'None'}
        {value.endDate && ` - ${new Date(value.endDate).toLocaleDateString()}`}
      </div>
    </div>
  );
};

export const Default: Story = {
  render: args => <DatePickerWrapper {...args} />,
  args: {
    variant: 'single',
    placeholder: 'Select a date',
  },
};

export const Range: Story = {
  render: args => <DatePickerWrapper {...args} />,
  args: {
    variant: 'range',
    placeholder: 'Select date range',
  },
};

export const Disabled: Story = {
  render: args => <DatePickerWrapper {...args} />,
  args: {
    variant: 'single',
    placeholder: 'Disabled picker',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  render: args => <DatePickerWrapper {...args} />,
  args: {
    variant: 'single',
    placeholder: 'Read only picker',
    readOnly: true,
  },
};

export const WithoutShortcuts: Story = {
  render: args => <DatePickerWrapper {...args} />,
  args: {
    variant: 'single',
    placeholder: 'No shortcuts',
    showShortcuts: false,
  },
};

export const WithoutFooter: Story = {
  render: args => <DatePickerWrapper {...args} />,
  args: {
    variant: 'single',
    placeholder: 'No footer',
    showFooter: false,
  },
};

export const WithDateRestrictions: Story = {
  render: args => <DatePickerWrapper {...args} />,
  args: {
    variant: 'single',
    placeholder: 'Select date (next 30 days)',
    minDate: new Date(),
    maxDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
};

export const CustomColor: Story = {
  render: args => <DatePickerWrapper {...args} />,
  args: {
    variant: 'single',
    placeholder: 'Custom color picker',
    primaryColor: lightColors.secondary[600],
  },
};

export const CustomFormat: Story = {
  render: args => <DatePickerWrapper {...args} />,
  args: {
    variant: 'single',
    placeholder: 'Custom format',
    format: 'YYYY-MM-DD',
    displayFormat: 'DD/MM/YYYY',
  },
};

export const CustomSeparator: Story = {
  render: args => <DatePickerWrapper {...args} />,
  args: {
    variant: 'range',
    placeholder: 'Custom separator',
    separator: ' to ',
  },
};

export const CustomConfiguration: Story = {
  render: args => <DatePickerWrapper {...args} />,
  args: {
    variant: 'single',
    placeholder: 'Custom configuration',
    configs: {
      shortcuts: {
        today: 'Today',
        yesterday: 'Yesterday',
        past: (period: number) => `Past ${period} days`,
        currentMonth: 'This Month',
        pastMonth: 'Last Month',
      },
      footer: {
        cancel: 'Cancel',
        apply: 'Apply',
      },
    },
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => {
    const [singleDate, setSingleDate] = useState<DatePickerValue>({
      startDate: null,
      endDate: null,
    });

    const [rangeDate, setRangeDate] = useState<DatePickerValue>({
      startDate: null,
      endDate: null,
    });

    return (
      <div className='space-y-6 w-full max-w-4xl'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h3 className='text-lg font-medium mb-2'>Single Date Picker</h3>
            <DatePicker
              value={singleDate}
              onChange={setSingleDate}
              variant='single'
              placeholder='Select a date'
            />
            <p className='text-sm text-gray-500 mt-1'>
              Selected:{' '}
              {singleDate.startDate
                ? new Date(singleDate.startDate).toLocaleDateString()
                : 'None'}
            </p>
          </div>

          <div>
            <h3 className='text-lg font-medium mb-2'>Range Date Picker</h3>
            <DatePicker
              value={rangeDate}
              onChange={setRangeDate}
              variant='range'
              placeholder='Select date range'
            />
            <p className='text-sm text-gray-500 mt-1'>
              Range:{' '}
              {rangeDate.startDate
                ? new Date(rangeDate.startDate).toLocaleDateString()
                : 'None'}{' '}
              -{' '}
              {rangeDate.endDate
                ? new Date(rangeDate.endDate).toLocaleDateString()
                : 'None'}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <h4 className='text-md font-medium mb-2'>Disabled</h4>
            <DatePicker
              value={{ startDate: null, endDate: null }}
              onChange={() => {}}
              variant='single'
              placeholder='Disabled'
              disabled
            />
          </div>

          <div>
            <h4 className='text-md font-medium mb-2'>Read Only</h4>
            <DatePicker
              value={{ startDate: new Date(), endDate: null }}
              onChange={() => {}}
              variant='single'
              placeholder='Read only'
              readOnly
            />
          </div>

          <div>
            <h4 className='text-md font-medium mb-2'>Custom Color</h4>
            <DatePicker
              value={{ startDate: null, endDate: null }}
              onChange={() => {}}
              variant='single'
              placeholder='Custom color'
              primaryColor={lightColors.secondary[600]}
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};
