'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

export interface SwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange'
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked,
      defaultChecked = false,
      onCheckedChange,
      label,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] =
      React.useState(defaultChecked);
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;

    const toggle = () => {
      if (disabled) return;
      const nextChecked = !isChecked;
      if (!isControlled) {
        setInternalChecked(nextChecked);
      }
      onCheckedChange?.(nextChecked);
    };

    const switchId = id ?? React.useId();

    return (
      <div className='inline-flex items-center gap-[var(--spacing-sm)]'>
        <button
          ref={ref}
          id={switchId}
          type='button'
          role='switch'
          aria-checked={isChecked}
          disabled={disabled}
          onClick={toggle}
          className={cn(
            'relative inline-flex h-[calc(var(--spacing-lg)+var(--spacing-xs))] w-[calc(var(--spacing-2xl)+var(--spacing-sm))] shrink-0 items-center rounded-[var(--radius-full)] border border-[color:var(--border-default)] bg-[color:var(--bg-secondary)] transition-colors duration-[var(--motion-normal)] ease-[var(--motion-easing)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--border-focus)] focus-visible:ring-offset-2 disabled:pointer-events-none',
            isChecked &&
              'border-[color:var(--color-primary)] bg-[color:var(--color-primary)]',
            className
          )}
          {...props}
        >
          <span
            aria-hidden='true'
            className={cn(
              'block size-[var(--spacing-lg)] rounded-[var(--radius-full)] bg-[color:var(--bg-surface)] shadow-[var(--shadow-sm)] transition-transform duration-[var(--motion-normal)] ease-[var(--motion-easing)]',
              isChecked
                ? 'translate-x-[calc(var(--spacing-lg)+var(--spacing-xs))]'
                : 'translate-x-[var(--spacing-xs)]'
            )}
          />
        </button>
        {label && (
          <label
            htmlFor={switchId}
            className='cursor-pointer text-[length:var(--font-size-body-sm)] font-medium text-[color:var(--text-paragraph)] [font-family:var(--font-rubik)]'
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export { Switch };
