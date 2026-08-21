'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import {
  createInputSecurityProcessor,
  type InputNormalizationPolicy,
  type InputValidationResult,
} from '@/lib/input-security';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  [
    'peer w-full bg-transparent font-[family-name:var(--font-rubik)] text-[length:var(--font-size-body1)]',
    'font-[var(--font-weight-regular)] leading-[var(--line-height-body1)] tracking-[0.15px]',
    'text-[color:var(--text-paragraph)]',
    'rounded-[var(--radius-md)] border px-3 py-2',
    'shadow-none outline-1 transition-colors duration-[var(--duration-normal)]',
    'placeholder:text-[color:var(--text-disabled)]',
    'focus:outline-none focus-visible:outline-none',

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

// Passing `inputSecurityPolicy` without `onNormalizedValueChange` is a compile-time
// error on purpose: the processor computes a normalized value but never applies it on
// its own (see input-security.ts), so a consumer must explicitly accept the normalized
// value back — otherwise the policy is silently advisory-only.
type InputSecurityProps =
  | {
      inputSecurityPolicy?: undefined;
      onInputValidationResult?: never;
      onNormalizedValueChange?: never;
    }
  | {
      inputSecurityPolicy: InputNormalizationPolicy;
      // eslint-disable-next-line no-unused-vars
      onInputValidationResult?: (result: InputValidationResult) => void;
      // eslint-disable-next-line no-unused-vars
      onNormalizedValueChange: (value: string) => void;
    };

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> &
  VariantProps<typeof inputVariants> & {
    error?: boolean;
    success?: boolean;
    label?: string;
    helperText?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    onStartIconClick?: () => void;
    onEndIconClick?: () => void;
  } & InputSecurityProps;

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
      inputSecurityPolicy,
      onInputValidationResult,
      onNormalizedValueChange,
      id,
      onBlur,
      onChange,
      onCompositionEnd,
      onCompositionStart,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const isComposingRef = React.useRef(false);
    const inputSecurityProcessor = React.useMemo(
      () =>
        inputSecurityPolicy
          ? createInputSecurityProcessor({
              policy: inputSecurityPolicy,
              onValidationResult: onInputValidationResult,
              onNormalizedValue: value => onNormalizedValueChange?.(value),
            })
          : null,
      [inputSecurityPolicy, onInputValidationResult, onNormalizedValueChange]
    );

    let finalVariant = variant;
    if (error) finalVariant = 'error';
    if (success) finalVariant = 'success';

    const helperColor = error
      ? 'text-[color:var(--helper-error)]'
      : success
        ? 'text-[color:var(--helper-success)]'
        : 'text-[color:var(--text-muted)]';

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      inputSecurityProcessor?.handleChange(event.currentTarget.value, {
        isComposing: isComposingRef.current,
      });
      onChange?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      const outcome = inputSecurityProcessor?.handleBlur(event.currentTarget.value);
      if (outcome?.changed) {
        // Correct the DOM value at the one safe moment (blur, not every keystroke)
        // so an uncontrolled/defaultValue field reflects the normalized value even
        // if the consumer's onNormalizedValueChange doesn't drive a re-render.
        event.currentTarget.value = outcome.result.value;
      }
      onBlur?.(event);
    };

    const handleCompositionStart = (
      event: React.CompositionEvent<HTMLInputElement>
    ) => {
      isComposingRef.current = true;
      onCompositionStart?.(event);
    };

    const handleCompositionEnd = (
      event: React.CompositionEvent<HTMLInputElement>
    ) => {
      isComposingRef.current = false;
      onCompositionEnd?.(event);
    };

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
            onBlur={handleBlur}
            onChange={handleChange}
            onCompositionEnd={handleCompositionEnd}
            onCompositionStart={handleCompositionStart}
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
