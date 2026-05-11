import * as React from 'react';

import { cn } from '@/lib/utils';

export interface CodeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
}

const CodeTextarea = React.forwardRef<HTMLTextAreaElement, CodeTextareaProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;

    return (
      <div className='grid gap-[var(--spacing-xs)]'>
        {label && (
          <label
            htmlFor={textareaId}
            className='text-[length:var(--font-size-body-sm)] font-medium text-[color:var(--text-title)] [font-family:var(--font-heading)]'
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          spellCheck={false}
          className={cn(
            'min-h-[calc(var(--spacing-2xl)*4)] w-full resize-y rounded-[var(--radius-md)] border border-[color:var(--border-default)] bg-[color:var(--bg-secondary)] p-[var(--spacing-md)] text-[length:var(--font-size-body-sm)] leading-[150%] text-[color:var(--text-paragraph)] shadow-none outline-none [font-family:var(--font-mono)] placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--border-focus)] focus-visible:ring-2 focus-visible:ring-[color:var(--border-focus)] focus-visible:ring-offset-1 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

CodeTextarea.displayName = 'CodeTextarea';

export { CodeTextarea };
