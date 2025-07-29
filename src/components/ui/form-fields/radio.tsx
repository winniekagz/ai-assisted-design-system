import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const radioVariants = cva(
  'peer h-4 w-4 shrink-0 rounded-full border border-[rgba(0,0,0,0.23)] bg-transparent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary',
  {
    variants: {
      variant: {
        default:
          'border-[rgba(0,0,0,0.23)] data-[state=checked]:border-[#009966] data-[state=checked]:bg-[#009966]',
        error:
          'border-[#f44336] data-[state=checked]:border-[#f44336] data-[state=checked]:bg-[#f44336]',
        success:
          'border-[#4caf50] data-[state=checked]:border-[#4caf50] data-[state=checked]:bg-[#4caf50]',
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

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof radioVariants> {
  error?: boolean;
  success?: boolean;
  label?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      variant,
      size,
      error,
      success,
      label,
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

    return (
      <div className='flex items-center space-x-2'>
        <div className='relative'>
          <input
            type='radio'
            className={cn(
              radioVariants({ variant: finalVariant, size, className }),
              'sr-only'
            )}
            ref={ref}
            checked={checked}
            onChange={onChange}
            {...props}
          />
          <div
            className={cn(
              radioVariants({ variant: finalVariant, size }),
              'flex items-center justify-center cursor-pointer'
            )}
            data-state={checked ? 'checked' : 'unchecked'}
            onClick={() => {
              if (onChange) {
                const event = {
                  target: { checked: true },
                } as React.ChangeEvent<HTMLInputElement>;
                onChange(event);
              }
            }}
          >
            {checked && <div className='h-2 w-2 rounded-full bg-white' />}
          </div>
        </div>
        {label && (
          <label
            htmlFor={props.id}
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-rubik text-[rgba(0,0,0,0.60)] cursor-pointer'
            onClick={() => {
              if (onChange) {
                const event = {
                  target: { checked: true },
                } as React.ChangeEvent<HTMLInputElement>;
                onChange(event);
              }
            }}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Radio.displayName = 'Radio';

export { Radio, radioVariants };
