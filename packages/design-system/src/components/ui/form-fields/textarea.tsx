import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import {
  createInputSecurityProcessor,
  type InputNormalizationPolicy,
  type InputValidationResult,
} from '@/lib/input-security';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
  'flex min-h-[80px] w-full font-rubik text-base font-normal leading-6 tracking-[0.15px] text-[color:var(--color-text-secondary)] rounded border border-[color:var(--color-border-default)] bg-transparent px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none',
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
        default: 'min-h-[80px] px-3 py-2',
        sm: 'min-h-[60px] px-2 py-1 text-sm',
        lg: 'min-h-[100px] px-4 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type TextareaSecurityProps =
  | {
      inputSecurityPolicy?: undefined;
      onInputValidationResult?: never;
      onNormalizedValueChange?: never;
    }
  | {
      inputSecurityPolicy: InputNormalizationPolicy;
      // eslint-disable-next-line no-unused-vars
      onInputValidationResult?: (result: InputValidationResult) => void;
      // eslint-disable-next-line no-unused-vars
      onNormalizedValueChange: (value: string) => void;
    };

export type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size'
> &
  VariantProps<typeof textareaVariants> & {
    error?: boolean;
    success?: boolean;
    autoGrow?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    onStartIconClick?: () => void;
    onEndIconClick?: () => void;
  } & TextareaSecurityProps;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      size,
      error,
      success,
      autoGrow = false,
      startIcon,
      endIcon,
      onStartIconClick,
      onEndIconClick,
      inputSecurityPolicy,
      onInputValidationResult,
      onNormalizedValueChange,
      onBlur,
      onChange,
      onCompositionEnd,
      onCompositionStart,
      ...props
    },
    ref
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const isComposingRef = React.useRef(false);
    const inputSecurityProcessor = React.useMemo(
      () =>
        inputSecurityPolicy
          ? createInputSecurityProcessor({
              policy: inputSecurityPolicy,
              onValidationResult: onInputValidationResult,
              onNormalizedValue: value => onNormalizedValueChange?.(value),
            })
          : null,
      [inputSecurityPolicy, onInputValidationResult, onNormalizedValueChange]
    );

    // Determine variant based on error/success states
    let finalVariant = variant;
    if (error) finalVariant = 'error';
    if (success) finalVariant = 'success';

    // Auto-grow functionality
    React.useEffect(() => {
      if (autoGrow && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [props.value, autoGrow]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoGrow && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
      inputSecurityProcessor?.handleChange(e.currentTarget.value, {
        isComposing: isComposingRef.current,
      });
      onChange?.(e);
    };

    const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      const outcome = inputSecurityProcessor?.handleBlur(event.currentTarget.value);
      if (outcome?.changed) {
        event.currentTarget.value = outcome.result.value;
      }
      onBlur?.(event);
    };

    const handleCompositionStart = (
      event: React.CompositionEvent<HTMLTextAreaElement>
    ) => {
      isComposingRef.current = true;
      onCompositionStart?.(event);
    };

    const handleCompositionEnd = (
      event: React.CompositionEvent<HTMLTextAreaElement>
    ) => {
      isComposingRef.current = false;
      onCompositionEnd?.(event);
    };

    return (
      <div className='relative'>
        <textarea
          className={cn(
            textareaVariants({ variant: finalVariant, size, className }),
            startIcon && 'pl-10',
            endIcon && 'pr-10'
          )}
          ref={node => {
            // Handle both refs
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            textareaRef.current = node;
          }}
          {...props}
          onBlur={handleBlur}
          onChange={handleChange}
          onCompositionEnd={handleCompositionEnd}
          onCompositionStart={handleCompositionStart}
        />
        {startIcon && (
          <div
            className={cn(
              'absolute left-3 top-3 text-muted-foreground',
              onStartIconClick && 'cursor-pointer hover:text-foreground'
            )}
            onClick={onStartIconClick}
          >
            {startIcon}
          </div>
        )}
        {endIcon && (
          <div
            className={cn(
              'absolute right-3 top-3 text-muted-foreground',
              onEndIconClick && 'cursor-pointer hover:text-foreground'
            )}
            onClick={onEndIconClick}
          >
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
