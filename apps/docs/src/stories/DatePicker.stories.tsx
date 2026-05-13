import * as React from 'react';
import type { StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import DatePicker, {
  DatePickerValue,
} from '@/components/ui/form-fields/DatePicker';

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Token-driven calendar input for selecting a single date or a start/end range. The component is **controlled**: pass a \`DatePickerValue\` object and update it via \`onChange\`. Calendar states use neutral text tokens; only selected dates receive the primary brand fill.

### When to use
- **Single** — due dates, appointments, birthdays, one-day filters.
- **Range** — booking windows, reporting periods, leave requests, analytics filters.
- Prefer a plain \`<Input type="date">\` when a calendar popover would feel heavy.

### Usage
\`\`\`tsx
import DatePicker, { DatePickerValue } from 'componentiq';

// Single date (controlled)
const [value, setValue] = useState<DatePickerValue>({ startDate: null, endDate: null });
<DatePicker value={value} onChange={setValue} variant="single" placeholder="Select date" />

// Date range (controlled)
const [range, setRange] = useState<DatePickerValue>({ startDate: null, endDate: null });
<DatePicker value={range} onChange={setRange} variant="range" placeholder="Select range" />

// With date restrictions
<DatePicker
  value={value}
  onChange={setValue}
  variant="single"
  minDate={new Date()}
  maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
/>
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`value\` | \`DatePickerValue\` | **required** | \`{ startDate, endDate }\` — both can be \`null\` |
| \`onChange\` | \`(val: DatePickerValue) => void\` | **required** | Called on every date selection |
| \`variant\` | \`"single" \\| "range"\` | "single" | Single date or start/end range |
| \`placeholder\` | string | — | Empty-state label shown in the trigger |
| \`disabled\` | boolean | false | Prevents interaction; applies disabled styling |
| \`readOnly\` | boolean | false | Shows the value without allowing edits |
| \`error\` | boolean | false | Applies the error border token |
| \`minDate\` | Date | — | Earliest selectable date |
| \`maxDate\` | Date | — | Latest selectable date |
| \`primaryColor\` | string | — | Overrides selected-date fill. Prefer \`ComponentIqProvider\` tokens instead |

### Selected-date colour
Selected dates use \`--color-primary\` from the design token system. Pass custom tokens to \`ComponentIqProvider\` to change this globally.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
    calendarProps: { table: { disable: true } },
    configs: { table: { disable: true } },
    format: { table: { disable: true } },
    displayFormat: { table: { disable: true } },
    separator: { table: { disable: true } },
    showShortcuts: { table: { disable: true } },
    showFooter: { table: { disable: true } },
    variant: {
      control: { type: 'select' },
      options: ['single', 'range'],
      description: 'Single date or start/end date range.',
      table: { type: { summary: "'single' | 'range'" }, defaultValue: { summary: "'single'" } },
    },
    placeholder: {
      control: 'text',
      description: 'Label shown in the trigger when no date is selected.',
      table: { type: { summary: 'string' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction and applies disabled text styling.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    readOnly: {
      control: 'boolean',
      description: 'Shows the current value without allowing edits.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    error: {
      control: 'boolean',
      description: 'Applies the error border token to the field.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    minDate: {
      control: false,
      description: 'Earliest selectable date.',
      table: { type: { summary: 'Date' } },
    },
    maxDate: {
      control: false,
      description: 'Latest selectable date.',
      table: { type: { summary: 'Date' } },
    },
    primaryColor: {
      control: { type: 'color' },
      description: 'Override for the selected-date background. Prefer `ComponentIqProvider tokens` for product use.',
      table: { type: { summary: 'string' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function VariantShowcase({
  title,
  variants,
}: {
  title: string;
  variants: Array<{ label: string; code: string; node: React.ReactNode }>;
}) {
  const [sel, setSel] = React.useState(0);
  return (
    <div className='w-full space-y-[var(--spacing-md)]'>
      <h2 className='font-[family-name:var(--font-heading)] font-[var(--font-weight-bold)] text-[color:var(--text-title)] text-[length:var(--font-size-heading-6)]'>
        {title}
      </h2>
      <div className='grid grid-cols-2 gap-[var(--spacing-sm)] sm:grid-cols-3'>
        {variants.map((v, i) => (
          <div
            key={v.label}
            onClick={() => setSel(i)}
            className={`flex flex-col items-start gap-[var(--spacing-sm)] rounded-[var(--radius-md)] border p-[var(--spacing-md)] transition-colors cursor-pointer ${
              sel === i
                ? 'bg-[color:var(--bg-hover)] border-[color:var(--color-primary)]'
                : 'bg-[color:var(--bg-surface)] border-[color:var(--border-subtle)] hover:bg-[color:var(--bg-hover)]'
            }`}
          >
            <span className='text-[length:var(--font-size-xs)] text-[color:var(--text-muted)] font-[family-name:var(--font-rubik)]'>
              {v.label}
            </span>
            <div className='w-full' onClick={e => e.stopPropagation()}>{v.node}</div>
          </div>
        ))}
      </div>
      <div className='rounded-[var(--radius-md)] bg-[color:var(--bg-secondary)] border border-[color:var(--border-subtle)] p-[var(--spacing-md)]'>
        <p className='text-[length:var(--font-size-xs)] text-[color:var(--text-muted)] font-[family-name:var(--font-rubik)] mb-[var(--spacing-sm)]'>
          {variants[sel].label}
        </p>
        <pre className='text-[length:var(--font-size-xs)] text-[color:var(--text-paragraph)] font-mono overflow-x-auto whitespace-pre-wrap'>
          <code>{variants[sel].code}</code>
        </pre>
      </div>
    </div>
  );
}

function SingleDateCard() {
  const [value, setValue] = useState<DatePickerValue>({ startDate: null, endDate: null });
  return <DatePicker value={value} onChange={setValue} variant='single' placeholder='Pick a date' />;
}

function RangeDateCard() {
  const [value, setValue] = useState<DatePickerValue>({ startDate: null, endDate: null });
  return <DatePicker value={value} onChange={setValue} variant='range' placeholder='Pick a range' />;
}

function PreSelectedCard() {
  const [value, setValue] = useState<DatePickerValue>({ startDate: new Date(), endDate: null });
  return <DatePicker value={value} onChange={setValue} variant='single' placeholder='Pick a date' />;
}

function ErrorCard() {
  const [value, setValue] = useState<DatePickerValue>({ startDate: null, endDate: null });
  return <DatePicker value={value} onChange={setValue} variant='single' placeholder='Pick a date' error />;
}

export const AllVariants: Story = {
  render: () => (
    <VariantShowcase
      title='DatePicker'
      variants={[
        {
          label: 'Single date picker',
          code: `const [value, setValue] = useState({ startDate: null, endDate: null });\n<DatePicker value={value} onChange={setValue} variant="single" placeholder="Pick a date" />`,
          node: <SingleDateCard />,
        },
        {
          label: 'Date range picker',
          code: `const [value, setValue] = useState({ startDate: null, endDate: null });\n<DatePicker value={value} onChange={setValue} variant="range" placeholder="Pick a range" />`,
          node: <RangeDateCard />,
        },
        {
          label: 'Pre-selected single',
          code: `const [value, setValue] = useState({ startDate: new Date(), endDate: null });\n<DatePicker value={value} onChange={setValue} variant="single" />`,
          node: <PreSelectedCard />,
        },
        {
          label: 'Error state',
          code: `<DatePicker value={value} onChange={setValue} variant="single" error={true} />`,
          node: <ErrorCard />,
        },
        {
          label: 'Disabled',
          code: `<DatePicker value={value} onChange={setValue} variant="single" disabled />`,
          node: (
            <DatePicker
              value={{ startDate: null, endDate: null }}
              onChange={() => {}}
              variant='single'
              placeholder='Pick a date'
              disabled
            />
          ),
        },
      ]}
    />
  ),
};

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
