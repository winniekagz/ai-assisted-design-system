'use client';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import * as React from 'react';

const autocompleteVariants = cva(
  [
    'w-full bg-[color:var(--bg-surface)]',
    'font-[family-name:var(--font-rubik)] text-[length:var(--font-size-body1)]',
    'font-[var(--font-weight-regular)] leading-[var(--line-height-body1)] tracking-[0.15px]',
    'text-[color:var(--text-paragraph)]',
    'rounded-[var(--radius-md)] border',
    'outline-none',
    'transition-colors duration-[var(--duration-normal)]',
    'focus:outline-none focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-0',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'placeholder:text-[color:var(--text-disabled)]',
  ],
  {
    variants: {
      variant: {
        default:
          'border-[color:var(--border-default)] hover:border-[color:var(--text-muted)] focus:border-[color:var(--border-focus)]',
        error:
          'border-[color:var(--helper-error)] focus-visible:ring-[color:var(--helper-error)]',
        success:
          'border-[color:var(--helper-success)] focus-visible:ring-[color:var(--helper-success)]',
      },
      size: {
        default: 'h-11 px-3',
        sm: 'h-9 px-2 text-[length:var(--font-size-sm)]',
        lg: 'h-12 px-4 text-[length:var(--font-size-lg)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface AutocompleteOption {
  value: string;
  label: string;
}

export interface AutocompleteProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'size' | 'onChange' | 'onSelect'
    >,
    VariantProps<typeof autocompleteVariants> {
  error?: boolean;
  success?: boolean;
  placeholder?: string;
  options: AutocompleteOption[];
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: AutocompleteOption) => void;
  multiple?: boolean;
  selectedValues?: string[];
  onSelectedValuesChange?: (values: string[]) => void;
  label?: string;
  helperText?: string;
}

const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      className,
      variant,
      size,
      error,
      success,
      placeholder,
      options,
      value,
      onChange,
      onSelect,
      multiple = false,
      selectedValues = [],
      onSelectedValuesChange,
      label,
      helperText,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const listboxId = `${inputId}-listbox`;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const [isOpen, setIsOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(() =>
      typeof value === 'string' ? value : ''
    );
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    let finalVariant = variant;
    if (error) finalVariant = 'error';
    if (success) finalVariant = 'success';

    const filteredOptions = React.useMemo(
      () =>
        options.filter(o =>
          o.label.toLowerCase().includes(inputValue.toLowerCase())
        ),
      [inputValue, options]
    );

    React.useEffect(() => {
      if (typeof value === 'string') setInputValue(value);
    }, [value]);

    // Reset active index when dropdown opens/filter changes
    React.useEffect(() => {
      setActiveIndex(-1);
    }, [isOpen, inputValue]);

    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setInputValue(v);
      setIsOpen(true);
      onChange?.(v);
    };

    const selectOption = (option: AutocompleteOption) => {
      if (multiple) {
        const next = selectedValues.includes(option.value)
          ? selectedValues.filter(v => v !== option.value)
          : [...selectedValues, option.value];
        onSelectedValuesChange?.(next);
        setInputValue('');
      } else {
        setInputValue(option.label);
        setIsOpen(false);
        onSelect?.(option);
        onChange?.(option.value);
      }
      inputRef.current?.focus();
    };

    const handleRemoveValue = (val: string) => {
      onSelectedValuesChange?.(selectedValues.filter(v => v !== val));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        setIsOpen(true);
        return;
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, filteredOptions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        const opt = filteredOptions[activeIndex];
        if (opt) selectOption(opt);
      }
    };

    const selectedOptions = options.filter(o => selectedValues.includes(o.value));

    const helperColor = error
      ? 'text-[color:var(--helper-error)]'
      : success
        ? 'text-[color:var(--helper-success)]'
        : 'text-[color:var(--text-muted)]';

    return (
      <div className='flex flex-col gap-[var(--spacing-xs)] w-full' ref={containerRef}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] leading-[var(--line-height-snug)] font-[family-name:var(--font-rubik)]',
              error ? 'text-[color:var(--helper-error)]' : 'text-[color:var(--text-secondary)]'
            )}
          >
            {label}
          </label>
        )}
        {/* Input wrapper — position:relative anchors the dropdown */}
        <div className='relative w-full'>
          <input
            id={inputId}
            ref={ref ?? inputRef}
            role='combobox'
            aria-expanded={isOpen}
            aria-autocomplete='list'
            aria-controls={listboxId}
            aria-activedescendant={
              activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
            }
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={helperId}
            className={cn(
              autocompleteVariants({ variant: finalVariant, size }),
              className
            )}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoComplete='off'
            {...props}
          />

          {/* Dropdown listbox — anchored to input */}
          {isOpen && filteredOptions.length > 0 && (
            <ul
              id={listboxId}
              role='listbox'
              aria-label={label ?? placeholder ?? 'Options'}
              className='absolute z-50 w-full top-[calc(100%+4px)] bg-[color:var(--bg-surface)] border border-[color:var(--border-subtle)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] max-h-60 overflow-auto p-[var(--spacing-xs)]'
            >
              {filteredOptions.map((option, index) => {
                const isActive = index === activeIndex;
                const isSelected = multiple
                  ? selectedValues.includes(option.value)
                  : inputValue === option.label;
                return (
                  <li
                    key={option.value}
                    id={`${listboxId}-option-${index}`}
                    role='option'
                    aria-selected={isSelected}
                    className={cn(
                      'w-full px-3 py-[var(--spacing-sm)] text-left cursor-pointer select-none',
                      'rounded-[var(--radius-md)]',
                      'font-[family-name:var(--font-rubik)] text-[length:var(--font-size-body1)] text-[color:var(--text-paragraph)]',
                      'transition-colors duration-[var(--duration-fast)]',
                      isActive
                        ? 'bg-[color:var(--bg-hover)]'
                        : isSelected
                          ? 'bg-[color:var(--bg-secondary)] font-[var(--font-weight-medium)]'
                          : 'hover:bg-[color:var(--bg-hover)]'
                    )}
                    onMouseDown={e => {
                      e.preventDefault(); // keep input focused
                      selectOption(option);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {option.label}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Multi-select chips */}
        {multiple && selectedOptions.length > 0 && (
          <div className='flex flex-wrap gap-[var(--spacing-xs)]'>
            {selectedOptions.map(option => (
              <span
                key={option.value}
                className='inline-flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-1 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] bg-[color:var(--bg-surface)] text-[color:var(--text-paragraph)] rounded-[var(--radius-sm)] shadow-[var(--shadow-md)] border border-[color:var(--border-default)] font-[family-name:var(--font-rubik)]'
              >
                {option.label}
                <button
                  type='button'
                  onClick={() => handleRemoveValue(option.value)}
                  aria-label={`Remove ${option.label}`}
                  className='rounded-full p-0.5 text-[color:var(--text-muted)] hover:text-[color:var(--text-paragraph)] hover:bg-[color:var(--bg-hover)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--color-primary)]'
                >
                  <X className='size-3' aria-hidden='true' />
                </button>
              </span>
            ))}
          </div>
        )}

        {helperText && (
          <p
            id={helperId}
            className={cn(
              'text-[length:var(--font-size-xs)] leading-[var(--line-height-snug)] font-[family-name:var(--font-rubik)]',
              helperColor
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Autocomplete.displayName = 'Autocomplete';

export { Autocomplete, autocompleteVariants };
