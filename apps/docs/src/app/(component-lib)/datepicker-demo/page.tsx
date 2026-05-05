'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import DatePicker, {
  DatePickerValue,
} from '@/components/ui/form-fields/DatePicker';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import ComponentIqDatePicker from '@/components/ui/form-fields/DatePicker';

export default function DatePickerDemo() {
  const [singleDate, setSingleDate] = useState<DatePickerValue>({
    startDate: null,
    endDate: null,
  });

  const [rangeDate, setRangeDate] = useState<DatePickerValue>({
    startDate: null,
    endDate: null,
  });

  const [customDate, setCustomDate] = useState<DatePickerValue>({
    startDate: null,
    endDate: null,
  });

  const [disabledDate, setDisabledDate] = useState<DatePickerValue>({
    startDate: null,
    endDate: null,
  });

  return (
    <div className='space-y-8 p-6'>
      <Typography variant='h3' className='mb-6'>
        DatePicker Component Demo
      </Typography>

      {/* Basic DatePicker Variants */}
      <Card className='p-6'>
        <Typography variant='h4' className='mb-4'>
          Basic DatePicker Variants
        </Typography>
        <Typography variant='body2' className='mb-6 text-muted-foreground'>
          Single and range date picker variants with different configurations.
        </Typography>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Typography variant='body2' className='font-medium'>
              Single Date Picker
            </Typography>
            <ComponentIqDatePicker
              value={singleDate}
              onChange={setSingleDate}
              variant='single'
              placeholder='Select a date'
            />
            <Typography variant='caption' className='text-gray-500'>
              Selected:{' '}
              {singleDate.startDate
                ? new Date(singleDate.startDate).toLocaleDateString()
                : 'None'}
            </Typography>
          </div>

          <div className='space-y-2'>
            <Typography variant='body2' className='font-medium'>
              Range Date Picker
            </Typography>
            <ComponentIqDatePicker
              value={rangeDate}
              onChange={setRangeDate}
              variant='range'
              placeholder='Select date range'
            />
            <Typography variant='caption' className='text-gray-500'>
              Range:{' '}
              {rangeDate.startDate
                ? new Date(rangeDate.startDate).toLocaleDateString()
                : 'None'}{' '}
              -{' '}
              {rangeDate.endDate
                ? new Date(rangeDate.endDate).toLocaleDateString()
                : 'None'}
            </Typography>
          </div>
        </div>
      </Card>

      <Separator />

      {/* Advanced DatePicker Features */}
      <Card className='p-6'>
        <Typography variant='h4' className='mb-4'>
          Advanced Features
        </Typography>
        <Typography variant='body2' className='mb-6 text-muted-foreground'>
          DatePicker with custom configurations, date restrictions, and styling.
        </Typography>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Typography variant='body2' className='font-medium'>
              Custom Configuration
            </Typography>
            <ComponentIqDatePicker
              value={customDate}
              onChange={setCustomDate}
              variant='single'
              placeholder='Custom date picker'
              showShortcuts={true}
              showFooter={true}
              format='YYYY-MM-DD'
              displayFormat='DD/MM/YYYY'
              primaryColor='hsl(var(--secondary))'
              configs={{
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
              }}
            />
          </div>

          <div className='space-y-2'>
            <Typography variant='body2' className='font-medium'>
              Date Restrictions
            </Typography>
            <ComponentIqDatePicker
              value={disabledDate}
              onChange={setDisabledDate}
              variant='single'
              placeholder='Select date (next 30 days)'
              minDate={new Date()}
              maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
              // showShortcuts={false}
            />
            <Typography variant='caption' className='text-gray-500'>
              Only allows dates from today to 30 days in the future
            </Typography>
          </div>
        </div>
      </Card>

      <Separator />

      {/* DatePicker States */}
      <Card className='p-6'>
        <Typography variant='h4' className='mb-4'>
          DatePicker States
        </Typography>
        <Typography variant='body2' className='mb-6 text-muted-foreground'>
          Different states and configurations of the DatePicker component.
        </Typography>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <Typography variant='body2' className='font-medium'>
              Disabled State
            </Typography>
            <DatePicker
              value={{ startDate: null, endDate: null }}
              onChange={() => {}}
              variant='single'
              placeholder='Disabled picker'
              disabled
            />
          </div>

          <div className='space-y-2'>
            <Typography variant='body2' className='font-medium'>
              Read Only
            </Typography>
            <DatePicker
              value={{ startDate: new Date(), endDate: null }}
              onChange={() => {}}
              variant='single'
              placeholder='Read only picker'
              readOnly
            />
          </div>

          <div className='space-y-2'>
            <Typography variant='body2' className='font-medium'>
              Without Shortcuts
            </Typography>
            <DatePicker
              value={{ startDate: null, endDate: null }}
              onChange={() => {}}
              variant='single'
              placeholder='No shortcuts'
              showShortcuts={false}
            />
          </div>

          <div className='space-y-2'>
            <Typography variant='body2' className='font-medium'>
              Without Footer
            </Typography>
            <DatePicker
              value={{ startDate: null, endDate: null }}
              onChange={() => {}}
              variant='single'
              placeholder='No footer'
              showFooter={false}
            />
          </div>

          <div className='space-y-2'>
            <Typography variant='body2' className='font-medium'>
              Custom Separator
            </Typography>
            <DatePicker
              value={{ startDate: null, endDate: null }}
              onChange={() => {}}
              variant='range'
              placeholder='Custom separator'
              separator=' to '
            />
          </div>

          <div className='space-y-2'>
            <Typography variant='body2' className='font-medium'>
              Error State (Custom)
            </Typography>
            <div className='border border-red-300 rounded-md'>
              <DatePicker
                value={{ startDate: null, endDate: null }}
                onChange={() => {}}
                variant='single'
                placeholder='Error state'
                className='border-red-500'
              />
            </div>
          </div>
        </div>
      </Card>

      <Separator />

      {/* Usage Examples */}
      <Card className='p-6'>
        <Typography variant='h4' className='mb-4'>
          Usage Examples
        </Typography>
        <Typography variant='body2' className='mb-6 text-muted-foreground'>
          Common use cases and implementation patterns for the DatePicker
          component.
        </Typography>

        <div className='space-y-4'>
          <div className='p-4 bg-gray-50 rounded-lg'>
            <Typography variant='h6' className='mb-2'>
              Basic Implementation
            </Typography>
            <pre className='text-sm bg-white p-3 rounded border overflow-x-auto'>
              {`import DatePicker from './components/ui/form-fields/DatePicker';

const [date, setDate] = useState({ startDate: null, endDate: null });

<DatePicker
  value={date}
  onChange={setDate}
  variant="single"
  placeholder="Select date"
/>`}
            </pre>
          </div>

          <div className='p-4 bg-gray-50 rounded-lg'>
            <Typography variant='h6' className='mb-2'>
              Range Picker with Restrictions
            </Typography>
            <pre className='text-sm bg-white p-3 rounded border overflow-x-auto'>
              {`<DatePicker
  value={dateRange}
  onChange={setDateRange}
  variant="range"
  placeholder="Select date range"
  minDate={new Date()}
  maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
  showShortcuts={true}
/>`}
            </pre>
          </div>

          <div className='p-4 bg-gray-50 rounded-lg'>
            <Typography variant='h6' className='mb-2'>
              Custom Styling and Configuration
            </Typography>
            <pre className='text-sm bg-white p-3 rounded border overflow-x-auto'>
              {`<DatePicker
  value={date}
  onChange={setDate}
  variant="single"
  placeholder="Custom picker"
  primaryColor="#3B82F6"
  format="YYYY-MM-DD"
  displayFormat="DD/MM/YYYY"
  configs={{
    shortcuts: {
      today: 'Today',
      yesterday: 'Yesterday',
    },
    footer: {
      cancel: 'Cancel',
      apply: 'Apply',
    },
  }}
/>`}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
}
