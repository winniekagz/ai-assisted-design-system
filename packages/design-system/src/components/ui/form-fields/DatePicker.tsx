'use client';

import {
  Calendar,
  DateField,
  DatePicker as HeroDatePicker,
  DateRangePicker as HeroDateRangePicker,
  RangeCalendar,
} from '@heroui/react';
import {
  CalendarDate,
  getLocalTimeZone,
  today,
  type DateValue,
} from '@internationalized/date';
import * as React from 'react';
import { cn } from '../../../lib/utils';

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
  separator?: string;
  showShortcuts?: boolean;
  showFooter?: boolean;
  primaryColor?: string;
  configs?: Record<string, unknown>;
  error?: boolean;
}

type DatePickerStyle = React.CSSProperties & {
  '--componentiq-date-accent'?: string;
};

function dateToCalendarDate(date: Date | null | undefined) {
  if (!date) {
    return null;
  }

  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
}

function dateValueToDate(value: DateValue | null | undefined) {
  if (!value) {
    return null;
  }

  return new Date(value.year, value.month - 1, value.day);
}

function getPlaceholderValue(
  selectedDate: Date | null | undefined,
  minDate: Date | null | undefined
) {
  return (
    dateToCalendarDate(selectedDate) ??
    dateToCalendarDate(minDate) ??
    today(getLocalTimeZone())
  );
}

const datePickerThemeClassName =
  '[--background:var(--bg-default)] [--foreground:var(--text-primary,var(--text-paragraph))] [--surface:var(--bg-surface)] [--surface-foreground:var(--text-primary,var(--text-paragraph))] [--surface-secondary:var(--bg-secondary)] [--overlay:var(--bg-surface)] [--overlay-foreground:var(--text-primary,var(--text-paragraph))] [--field-background:var(--bg-surface)] [--field-foreground:var(--text-primary,var(--text-paragraph))] [--field-placeholder:var(--text-muted)] [--muted:var(--text-secondary,var(--text-muted))] [--default:var(--bg-secondary)] [--default-foreground:var(--text-primary,var(--text-paragraph))] [--accent:var(--componentiq-date-accent,var(--color-primary))] [--accent-foreground:var(--color-primary-fg,var(--text-inverse))] [--focus:var(--componentiq-date-accent,var(--color-primary))] [--disabled-opacity:1]';

const dateFieldClassName =
  'min-h-11 w-full rounded  bg-[color:var(--bg-surface)] text-[color:var(--text-primary,var(--text-paragraph))] shadow-none data-[invalid=true]:border-[color:var(--status-error)]';

const datePopoverClassName =
  'min-w-72 overflow-hidden rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-0 text-[color:var(--text-primary,var(--text-paragraph))] shadow-xl';

const dateCalendarClassName =
  'w-80 max-w-full p-4 text-[color:var(--text-primary,var(--text-paragraph))]';

const dateRangeCalendarClassName =
  'w-[min(42rem,calc(100vw-2rem))] max-w-full p-4 text-[color:var(--text-primary,var(--text-paragraph))]';

const dateCalendarHeaderClassName =
  'flex items-center justify-between px-0.5 pb-4 text-[color:var(--text-primary,var(--text-paragraph))]';

const dateCalendarHeadingClassName =
  'flex-1 text-center text-sm font-semibold text-[color:var(--text-primary,var(--text-paragraph))]';

const dateCalendarNavButtonClassName =
  'flex size-8 items-center justify-center rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] text-[color:var(--text-secondary,var(--text-muted))] shadow-sm hover:bg-[color:var(--bg-secondary)] hover:text-[color:var(--text-primary,var(--text-paragraph))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--componentiq-date-accent,var(--color-primary))]';

const dateCalendarHeaderCellClassName =
  'flex h-9 items-center justify-center text-xs font-semibold !text-[color:var(--text-primary,var(--text-paragraph))] !opacity-100';

const dateCalendarGridClassName = 'w-full border-separate border-spacing-y-1';

const todayIndicatorClassName =
  'after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-[color:var(--componentiq-date-accent,var(--color-primary))]';

function getCalendarCellClassName(state: any) {
  return cn(
    'relative flex aspect-square size-full items-center justify-center rounded-md text-center text-sm font-medium text-[color:var(--text-primary,var(--text-paragraph))] outline-none transition-colors',
    'hover:bg-[color:var(--bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--componentiq-date-accent,var(--color-primary))]',
    state?.isToday &&
      !state?.isSelected &&
      cn(
        'font-semibold text-[color:var(--componentiq-date-accent,var(--color-primary))]',
        todayIndicatorClassName
      ),
    state?.isOutsideMonth &&
      '!text-[color:var(--text-secondary,var(--text-primary))] !opacity-100',
    (state?.isDisabled || state?.isUnavailable) &&
      'cursor-not-allowed !text-[color:var(--text-disabled,var(--text-muted))] line-through',
    state?.isSelected &&
      'bg-[color:var(--componentiq-date-accent,var(--color-primary))] text-[color:var(--color-primary-fg,var(--text-inverse))] hover:bg-[color:var(--componentiq-date-accent,var(--color-primary))]'
  );
}

function getRangeCalendarCellClassName(state: any) {
  return cn(
    'relative z-1 h-9 text-[color:var(--text-primary,var(--text-paragraph))] outline-none transition-colors',
    state?.isSelected && 'bg-[color:var(--bg-secondary)]',
    state?.isSelectionStart && 'rounded-l-md',
    state?.isSelectionEnd && 'rounded-r-md',
    state?.isOutsideMonth &&
      '!text-[color:var(--text-secondary,var(--text-primary))] !opacity-100',
    (state?.isDisabled || state?.isUnavailable) &&
      'cursor-not-allowed !text-[color:var(--text-disabled,var(--text-muted))] line-through'
  );
}

function getRangeCalendarCellButtonClassName(state: any) {
  return cn(
    'relative flex aspect-square w-full items-center justify-center rounded-md text-sm font-medium text-[color:var(--text-primary,var(--text-paragraph))] transition-colors',
    'hover:bg-[color:var(--bg-secondary)]',
    state?.isToday &&
      !(state?.isSelectionStart || state?.isSelectionEnd) &&
      cn(
        'font-semibold text-[color:var(--componentiq-date-accent,var(--color-primary))]',
        todayIndicatorClassName
      ),
    state?.isOutsideMonth &&
      '!text-[color:var(--text-secondary,var(--text-primary))] !opacity-100',
    (state?.isDisabled || state?.isUnavailable) &&
      'cursor-not-allowed !text-[color:var(--text-disabled,var(--text-muted))] line-through',
    (state?.isSelectionStart || state?.isSelectionEnd) &&
      'bg-[color:var(--componentiq-date-accent,var(--color-primary))] text-[color:var(--color-primary-fg,var(--text-inverse))] shadow-sm hover:bg-[color:var(--componentiq-date-accent,var(--color-primary))]'
  );
}

function DatePickerCalendar({
  label,
  calendarProps,
}: {
  label: string;
  calendarProps?: Record<string, unknown>;
}) {
  return (
    <Calendar
      aria-label={label}
      {...calendarProps}
      className={cn(
        dateCalendarClassName,
        calendarProps?.className as string | undefined
      )}
    >
      <Calendar.Header className={dateCalendarHeaderClassName}>
        <Calendar.YearPickerTrigger className='inline-flex items-center gap-1 rounded px-1 text-[color:var(--text-primary,var(--text-paragraph))] hover:bg-[color:var(--bg-secondary)]'>
          <Calendar.YearPickerTriggerHeading
            className={dateCalendarHeadingClassName}
          />
          <Calendar.YearPickerTriggerIndicator className='text-[color:var(--text-secondary,var(--text-muted))]' />
        </Calendar.YearPickerTrigger>
        <Calendar.NavButton
          slot='previous'
          className={dateCalendarNavButtonClassName}
        />
        <Calendar.NavButton
          slot='next'
          className={dateCalendarNavButtonClassName}
        />
      </Calendar.Header>
      <Calendar.Grid className={dateCalendarGridClassName}>
        <Calendar.GridHeader>
          {day => (
            <Calendar.HeaderCell className={dateCalendarHeaderCellClassName}>
              {day}
            </Calendar.HeaderCell>
          )}
        </Calendar.GridHeader>
        <Calendar.GridBody>
          {date => (
            <Calendar.Cell date={date} className={getCalendarCellClassName}>
              {state => state.formattedDate}
            </Calendar.Cell>
          )}
        </Calendar.GridBody>
      </Calendar.Grid>
    </Calendar>
  );
}

function DateRangePickerCalendar({
  label,
  calendarProps,
}: {
  label: string;
  calendarProps?: Record<string, unknown>;
}) {
  return (
    <RangeCalendar
      aria-label={label}
      {...calendarProps}
      visibleDuration={calendarProps?.visibleDuration ?? { months: 2 }}
      className={cn(
        dateRangeCalendarClassName,
        calendarProps?.className as string | undefined
      )}
    >
      <RangeCalendar.Header className={dateCalendarHeaderClassName}>
        <RangeCalendar.YearPickerTrigger className='inline-flex items-center gap-1 rounded px-1 text-[color:var(--text-primary,var(--text-paragraph))] hover:bg-[color:var(--bg-secondary)]'>
          <RangeCalendar.YearPickerTriggerHeading
            className={dateCalendarHeadingClassName}
          />
          <RangeCalendar.YearPickerTriggerIndicator className='text-[color:var(--text-secondary,var(--text-muted))]' />
        </RangeCalendar.YearPickerTrigger>
        <RangeCalendar.NavButton
          slot='previous'
          className={dateCalendarNavButtonClassName}
        />
        <RangeCalendar.NavButton
          slot='next'
          className={dateCalendarNavButtonClassName}
        />
      </RangeCalendar.Header>
      <div className='grid gap-6 md:grid-cols-2'>
        {[0, 1].map(offset => (
          <RangeCalendar.Grid
            key={offset}
            offset={offset ? { months: offset } : undefined}
            className={dateCalendarGridClassName}
          >
            <RangeCalendar.GridHeader>
              {day => (
                <RangeCalendar.HeaderCell
                  className={dateCalendarHeaderCellClassName}
                >
                  {day}
                </RangeCalendar.HeaderCell>
              )}
            </RangeCalendar.GridHeader>
            <RangeCalendar.GridBody>
              {date => (
                <RangeCalendar.Cell
                  date={date}
                  className={getRangeCalendarCellClassName}
                >
                  {state => (
                    <span
                      className={getRangeCalendarCellButtonClassName(state)}
                    >
                      {state.formattedDate}
                    </span>
                  )}
                </RangeCalendar.Cell>
              )}
            </RangeCalendar.GridBody>
          </RangeCalendar.Grid>
        ))}
      </div>
    </RangeCalendar>
  );
}

function DateFieldGroup({ isRange = false }: { isRange?: boolean }) {
  if (isRange) {
    return (
      <DateField.Group fullWidth className={dateFieldClassName}>
        <DateField.InputContainer className='min-w-0 flex-1'>
          <DateField.Input slot='start' className='min-w-0 flex-1 px-3 py-2'>
            {segment => <DateField.Segment segment={segment} />}
          </DateField.Input>
          <HeroDateRangePicker.RangeSeparator className='px-1 text-[color:var(--text-secondary,var(--text-muted))]' />
          <DateField.Input slot='end' className='min-w-0 flex-1 px-3 py-2'>
            {segment => <DateField.Segment segment={segment} />}
          </DateField.Input>
        </DateField.InputContainer>
        <DateField.Suffix>
          <HeroDateRangePicker.Trigger className='size-9 justify-center rounded text-[color:var(--text-secondary,var(--text-muted))] hover:bg-[color:var(--bg-secondary)]'>
            <HeroDateRangePicker.TriggerIndicator className='text-[color:var(--text-secondary,var(--text-muted))]' />
          </HeroDateRangePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
    );
  }

  return (
    <DateField.Group fullWidth className={dateFieldClassName}>
      <DateField.Input className='min-w-0 flex-1 px-3 py-2'>
        {segment => <DateField.Segment segment={segment} />}
      </DateField.Input>
      <DateField.Suffix>
        <HeroDatePicker.Trigger className='size-9 justify-center rounded text-[color:var(--text-secondary,var(--text-muted))] hover:bg-[color:var(--bg-secondary)]'>
          <HeroDatePicker.TriggerIndicator className='text-[color:var(--text-secondary,var(--text-muted))]' />
        </HeroDatePicker.Trigger>
      </DateField.Suffix>
    </DateField.Group>
  );
}

const ComponentIqDatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  variant = 'single',
  placeholder = 'Pick a date',
  disabled = false,
  className = '',
  minDate,
  maxDate,
  readOnly = false,
  calendarProps = {},
  primaryColor,
  error = false,
}) => {
  const minValue = dateToCalendarDate(minDate);
  const maxValue = dateToCalendarDate(maxDate);
  const placeholderValue = getPlaceholderValue(value.startDate, minDate);
  const datePickerStyle: DatePickerStyle | undefined = primaryColor
    ? { '--componentiq-date-accent': primaryColor }
    : undefined;

  if (variant === 'range') {
    const start = dateToCalendarDate(value.startDate);
    const end = dateToCalendarDate(value.endDate);
    const rangeValue = start && end ? { start, end } : null;

    return (
      <HeroDateRangePicker
        aria-label={placeholder}
        value={rangeValue}
        onChange={nextValue => {
          onChange({
            startDate: dateValueToDate(nextValue?.start),
            endDate: dateValueToDate(nextValue?.end),
          });
        }}
        minValue={minValue ?? undefined}
        maxValue={maxValue ?? undefined}
        placeholderValue={placeholderValue}
        isDisabled={disabled}
        isReadOnly={readOnly}
        isInvalid={error}
        className={cn('w-full gap-1', datePickerThemeClassName, className)}
        style={datePickerStyle}
      >
        <DateFieldGroup isRange />
        <HeroDateRangePicker.Popover className={datePopoverClassName}>
          <DateRangePickerCalendar
            label={placeholder}
            calendarProps={calendarProps}
          />
        </HeroDateRangePicker.Popover>
      </HeroDateRangePicker>
    );
  }

  return (
    <HeroDatePicker
      aria-label={placeholder}
      value={dateToCalendarDate(value.startDate)}
      onChange={nextValue => {
        onChange({
          startDate: dateValueToDate(nextValue),
          endDate: null,
        });
      }}
      minValue={minValue ?? undefined}
      maxValue={maxValue ?? undefined}
      placeholderValue={placeholderValue}
      isDisabled={disabled}
      isReadOnly={readOnly}
      isInvalid={error}
      className={cn('w-full gap-1', datePickerThemeClassName, className)}
      style={datePickerStyle}
    >
      <DateFieldGroup />
      <HeroDatePicker.Popover className={datePopoverClassName}>
        <DatePickerCalendar label={placeholder} calendarProps={calendarProps} />
      </HeroDatePicker.Popover>
    </HeroDatePicker>
  );
};

export default ComponentIqDatePicker;
