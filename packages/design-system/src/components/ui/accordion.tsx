'use client';

import { Accordion as HeroAccordion } from '@heroui/react';
import { Minus, Plus } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps extends Omit<
  React.ComponentProps<typeof HeroAccordion.Root>,
  'children' | 'className'
> {
  items: AccordionItem[];
  className?: string;
  itemClassName?: string;
  triggerClassName?: string;
  bodyClassName?: string;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      className,
      itemClassName,
      triggerClassName,
      bodyClassName,
      hideSeparator = true,
      ...props
    },
    ref
  ) => {
    return (
      <HeroAccordion.Root
        ref={ref}
        hideSeparator={hideSeparator}
        className={cn(
          'flex w-full flex-col gap-[var(--spacing-sm)]',
          className
        )}
        {...props}
      >
        {items.map(item => (
          <HeroAccordion.Item
            key={item.id}
            id={item.id}
            isDisabled={item.disabled}
            className={({ isExpanded }) =>
              cn(
                'rounded-[var(--radius-md)] transition-colors duration-200',
                isExpanded &&
                  'bg-[color:var(--bg-surface)] shadow-[var(--shadow-sm)]',
                item.disabled && 'opacity-60',
                itemClassName
              )
            }
          >
            <HeroAccordion.Heading>
              <HeroAccordion.Trigger
                className={cn(
                  'flex w-full items-center gap-[var(--spacing-sm)] rounded-[var(--radius-md)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left outline-none transition-colors',
                  'text-[length:var(--font-size-heading-6)] font-semibold leading-[150%] tracking-[0px] text-[color:var(--text-title)] [font-family:var(--font-heading)]',
                  'hover:bg-[color:var(--bg-hover)] focus-visible:ring-2 focus-visible:ring-[color:var(--border-focus)] focus-visible:ring-offset-2',
                  triggerClassName
                )}
              >
                <HeroAccordion.Indicator
                  className={cn(
                    'grid size-4 shrink-0 place-items-center rounded-full border border-[color:var(--border-default)] text-[color:var(--text-secondary)] transition-colors',
                    '[&[data-expanded=true]_.ciq-accordion-plus]:hidden [&[data-expanded=true]_.ciq-accordion-minus]:block'
                  )}
                >
                  <span className='grid size-4 place-items-center'>
                    <Plus
                      className='ciq-accordion-plus size-3'
                      strokeWidth={1.5}
                    />
                    <Minus
                      className='ciq-accordion-minus hidden size-3'
                      strokeWidth={1.5}
                    />
                  </span>
                </HeroAccordion.Indicator>
                <span>{item.title}</span>
              </HeroAccordion.Trigger>
            </HeroAccordion.Heading>
            <HeroAccordion.Panel className='px-[var(--spacing-md)] pb-[var(--spacing-md)]'>
              <HeroAccordion.Body
                className={cn(
                  'rounded-[var(--radius-sm)] bg-[color:var(--bg-default)] px-[var(--spacing-md)] py-[var(--spacing-sm)]',
                  'text-[length:var(--font-size-body)] font-normal leading-[150%] tracking-[0px] text-[color:var(--text-paragraph)] [font-family:var(--font-rubik)]',
                  bodyClassName
                )}
              >
                {item.content}
              </HeroAccordion.Body>
            </HeroAccordion.Panel>
          </HeroAccordion.Item>
        ))}
      </HeroAccordion.Root>
    );
  }
);

Accordion.displayName = 'Accordion';

export { Accordion };
