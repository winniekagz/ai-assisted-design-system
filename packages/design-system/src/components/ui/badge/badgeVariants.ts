import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border font-medium transition-colors focus:outline-none focus:ring-offset-2',
  {
    variants: {
      variant: {
        filled: '',
        outlined: 'bg-transparent',
        pastel: '',
      },
      size: {
        sm: 'text-xs px-2.5 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-2',
        xl: 'text-lg px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'pastel',
      size: 'md',
    },
  }
);
