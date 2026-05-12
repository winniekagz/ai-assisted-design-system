'use client';

import { Search } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../../lib/utils';

interface SidebarSearchProps {
  placeholder?: string;
  shortcut?: string;
  value?: string;
  onChange?: (value: string) => void;
  isCollapsed?: boolean;
  className?: string;
}

export function SidebarSearch({
  placeholder = 'Search…',
  shortcut,
  value,
  onChange,
  isCollapsed,
  className,
}: SidebarSearchProps) {
  if (isCollapsed) {
    return (
      <div className='flex justify-center px-2 py-1'>
        <button className='flex h-8 w-8 items-center justify-center rounded-[var(--sb-radius,var(--radius-md))] text-[color:var(--sb-muted,var(--text-muted))] hover:bg-[color:var(--sb-hover,var(--bg-hover))] transition-colors'>
          <Search className='size-4' />
        </button>
      </div>
    );
  }

  return (
    <div className={cn('px-3 py-1', className)}>
      <div className='relative flex items-center gap-2 rounded-[var(--sb-radius,var(--radius-md))] border border-[color:var(--border-subtle)] bg-[color:var(--bg-default)] px-3 h-9'>
        <Search className='size-4 shrink-0 text-[color:var(--sb-muted,var(--text-muted))]' />
        <input
          type='search'
          placeholder={placeholder}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className='flex-1 bg-transparent text-[length:var(--font-size-body-sm)] text-[color:var(--text-paragraph)] placeholder:text-[color:var(--text-muted)] outline-none [font-family:var(--font-rubik)]'
        />
        {shortcut && (
          <kbd className='hidden shrink-0 text-[length:var(--font-size-xs)] text-[color:var(--text-muted)] sm:inline-flex items-center gap-0.5 rounded border border-[color:var(--border-subtle)] px-1.5 py-0.5 font-mono'>
            {shortcut}
          </kbd>
        )}
      </div>
    </div>
  );
}
