'use client';

import * as SheetPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export type SheetSide = 'top' | 'right' | 'bottom' | 'left';
export type SheetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const sideClasses: Record<SheetSide, string> = {
  top: 'inset-x-0 top-0 max-h-[min(92vh,720px)] rounded-b-[var(--radius-lg)] border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
  right:
    'inset-y-0 right-0 h-full border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
  bottom:
    'inset-x-0 bottom-0 max-h-[min(92vh,720px)] rounded-t-[var(--radius-lg)] border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
  left: 'inset-y-0 left-0 h-full border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
};

const sizeClasses: Record<SheetSide, Record<SheetSize, string>> = {
  top: {
    sm: 'h-[320px]',
    md: 'h-[480px]',
    lg: 'h-[640px]',
    xl: 'h-[760px]',
    full: 'h-screen max-h-screen rounded-none',
  },
  right: {
    sm: 'w-[min(100vw,360px)]',
    md: 'w-[min(100vw,520px)]',
    lg: 'w-[min(100vw,720px)]',
    xl: 'w-[min(100vw,920px)]',
    full: 'w-screen',
  },
  bottom: {
    sm: 'h-[320px]',
    md: 'h-[480px]',
    lg: 'h-[640px]',
    xl: 'h-[760px]',
    full: 'h-screen max-h-screen rounded-none',
  },
  left: {
    sm: 'w-[min(100vw,360px)]',
    md: 'w-[min(100vw,520px)]',
    lg: 'w-[min(100vw,720px)]',
    xl: 'w-[min(100vw,920px)]',
    full: 'w-screen',
  },
};

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;
const SheetTitle = SheetPrimitive.Title;
const SheetDescription = SheetPrimitive.Description;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

export interface SheetContentProps extends React.ComponentPropsWithoutRef<
  typeof SheetPrimitive.Content
> {
  side?: SheetSide;
  size?: SheetSize;
  showClose?: boolean;
  closeLabel?: string;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(
  (
    {
      side = 'right',
      size = 'md',
      showClose = true,
      closeLabel = 'Close sheet',
      className,
      children,
      ...props
    },
    ref
  ) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-50 grid grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] text-[color:var(--text-paragraph)] shadow-xl outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:duration-200 data-[state=open]:duration-300',
          sideClasses[side],
          sizeClasses[side][size],
          className
        )}
        {...props}
      >
        {children}
        {showClose && (
          <SheetPrimitive.Close
            className='absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-[var(--radius-md)] text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-hover)] hover:text-[color:var(--text-title)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]'
            aria-label={closeLabel}
          >
            <X className='size-4' aria-hidden='true' />
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'border-b border-[color:var(--border-subtle)] px-6 py-5 pr-14',
      className
    )}
    {...props}
  />
));
SheetHeader.displayName = 'SheetHeader';

const SheetBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('min-h-0 overflow-y-auto px-6 py-5', className)}
    {...props}
  />
));
SheetBody.displayName = 'SheetBody';

const SheetFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col-reverse gap-2 border-t border-[color:var(--border-subtle)] px-6 py-4 sm:flex-row sm:justify-end',
      className
    )}
    {...props}
  />
));
SheetFooter.displayName = 'SheetFooter';

export interface DrawerProps extends SheetContentProps {
  trigger?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

function Drawer({
  trigger,
  header,
  footer,
  children,
  ...contentProps
}: DrawerProps) {
  return (
    <Sheet>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent {...contentProps}>
        {header ? <SheetHeader>{header}</SheetHeader> : <div />}
        <SheetBody>{children}</SheetBody>
        {footer ? <SheetFooter>{footer}</SheetFooter> : <div />}
      </SheetContent>
    </Sheet>
  );
}

export {
  Drawer,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
