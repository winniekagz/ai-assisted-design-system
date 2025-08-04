// components/ui/sidebar-nav-item.tsx
import { cn } from '@/lib/utils';
import * as React from 'react';

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
    return (
      <li
        ref={ref}
        className={cn(
          'group flex items-center gap-3 w-full cursor-pointer rounded px-3 py-2 text-sm transition-colors',
          disabled && 'opacity-50 pointer-events-none',
          active
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-primary/5 text-muted-foreground',
          level > 0 && `pl-${level * 4}`,
          className
        )}
        {...props}
      >
        {icon && <span className='h-4 w-4'>{icon}</span>}
        <span className='flex-1 text-left'>{title}</span>
        {expandable && (
          <span className={cn('transition-transform', expanded && 'rotate-90')}>
            ▶
          </span>
        )}
        {children}
      </li>
    );
  }
);

SidebarNavItem.displayName = 'SidebarNavItem';
