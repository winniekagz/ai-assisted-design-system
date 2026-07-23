import * as React from 'react';
import { Input as HeroInput } from '@heroui/react';

import { cn } from '@/lib/utils';

/**
 * @deprecated Prefer `Input` from `components/ui/form-fields/input` (exported as
 * `Input`, this one is exported as `BaseInput`) — it supports label/helperText/
 * aria-describedby and `inputSecurityPolicy` wiring. This is a thin `@heroui/react`
 * wrapper kept for existing call sites only; it will not receive new features.
 */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * @deprecated Prefer `Input` from `components/ui/form-fields/input` (exported here as
 * `BaseInput`) — see the `InputProps` deprecation note above for details.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <HeroInput
        type={type}
        className={cn(
          'h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-none outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
