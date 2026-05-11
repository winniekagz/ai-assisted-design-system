'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface DatePickerValue {
  startDate: Date | null;
  endDate:   Date | null;
}

export interface DatePickerProps {
  value:        DatePickerValue;
  onChange:     (value: DatePickerValue) => void;
  variant?:     'single' | 'range';
  placeholder?: string;
  disabled?:    boolean;
  className?:   string;
  minDate?:     Date;
  maxDate?:     Date;
  readOnly?:    boolean;
  error?:       boolean;
}

function formatLabel(
  value: DatePickerValue,
  variant: 'single' | 'range',
  placeholder: string,
): string {
  if (variant === 'range') {
    if (value.startDate && value.endDate) {
      return `${format(value.startDate, 'MMM d, yyyy')} – ${format(value.endDate, 'MMM d, yyyy')}`;
    }
    if (value.startDate) return format(value.startDate, 'MMM d, yyyy');
    return placeholder;
  }
  return value.startDate ? format(value.startDate, 'PPP') : placeholder;
}

function DatePicker({
  value,
  onChange,
  variant     = 'single',
  placeholder = 'Pick a date',
  disabled,
  className,
  minDate,
  maxDate,
  readOnly,
  error,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const hasValue = value.startDate !== null;

  const handleSingleSelect = (day: Date | undefined) => {
    onChange({ startDate: day ?? null, endDate: day ?? null });
    if (day) setOpen(false);
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    onChange({
      startDate: range?.from ?? null,
      endDate:   range?.to   ?? null,
    });
  };

  return (
    <Popover open={open} onOpenChange={disabled || readOnly ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <button
          type='button'
          disabled={disabled}
          aria-haspopup='dialog'
          aria-expanded={open}
          data-slot='date-picker-trigger'
          className={cn(
            'inline-flex h-11 w-full items-center justify-between gap-2',
            'rounded-[var(--radius-md)] border-2 px-3',
            'text-[length:var(--font-size-body1)] font-[var(--font-weight-regular)] font-[family-name:var(--font-rubik)]',
            'transition-colors outline-none',
            'focus-visible:ring-[3px] focus-visible:border-[color:var(--border-focus)] focus-visible:ring-[color:var(--border-focus)]/50',
            'disabled:cursor-not-allowed disabled:opacity-40',
            error
              ? 'border-[color:var(--helper-error)] text-[color:var(--text-primary)]'
              : hasValue
              ? 'border-[color:var(--border-default)] text-[color:var(--text-primary)]'
              : 'border-[color:var(--border-default)] text-[color:var(--text-muted)]',
            'bg-[color:var(--bg-surface)]',
            className,
          )}
        >
          <span className='truncate'>
            {formatLabel(value, variant, placeholder)}
          </span>
          <CalendarIcon
            className='size-4 shrink-0 text-[color:var(--text-muted)]'
            aria-hidden='true'
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className='w-auto p-0 shadow-[var(--shadow-md)]'
        align='start'
      >
        {variant === 'range' ? (
          <Calendar
            mode='range'
            selected={
              value.startDate
                ? { from: value.startDate, to: value.endDate ?? undefined }
                : undefined
            }
            onSelect={handleRangeSelect}
            startMonth={minDate}
            endMonth={maxDate}
            disabled={[
              ...(minDate ? [{ before: minDate }] : []),
              ...(maxDate ? [{ after:  maxDate }] : []),
            ]}
            numberOfMonths={2}
            autoFocus
          />
        ) : (
          <Calendar
            mode='single'
            selected={value.startDate ?? undefined}
            onSelect={handleSingleSelect}
            startMonth={minDate}
            endMonth={maxDate}
            disabled={[
              ...(minDate ? [{ before: minDate }] : []),
              ...(maxDate ? [{ after:  maxDate }] : []),
            ]}
            autoFocus
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
