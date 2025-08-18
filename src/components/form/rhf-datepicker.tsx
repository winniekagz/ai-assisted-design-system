import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import LejaDatePicker, { DatePickerProps } from '../ui/form-fields/DatePicker';
import { Typography } from '../ui/typography';

export interface RHFDDatePickerProps
  extends Omit<DatePickerProps, 'value' | 'onChange'> {
  name: string;
  label?: string;
  required?: boolean;
  helperText?: string;
  error?: boolean;
}

export const RHFDDatePicker: React.FC<RHFDDatePickerProps> = ({
  name,
  label,
  required = false,
  helperText,
  error,
  variant = 'single',
  placeholder,
  disabled,
  className = '',
  minDate,
  maxDate,
  format = 'PPP',
  displayFormat = 'PPP',
  readOnly = false,
  calendarProps = {},
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const fieldError = errors[name];

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Typography variant='body2' className='font-medium'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </Typography>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <LejaDatePicker
            value={field.value || { startDate: null, endDate: null }}
            onChange={value => field.onChange(value)}
            variant={variant}
            placeholder={placeholder}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            format={format}
            displayFormat={displayFormat}
            readOnly={readOnly}
            calendarProps={calendarProps}
          />
        )}
      />

      {(fieldError || helperText) && (
        <Typography
          variant='caption'
          className={fieldError ? 'text-red-500' : 'text-gray-500'}
        >
          {(fieldError?.message as string) || helperText}
        </Typography>
      )}
    </div>
  );
};
