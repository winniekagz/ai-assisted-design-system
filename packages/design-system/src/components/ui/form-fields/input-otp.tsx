'use client';

import { Minus } from 'lucide-react';
import * as React from 'react';
import {
  OTPInput,
  OTPInputContext,
  REGEXP_ONLY_CHARS,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
  type OTPInputProps,
} from 'input-otp';

import { cn } from '@/lib/utils';

export type InputOTPSize = 'sm' | 'default' | 'lg';

export type InputOTPProps = Omit<OTPInputProps, 'render' | 'size'> & {
  label?: string;
  helperText?: string;
  error?: boolean;
  success?: boolean;
  size?: InputOTPSize;
};

const ComponentIqInputOTPContext = React.createContext<{
  size: InputOTPSize;
  error?: boolean;
  success?: boolean;
}>({
  size: 'default',
});

const slotSizeClasses: Record<InputOTPSize, string> = {
  sm: '[--otp-slot-size:2.25rem] [--otp-slot-font-size:var(--font-size-sm)]',
  default:
    '[--otp-slot-size:2.75rem] [--otp-slot-font-size:var(--font-size-body1)]',
  lg: '[--otp-slot-size:3rem] [--otp-slot-font-size:var(--font-size-lg)]',
};

const InputOTP = React.forwardRef<HTMLInputElement, InputOTPProps>(
  (
    {
      className,
      containerClassName,
      label,
      helperText,
      error,
      success,
      size = 'default',
      id,
      required,
      disabled,
      children,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const describedBy = [ariaDescribedBy, helperId].filter(Boolean).join(' ');
    const helperColor = error
      ? 'text-[color:var(--helper-error)]'
      : success
        ? 'text-[color:var(--helper-success)]'
        : 'text-[color:var(--text-muted)]';

    return (
      <div
        className='flex w-full flex-col gap-[var(--spacing-xs)]'
        data-size={size}
        data-error={error ? 'true' : undefined}
        data-success={success ? 'true' : undefined}
      >
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] leading-[var(--line-height-snug)] [font-family:var(--font-rubik)]',
              error
                ? 'text-[color:var(--helper-error)]'
                : 'text-[color:var(--text-secondary)]'
            )}
          >
            {label}
            {required && (
              <span
                className='ml-1 text-[color:var(--helper-error)]'
                aria-hidden='true'
              >
                *
              </span>
            )}
          </label>
        )}
        <OTPInput
          id={inputId}
          ref={ref}
          required={required}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          data-size={size}
          data-error={error ? 'true' : undefined}
          data-success={success ? 'true' : undefined}
          containerClassName={cn(
            'group flex min-h-[var(--otp-slot-size,2.75rem)] items-center gap-[var(--spacing-sm)] has-[:disabled]:opacity-50',
            slotSizeClasses[size],
            containerClassName
          )}
          className={cn('disabled:cursor-not-allowed', className)}
          {...props}
        >
          <ComponentIqInputOTPContext.Provider value={{ size, error, success }}>
            {children}
          </ComponentIqInputOTPContext.Provider>
        </OTPInput>
        {helperText && (
          <p
            id={helperId}
            className={cn(
              'text-[length:var(--font-size-xs)] leading-[var(--line-height-snug)] [font-family:var(--font-rubik)]',
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
InputOTP.displayName = 'InputOTP';

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-[var(--spacing-sm)]', className)}
    {...props}
  />
));
InputOTPGroup.displayName = 'InputOTPGroup';

const InputOTPSlot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    index: number;
    size?: InputOTPSize;
    error?: boolean;
    success?: boolean;
  }
>(({ index, size, error, success, className, style, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const componentContext = React.useContext(ComponentIqInputOTPContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];
  const resolvedSize = size ?? componentContext.size;
  const isError = error ?? componentContext.error;
  const isSuccess = success ?? componentContext.success;

  return (
    <div
      ref={ref}
      data-active={isActive ? 'true' : undefined}
      data-error={isError ? 'true' : undefined}
      data-success={isSuccess ? 'true' : undefined}
      aria-invalid={isError ? 'true' : undefined}
      style={{
        width: 'var(--otp-slot-size, 2.75rem)',
        height: 'var(--otp-slot-size, 2.75rem)',
        minWidth: 'var(--otp-slot-size, 2.75rem)',
        fontSize: 'var(--otp-slot-font-size, var(--font-size-body1))',
        ...style,
      }}
      className={cn(
        'relative flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] text-center font-[var(--font-weight-regular)] leading-[var(--line-height-body1)] text-[color:var(--text-paragraph)] shadow-none transition-colors duration-[var(--duration-normal)] [font-family:var(--font-rubik)]',
        'h-[var(--otp-slot-size,2.75rem)] w-[var(--otp-slot-size,2.75rem)] min-w-[var(--otp-slot-size,2.75rem)] text-[length:var(--otp-slot-font-size,var(--font-size-body1))]',
        'group-hover:border-[color:var(--text-muted)]',
        'data-[active=true]:border-transparent data-[active=true]:ring-2 data-[active=true]:ring-[color:var(--color-primary)]',
        'data-[error=true]:border-[color:var(--helper-error)] data-[error=true]:data-[active=true]:ring-[color:var(--helper-error)]',
        'data-[success=true]:border-[color:var(--helper-success)] data-[success=true]:data-[active=true]:ring-[color:var(--helper-success)]',
        'group-has-[:disabled]:cursor-not-allowed group-has-[:disabled]:bg-[color:var(--bg-secondary)]',
        slotSizeClasses[resolvedSize],
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
          <div className='h-4 w-px animate-pulse bg-[color:var(--text-title)]' />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = 'InputOTPSlot';

const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role='separator'
    className={cn(
      'flex items-center text-[color:var(--text-muted)]',
      className
    )}
    {...props}
  >
    <Minus className='size-4' aria-hidden='true' />
  </div>
));
InputOTPSeparator.displayName = 'InputOTPSeparator';

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  REGEXP_ONLY_CHARS,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS,
};
