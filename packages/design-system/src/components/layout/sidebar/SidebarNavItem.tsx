import { cn } from '@/lib/utils';
import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { Typography } from '../../ui/typography';

interface SidebarNavItemProps extends React.HTMLAttributes<HTMLLIElement> {
  icon?: React.ReactNode;
  title: string;
  active?: boolean;
  disabled?: boolean;
  level?: number;
  expandable?: boolean;
  expanded?: boolean;
}

export const SidebarNavItem = React.forwardRef<
  HTMLLIElement,
  SidebarNavItemProps
>(
  (
    {
      icon,
      title,
      active,
      disabled,
      level = 0,
      expandable,
      expanded,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const levelPadding = `pl-${level * 4}`; // Adjust as needed, or use a map
    return (
      <li
        ref={ref}
        className={cn(
          'group flex w-full items-center rounded px-2 py-1 transition-colors',
          disabled && 'opacity-50 pointer-events-none',
          active ? 'bg-background-hover' : 'hover:bg-background-hover',
          className,
          levelPadding
        )}
        {...props}
      >
        {/* Icon + title container */}
        <div className='flex items-center gap-3 flex-grow min-w-0'>
          {icon && <span className='h-4 w-4 shrink-0'>{icon}</span>}
          <Typography variant='body1' className='truncate'>
            {title}
          </Typography>
        </div>

        {/* Chevron wrapper always rendered to prevent shift */}
        <div className='ml-2 h-4 w-4 flex items-center justify-center'>
          {expandable && (
            <ChevronDown
              className={cn('h-4 w-4 ', expanded ? 'rotate-180' : 'rotate-0')}
            />
          )}
        </div>

        {/* Optional expandable children */}
        {children}
      </li>
    );
  }
);

SidebarNavItem.displayName = 'SidebarNavItem';
