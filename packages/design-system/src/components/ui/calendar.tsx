import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { cn } from '../../lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={false}
      className={cn('p-3 min-w-72', className)}
      classNames={{
        months:
          'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 gap-4',
        month:
          'space-y-4 bg-[color:var(--bg-surface)] rounded-[var(--radius-md)]',
        caption: 'hidden',
        caption_label: 'hidden',
        nav: 'space-x-1 flex gap-4',
        nav_button: cn(
          'h-7 w-7 bg-[color:var(--bg-secondary)] p-0 text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-hover)] hover:text-[color:var(--text-title)] rounded-[var(--radius-sm)]'
        ),
        button_previous:
          'absolute left-1 bg-[color:var(--color-primary)] text-[color:var(--text-inverse)] rounded-[var(--radius-sm)]',
        button_next:
          'absolute right-1 bg-[color:var(--color-primary)] text-[color:var(--text-inverse)] rounded-[var(--radius-sm)]',

        table: 'w-full border-collapse space-y-1',
        head_row: 'flex flex-row',
        head_cell:
          'text-[color:var(--text-secondary)] rounded-[var(--radius-md)] w-9 font-normal text-[length:var(--font-size-caption)]',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-[var(--radius-md)] [&:has([aria-selected].day-outside)]:bg-[color:var(--bg-hover)] [&:has([aria-selected])]:bg-[color:var(--bg-hover)] first:[&:has([aria-selected])]:rounded-l-[var(--radius-md)] last:[&:has([aria-selected])]:rounded-r-[var(--radius-md)] focus-within:relative focus-within:z-20',
        day: cn(
          'h-9 w-9 p-0 font-normal aria-selected:bg-[color:var(--color-primary)] aria-selected:rounded-full aria-selected:text-[color:var(--text-inverse)] text-center hover:bg-[color:var(--bg-hover)] hover:text-[color:var(--color-primary)] rounded-[var(--radius-md)]'
        ),
        day_range_end: 'day-range-end',
        day_selected: 'rdp-day_selected bg-[color:var(--color-primary)]',
        day_today:
          'bg-[color:var(--color-primary)] rounded-full text-[color:var(--text-inverse)]',
        day_outside:
          'day-outside text-[color:var(--text-disabled)] aria-selected:bg-[color:var(--bg-hover)] aria-selected:text-[color:var(--text-disabled)]',
        day_disabled: 'text-[color:var(--text-disabled)]',
        day_range_middle:
          'aria-selected:bg-[color:var(--bg-hover)] aria-selected:text-[color:var(--text-paragraph)]',
        day_hidden: 'invisible',
        dropdown_month: 'rdp-dropdown_month',
        dropdown_year: 'rdp-dropdown_year',
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
