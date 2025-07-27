import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 ",
  {
    variants: {
      variant: {
        // Contained variant (default filled button)
        contained:
          'bg-primary text-primary-foreground  hover:bg-primary/90 active:bg-primary/80 focus-visible:ring-primary/20 font-medium text-base radius-md ',
        // Outlined variant (bordered button)
        outlined:
          'border border-border bg-background text-foreground  hover:bg-accent hover:text-accent-foreground active:bg-accent/80  font-medium text-base radius-md',
        // Text variant (minimal button)
        text: 'bg-transparent text-primary hover:bg-primary/10  active:bg-primary/20 focus-visible:ring-primary/20 font-medium text-base radius-md',
        // Destructive variant
        destructive:
          'bg-destructive hover:bg-destructive/90 active:bg-destructive/80 font-medium text-base radius-md text-white',
        // Secondary variant
        secondary:
          'bg-secondary text-secondary-foreground  hover:bg-secondary/80 active:bg-secondary/70 font-medium text-base radius-md',
        // Ghost variant
        ghost:
          'hover:bg-accent hover:text-accent-foreground active:bg-accent/80 focus-visible:ring-accent/20 font-medium text-base radius-md',
        // Link variant
        link: 'text-primary underline-offset-4 hover:underline focus-visible:ring-primary/20 font-medium text-base radius-md',
      },
      size: {
        sm: 'h-8 px-3 py-1.5 text-xs rounded-md gap-1.5',
        default: 'h-10 px-[30px] py-[10px] text-sm rounded-md gap-2',
        lg: 'h-11 px-6 py-2.5 text-base rounded-md gap-2.5',
        xl: 'h-12 px-8 py-3 text-lg rounded-lg gap-3',
        icon: 'h-9 w-9 p-0',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'contained',
      size: 'default',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      startIcon,
      endIcon,
      leftIcon, // Backward compatibility
      rightIcon, // Backward compatibility
      children,
      disabled,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      'aria-expanded': ariaExpanded,
      'aria-pressed': ariaPressed,
      'aria-haspopup': ariaHaspopup,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;

    // Use startIcon/endIcon or fallback to leftIcon/rightIcon for backward compatibility
    const finalStartIcon = startIcon || leftIcon;
    const finalEndIcon = endIcon || rightIcon;

    // Enhanced accessibility attributes
    const accessibilityProps = {
      disabled: isDisabled,
      'aria-disabled': isDisabled,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      'aria-expanded': ariaExpanded,
      'aria-pressed': ariaPressed,
      'aria-haspopup': ariaHaspopup,
      'aria-busy': loading,
      role: props.role || 'button',
      tabIndex: isDisabled ? -1 : props.tabIndex,
    };

    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className='animate-spin size-4'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        aria-hidden='true'
      >
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        />
        <path
          className='opacity-75'
          fill='currentColor'
          d='m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    );

    return (
      <Comp
        ref={ref}
        data-slot='button'
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        {...accessibilityProps}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {!loading && finalStartIcon && (
          <span className='flex-shrink-0' aria-hidden='true'>
            {finalStartIcon}
          </span>
        )}
        <span className='flex-shrink-0'>{children}</span>
        {!loading && finalEndIcon && (
          <span className='flex-shrink-0' aria-hidden='true'>
            {finalEndIcon}
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
