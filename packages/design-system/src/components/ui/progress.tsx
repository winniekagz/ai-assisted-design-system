import * as React from 'react';

import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  label?: React.ReactNode;
  showValue?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    { className, value = 0, max = 100, label, showValue = false, ...props },
    ref
  ) => {
    const normalizedValue = Math.min(Math.max(value, 0), max);
    const percentage = max > 0 ? Math.round((normalizedValue / max) * 100) : 0;

    return (
      <div
        ref={ref}
        className={cn('grid gap-[var(--spacing-xs)]', className)}
        {...props}
      >
        {(label || showValue) && (
          <div className='flex items-center justify-between gap-[var(--spacing-sm)] text-[length:var(--font-size-body-sm)] text-[color:var(--text-secondary)] [font-family:var(--font-rubik)]'>
            <span>{label}</span>
            {showValue && <span>{percentage}%</span>}
          </div>
        )}
        <div
          role='progressbar'
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={normalizedValue}
          className='h-[var(--spacing-sm)] overflow-hidden rounded-[var(--radius-full)] bg-[color:var(--bg-secondary)]'
        >
          <div
            className='h-full rounded-[var(--radius-full)] bg-[color:var(--color-primary)] transition-[width] duration-[var(--motion-normal)] ease-[var(--motion-easing)]'
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };
