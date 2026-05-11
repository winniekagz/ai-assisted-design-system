import * as React from 'react';

import { cn } from '@/lib/utils';

export interface StepperStep {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
}

export interface StepperProps extends React.HTMLAttributes<HTMLOListElement> {
  steps: StepperStep[];
  currentStep?: number;
}

const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(
  ({ className, steps, currentStep = 0, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn('grid gap-[var(--spacing-md)]', className)}
      {...props}
    >
      {steps.map((step, index) => {
        const isComplete = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <li key={step.id} className='flex gap-[var(--spacing-sm)]'>
            <div
              className={cn(
                'grid size-[var(--spacing-lg)] shrink-0 place-items-center rounded-[var(--radius-full)] border text-[length:var(--font-size-caption)] font-semibold [font-family:var(--font-heading)]',
                isComplete || isCurrent
                  ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-[color:var(--text-inverse)]'
                  : 'border-[color:var(--border-default)] bg-[color:var(--bg-surface)] text-[color:var(--text-secondary)]'
              )}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {index + 1}
            </div>
            <div className='grid gap-[var(--spacing-xs)]'>
              <div className='text-[length:var(--font-size-body-sm)] font-medium text-[color:var(--text-title)] [font-family:var(--font-heading)]'>
                {step.label}
              </div>
              {step.description && (
                <div className='text-[length:var(--font-size-caption)] text-[color:var(--text-secondary)] [font-family:var(--font-rubik)]'>
                  {step.description}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  )
);

Stepper.displayName = 'Stepper';

export { Stepper };
