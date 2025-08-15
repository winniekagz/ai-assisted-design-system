import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

// Tab trigger variants
const tabTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-body1 font-normal transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm',
  {
    variants: {
      variant: {
        underlined:
          'border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary',
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
  'inline-flex h-10 items-center justify-center text-muted-foreground',
  {
    variants: {
      variant: {
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
  content: React.ReactNode;
}

export interface ReusableTabsProps
  extends React.ComponentPropsWithoutRef<typeof Tabs>,
    VariantProps<typeof tabTriggerVariants> {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
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
      triggerClassName,
      contentClassName,
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
        <TabsList className={cn(tabListVariants({ variant }))}>
          {items.map(item => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className={cn(
                tabTriggerVariants({ variant, size }),
                triggerClassName
              )}
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
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

export { ReusableTabs, tabListVariants, tabTriggerVariants };
