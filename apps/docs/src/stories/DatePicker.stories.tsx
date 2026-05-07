import type { Meta, StoryObj } from '@storybook/react';
import type React from 'react';
import { useState } from 'react';
import DatePicker, {
  DatePickerValue,
} from '@/components/ui/form-fields/DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
DatePicker is the standalone calendar input for ComponentIQ. Use it when users need to select one date or a start/end range.

The component is controlled: pass a \`DatePickerValue\` object and update it through \`onChange\`. It uses the design-token contract directly, so calendar text stays neutral and only selected dates use the primary brand background.

Use \`variant="single"\` for due dates, appointments, birthdays, and one-day filters. Use \`variant="range"\` for booking windows, reporting periods, leave requests, and analytics filters.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      table: { disable: true },
    },
    onChange: {
      table: { disable: true },
    },
    calendarProps: {
      table: { disable: true },
    },
    configs: {
      table: { disable: true },
    },
    format: {
      table: { disable: true },
    },
    displayFormat: {
      table: { disable: true },
    },
    separator: {
      table: { disable: true },
    },
    showShortcuts: {
      table: { disable: true },
    },
    showFooter: {
      table: { disable: true },
    },
    variant: {
      control: { type: 'select' },
      options: ['single', 'range'],
      description:
        'Controls whether the picker returns one date or a start/end range.',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Accessible label and empty-state prompt for the field.',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Prevents interaction and applies disabled text styling.',
    },
    readOnly: {
      control: { type: 'boolean' },
      description:
        'Shows the current value without allowing the user to change it.',
    },
    minDate: {
      control: false,
      description: 'Earliest selectable date.',
    },
    maxDate: {
      control: false,
      description: 'Latest selectable date.',
    },
    primaryColor: {
      control: { type: 'color' },
      description:
        'Optional override for selected-date background. Prefer design tokens for product use.',
    },
    error: {
      control: { type: 'boolean' },
      description: 'Applies the error border token to the field.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const emptyValue: DatePickerValue = {
  startDate: null,
  endDate: null,
};

function formatDate(date: Date | null) {
  return date
    ? new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date)
    : 'Not selected';
}

function formatValue(value: DatePickerValue) {
  if (value.startDate && value.endDate) {
    return `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`;
  }

  return formatDate(value.startDate);
}

function SpecimenFrame({
  title,
  description,
  children,
  result,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  result?: string;
}) {
  return (
    <section className='w-[min(420px,calc(100vw-48px))] rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-4 shadow-sm'>
      <div className='mb-4 border-b border-[color:var(--border-subtle)] pb-3'>
        <p className='text-xs font-medium uppercase tracking-[0.14em] text-[color:var(--text-muted)]'>
          Date input
        </p>
        <h3 className='mt-1 text-base font-semibold text-[color:var(--text-primary)]'>
          {title}
        </h3>
        <p className='mt-1 text-sm leading-5 text-[color:var(--text-secondary)]'>
          {description}
        </p>
      </div>
      <div className='space-y-2'>
        {children}
        {result && (
          <p className='text-xs text-[color:var(--text-muted)]'>
            Selected: {result}
          </p>
        )}
      </div>
    </section>
  );
}

function ControlledDatePicker(
  args: React.ComponentProps<typeof DatePicker> & {
    helper?: string;
    label?: string;
  }
) {
  const [value, setValue] = useState<DatePickerValue>(emptyValue);

  return (
    <SpecimenFrame
      title={args.label ?? 'Default'}
      description={
        args.helper ??
        'A compact controlled field for choosing a calendar date.'
      }
      result={formatValue(value)}
    >
      <DatePicker {...args} value={value} onChange={setValue} />
    </SpecimenFrame>
  );
}

export const Default: Story = {
  render: args => (
    <ControlledDatePicker
      {...args}
      label='Single date'
      helper='Use for one-day values such as deadlines, appointments, or effective dates.'
    />
  ),
  args: {
    variant: 'single',
    placeholder: 'Select date',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The default picker stores one date in `value.startDate` and leaves `value.endDate` empty.',
      },
    },
  },
};

export const Range: Story = {
  render: args => (
    <ControlledDatePicker
      {...args}
      label='Date range'
      helper='Use for booking windows, report filters, travel dates, or coverage periods.'
    />
  ),
  args: {
    variant: 'range',
    placeholder: 'Select range',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Range mode writes both `startDate` and `endDate` once the user completes the selection.',
      },
    },
  },
};

export const WithDateRestrictions: Story = {
  render: args => (
    <ControlledDatePicker
      {...args}
      label='Restricted dates'
      helper='Use minDate and maxDate to keep selection inside a valid business window.'
    />
  ),
  args: {
    variant: 'single',
    placeholder: 'Next 30 days',
    minDate: new Date(),
    maxDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
};

export const DisabledAndReadOnly: Story = {
  render: () => (
    <div className='grid w-[min(760px,calc(100vw-48px))] gap-4 md:grid-cols-2'>
      <SpecimenFrame
        title='Disabled'
        description='Use when the value cannot be changed in the current state.'
      >
        <DatePicker
          value={emptyValue}
          onChange={() => {}}
          variant='single'
          placeholder='Disabled picker'
          disabled
        />
      </SpecimenFrame>
      <SpecimenFrame
        title='Read only'
        description='Use when users may inspect the value but not edit it.'
      >
        <DatePicker
          value={{ startDate: new Date(), endDate: null }}
          onChange={() => {}}
          variant='single'
          placeholder='Read only'
          readOnly
        />
      </SpecimenFrame>
    </div>
  ),
};

export const DesignSystemSpecimen: Story = {
  render: () => {
    const [singleDate, setSingleDate] = useState<DatePickerValue>(emptyValue);
    const [rangeDate, setRangeDate] = useState<DatePickerValue>(emptyValue);

    const tokens = [
      ['Text primary', 'var(--text-primary)'],
      ['Text secondary', 'var(--text-secondary)'],
      ['Text muted', 'var(--text-muted)'],
      ['Primary fill', 'var(--color-primary)'],
    ];

    return (
      <div className='w-[min(780px,calc(100vw-48px))] overflow-hidden rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] shadow-sm'>
        <div className='bg-[color:var(--color-primary)] px-5 py-4 text-[color:var(--color-primary-fg,var(--text-inverse))]'>
          <p className='text-xs font-medium uppercase tracking-[0.22em] opacity-80'>
            ComponentIQ UI Kit
          </p>
          <h3 className='mt-2 text-lg font-semibold'>DatePicker Specimen</h3>
        </div>
        <div className='grid gap-6 p-5 md:grid-cols-[1fr_0.85fr]'>
          <div className='space-y-4'>
            <div>
              <p className='text-xs font-medium uppercase tracking-[0.14em] text-[color:var(--text-muted)]'>
                Component
              </p>
              <div className='mt-3 space-y-3'>
                <DatePicker
                  value={singleDate}
                  onChange={setSingleDate}
                  variant='single'
                  placeholder='Select date'
                />
                <DatePicker
                  value={rangeDate}
                  onChange={setRangeDate}
                  variant='range'
                  placeholder='Select range'
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-3 text-xs text-[color:var(--text-secondary)]'>
              <p>Single: {formatValue(singleDate)}</p>
              <p>Range: {formatValue(rangeDate)}</p>
            </div>
          </div>
          <div>
            <p className='text-xs font-medium uppercase tracking-[0.14em] text-[color:var(--text-muted)]'>
              Color behavior
            </p>
            <div className='mt-3 grid gap-3'>
              {tokens.map(([label, color]) => (
                <div key={label} className='flex items-center gap-3 text-sm'>
                  <span
                    className='size-4 rounded-full border border-[color:var(--border-subtle)]'
                    style={{ background: color }}
                  />
                  <span className='text-[color:var(--text-secondary)]'>
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <p className='mt-4 text-sm leading-5 text-[color:var(--text-muted)]'>
              The calendar uses neutral text for default, secondary, muted, and
              disabled states. Primary is reserved for selected dates only.
            </p>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'A compact visual specimen inspired by design-system presentation boards: component behavior on the left, token behavior on the right.',
      },
    },
  },
};
