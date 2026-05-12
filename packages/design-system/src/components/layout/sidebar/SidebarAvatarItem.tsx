'use client';

import * as React from 'react';
import { cn } from '../../../lib/utils';
import { Tooltip } from '../../ui/tooltip';

interface SidebarAvatarItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  name: string;
  src?: string;
  fallback?: string;
  subtitle?: string;
  badge?: string | number;
  active?: boolean;
  isCollapsed?: boolean;
}

export function SidebarAvatarItem({
  name,
  src,
  fallback,
  subtitle,
  badge,
  active,
  isCollapsed,
  className,
  ...props
}: SidebarAvatarItemProps) {
  const initials = fallback ?? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const avatar = (
    <span className='relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[color:var(--color-primary)] text-[color:var(--text-inverse)] text-[length:var(--font-size-xs)] font-semibold'>
      {src ? <img src={src} alt={name} className='h-full w-full object-cover' /> : initials}
    </span>
  );

  if (isCollapsed) {
    return (
      <Tooltip content={name} side='right' delayDuration={200}>
        <button
          className={cn(
            'flex w-full justify-center rounded-[var(--sb-radius,var(--radius-md))] p-2 transition-colors',
            active
              ? 'bg-[color:var(--sb-active,var(--bg-hover))] text-[color:var(--sb-active-text,var(--text-title))]'
              : 'hover:bg-[color:var(--sb-hover,var(--bg-hover))]',
            className
          )}
          {...props}
        >
          {avatar}
        </button>
      </Tooltip>
    );
  }

  return (
    <button
      className={cn(
        'flex w-full items-center gap-3 rounded-[var(--sb-radius,var(--radius-md))] px-3 py-2 text-left transition-colors',
        active
          ? 'bg-[color:var(--sb-active,var(--bg-hover))] text-[color:var(--sb-active-text,var(--text-title))]'
          : 'text-[color:var(--text-paragraph)] hover:bg-[color:var(--sb-hover,var(--bg-hover))]',
        className
      )}
      {...props}
    >
      {avatar}
      <div className='min-w-0 flex-1'>
        <p className='truncate text-[length:var(--font-size-body-sm)] font-medium leading-tight text-[color:var(--text-title)] [font-family:var(--font-heading)]'>
          {name}
        </p>
        {subtitle && (
          <p className='truncate text-[length:var(--font-size-xs)] text-[color:var(--sb-muted,var(--text-muted))] [font-family:var(--font-rubik)]'>
            {subtitle}
          </p>
        )}
      </div>
      {badge != null && (
        <span className='flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--sb-accent,var(--color-primary))] px-1 text-[length:var(--font-size-xs)] font-semibold text-[color:var(--text-inverse)]'>
          {badge}
        </span>
      )}
    </button>
  );
}
