'use client';

import * as React from 'react';
import { cn } from '../../../lib/utils';

interface SidebarCTAProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action: string;
  onAction?: () => void;
  isCollapsed?: boolean;
}

export function SidebarCTA({
  title,
  description,
  action,
  onAction,
  isCollapsed,
  className,
}: SidebarCTAProps) {
  if (isCollapsed) return null;

  return (
    <div className={cn('mx-3 mb-2 rounded-[var(--sb-radius,var(--radius-lg))] border border-[color:var(--border-subtle)] bg-[color:var(--bg-secondary)] p-3', className)}>
      <p className='text-[length:var(--font-size-body-sm)] font-semibold text-[color:var(--text-title)] [font-family:var(--font-heading)]'>
        {title}
      </p>
      {description && (
        <p className='mt-1 text-[length:var(--font-size-xs)] text-[color:var(--text-secondary)] [font-family:var(--font-rubik)]'>
          {description}
        </p>
      )}
      <button
        onClick={onAction}
        className='mt-2 w-full rounded-[var(--sb-radius,var(--radius-md))] bg-[color:var(--sb-accent,var(--color-primary))] px-3 py-1.5 text-[length:var(--font-size-xs)] font-semibold text-[color:var(--text-inverse)] transition-opacity hover:opacity-90 [font-family:var(--font-heading)]'
      >
        {action}
      </button>
    </div>
  );
}
