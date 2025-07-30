'use client';

import { Checkbox } from '@/components/ui/form-fields/checkbox';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { BaseRHFProps } from './types';

export interface RHFCheckboxProps
  extends Omit<React.ComponentProps<typeof Checkbox>, 'name'>,
    BaseRHFProps {}

export const RHFCheckbox = React.forwardRef<HTMLInputElement, RHFCheckboxProps>(
  (
    { name, label, formError, disabled, required, className, ...props },
    ref
  ) => {
    const formContext = useFormContext();

    // If not wrapped in FormProvider, show a warning and render without form integration
    if (!formContext) {
      console.warn(
        `RHFCheckbox "${name}" is not wrapped in a FormProvider. Please wrap your form with FormProvider from react-hook-form.`
      );

      return (
        <div className={cn('space-y-2', className)}>
          <Checkbox
            {...props}
            ref={ref}
            id={name}
            error={!!formError}
            disabled={disabled}
          />
          {label && (
            <label
              htmlFor={name}
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-rubik text-[color:var(--color-text-secondary)]'
            >
              {label}
              {required && (
                <span className='text-[color:var(--color-error-500)] ml-1'>
                  *
                </span>
              )}
            </label>
          )}
          {formError && (
            <p className='text-sm text-[color:var(--color-error-500)]'>
              {formError}
            </p>
          )}
        </div>
      );
    }

    const { control, formState } = formContext;
    const fieldError = formState.errors[name]?.message as string;
    const hasError = !!fieldError || !!formError;

    return (
      <div className={cn('space-y-2', className)}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              {...props}
              ref={ref}
              id={name}
              error={hasError}
              disabled={disabled}
            />
          )}
        />
        {label && (
          <label
            htmlFor={name}
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-rubik text-[color:var(--color-text-secondary)]'
          >
            {label}
            {required && (
              <span className='text-[color:var(--color-error-500)] ml-1'>
                *
              </span>
            )}
          </label>
        )}
        {(fieldError || formError) && (
          <p className='text-sm text-[color:var(--color-error-500)]'>
            {fieldError || formError}
          </p>
        )}
      </div>
    );
  }
);

RHFCheckbox.displayName = 'RHFCheckbox';
