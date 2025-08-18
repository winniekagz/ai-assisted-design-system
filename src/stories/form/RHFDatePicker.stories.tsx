import { zodResolver } from '@hookform/resolvers/zod';
import type { Meta, StoryObj } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { RHFDDatePicker } from '../../components/form/rhf-datepicker';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

const formSchema = z.object({
  singleDate: z
    .object({
      startDate: z.date().nullable(),
      endDate: z.date().nullable(),
    })
    .optional(),
  dateRange: z
    .object({
      startDate: z.date().nullable(),
      endDate: z.date().nullable(),
    })
    .optional(),
  requiredDate: z.object({
    startDate: z.date({ error: 'Date is required' }),
    endDate: z.date().nullable(),
  }),
});

type FormData = z.infer<typeof formSchema>;

const meta: Meta<typeof RHFDDatePicker> = {
  title: 'Form/RHFDatePicker',
  component: RHFDDatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => {
      const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          singleDate: { startDate: null, endDate: null },
          dateRange: { startDate: null, endDate: null },
          requiredDate: { startDate: null, endDate: null },
        },
      });

      const onSubmit = (data: FormData) => {
        console.log('Form data:', data);
        alert('Form submitted! Check console for data.');
      };

      return (
        <FormProvider {...form}>
          <Card className='p-6 w-96'>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <Story />
              <Button type='submit' className='w-full'>
                Submit Form
              </Button>
            </form>
          </Card>
        </FormProvider>
      );
    },
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['single', 'range'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    required: {
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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'singleDate',
    label: 'Select Date',
    placeholder: 'Choose a date',
    variant: 'single',
  },
};

export const Range: Story = {
  args: {
    name: 'dateRange',
    label: 'Date Range',
    placeholder: 'Select date range',
    variant: 'range',
  },
};

export const Required: Story = {
  args: {
    name: 'requiredDate',
    label: 'Required Date',
    placeholder: 'This field is required',
    variant: 'single',
    required: true,
  },
};

export const WithHelperText: Story = {
  args: {
    name: 'singleDate',
    label: 'Date with Helper Text',
    placeholder: 'Select a date',
    variant: 'single',
    helperText: 'This is helpful information about the date picker',
  },
};

export const Disabled: Story = {
  args: {
    name: 'singleDate',
    label: 'Disabled Date Picker',
    placeholder: 'This is disabled',
    variant: 'single',
    disabled: true,
  },
};

export const WithoutShortcuts: Story = {
  args: {
    name: 'singleDate',
    label: 'No Shortcuts',
    placeholder: 'Select date without shortcuts',
    variant: 'single',
    showShortcuts: false,
  },
};

export const WithoutFooter: Story = {
  args: {
    name: 'singleDate',
    label: 'No Footer',
    placeholder: 'Select date without footer',
    variant: 'single',
    showFooter: false,
  },
};

export const WithDateRestrictions: Story = {
  args: {
    name: 'singleDate',
    label: 'Date with Restrictions',
    placeholder: 'Select date (next 30 days)',
    variant: 'single',
    minDate: new Date(),
    maxDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
};

// Multiple DatePickers in one form
export const MultipleDatePickers: Story = {
  render: () => {
    const form = useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        singleDate: { startDate: null, endDate: null },
        dateRange: { startDate: null, endDate: null },
        requiredDate: { startDate: null, endDate: null },
      },
    });

    const onSubmit = (data: FormData) => {
      console.log('Form data:', data);
      alert('Form submitted! Check console for data.');
    };

    return (
      <FormProvider {...form}>
        <Card className='p-6 w-96'>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <RHFDDatePicker
              name='singleDate'
              label='Single Date'
              placeholder='Select a single date'
              variant='single'
            />

            <RHFDDatePicker
              name='dateRange'
              label='Date Range'
              placeholder='Select a date range'
              variant='range'
            />

            <RHFDDatePicker
              name='requiredDate'
              label='Required Date'
              placeholder='This field is required'
              variant='single'
              required
            />

            <Button type='submit' className='w-full'>
              Submit Form
            </Button>
          </form>
        </Card>
      </FormProvider>
    );
  },
  parameters: {
    layout: 'padded',
  },
};
