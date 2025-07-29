import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const inputVariants = cva(
  'flex w-full font-rubik text-base font-normal leading-6 tracking-[0.15px] text-[rgba(0,0,0,0.60)] max-h-14 h-auto px-2 py-2 rounded border border-[rgba(0,0,0,0.23)] bg-transparent transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-[rgba(0,0,0,0.23)] focus:border-[#009966]',
        outline:
          'border-[rgba(0,0,0,0.23)] focus:border-[#009966] bg-transparent',
        text: 'border-transparent bg-transparent focus:border-transparent hover:bg-gray-50',
        error: 'border-[#f44336] focus:border-[#f44336]',
        success: 'border-[#4caf50] focus:border-[#4caf50]',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-8 px-2 text-sm',
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
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
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
        <input
          className={cn(
            inputVariants({ variant: finalVariant, size, className }),
            startIcon && 'pl-10',
            endIcon && 'pr-10'
          )}
          ref={ref}
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
