import { BadgeVariants } from '../../../types/badgw';

// Fully literal Tailwind class map for known statuses
export const defaultBadgeStatusConfig = {
  success: {
    label: 'Success',
    colors: {
      filled: 'bg-success-500 dark:bg-success-600 text-white',
      outlined:
        'bg-transparent text-success-500 dark:text-success-600 border-success-500 dark:border-success-600',
      pastel: 'bg-success-50 text-success-500',
    },
  },
  pending: {
    label: 'Pending',
    colors: {
      filled: 'bg-warning-500 dark:bg-warning-600 text-white',
      outlined:
        'bg-transparent text-warning-500 dark:text-warning-600 border-warning-500 dark:border-warning-600',
      pastel: 'bg-warning-50 text-warning-500',
    },
  },
  error: {
    label: 'Error',
    colors: {
      filled: 'bg-error-500 dark:bg-error-600 text-white',
      outlined:
        'bg-transparent text-error-500 dark:text-error-600 border-error-500 dark:border-error-600',
      pastel: 'bg-error-50 text-error-500',
    },
  },
  completed: {
    label: 'Completed',
    colors: {
      filled: 'bg-info-500 dark:bg-info-600 text-white',
      outlined:
        'bg-transparent text-info-500 dark:text-info-600 border-info-500 dark:border-info-600',
      pastel: 'bg-info-50 text-info-500',
    },
  },
  neutral: {
    label: 'Neutral',
    colors: {
      filled: 'bg-neutral-500 dark:bg-neutral-600 text-white',
      outlined:
        'bg-transparent text-neutral-500 dark:text-neutral-600 border-neutral-500 dark:border-neutral-600',
      pastel: 'bg-neutral-50 text-neutral-500',
    },
  },
} as const;

// Fallback dynamic generator for custom colors
export const makeCustomColors = (
  colorName: string,
  status: string
): BadgeVariants => {
  console.log('[makeCustomColors] generating colors for:', colorName);

  return {
    filled: `bg-${colorName}-500 dark:bg-${colorName}-600 text-white`,
    outlined: `bg-transparent text-${colorName}-500 dark:text-${colorName}-600 border-${colorName}-500 dark:border-${colorName}-600`,
    pastel: `bg-${colorName}-50 text-${colorName}-500`,
  };
};
