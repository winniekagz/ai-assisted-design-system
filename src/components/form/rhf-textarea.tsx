'use client';

import { Textarea } from '@/components/ui/form-fields/textarea';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { BaseRHFProps } from './types';

export interface RHFTextareaProps
  extends Omit<React.ComponentProps<typeof Textarea>, 'name'>,
    BaseRHFProps {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onStartIconClick?: () => void;
  onEndIconClick?: () => void;
  autoGrow?: boolean;
}

export const RHFTextarea = React.forwardRef<
  HTMLTextAreaElement,
  RHFTextareaProps
>(
  (
    {
      name,
      label,
      formError,
      disabled,
      required,
      className,
      startIcon,
      endIcon,
      onStartIconClick,
      onEndIconClick,
      autoGrow,
      ...props
    },
    ref
  ) => {
    const formContext = useFormContext();

    // If not wrapped in FormProvider, show a warning and render without form integration
    if (!formContext) {
      console.warn(
        `RHFTextarea "${name}" is not wrapped in a FormProvider. Please wrap your form with FormProvider from react-hook-form.`
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
          <Textarea
            {...props}
            ref={ref}
            id={name}
            error={!!formError}
            disabled={disabled}
            startIcon={startIcon}
            endIcon={endIcon}
            onStartIconClick={onStartIconClick}
            onEndIconClick={onEndIconClick}
            autoGrow={autoGrow}
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
            <Textarea
              {...field}
              {...props}
              ref={ref}
              id={name}
              error={hasError}
              disabled={disabled}
              startIcon={startIcon}
              endIcon={endIcon}
              onStartIconClick={onStartIconClick}
              onEndIconClick={onEndIconClick}
              autoGrow={autoGrow}
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

RHFTextarea.displayName = 'RHFTextarea';
