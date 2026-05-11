'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'dir' | 'onChange'
> {
  items: AccordionItem[];
  defaultExpandedKeys?: Iterable<string>;
  expandedKeys?: Iterable<string>;
  onExpandedChange?: (keys: Set<string>) => void;
  allowsMultipleExpanded?: boolean;
  dir?: 'ltr' | 'rtl';
  itemClassName?: string;
  triggerClassName?: string;
  bodyClassName?: string;
}

function toKeyArray(keys: Iterable<string> | undefined) {
  return Array.from(keys ?? []);
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      defaultExpandedKeys,
      expandedKeys,
      onExpandedChange,
      allowsMultipleExpanded = false,
      className,
      itemClassName,
      triggerClassName,
      bodyClassName,
      ...props
    },
    ref
  ) => {
    const value = expandedKeys ? toKeyArray(expandedKeys) : undefined;
    const defaultValue = defaultExpandedKeys
      ? toKeyArray(defaultExpandedKeys)
      : undefined;

    const accordionItems = (
      <>
        {items.map(item => (
          <AccordionPrimitive.Item
            key={item.id}
            value={item.id}
            disabled={item.disabled}
            data-slot='accordion-item'
            className={cn(
              'group overflow-hidden rounded-[var(--radius-lg)] border transition-colors duration-[var(--motion-normal)] ease-[var(--motion-easing)]',
              'border-[color:var(--border-subtle)] bg-[color:var(--bg-default)]',
              'hover:bg-[color:var(--bg-hover)]',
              'data-[disabled]:pointer-events-none',
              'data-[state=open]:border-[color:var(--border-default)] data-[state=open]:bg-[color:var(--bg-surface)] data-[state=open]:shadow-[var(--shadow-sm)] data-[state=open]:hover:bg-[color:var(--bg-surface)]',
              itemClassName
            )}
          >
            <AccordionPrimitive.Header className='m-0'>
              <AccordionPrimitive.Trigger
                className={cn(
                  'flex w-full items-center gap-2 px-[var(--spacing-md)] py-[var(--spacing-md)] outline-none transition-colors duration-[var(--motion-normal)] ease-[var(--motion-easing)]',
                  'text-[length:var(--font-size-heading-6)] font-semibold leading-[150%] tracking-[0px] text-[color:var(--text-title)] [font-family:var(--font-heading)]',
                  'hover:bg-[color:var(--bg-hover)] focus-visible:ring-2 focus-visible:ring-[color:var(--border-focus)] focus-visible:ring-inset',
                  'data-[state=open]:hover:bg-[color:var(--bg-surface)]',
                  triggerClassName
                )}
              >
                {item.startIcon && (
                  <span
                    aria-hidden='true'
                    className='grid shrink-0 place-items-center rounded border border-[color:var(--border-subtle)] p-1 text-[color:var(--text-secondary)]'
                  >
                    {item.startIcon}
                  </span>
                )}
                <span className='min-w-0 flex-1 text-left'>{item.title}</span>
                {item.endIcon !== undefined ? (
                  item.endIcon
                ) : (
                  <ChevronDown
                    aria-hidden='true'
                    className='size-[var(--spacing-md)] shrink-0 text-[color:var(--text-secondary)] transition-transform duration-[var(--motion-normal)] ease-[var(--motion-easing)] group-data-[state=open]:rotate-180'
                    strokeWidth='var(--stroke-md)'
                  />
                )}
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content
              data-slot='accordion-panel'
              className='overflow-hidden border-t border-[color:var(--border-subtle)] data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up'
            >
              <div
                className={cn(
                  'bg-[color:var(--bg-surface)] px-[var(--spacing-md)] pb-[var(--spacing-md)] pt-[var(--spacing-sm)]',
                  'text-[length:var(--font-size-body)] font-normal leading-[160%] tracking-[0px] text-[color:var(--text-paragraph)] [font-family:var(--font-rubik)]',
                  bodyClassName
                )}
              >
                {item.content}
              </div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        ))}
      </>
    );

    if (allowsMultipleExpanded) {
      return (
        <AccordionPrimitive.Root
          ref={ref}
          type='multiple'
          value={value}
          defaultValue={defaultValue}
          onValueChange={keys => onExpandedChange?.(new Set(keys))}
          data-slot='accordion'
          className={cn(
            'flex w-full flex-col gap-[var(--spacing-sm)]',
            className
          )}
          {...props}
        >
          {accordionItems}
        </AccordionPrimitive.Root>
      );
    }

    return (
      <AccordionPrimitive.Root
        ref={ref}
        type='single'
        collapsible
        value={value?.[0]}
        defaultValue={defaultValue?.[0]}
        onValueChange={key =>
          onExpandedChange?.(key ? new Set([key]) : new Set())
        }
        data-slot='accordion'
        className={cn(
          'flex w-full flex-col gap-[var(--spacing-sm)]',
          className
        )}
        {...props}
      >
        {accordionItems}
      </AccordionPrimitive.Root>
    );
  }
);

Accordion.displayName = 'Accordion';

export { Accordion };
