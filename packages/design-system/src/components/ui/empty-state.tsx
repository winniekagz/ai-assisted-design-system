import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from './button';

export interface EmptyStateProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      icon,
      title,
      description,
      actionLabel,
      onAction,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center gap-[var(--spacing-sm)] rounded-[var(--radius-lg)] border border-dashed border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-[var(--spacing-xl)] text-center',
        className
      )}
      {...props}
    >
      {icon && (
        <div className='grid size-[var(--spacing-2xl)] place-items-center rounded-[var(--radius-full)] bg-[color:var(--bg-secondary)] text-[color:var(--text-secondary)]'>
          {icon}
        </div>
      )}
      <div className='text-[length:var(--font-size-heading-6)] font-semibold text-[color:var(--text-title)] [font-family:var(--font-heading)]'>
        {title}
      </div>
      {description && (
        <div className='max-w-prose text-[length:var(--font-size-body-sm)] leading-[150%] text-[color:var(--text-secondary)] [font-family:var(--font-rubik)]'>
          {description}
        </div>
      )}
      {children}
      {actionLabel && onAction && (
        <Button size='sm' onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
);

EmptyState.displayName = 'EmptyState';

export { EmptyState };
