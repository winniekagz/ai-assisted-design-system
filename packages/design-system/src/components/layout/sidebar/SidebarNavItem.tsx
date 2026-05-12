'use client';

import { ChevronDown } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../lib/utils';
import { Tooltip } from '../../ui/tooltip';

interface SidebarNavItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  title: string;
  active?: boolean;
  disabled?: boolean;
  level?: number;
  expandable?: boolean;
  expanded?: boolean;
  badge?: string | number;
  isCollapsed?: boolean;
}

export const SidebarNavItem = React.forwardRef<HTMLButtonElement, SidebarNavItemProps>(
  (
    {
      icon,
      title,
      active,
      disabled,
      level = 0,
      expandable,
      expanded,
      badge,
      isCollapsed,
      className,
      ...props
    },
    ref
  ) => {
    const indent = level > 0 ? { paddingLeft: `${(level * 12) + 12}px` } : {};

    if (isCollapsed && level === 0) {
      return (
        <Tooltip content={title} side='right' delayDuration={200}>
          <button
            ref={ref}
            disabled={disabled}
            className={cn(
              'flex w-full justify-center items-center rounded-[var(--sb-radius,var(--radius-md))] p-2 transition-colors outline-none',
              'focus-visible:ring-2 focus-visible:ring-[color:var(--border-focus)]',
              active
                ? 'bg-[color:var(--sb-active,var(--bg-hover))] text-[color:var(--sb-active-text,var(--text-title))]'
                : 'text-[color:var(--text-paragraph)] hover:bg-[color:var(--sb-hover,var(--bg-hover))] hover:text-[color:var(--text-title)]',
              disabled && 'pointer-events-none opacity-40',
              className
            )}
            {...props}
          >
            {icon && <span className='size-5 shrink-0 flex items-center justify-center'>{icon}</span>}
          </button>
        </Tooltip>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        style={indent}
        className={cn(
          'group flex w-full items-center gap-3 rounded-[var(--sb-radius,var(--radius-md))] px-3 py-2 text-left transition-colors outline-none',
          'focus-visible:ring-2 focus-visible:ring-[color:var(--border-focus)] focus-visible:ring-inset',
          active
            ? 'bg-[color:var(--sb-active,var(--bg-hover))] text-[color:var(--sb-active-text,var(--text-title))] font-semibold'
            : 'text-[color:var(--text-paragraph)] hover:bg-[color:var(--sb-hover,var(--bg-hover))] hover:text-[color:var(--text-title)]',
          disabled && 'pointer-events-none opacity-40',
          className
        )}
        {...props}
      >
        {icon && (
          <span className='size-4 shrink-0 flex items-center justify-center text-[color:var(--text-secondary)] group-hover:text-current'>
            {icon}
          </span>
        )}
        <span className='min-w-0 flex-1 truncate text-[length:var(--font-size-body-sm)] [font-family:var(--font-rubik)]'>
          {title}
        </span>
        {badge != null && (
          <span className='flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--sb-badge-bg,var(--bg-secondary))] px-1.5 text-[length:var(--font-size-xs)] font-semibold text-[color:var(--text-secondary)]'>
            {badge}
          </span>
        )}
        {expandable && (
          <ChevronDown
            className={cn(
              'size-4 shrink-0 text-[color:var(--text-muted)] transition-transform duration-[var(--motion-normal)]',
              expanded && 'rotate-180'
            )}
          />
        )}
      </button>
    );
  }
);

SidebarNavItem.displayName = 'SidebarNavItem';
