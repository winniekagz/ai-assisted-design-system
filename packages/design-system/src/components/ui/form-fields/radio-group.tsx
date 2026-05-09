'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';
import { Radio, type RadioProps } from './radio';

export interface RadioGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> {
  options: RadioGroupOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  label?: string;
  error?: boolean;
  success?: boolean;
  size?: RadioProps['size'];
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      options,
      value,
      defaultValue,
      onValueChange,
      name,
      label,
      error,
      success,
      size,
      ...props
    },
    ref
  ) => {
    const generatedName = React.useId();
    const groupName = name ?? generatedName;
    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? ''
    );
    const isControlled = value !== undefined;
    const selectedValue = isControlled ? value : internalValue;

    const handleValueChange = (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    };

    return (
      <div
        ref={ref}
        role='radiogroup'
        aria-label={label}
        className={cn('grid gap-[var(--spacing-sm)]', className)}
        {...props}
      >
        {label && (
          <div className='text-[length:var(--font-size-body-sm)] font-medium text-[color:var(--text-title)] [font-family:var(--font-heading)]'>
            {label}
          </div>
        )}
        {options.map(option => (
          <Radio
            key={option.value}
            name={groupName}
            value={option.value}
            label={option.label}
            checked={selectedValue === option.value}
            disabled={option.disabled}
            error={error}
            success={success}
            size={size}
            onChange={() => handleValueChange(option.value)}
          />
        ))}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export { RadioGroup };
