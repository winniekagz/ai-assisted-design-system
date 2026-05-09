import { AlertCircle, CheckCircle, Info, TriangleAlert } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';

export interface AlertProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  variant?: AlertVariant;
  title?: React.ReactNode;
  icon?: React.ElementType;
}

const variantClasses: Record<AlertVariant, string> = {
  info: 'bg-[color:var(--helper-information-pastel)] text-[color:var(--helper-information)] border-[color:var(--helper-information)]',
  success:
    'bg-[color:var(--helper-success-pastel)] text-[color:var(--helper-success)] border-[color:var(--helper-success)]',
  warning:
    'bg-[color:var(--helper-warning-pastel)] text-[color:var(--helper-warning)] border-[color:var(--helper-warning)]',
  error:
    'bg-[color:var(--helper-error-pastel)] text-[color:var(--helper-error)] border-[color:var(--helper-error)]',
  neutral:
    'bg-[color:var(--bg-secondary)] text-[color:var(--text-paragraph)] border-[color:var(--border-default)]',
};

const defaultIcons: Record<AlertVariant, React.ElementType> = {
  info: Info,
  success: CheckCircle,
  warning: TriangleAlert,
  error: AlertCircle,
  neutral: Info,
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = 'info',
      title,
      icon: Icon = defaultIcons[variant],
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      role='status'
      className={cn(
        'flex gap-[var(--spacing-sm)] rounded-[var(--radius-md)] border p-[var(--spacing-md)]',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <Icon
        aria-hidden='true'
        className='mt-[var(--spacing-xs)] size-[var(--spacing-md)] shrink-0'
        strokeWidth='var(--stroke-md)'
      />
      <div className='grid gap-[var(--spacing-xs)]'>
        {title && (
          <div className='text-[length:var(--font-size-heading-6)] font-semibold text-[color:var(--text-title)] [font-family:var(--font-heading)]'>
            {title}
          </div>
        )}
        <div className='text-[length:var(--font-size-body-sm)] leading-[150%] text-[color:var(--text-paragraph)] [font-family:var(--font-rubik)]'>
          {children}
        </div>
      </div>
    </div>
  )
);

Alert.displayName = 'Alert';

export { Alert };
