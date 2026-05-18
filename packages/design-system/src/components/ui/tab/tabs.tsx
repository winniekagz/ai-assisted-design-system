import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

// Tab trigger variants
const tabTriggerVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap text-[0.87rem] leading-[24px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-none',
  {
    variants: {
      variant: {
        pill: 'rounded-full text-[color:var(--text-title)] hover:bg-[color:var(--bg-hover)] data-[state=active]:bg-[color:var(--color-primary-50,var(--bg-hover))] data-[state=active]:text-[color:var(--color-primary)]',
        segmented:
          'rounded-[var(--radius-md)] text-[color:var(--text-secondary)] hover:bg-[color:var(--bg-hover)] hover:text-[color:var(--text-title)] data-[state=active]:bg-[color:var(--bg-surface)] data-[state=active]:text-[color:var(--text-title)] data-[state=active]:shadow-sm',
        underline:
          'rounded-none border-b-2 border-transparent text-[color:var(--text-secondary)] hover:text-[color:var(--color-primary)] data-[state=active]:border-[color:var(--color-primary)] data-[state=active]:text-[color:var(--color-primary)]',
        underlined:
          'border-b-2 border-transparent text-muted-foreground hover:text-primary uppercase hover:border-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary',
        outlined:
          'rounded-lg data-[state=active]:border data-[state=active]:border-input bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border-primary',
        contained:
          'rounded-lg bg-transparent text-muted-foreground hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
        rounded:
          'rounded-full bg-transparent text-muted-foreground hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 py-1',
        lg: 'h-12 px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'underlined',
      size: 'default',
    },
  }
);

// Tab list variants
const tabListVariants = cva(
  'inline-flex w-max min-w-full items-center text-muted-foreground',
  {
    variants: {
      variant: {
        pill: 'gap-2 rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-2 shadow-sm',
        segmented:
          'gap-1 rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[color:var(--bg-secondary)] p-1 shadow-sm',
        underline:
          'gap-6 border-b border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)]',
        underlined: ' px-2 py-1 gap-6',
        outlined: 'rounded-lg bg-transparent px-2 py-1 gap-2',
        contained: 'rounded-lg bg-muted px-2 py-1 gap-2',
        rounded: 'rounded-lg bg-transparent p-1 px-2 py-1 gap-2',
      },
    },
    defaultVariants: {
      variant: 'underlined',
    },
  }
);

export interface TabItem {
  value: string;
  label: string;
  content?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface ReusableTabsProps
  extends
    React.ComponentPropsWithoutRef<typeof Tabs>,
    VariantProps<typeof tabTriggerVariants> {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  badgeClassName?: string;
  contentClassName?: string;
  scrollable?: boolean;
}

const ReusableTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  ReusableTabsProps
>(
  (
    {
      items,
      variant = 'underlined',
      size = 'default',
      defaultValue,
      className,
      listClassName,
      triggerClassName,
      badgeClassName,
      contentClassName,
      scrollable = true,
      ...props
    },
    ref
  ) => {
    const defaultTabValue = defaultValue || items[0]?.value;

    return (
      <Tabs
        ref={ref}
        defaultValue={defaultTabValue}
        className={cn('w-full', className)}
        {...props}
      >
        <div
          className={cn(
            scrollable &&
              'w-full overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          )}
        >
          <TabsList className={cn(tabListVariants({ variant }), listClassName)}>
            {items.map(item => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                disabled={item.disabled}
                className={cn(
                  tabTriggerVariants({ variant, size }),
                  triggerClassName
                )}
              >
                {item.icon && (
                  <span className='flex h-5 w-5 shrink-0 items-center justify-center [&>svg]:h-5 [&>svg]:w-5'>
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge !== null && (
                  <span
                    className={cn(
                      'inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-primary)] px-2 text-xs font-semibold leading-none text-[color:var(--color-primary-fg,var(--text-inverse))]',
                      badgeClassName
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {items.map(item => (
          <TabsContent
            key={item.value}
            value={item.value}
            className={cn(
              'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              contentClassName
            )}
          >
            {item.content}
          </TabsContent>
        ))}
      </Tabs>
    );
  }
);

ReusableTabs.displayName = 'ReusableTabs';

export {
  ReusableTabs,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  tabListVariants,
  tabTriggerVariants,
};
