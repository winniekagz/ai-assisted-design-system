'use client';

import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onChange'> {
  label?:           string;
  labelPosition?:   'right' | 'left';
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({
  className,
  label,
  labelPosition = 'right',
  disabled,
  id,
  onCheckedChange,
  ...props
}, ref) => {
  const switchId = id ?? React.useId();

  const labelEl = label ? (
    <label
      htmlFor={switchId}
      className={cn(
        'select-none',
        'text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)]',
        'text-[color:var(--text-paragraph)] font-[family-name:var(--font-rubik)]',
        'leading-[var(--line-height-snug)]',
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
      )}
    >
      {label}
    </label>
  ) : null;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-[var(--spacing-sm)]',
        labelPosition === 'left' && 'flex-row-reverse',
      )}
    >
      {labelPosition === 'left' && labelEl}

      <SwitchPrimitive.Root
        ref={ref}
        id={switchId}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        data-slot='switch'
        className={cn(
          'peer inline-flex h-8 w-[52px] shrink-0 items-center rounded-full border-2',
          'transition-colors duration-[var(--motion-normal)] ease-in-out outline-none',
          'focus-visible:ring-[3px] focus-visible:border-[color:var(--border-focus)] focus-visible:ring-[color:var(--border-focus)]/50',
          'disabled:pointer-events-none disabled:opacity-40',
          // OFF: surface bg + visible border; ON: primary fill + no border
          'border-[color:var(--border-default)] bg-[color:var(--bg-surface)]',
          'data-[state=checked]:border-transparent data-[state=checked]:bg-[color:var(--color-primary)]',
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot='switch-thumb'
          className={cn(
            'pointer-events-none block rounded-full',
            'shadow-[var(--shadow-sm)]',
            'transition-all duration-[var(--motion-normal)] ease-in-out',
            // OFF: 20px at x=2px, grey thumb; ON: 24px at x=22px, surface (white) thumb
            'data-[state=unchecked]:size-5 data-[state=unchecked]:translate-x-[2px] data-[state=unchecked]:bg-[color:var(--border-default)]',
            'data-[state=checked]:size-6   data-[state=checked]:translate-x-[22px]  data-[state=checked]:bg-[color:var(--bg-surface)]',
          )}
        />
      </SwitchPrimitive.Root>

      {labelPosition === 'right' && labelEl}
    </div>
  );
});
Switch.displayName = 'Switch';

export { Switch };
