'use client';

import type React from 'react';
import { useState } from 'react';
import DatePicker, {
  DatePickerValue,
} from '@/components/ui/form-fields/DatePicker';

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

function FieldSpecimen({
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
    <section className='rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-4 shadow-sm'>
      <p className='text-xs font-medium uppercase tracking-[0.14em] text-[color:var(--text-muted)]'>
        Date input
      </p>
      <h2 className='mt-1 text-base font-semibold text-[color:var(--text-primary)]'>
        {title}
      </h2>
      <p className='mt-1 text-sm leading-5 text-[color:var(--text-secondary)]'>
        {description}
      </p>
      <div className='mt-4 space-y-2'>
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

export default function DatePickerDemo() {
  const [singleDate, setSingleDate] = useState<DatePickerValue>(emptyValue);
  const [rangeDate, setRangeDate] = useState<DatePickerValue>(emptyValue);
  const [restrictedDate, setRestrictedDate] =
    useState<DatePickerValue>(emptyValue);

  const tokenRows = [
    ['Default dates', '--text-primary'],
    ['Weekdays and controls', '--text-secondary'],
    ['Outside month', '--text-muted'],
    ['Disabled dates', '--text-disabled'],
    ['Selected date fill', '--color-primary'],
  ];

  return (
    <main className='mx-auto max-w-5xl px-6 py-8'>
      <section className='overflow-hidden rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] shadow-sm'>
        <div className='bg-[color:var(--color-primary)] px-6 py-5 text-[color:var(--color-primary-fg,var(--text-inverse))]'>
          <p className='text-xs font-medium uppercase tracking-[0.24em] opacity-80'>
            ComponentIQ UI Kit
          </p>
          <h1 className='mt-2 text-xl font-semibold'>DatePicker</h1>
        </div>

        <div className='grid gap-8 p-6 md:grid-cols-[0.9fr_1.1fr]'>
          <div>
            <p className='text-xs font-medium uppercase tracking-[0.14em] text-[color:var(--text-muted)]'>
              Usage
            </p>
            <p className='mt-3 text-sm leading-6 text-[color:var(--text-paragraph)]'>
              Use DatePicker when a user needs a precise calendar value. The
              component is controlled: keep a `DatePickerValue` in state, pass
              it to `value`, and update it through `onChange`.
            </p>
            <p className='mt-3 text-sm leading-6 text-[color:var(--text-secondary)]'>
              Choose `single` for one-day values and `range` for booking
              windows, reports, filters, or travel periods.
            </p>
          </div>

          <div>
            <p className='text-xs font-medium uppercase tracking-[0.14em] text-[color:var(--text-muted)]'>
              Color behavior
            </p>
            <div className='mt-3 grid gap-3 sm:grid-cols-2'>
              {tokenRows.map(([label, token]) => (
                <div key={token} className='flex items-center gap-3 text-sm'>
                  <span
                    className='size-4 rounded-full border border-[color:var(--border-subtle)]'
                    style={{ background: `var(${token})` }}
                  />
                  <div>
                    <p className='text-[color:var(--text-primary)]'>{label}</p>
                    <p className='text-xs text-[color:var(--text-muted)]'>
                      {token}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='mt-6 grid gap-4 md:grid-cols-2'>
        <FieldSpecimen
          title='Single date'
          description='For deadlines, appointments, birthdays, or effective dates.'
          result={formatValue(singleDate)}
        >
          <DatePicker
            value={singleDate}
            onChange={setSingleDate}
            variant='single'
            placeholder='Select date'
          />
        </FieldSpecimen>

        <FieldSpecimen
          title='Date range'
          description='For booking windows, reporting periods, and filters.'
          result={formatValue(rangeDate)}
        >
          <DatePicker
            value={rangeDate}
            onChange={setRangeDate}
            variant='range'
            placeholder='Select range'
          />
        </FieldSpecimen>

        <FieldSpecimen
          title='Restricted dates'
          description='Use minDate and maxDate to keep selection inside a valid window.'
          result={formatValue(restrictedDate)}
        >
          <DatePicker
            value={restrictedDate}
            onChange={setRestrictedDate}
            variant='single'
            placeholder='Next 30 days'
            minDate={new Date()}
            maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
          />
        </FieldSpecimen>

        <FieldSpecimen
          title='Static states'
          description='Disabled and read-only states use neutral token styling.'
        >
          <div className='grid gap-3'>
            <DatePicker
              value={emptyValue}
              onChange={() => {}}
              variant='single'
              placeholder='Disabled'
              disabled
            />
            <DatePicker
              value={{ startDate: new Date(), endDate: null }}
              onChange={() => {}}
              variant='single'
              placeholder='Read only'
              readOnly
            />
          </div>
        </FieldSpecimen>
      </section>

      <section className='mt-6 rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--bg-secondary)] p-4'>
        <p className='text-xs font-medium uppercase tracking-[0.14em] text-[color:var(--text-muted)]'>
          Implementation
        </p>
        <pre className='mt-3 overflow-x-auto rounded-md bg-[color:var(--bg-surface)] p-4 text-xs leading-5 text-[color:var(--text-paragraph)]'>
          {`const [date, setDate] = useState<DatePickerValue>({
  startDate: null,
  endDate: null,
});

<DatePicker
  value={date}
  onChange={setDate}
  variant="single"
  placeholder="Select date"
/>`}
        </pre>
      </section>
    </main>
  );
}
