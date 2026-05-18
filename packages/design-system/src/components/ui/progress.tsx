import * as React from 'react';

import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  label?: React.ReactNode;
  showValue?: boolean;
  variant?: 'linear' | 'radial';
  size?: number;
  strokeWidth?: number;
  status?: React.ReactNode;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      label,
      showValue = false,
      variant = 'linear',
      size = 96,
      strokeWidth = 8,
      status,
      ...props
    },
    ref
  ) => {
    const normalizedValue = Math.min(Math.max(value, 0), max);
    const percentage = max > 0 ? Math.round((normalizedValue / max) * 100) : 0;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    if (variant === 'radial') {
      return (
        <div
          ref={ref}
          className={cn('inline-grid place-items-center', className)}
          {...props}
        >
          <div
            className='relative grid place-items-center'
            style={{ width: size, height: size }}
          >
            <svg
              role='progressbar'
              aria-valuemin={0}
              aria-valuemax={max}
              aria-valuenow={normalizedValue}
              aria-label={typeof label === 'string' ? label : undefined}
              className='-rotate-90'
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill='none'
                stroke='var(--bg-secondary)'
                strokeWidth={strokeWidth}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill='none'
                stroke='var(--color-primary)'
                strokeLinecap='round'
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className='transition-[stroke-dashoffset] duration-[var(--motion-normal)] ease-[var(--motion-easing)]'
              />
              <circle
                cx={size / 2}
                cy={strokeWidth / 2}
                r={Math.max(strokeWidth / 2 - 1, 3)}
                fill='var(--bg-surface)'
                stroke='var(--color-primary)'
                strokeWidth={Math.max(strokeWidth / 3, 2)}
                transform={`rotate(${(percentage / 100) * 360} ${size / 2} ${size / 2})`}
                className='transition-transform duration-[var(--motion-normal)] ease-[var(--motion-easing)]'
              />
            </svg>
            <div className='absolute inset-0 grid place-items-center text-center'>
              <div>
                <div className='text-[length:var(--font-size-heading-6)] font-semibold leading-none text-[color:var(--text-title)] [font-family:var(--font-heading)]'>
                  {percentage}%
                </div>
                {(status || label) && (
                  <div className='mt-1 text-[10px] font-medium leading-none text-[color:var(--text-muted)] [font-family:var(--font-rubik)]'>
                    {status || label}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

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
