'use client';

import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export type RadioSize    = 'sm' | 'default' | 'lg';
export type RadioVariant = 'default' | 'error' | 'success';

export interface RadioProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onChange'> {
  size?:          RadioSize;
  variant?:       RadioVariant;
  error?:         boolean;
  success?:       boolean;
  label?:         string;
  required?:      boolean;
  checked?:       boolean;
  defaultChecked?: boolean;
  onChange?:      (e: { target: { checked: boolean; value: string } }) => void;
}

const sizeMap = {
  sm:      { item: 'size-4',      dot: 'size-2'      },
  default: { item: 'size-5',      dot: 'size-[10px]' },
  lg:      { item: 'size-6',      dot: 'size-3'      },
};

/**
 * Standalone radio. For a controlled group use the RadioGroup component instead.
 * This wraps a Radix RadioGroup internally so the primitive satisfies its context requirement.
 */
const Radio = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioProps
>(({
  className,
  size     = 'default',
  variant  = 'default',
  error,
  success,
  label,
  required,
  checked,
  defaultChecked,
  onChange,
  disabled,
  id,
  value = '',
  ...props
}, ref) => {
  const radioId      = id ?? React.useId();
  const finalVariant = error ? 'error' : success ? 'success' : variant;
  const { item, dot } = sizeMap[size];

  const dotColorCls =
    finalVariant === 'error'   ? 'bg-[color:var(--helper-error)]'   :
    finalVariant === 'success' ? 'bg-[color:var(--helper-success)]' :
                                 'bg-[color:var(--color-primary)]';

  const itemVariantCls =
    finalVariant === 'error'
      ? 'border-[color:var(--helper-error)]   data-[state=checked]:border-[color:var(--helper-error)]'
      : finalVariant === 'success'
      ? 'border-[color:var(--helper-success)] data-[state=checked]:border-[color:var(--helper-success)]'
      // unchecked: neutral-300 (gray-300); checked: primary border
      : 'border-[color:var(--border-default)] data-[state=checked]:border-[color:var(--color-primary)]';

  return (
    <RadioGroupPrimitive.Root
      value={checked ? value : undefined}
      defaultValue={defaultChecked ? value : undefined}
      onValueChange={v => onChange?.({ target: { checked: v === value, value } })}
    >
      <div className='inline-flex items-center gap-[var(--spacing-sm)]'>
        <RadioGroupPrimitive.Item
          ref={ref}
          id={radioId}
          value={value}
          disabled={disabled}
          data-slot='radio-group-item'
          className={cn(
            item,
            'aspect-square shrink-0 rounded-full border-2',
            'transition-[color,box-shadow] outline-none',
            'focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]/40',
            'disabled:cursor-not-allowed disabled:opacity-40',
            itemVariantCls,
            className,
          )}
          {...props}
        >
          <RadioGroupPrimitive.Indicator
            data-slot='radio-group-indicator'
            className='flex items-center justify-center'
          >
            <span className={cn(dot, 'rounded-full', dotColorCls)} aria-hidden='true' />
          </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>

        {label && (
          <label
            htmlFor={radioId}
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
    </RadioGroupPrimitive.Root>
  );
});
Radio.displayName = 'Radio';

export { Radio };

