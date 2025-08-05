import { buttonVariants } from '@/components/ui/button';
import { type VariantProps } from 'class-variance-authority';

// Utility to create custom button variants
export function createCustomButtonVariants(
  customVariants: Record<string, string> = {},
  customSizes: Record<string, string> = {}
) {
  return {
    variants: {
      variant: {
        ...buttonVariants.variants?.variant,
        ...customVariants,
      },
      size: {
        ...buttonVariants.variants?.size,
        ...customSizes,
      },
      fullWidth: buttonVariants.variants?.fullWidth,
    },
    defaultVariants: buttonVariants.defaultVariants,
  };
}

// Utility to get button styles for custom components
export function getButtonStyles(
  variant: VariantProps<typeof buttonVariants>['variant'] = 'contained',
  size: VariantProps<typeof buttonVariants>['size'] = 'default',
  fullWidth: boolean = false,
  className?: string
) {
  return buttonVariants({ variant, size, fullWidth, className });
}

// Utility to create button presets
export const buttonPresets = {
  // Common button combinations
  primary: {
    variant: 'contained' as const,
    size: 'default' as const,
  },
  secondary: {
    variant: 'outlined' as const,
    size: 'default' as const,
  },
  danger: {
    variant: 'destructive' as const,
    size: 'default' as const,
  },
  small: {
    variant: 'contained' as const,
    size: 'sm' as const,
  },
  large: {
    variant: 'contained' as const,
    size: 'lg' as const,
  },
  icon: {
    variant: 'ghost' as const,
    size: 'icon' as const,
  },
  link: {
    variant: 'link' as const,
    size: 'default' as const,
  },
} as const;

// Utility to validate button props
export function validateButtonProps(props: {
  variant?: string;
  size?: string;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
}) {
  const errors: string[] = [];

  // Validate variant
  const validVariants = [
    'contained',
    'outlined',
    'text',
    'secondary',
    'destructive',
    'ghost',
    'link',
  ];
  if (props.variant && !validVariants.includes(props.variant)) {
    errors.push(`Invalid variant: ${props.variant}`);
  }

  // Validate size
  const validSizes = ['sm', 'default', 'lg', 'xl', 'icon'];
  if (props.size && !validSizes.includes(props.size)) {
    errors.push(`Invalid size: ${props.size}`);
  }

  // Validate boolean props
  if (
    typeof props.fullWidth !== 'undefined' &&
    typeof props.fullWidth !== 'boolean'
  ) {
    errors.push('fullWidth must be a boolean');
  }
  if (
    typeof props.loading !== 'undefined' &&
    typeof props.loading !== 'boolean'
  ) {
    errors.push('loading must be a boolean');
  }
  if (
    typeof props.disabled !== 'undefined' &&
    typeof props.disabled !== 'boolean'
  ) {
    errors.push('disabled must be a boolean');
  }

  return errors;
}

// Utility to generate button variants for different themes
export function generateThemeButtonVariants(theme: 'light' | 'dark' = 'light') {
  const baseVariants = {
    contained:
      'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
    outlined:
      'border border-border bg-background text-foreground shadow-sm hover:bg-accent',
    text: 'bg-transparent text-primary hover:bg-primary/10',
    destructive:
      'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
  };

  if (theme === 'dark') {
    return {
      ...baseVariants,
      contained:
        'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 dark:bg-primary/90',
      outlined:
        'border border-border bg-background text-foreground shadow-sm hover:bg-accent dark:border-border/50',
    };
  }

  return baseVariants;
}

// Utility to create responsive button variants
export function createResponsiveButtonVariants() {
  return {
    sm: 'h-8 px-3 py-1.5 text-xs rounded-md gap-1.5 md:h-9 md:px-4 md:py-2 md:text-sm',
    default:
      'h-10 px-[30px] py-[10px] text-sm rounded-md gap-2 md:h-11 md:px-6 md:py-2.5 md:text-base',
    lg: 'h-11 px-6 py-2.5 text-base rounded-md gap-2.5 md:h-12 md:px-8 md:py-3 md:text-lg',
  };
}
