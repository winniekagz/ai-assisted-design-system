import { ChevronRight } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ className, items, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label='Breadcrumb'
      className={cn(
        'text-[length:var(--font-size-body-sm)] text-[color:var(--text-secondary)] [font-family:var(--font-rubik)]',
        className
      )}
      {...props}
    >
      <ol className='flex flex-wrap items-center gap-[var(--spacing-xs)]'>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={index}
              className='inline-flex items-center gap-[var(--spacing-xs)]'
            >
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className='font-medium text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--color-primary)]'
                >
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(
                    isLast && 'font-medium text-[color:var(--text-title)]'
                  )}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight
                  aria-hidden='true'
                  className='size-[var(--spacing-md)] text-[color:var(--text-muted)]'
                  strokeWidth='var(--stroke-md)'
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  )
);

Breadcrumbs.displayName = 'Breadcrumbs';

export { Breadcrumbs };
