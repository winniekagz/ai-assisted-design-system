import { cn } from '@/lib/utils';
import { Input as HeroInput } from '@heroui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const inputVariants = cva(
  'h-11 min-w-0 w-full font-rubik text-base font-normal leading-6 tracking-[0.15px] text-[color:var(--color-text-secondary)] px-3 py-2 rounded border bg-transparent shadow-none outline-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary-500)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-[color:var(--color-border-default)] focus:border-[color:var(--color-primary-500)]',
        outline:
          'border-[color:var(--color-border-default)] focus:border-[color:var(--color-primary-500)] bg-transparent',
        text: 'border-transparent bg-transparent focus:border-transparent hover:bg-[color:var(--color-neutral-50)] shadow-none',
        error:
          'border-[color:var(--color-error-500)] focus:border-[color:var(--color-error-500)]',
        success:
          'border-[color:var(--color-success-500)] focus:border-[color:var(--color-success-500)]',
      },
      size: {
        default: 'h-11 px-3',
        sm: 'h-9 px-2 text-sm',
        lg: 'h-12 px-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
  success?: boolean;
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
      startIcon,
      endIcon,
      onStartIconClick,
      onEndIconClick,
      ...props
    },
    ref
  ) => {
    // Determine variant based on error/success states
    let finalVariant = variant;
    if (error) finalVariant = 'error';
    if (success) finalVariant = 'success';

    return (
      <div className='relative'>
        <HeroInput
          className={cn(
            inputVariants({ variant: finalVariant, size, className }),
            startIcon && 'pl-10',
            endIcon && 'pr-10'
          )}
          ref={ref}
          aria-invalid={error || undefined}
          {...props}
        />
        {startIcon && (
          <div
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground',
              onStartIconClick && 'cursor-pointer hover:text-foreground'
            )}
            onClick={onStartIconClick}
          >
            {startIcon}
          </div>
        )}
        {endIcon && (
          <div
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground',
              onEndIconClick && 'cursor-pointer hover:text-foreground'
            )}
            onClick={onEndIconClick}
          >
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };
