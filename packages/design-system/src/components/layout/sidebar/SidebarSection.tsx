'use client';

import * as React from 'react';
import { cn } from '../../../lib/utils';

interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  isCollapsed?: boolean;
  action?: React.ReactNode;
}

export function SidebarSection({
  label,
  isCollapsed,
  action,
  children,
  className,
}: SidebarSectionProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && !isCollapsed && (
        <div className='flex items-center justify-between px-3 pb-1 pt-3'>
          <span className='text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-[color:var(--sb-muted,var(--text-muted))] [font-family:var(--font-heading)]'>
            {label}
          </span>
          {action}
        </div>
      )}
      <div className='flex flex-col gap-0.5'>{children}</div>
    </div>
  );
}
