

'use client';

import { ChevronUp } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../lib/utils';

interface SidebarUserFooterProps extends React.HTMLAttributes<HTMLButtonElement> {
  name: string;
  role?: string;
  avatarSrc?: string;
  avatarFallback?: string;
  isCollapsed?: boolean;
  progress?: number;
  progressLabel?: string;
}

export function SidebarUserFooter({
  name,
  role,
  avatarSrc,
  avatarFallback,
  isCollapsed,
  progress,
  progressLabel,
  className,
  ...props
}: SidebarUserFooterProps) {
  const initials = avatarFallback ?? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const avatar = (
    <span className='flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[color:var(--color-primary)] text-[color:var(--text-inverse)] text-[length:var(--font-size-xs)] font-semibold'>
      {avatarSrc ? <img src={avatarSrc} alt={name} className='h-full w-full object-cover' /> : initials}
    </span>
  );

  if (isCollapsed) {
    return (
      <button
        className={cn('flex w-full justify-center p-2 hover:bg-[color:var(--sb-hover,var(--bg-hover))] rounded-[var(--sb-radius,var(--radius-md))] transition-colors', className)}
        title={name}
        {...props}
      >
        {avatar}
      </button>
    );
  }

  return (
    <div className={cn('px-3 pb-3', className)}>
      <button
        className='flex w-full items-center gap-3 rounded-[var(--sb-radius,var(--radius-md))] p-2 hover:bg-[color:var(--sb-hover,var(--bg-hover))] transition-colors text-left'
        {...props}
      >
        {avatar}
        <div className='min-w-0 flex-1'>
          <p className='truncate text-[length:var(--font-size-body-sm)] font-semibold text-[color:var(--text-title)] [font-family:var(--font-heading)]'>
            {name}
          </p>
          {role && (
            <p className='truncate text-[length:var(--font-size-xs)] text-[color:var(--sb-muted,var(--text-muted))] [font-family:var(--font-rubik)]'>
              {role}
            </p>
          )}
        </div>
        <ChevronUp className='size-4 shrink-0 text-[color:var(--text-muted)]' />
      </button>
      {progress != null && (
        <div className='mt-2 px-2'>
          {progressLabel && (
            <p className='mb-1 text-[length:var(--font-size-xs)] text-[color:var(--text-muted)] [font-family:var(--font-rubik)]'>
              {progressLabel}
            </p>
          )}
          <div className='h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--bg-secondary)]'>
            <div
              className='h-full rounded-full bg-[color:var(--sb-accent,var(--color-primary))] transition-[width] duration-[var(--motion-normal)]'
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
