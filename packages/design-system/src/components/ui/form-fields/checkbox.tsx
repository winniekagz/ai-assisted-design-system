import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check } from 'lucide-react';
import * as React from 'react';

const checkboxVariants = cva(
  'peer h-4 w-4 shrink-0 rounded border border-[color:var(--color-border-default)] bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary',
  {
    variants: {
      variant: {
        default:
          'border-[color:var(--color-border-default)] data-[state=checked]:border-[color:var(--color-primary-500)] data-[state=checked]:bg-[color:var(--color-primary-500)]',
        error:
          'border-[color:var(--color-error-500)] data-[state=checked]:border-[color:var(--color-error-500)] data-[state=checked]:bg-[color:var(--color-error-500)]',
        success:
          'border-[color:var(--color-success-500)] data-[state=checked]:border-[color:var(--color-success-500)] data-[state=checked]:bg-[color:var(--color-success-500)]',
      },
      size: {
        default: 'h-4 w-4',
        sm: 'h-3 w-3',
        lg: 'h-5 w-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof checkboxVariants> {
  error?: boolean;
  success?: boolean;
  label?: string;
  required?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      variant,
      size,
      error,
      success,
      label,
      required,
      checked,
      onChange,
      ...props
    },
    ref
  ) => {
    // Determine variant based on error/success states
    let finalVariant = variant;
    if (error) finalVariant = 'error';
    if (success) finalVariant = 'success';

    const handleToggle = () => {
      if (onChange) {
        const event = {
          target: { checked: !checked },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };

    return (
      <div className='flex items-center space-x-2'>
        <div className='relative'>
          <input
            type='checkbox'
            className={cn(
              checkboxVariants({ variant: finalVariant, size, className }),
              'sr-only'
            )}
            ref={ref}
            checked={checked}
            onChange={onChange}
            {...props}
          />
          <div
            className={cn(
              checkboxVariants({ variant: finalVariant, size }),
              'flex items-center justify-center cursor-pointer hover:bg-primary-50/50 transition-colors'
            )}
            data-state={checked ? 'checked' : 'unchecked'}
            onClick={handleToggle}
            role='checkbox'
            aria-checked={checked}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggle();
              }
            }}
          >
            {checked && <Check className='h-3 w-3 text-white' />}
          </div>
        </div>
        {label && (
          <label
            htmlFor={props.id}
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-rubik text-[color:var(--color-text-secondary)] cursor-pointer'
            onClick={handleToggle}
          >
            {label}
            {required && (
              <span className='text-[color:var(--color-error-500)] ml-1'>
                *
              </span>
            )}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox, checkboxVariants };
