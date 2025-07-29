import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const textareaVariants = cva(
  'flex min-h-[80px] w-full font-rubik text-base font-normal leading-6 tracking-[0.15px] text-[rgba(0,0,0,0.60)] rounded border border-[rgba(0,0,0,0.23)] bg-transparent px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none',
  {
    variants: {
      variant: {
        default: 'border-[rgba(0,0,0,0.23)] focus:border-[#009966]',
        error: 'border-[#f44336] focus:border-[#f44336]',
        success: 'border-[#4caf50] focus:border-[#4caf50]',
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

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {
  error?: boolean;
  success?: boolean;
  autoGrow?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onStartIconClick?: () => void;
  onEndIconClick?: () => void;
}

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
      ...props
    },
    ref
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

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
      props.onChange?.(e);
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
          onChange={handleChange}
          {...props}
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
