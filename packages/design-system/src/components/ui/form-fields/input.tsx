'use client';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const inputVariants = cva(
  [
    'peer w-full bg-transparent font-[family-name:var(--font-rubik)] text-[length:var(--font-size-body1)]',
    'font-[var(--font-weight-regular)] leading-[var(--line-height-body1)] tracking-[0.15px]',
    'text-[color:var(--text-paragraph)]',
    'rounded-[var(--radius-md)] border px-3 py-2',
    'shadow-none outline-1 transition-colors duration-[var(--duration-normal)]',
    'placeholder:text-[color:var(--text-disabled)]',
    // focus:outline-none suppresses the browser's outline-style:auto injected on :focus
    // ring-0 offset means the ring sits flush against the border-radius — no sharp gap
    'focus:outline-none focus-visible:outline-none',
    // on focus: hide the gray border, show only the primary ring
    'focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-0',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[color:var(--bg-secondary)]',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
  ],
  {
    variants: {
      variant: {
        default:
          'border-[color:var(--border-default)] hover:border-[color:var(--text-muted)]',
        outline:
          'border-[color:var(--border-default)] hover:border-[color:var(--text-muted)] bg-transparent',
        text: 'border-transparent focus:border-transparent hover:bg-[color:var(--bg-hover)] shadow-none',
        error:
          'border-[color:var(--helper-error)] focus-visible:ring-[color:var(--helper-error)]',
        success:
          'border-[color:var(--helper-success)] focus-visible:ring-[color:var(--helper-success)]',
      },
      size: {
        default: 'h-11 px-3 text-[length:var(--font-size-body1)]',
        sm: 'h-9 px-2 text-[length:var(--font-size-sm)]',
        lg: 'h-12 px-4 text-[length:var(--font-size-lg)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
  success?: boolean;
  label?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onStartIconClick?: () => void;
  onEndIconClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      error,
      success,
      label,
      helperText,
      startIcon,
      endIcon,
      onStartIconClick,
      onEndIconClick,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? React.useId();
    const helperId = helperText ? `${inputId}-helper` : undefined;

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
            htmlFor={inputId}
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
        <div className='relative'>
          <input
            id={inputId}
            className={cn(
              inputVariants({ variant: finalVariant, size }),
              startIcon && 'pl-10',
              endIcon && 'pr-10',
              className
            )}
            ref={ref}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={helperId}
            {...props}
          />
          {startIcon && (
            <div
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] flex items-center',
                onStartIconClick && 'cursor-pointer hover:text-[color:var(--text-paragraph)]'
              )}
              onClick={onStartIconClick}
              aria-hidden='true'
            >
              {startIcon}
            </div>
          )}
          {endIcon && (
            <div
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)] flex items-center',
                onEndIconClick && 'cursor-pointer hover:text-[color:var(--text-paragraph)]'
              )}
              onClick={onEndIconClick}
              aria-hidden='true'
            >
              {endIcon}
            </div>
          )}
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
Input.displayName = 'Input';

export { Input, inputVariants };
