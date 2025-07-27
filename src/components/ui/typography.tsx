import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const typographyVariants = cva('font-rubik text-foreground', {
  variants: {
    variant: {
      // Heading variants
      h1: 'text-[75px] font-bold leading-[100%] tracking-[-2px] text-[#E0E0E0]',
      h2: 'text-[50px] font-bold leading-[100%] tracking-[-3%] text-[rgba(0,0,0,0.87)]',
      h3: 'text-[30px] font-semibold leading-[100%] tracking-[-2px]',
      h4: 'text-[21px] font-semibold leading-[120%] tracking-[0px]',
      h5: 'text-[1.5em] font-medium leading-[133%] tracking-[0.5%]',
      h6: 'text-[1.25rem] font-medium leading-[160%] tracking-[0.15px] text-[rgba(0,0,0,0.6)]',

      // Body text variants
      body1:
        'text-[1rem] font-normal leading-[150%] tracking-[0.15%] text-[rgba(0,0,0,0.6)]',
      body2:
        'text-[0.87rem] font-normal leading-[143%] tracking-[0.17%] text-[rgba(0,0,0,0.6)]',

      // Specialized variants
      caption: 'text-[14px] font-normal leading-[100%] tracking-[0px]',
      small: 'text-[14px] font-normal leading-[130%] tracking-[0px]',
      link: 'text-[16px] font-medium leading-[130%] tracking-[0.15px] text-primary hover:text-primary/80 underline-offset-4 hover:underline',

      // Display variants
      display1: 'text-[2.25rem] font-bold leading-tight tracking-tight',
      display2: 'text-[3rem] font-bold leading-tight tracking-tight',
      display3: 'text-[3.75rem] font-bold leading-tight tracking-tight',

      // Code variants
      code: 'font-mono text-sm bg-muted px-1.5 py-0.5 rounded-md',
      pre: 'font-mono text-sm bg-muted p-4 rounded-lg overflow-x-auto',
    },
    textColor: {
      default: 'text-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
      success: 'text-success-500',
      warning: 'text-warning-500',
      info: 'text-info-500',
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
});

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
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
