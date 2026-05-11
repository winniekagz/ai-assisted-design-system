'use client';

import * as React from 'react';
import { CheckIcon, MinusIcon } from 'lucide-react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export type CheckboxSize    = 'sm' | 'default' | 'lg';
export type CheckboxVariant = 'default' | 'error' | 'success';

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onChange'> {
  size?:          CheckboxSize;
  variant?:       CheckboxVariant;
  error?:         boolean;
  success?:       boolean;
  label?:         string;
  required?:      boolean;
  indeterminate?: boolean;
  /** Legacy bridge — prefer onCheckedChange for new code */
  onChange?: (e: { target: { checked: boolean } }) => void;
}

const sizeMap = {
  sm:      { box: 'size-4',  icon: 'size-3'   },
  default: { box: 'size-5',  icon: 'size-3.5' },
  lg:      { box: 'size-6',  icon: 'size-4'   },
};

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>((
  {
    className,
    size         = 'default',
    variant      = 'default',
    error,
    success,
    label,
    required,
    indeterminate,
    checked,
    onCheckedChange,
    onChange,
    disabled,
    id,
    ...props
  },
  ref,
) => {
  const checkboxId   = id ?? React.useId();
  const finalVariant = error ? 'error' : success ? 'success' : variant;
  const { box, icon } = sizeMap[size];

  const handleCheckedChange = (next: boolean | 'indeterminate') => {
    onCheckedChange?.(next);
    onChange?.({ target: { checked: next === true } });
  };

  // Only pass `checked` when explicitly controlled — lets `defaultChecked`
  // in ...props drive the uncontrolled case without conflict.
  const checkedProp = indeterminate
    ? ('indeterminate' as const)
    : checked !== undefined
    ? checked
    : undefined;

  // Checked/indeterminate: accent fill + accent border, white tick on top.
  // Unchecked: neutral-300 border (gray-300), surface bg, no icon shown.
  const variantCls =
    finalVariant === 'error'
      ? 'border-[color:var(--helper-error)] data-[state=checked]:bg-[color:var(--helper-error)] data-[state=checked]:border-[color:var(--helper-error)] data-[state=indeterminate]:bg-[color:var(--helper-error)] data-[state=indeterminate]:border-[color:var(--helper-error)]'
      : finalVariant === 'success'
      ? 'border-[color:var(--helper-success)] data-[state=checked]:bg-[color:var(--helper-success)] data-[state=checked]:border-[color:var(--helper-success)] data-[state=indeterminate]:bg-[color:var(--helper-success)] data-[state=indeterminate]:border-[color:var(--helper-success)]'
      : 'border-[color:var(--border-default)] data-[state=checked]:bg-[color:var(--color-primary)] data-[state=checked]:border-[color:var(--color-primary)] data-[state=indeterminate]:bg-[color:var(--color-primary)] data-[state=indeterminate]:border-[color:var(--color-primary)]';

  return (
    <div className='inline-flex items-center gap-[var(--spacing-sm)]'>
      <CheckboxPrimitive.Root
        ref={ref}
        id={checkboxId}
        disabled={disabled}
        aria-invalid={finalVariant === 'error' || undefined}
        data-slot='checkbox'
        {...props}
        {...(checkedProp !== undefined ? { checked: checkedProp } : {})}
        onCheckedChange={handleCheckedChange}
        className={cn(
          box,
          'shrink-0 rounded-[var(--radius-sm)] border-2 bg-[color:var(--bg-surface)]',
          'flex items-center justify-center',
          'transition-colors outline-none',
          // focus: drop the gray border, show only primary ring
          'focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]/40',
          'disabled:cursor-not-allowed disabled:opacity-40',
          variantCls,
          className,
        )}
      >
        {/* Indicator only renders when checked/indeterminate — no forceMount. */}
        <CheckboxPrimitive.Indicator
          data-slot='checkbox-indicator'
          className='grid place-content-center text-white transition-none'
        >
          {indeterminate
            ? <MinusIcon className={icon} strokeWidth={3} aria-hidden='true' />
            : <CheckIcon  className={icon} strokeWidth={3} aria-hidden='true' />}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {label && (
        <label
          htmlFor={checkboxId}
          className={cn(
            'text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] leading-[var(--line-height-snug)]',
            'font-[family-name:var(--font-rubik)] text-[color:var(--text-secondary)]',
            disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
          )}
        >
          {label}
          {required && (
            <span className='ml-1 text-[color:var(--helper-error)]' aria-hidden='true'>*</span>
          )}
        </label>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
