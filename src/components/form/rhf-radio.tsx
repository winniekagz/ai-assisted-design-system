'use client';

import { Radio } from '@/components/ui/form-fields/radio';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { BaseRHFProps } from './types';

export interface RHFRadioProps
  extends Omit<React.ComponentProps<typeof Radio>, 'name'>,
    BaseRHFProps {}

export const RHFRadio = React.forwardRef<HTMLInputElement, RHFRadioProps>(
  (
    { name, label, formError, disabled, required, className, value, ...props },
    ref
  ) => {
    const formContext = useFormContext();

    // If not wrapped in FormProvider, show a warning and render without form integration
    if (!formContext) {
      console.warn(
        `RHFRadio "${name}" is not wrapped in a FormProvider. Please wrap your form with FormProvider from react-hook-form.`
      );

      return (
        <div className={cn('space-y-2', className)}>
          <Radio
            {...props}
            ref={ref}
            id={name}
            name={name}
            value={value}
            label={label}
            required={required}
            error={!!formError}
            disabled={disabled}
          />
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
            <Radio
              {...props}
              ref={ref}
              id={name}
              value={value}
              label={label}
              required={required}
              error={hasError}
              disabled={disabled}
              checked={field.value === value}
              onChange={field.onChange}
            />
          )}
        />
        {(fieldError || formError) && (
          <p className='text-sm text-[color:var(--color-error-500)]'>
            {fieldError || formError}
          </p>
        )}
      </div>
    );
  }
);

RHFRadio.displayName = 'RHFRadio';
