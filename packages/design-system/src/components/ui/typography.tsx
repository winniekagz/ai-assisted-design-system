import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const typographyVariants = cva(
  '[font-family:var(--font-rubik)] text-[color:var(--text-paragraph)]',
  {
    variants: {
      variant: {
        // Heading variants
        h1: 'text-[length:var(--font-size-heading-1)] font-bold leading-[100%] tracking-[0px] text-[color:var(--text-title)] [font-family:var(--font-heading)]',
        h2: 'text-[length:var(--font-size-heading-2)] font-bold leading-[105%] tracking-[0px] text-[color:var(--text-title)] [font-family:var(--font-heading)]',
        h3: 'text-[length:var(--font-size-heading-3)] font-semibold leading-[115%] tracking-[0px] text-[color:var(--text-title)] [font-family:var(--font-heading)]',
        h4: 'text-[length:var(--font-size-heading-4)] font-semibold leading-[125%] tracking-[0px] text-[color:var(--text-title)] [font-family:var(--font-heading)]',
        h5: 'text-[length:var(--font-size-heading-5)] font-medium leading-[133%] tracking-[0px] text-[color:var(--text-title)] [font-family:var(--font-heading)]',
        h6: 'text-[length:var(--font-size-heading-6)] font-medium leading-[150%] tracking-[0px] text-[color:var(--text-title)] [font-family:var(--font-heading)]',

        // Body text variants
        body1:
          'text-[length:var(--font-size-body)] font-normal leading-[150%] tracking-[0px] text-[color:var(--text-paragraph)]',
        body2:
          'text-[length:var(--font-size-body-sm)] font-normal leading-[143%] tracking-[0px] text-[color:var(--text-secondary)]',

        // Specialized variants
        caption:
          'text-[length:var(--font-size-caption)] font-normal leading-[130%] tracking-[0px] text-[color:var(--text-secondary)]',
        small:
          'text-[length:var(--font-size-body-sm)] font-normal leading-[130%] tracking-[0px] text-[color:var(--text-secondary)]',
        link: 'text-[length:var(--font-size-body)] font-medium leading-[130%] tracking-[0px] text-[color:var(--color-primary)] hover:opacity-80 underline-offset-4 hover:underline',

        // Display variants
        display1:
          'text-[length:var(--font-size-display-1)] font-bold leading-tight tracking-[0px] text-[color:var(--text-title)] [font-family:var(--font-heading)]',
        display2:
          'text-[length:var(--font-size-display-2)] font-bold leading-tight tracking-[0px] text-[color:var(--text-title)] [font-family:var(--font-heading)]',
        display3:
          'text-[length:var(--font-size-display-3)] font-bold leading-tight tracking-[0px] text-[color:var(--text-title)] [font-family:var(--font-heading)]',

        // Code variants
        code: '[font-family:var(--font-mono)] text-[length:var(--font-size-body-sm)] bg-[color:var(--bg-secondary)] px-1.5 py-0.5 rounded-[var(--radius-sm)] text-[color:var(--text-paragraph)]',
        pre: '[font-family:var(--font-mono)] text-[length:var(--font-size-body-sm)] bg-[color:var(--bg-secondary)] p-4 rounded-[var(--radius-lg)] overflow-x-auto text-[color:var(--text-paragraph)]',
      },
      textColor: {
        default: 'text-[color:var(--text-paragraph)]',
        primary: 'text-[color:var(--color-primary)]',
        secondary: 'text-[color:var(--text-secondary)]',
        muted: 'text-[color:var(--text-muted)]',
        destructive: 'text-[color:var(--helper-error)]',
        success: 'text-[color:var(--helper-success)]',
        warning: 'text-[color:var(--helper-warning)]',
        info: 'text-[color:var(--helper-information)]',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
      },
      truncate: {
        true: 'truncate',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'body1',
      textColor: 'default',
      weight: 'normal',
      align: 'left',
      truncate: false,
    },
  }
);

export interface TypographyProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof typographyVariants> {
  asChild?: boolean;
  as?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'p'
    | 'span'
    | 'div'
    | 'code'
    | 'pre'
    | 'label'
    | 'a';
  children: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
}
export type TypographyVariantProps = VariantProps<
  typeof typographyVariants
>['variant'];
const Typography = React.forwardRef<any, TypographyProps>(
  (
    {
      className,
      variant,
      textColor,
      weight,
      align,
      truncate,
      asChild = false,
      as,
      children,
      href,
      target,
      rel,
      ...props
    },
    ref
  ) => {
    // Determine the HTML element based on variant or as prop
    const getElement = () => {
      if (as) return as;

      switch (variant) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          return variant;
        case 'code':
          return 'code';
        case 'pre':
          return 'pre';
        default:
          return 'p';
      }
    };

    const Comp = asChild ? Slot : getElement();

    // Prepare anchor-specific props
    const anchorProps =
      as === 'a' || getElement() === 'a' ? { href, target, rel } : {};

    return (
      <Comp
        ref={ref}
        data-slot='typography'
        className={cn(
          typographyVariants({
            variant,
            textColor,
            weight,
            align,
            truncate,
            className,
          })
        )}
        {...anchorProps}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Typography.displayName = 'Typography';

export { Typography, typographyVariants };
