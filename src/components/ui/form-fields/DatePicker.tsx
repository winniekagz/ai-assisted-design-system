'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../button';
import { Calendar } from '../calendar';
import { Input } from '../input';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

export interface DatePickerValue {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DatePickerProps {
  value: DatePickerValue;
  onChange: (value: DatePickerValue) => void;
  variant?: 'single' | 'range';
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  format?: string;
  displayFormat?: string;
  readOnly?: boolean;
  calendarProps?: any;
}

function formatDate(date: Date | undefined, formatStr: string = 'PPP') {
  if (!date) {
    return '';
  }
  return format(date, formatStr);
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

const LejaDatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  variant = 'single',
  placeholder = 'Pick a date',
  disabled = false,
  className = '',
  minDate,
  maxDate,
  format: dateFormat = 'PPP',
  displayFormat = 'PPP',
  readOnly = false,
  calendarProps = {},
}) => {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(
    value.startDate || new Date()
  );
  const [inputValue, setInputValue] = React.useState(
    formatDate(value.startDate || undefined, displayFormat)
  );

  const handleSelect = (date: Date | undefined) => {
    if (variant === 'single') {
      const newValue = {
        startDate: date || null,
        endDate: null,
      };
      onChange(newValue);
      setInputValue(formatDate(date, displayFormat));
      setOpen(false);
    } else {
      // For range, we need to handle start and end date selection
      if (!value.startDate || (value.startDate && value.endDate)) {
        // Start new range
        const newValue = {
          startDate: date || null,
          endDate: null,
        };
        onChange(newValue);
        setInputValue(formatDate(date, displayFormat));
      } else {
        // Complete the range
        const startDate = value.startDate;
        const endDate = date || null;

        if (startDate && endDate && endDate < startDate) {
          // Swap dates if end date is before start date
          const newValue = {
            startDate: endDate,
            endDate: startDate,
          };
          onChange(newValue);
          setInputValue(
            `${formatDate(endDate || undefined, displayFormat)} - ${formatDate(startDate || undefined, displayFormat)}`
          );
        } else {
          const newValue = {
            startDate,
            endDate,
          };
          onChange(newValue);
          setInputValue(
            `${formatDate(startDate || undefined, displayFormat)} - ${formatDate(endDate || undefined, displayFormat)}`
          );
        }
        setOpen(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!open) {
      setOpen(true);
    }
    setInputValue(e.target.value);
    const date = new Date(e.target.value);
    if (isValidDate(date)) {
      handleSelect(date);
    }
  };

  const formatDisplayValue = () => {
    if (variant === 'single') {
      return value.startDate
        ? formatDate(value.startDate, displayFormat)
        : placeholder;
    } else {
      if (value.startDate && value.endDate) {
        return `${formatDate(value.startDate, displayFormat)} - ${formatDate(
          value.endDate,
          displayFormat
        )}`;
      } else if (value.startDate) {
        return `${formatDate(value.startDate, displayFormat)} - ${placeholder}`;
      }
      return placeholder;
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className='relative flex gap-2'>
        <Input
          value={inputValue}
          placeholder={placeholder}
          className='bg-background pr-10 w-full flex-1'
          disabled={disabled || readOnly}
          onChange={handleInputChange}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='ghost'
              className='absolute top-1/2 right-2 size-6 -translate-y-1/2'
              disabled={disabled || readOnly}
            >
              <CalendarIcon className='size-3.5' />
              <span className='sr-only'>Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className='w-full overflow-hidden p-0 flex-1'
            align='start'
          >
            <Calendar
              mode='single'
              selected={value.startDate || undefined}
              captionLayout='dropdown'
              month={month}
              onMonthChange={setMonth}
              onSelect={handleSelect}
              disabled={disabled}
              fromDate={minDate}
              toDate={maxDate}
              {...calendarProps}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default LejaDatePicker;
