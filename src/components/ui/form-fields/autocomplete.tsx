'use client';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown, X } from 'lucide-react';
import * as React from 'react';

const autocompleteVariants = cva(
  'flex w-full font-rubik text-base font-normal leading-6 tracking-[0.15px] text-[color:var(--color-text-secondary)] max-h-14 h-auto px-3 py-2 rounded border border-[color:var(--color-border-default)] bg-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
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
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(() => {
      if (typeof value === 'string') return value;
      if (value && typeof value === 'object' && 'value' in value)
        return String((value as any).value);
      return '';
    });
    const [filteredOptions, setFilteredOptions] = React.useState(options);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Determine variant based on error/success states
    let finalVariant = variant;
    if (error) finalVariant = 'error';
    if (success) finalVariant = 'success';

    React.useEffect(() => {
      const inputValueStr = typeof inputValue === 'string' ? inputValue : '';
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(inputValueStr.toLowerCase())
      );
      setFilteredOptions(filtered);
    }, [inputValue, options]);

    // Update inputValue when value prop changes
    React.useEffect(() => {
      if (typeof value === 'string') {
        setInputValue(value);
      } else if (value && typeof value === 'object' && 'value' in value) {
        setInputValue(String((value as any).value));
      }
    }, [value]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setIsOpen(true);
      onChange?.(newValue);
    };

    const handleOptionClick = (option: AutocompleteOption) => {
      if (multiple) {
        const newSelectedValues = selectedValues.includes(option.value)
          ? selectedValues.filter(v => v !== option.value)
          : [...selectedValues, option.value];
        onSelectedValuesChange?.(newSelectedValues);
        setInputValue('');
      } else {
        setInputValue(option.label);
        setIsOpen(false);
        onSelect?.(option);
        onChange?.(option.value);
      }
    };

    const handleRemoveValue = (valueToRemove: string) => {
      const newSelectedValues = selectedValues.filter(v => v !== valueToRemove);
      onSelectedValuesChange?.(newSelectedValues);
    };

    const selectedOptions = options.filter(option =>
      selectedValues.includes(option.value)
    );

    return (
      <div className='relative' ref={containerRef}>
        <div className='relative'>
          <input
            className={cn(
              autocompleteVariants({ variant: finalVariant, size, className }),
              'pr-10'
            )}
            ref={ref}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            {...props}
          />
          <ChevronDown className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none' />
        </div>

        {/* Selected values display for multiple mode */}
        {multiple && selectedOptions.length > 0 && (
          <div className='flex flex-wrap gap-1 mt-2 bg-white rounded'>
            {selectedOptions.map(option => (
              <span
                key={option.value}
                className='inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded '
              >
                {option.label}
                <button
                  type='button'
                  onClick={() => handleRemoveValue(option.value)}
                  className='ml-1 hover:bg-primary/80 rounded-full p-0.5'
                >
                  <X className='h-3 w-3' />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Dropdown */}
        {isOpen && filteredOptions.length > 0 && (
          <div className='absolute z-50 w-full mt-1 bg-white border-none rounded shadow-lg max-h-60 overflow-auto'>
            {filteredOptions.map(option => (
              <button
                key={option.value}
                type='button'
                className={cn(
                  'w-full px-3 py-2 text-left hover:bg-primary/10 focus:bg-primary-100 focus:outline-none font-rubik text-[rgba(0,0,0,0.60)]',
                  multiple &&
                    selectedValues.includes(option.value) &&
                    'bg-primary/10'
                )}
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);
Autocomplete.displayName = 'Autocomplete';

export { Autocomplete, autocompleteVariants };
