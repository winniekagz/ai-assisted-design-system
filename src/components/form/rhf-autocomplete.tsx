'use client';

import { Autocomplete } from '@/components/ui/form-fields/autocomplete';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { AutocompleteOption, BaseRHFProps } from './types';

export interface RHFAutocompleteProps
  extends Omit<
      React.ComponentProps<typeof Autocomplete>,
      'name' | 'onChange' | 'onSelect'
    >,
    BaseRHFProps {
  options: AutocompleteOption[];
  placeholder?: string;
  multiple?: boolean;
}

export const RHFAutocomplete = React.forwardRef<
  HTMLInputElement,
  RHFAutocompleteProps
>(
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
      multiple = false,
      ...props
    },
    ref
  ) => {
    const formContext = useFormContext();

    // If not wrapped in FormProvider, show a warning and render without form integration
    if (!formContext) {
      console.warn(
        `RHFAutocomplete "${name}" is not wrapped in a FormProvider. Please wrap your form with FormProvider from react-hook-form.`
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
          <Autocomplete
            {...props}
            ref={ref}
            id={name}
            error={!!formError}
            disabled={disabled}
            options={options}
            placeholder={placeholder}
            multiple={multiple}
            value={props.value || ''}
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
            <Autocomplete
              {...props}
              ref={ref}
              id={name}
              error={hasError}
              disabled={disabled}
              options={options}
              placeholder={placeholder}
              multiple={multiple}
              value={field.value || ''}
              onChange={value => field.onChange(value)}
              onSelect={option => field.onChange(option.value)}
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

RHFAutocomplete.displayName = 'RHFAutocomplete';
