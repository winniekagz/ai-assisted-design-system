'use client';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

const selectVariants = cva(
  [
    // appearance-none removes the browser's built-in arrow; we render our own ChevronDown
    'w-full appearance-none',
    'font-[family-name:var(--font-rubik)] text-[length:var(--font-size-body1)]',
    'font-[var(--font-weight-regular)] leading-[var(--line-height-body1)] tracking-[0.15px]',
    'text-[color:var(--text-paragraph)]',
    'rounded-[var(--radius-md)] border bg-[color:var(--bg-surface)]',
    'outline-none cursor-pointer',
    'transition-colors duration-[var(--duration-normal)]',
    'focus:outline-none focus-visible:outline-none',
    'focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-0',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[color:var(--bg-secondary)]',
  ],
  {
    variants: {
      variant: {
        default:
          'border-[color:var(--border-default)] hover:border-[color:var(--text-muted)]',
        error:
          'border-[color:var(--helper-error)] focus-visible:ring-[color:var(--helper-error)]',
        success:
          'border-[color:var(--helper-success)] focus-visible:ring-[color:var(--helper-success)]',
      },
      size: {
        // pr-10 reserves space for the ChevronDown icon
        default: 'h-11 pl-4 pr-10',
        sm: 'h-9 pl-3 pr-9 text-[length:var(--font-size-sm)]',
        lg: 'h-12 pl-4 pr-10 text-[length:var(--font-size-lg)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  error?: boolean;
  success?: boolean;
  placeholder?: string;
  label?: string;
  helperText?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      variant,
      size,
      error,
      success,
      placeholder,
      label,
      helperText,
      children,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id ?? React.useId();
    const helperId = helperText ? `${selectId}-helper` : undefined;

    let finalVariant = variant;
    if (error) finalVariant = 'error';
    if (success) finalVariant = 'success';

    const helperColor = error
      ? 'text-[color:var(--helper-error)]'
      : success
        ? 'text-[color:var(--helper-success)]'
        : 'text-[color:var(--text-muted)]';

    return (
      <div className='flex flex-col gap-[var(--spacing-xs)] w-full'>
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              'text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] leading-[var(--line-height-snug)] font-[family-name:var(--font-rubik)]',
              error
                ? 'text-[color:var(--helper-error)]'
                : 'text-[color:var(--text-secondary)]'
            )}
          >
            {label}
            {props.required && (
              <span className='text-[color:var(--helper-error)] ml-1' aria-hidden='true'>*</span>
            )}
          </label>
        )}
        <div className='relative w-full'>
          <select
            id={selectId}
            className={cn(selectVariants({ variant: finalVariant, size }), className)}
            ref={ref}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={helperId}
            {...props}
          >
            {placeholder && (
              <option value='' disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>
          {/* Custom chevron — pointer-events-none so clicks pass through to the select */}
          <ChevronDown
            aria-hidden='true'
            className={cn(
              'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2',
              'text-[color:var(--text-muted)]',
              size === 'sm' ? 'size-3.5' : 'size-4',
            )}
          />
        </div>
        {helperText && (
          <p
            id={helperId}
            className={cn(
              'text-[length:var(--font-size-xs)] leading-[var(--line-height-snug)] font-[family-name:var(--font-rubik)]',
              helperColor
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select, selectVariants };
