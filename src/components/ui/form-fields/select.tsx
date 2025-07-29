import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

const selectVariants = cva(
  'flex w-full font-rubik text-base font-normal leading-6 tracking-[0.15px] text-[color:var(--color-text-secondary)] max-h-14 h-auto px-3 py-2 rounded border border-[color:var(--color-border-default)] bg-transparent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 appearance-none',
  {
    variants: {
      variant: {
        default:
          'border-[color:var(--color-border-default)] focus:border-[color:var(--color-primary-500)]',
        error:
          'border-[color:var(--color-error-500)] focus:border-[color:var(--color-error-500)]',
        success:
          'border-[color:var(--color-success-500)] focus:border-[color:var(--color-success-500)]',
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

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  error?: boolean;
  success?: boolean;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      variant,
      size,
      error,
      success,
      placeholder,
      children,
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
        <select
          className={cn(
            selectVariants({ variant: finalVariant, size, className }),
            'pr-10' // Space for the chevron icon
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value='' disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <ChevronDown className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none' />
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select, selectVariants };
