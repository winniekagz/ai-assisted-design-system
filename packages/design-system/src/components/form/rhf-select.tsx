'use client';

import { Select } from '@/components/ui/form-fields/select';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { BaseRHFProps, SelectOption } from './types';

export interface RHFSelectProps
  extends Omit<React.ComponentProps<typeof Select>, 'name'>,
    BaseRHFProps {
  options: SelectOption[];
  placeholder?: string;
}

export const RHFSelect = React.forwardRef<HTMLSelectElement, RHFSelectProps>(
  (
    {
      name,
      label,
      formError,
      disabled,
      required,
      className,
      options,
      placeholder,
      ...props
    },
    ref
  ) => {
    const formContext = useFormContext();

    // If not wrapped in FormProvider, show a warning and render without form integration
    if (!formContext) {
      console.warn(
        `RHFSelect "${name}" is not wrapped in a FormProvider. Please wrap your form with FormProvider from react-hook-form.`
      );

      return (
        <div className={cn('space-y-2', className)}>
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
          <Select
            {...props}
            ref={ref}
            id={name}
            error={!!formError}
            disabled={disabled}
            placeholder={placeholder}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
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
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              {...props}
              ref={ref}
              id={name}
              error={hasError}
              disabled={disabled}
              placeholder={placeholder}
            >
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
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

RHFSelect.displayName = 'RHFSelect';
