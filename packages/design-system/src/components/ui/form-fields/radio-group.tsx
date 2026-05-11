'use client';

import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export interface RadioGroupOption {
  value:     string;
  label:     string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options:        RadioGroupOption[];
  value?:         string;
  defaultValue?:  string;
  onValueChange?: (value: string) => void;
  name?:          string;
  label?:         string;
  error?:         boolean;
  success?:       boolean;
  size?:          'sm' | 'default' | 'lg';
  orientation?:   'vertical' | 'horizontal';
  disabled?:      boolean;
  className?:     string;
}

const sizeMap = {
  sm:      { item: 'size-4',      dot: 'size-2'      },
  default: { item: 'size-5',      dot: 'size-[10px]' },
  lg:      { item: 'size-6',      dot: 'size-3'      },
};

const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  label,
  error,
  success,
  size        = 'default',
  orientation = 'vertical',
  disabled,
  className,
}, ref) => {
  const groupId           = React.useId();
  const resolvedName      = name ?? groupId;
  const { item, dot }     = sizeMap[size];

  const dotColorCls =
    error   ? 'bg-[color:var(--helper-error)]'   :
    success ? 'bg-[color:var(--helper-success)]' :
              'bg-[color:var(--color-primary)]';

  const itemVariantCls =
    error   ? 'border-[color:var(--helper-error)]   data-[state=checked]:border-[color:var(--helper-error)]'   :
    success ? 'border-[color:var(--helper-success)] data-[state=checked]:border-[color:var(--helper-success)]' :
              // unchecked: neutral-300 (gray-300); checked: primary border
              'border-[color:var(--border-default)] data-[state=checked]:border-[color:var(--color-primary)]';

  return (
    <div className={cn('flex flex-col gap-[var(--spacing-xs)]', className)}>
      {label && (
        <span className='text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-[color:var(--text-secondary)] font-[family-name:var(--font-rubik)]'>
          {label}
        </span>
      )}
      <RadioGroupPrimitive.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        name={resolvedName}
        disabled={disabled}
        orientation={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
        data-slot='radio-group'
        className={cn(
          orientation === 'horizontal'
            ? 'flex flex-wrap gap-[var(--spacing-md)]'
            : 'grid gap-[var(--spacing-xs)]',
        )}
      >
        {options.map(option => {
          const itemId = `${resolvedName}-${option.value}`;
          return (
            <div key={option.value} className='flex items-center gap-[var(--spacing-sm)]'>
              <RadioGroupPrimitive.Item
                value={option.value}
                id={itemId}
                disabled={option.disabled}
                data-slot='radio-group-item'
                className={cn(
                  item,
                  'aspect-square shrink-0 rounded-full border-2',
                  'transition-[color,box-shadow] outline-none',
                  'focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]/40',
                  'disabled:cursor-not-allowed disabled:opacity-40',
                  itemVariantCls,
                )}
              >
                <RadioGroupPrimitive.Indicator
                  data-slot='radio-group-indicator'
                  className='flex items-center justify-center'
                >
                  <span className={cn(dot, 'rounded-full', dotColorCls)} aria-hidden='true' />
                </RadioGroupPrimitive.Indicator>
              </RadioGroupPrimitive.Item>

              <label
                htmlFor={itemId}
                className={cn(
                  'text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] leading-[var(--line-height-snug)]',
                  'font-[family-name:var(--font-rubik)] text-[color:var(--text-secondary)]',
                  option.disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
                )}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </RadioGroupPrimitive.Root>
    </div>
  );
});
RadioGroup.displayName = 'RadioGroup';

export { RadioGroup };
