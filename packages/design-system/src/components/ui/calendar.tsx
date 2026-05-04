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
      className={cn('p-3  min-w-72', className)}
      classNames={{
        months:
          'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 gap-4 ',
        month: 'space-y-4 bg-paper rounded-1',
        caption: 'hidden',
        caption_label: 'hidden',
        nav: 'space-x-1 flex gap-4  bg-primary',
        nav_button: cn(
          'h-7 w-7 bg-blue-50 p-0 opacity-50 hover:opacity-100 hover:bg-accent rounded-sm'
        ),
        button_previous:
          'absolute left-1 bg-primary-500 text-white rounded-[4px]',
        button_next: 'absolute right-1 bg-primary-500 text-white rounded-[4px]',

        table: 'w-full border-collapse space-y-1 bg-red-500',
        head_row: 'flex flex-row bg-yellow-500',
        head_cell:
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] ',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          'h-9 w-9 p-0 font-normal aria-selected:bg-primary aria-selected:rounded-full  aria-selected:text-white text-center hover:bg-accent hover:text-primary rounded-md'
        ),
        day_range_end: 'day-range-end',
        day_selected: 'rdp-day_selected bg-primary-500',
        day_today: 'bg-primary-500 rounded-full text-primary',
        day_outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
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
