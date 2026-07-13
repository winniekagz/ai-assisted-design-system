'use client';

import * as ToastPrimitive from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastPayload {
  id?: string;
  variant?: ToastVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  message?: string;
  duration?: number;
}

type ToastItem = Required<Pick<ToastPayload, 'id' | 'variant'>> &
  Omit<ToastPayload, 'id' | 'variant'>;

type ToastListener = () => void;

const TOAST_LIMIT = 5;
const listeners = new Set<ToastListener>();
let toastItems: ToastItem[] = [];

function createToastId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function emitChange() {
  listeners.forEach(listener => listener());
}

function subscribe(listener: ToastListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return toastItems;
}

function removeToast(id: string) {
  toastItems = toastItems.filter(item => item.id !== id);
  emitChange();
}

export function toast(payload: ToastPayload) {
  const id = payload.id ?? createToastId();
  const item: ToastItem = {
    ...payload,
    id,
    variant: payload.variant ?? 'info',
  };

  toastItems = [item, ...toastItems.filter(existing => existing.id !== id)].slice(
    0,
    TOAST_LIMIT
  );
  emitChange();

  return {
    id,
    dismiss: () => removeToast(id),
  };
}

export function useToast() {
  const toasts = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    toasts,
    toast,
    dismiss: removeToast,
  };
}

const toastVariantClasses: Record<ToastVariant, string> = {
  info: 'border-[color:var(--status-info)] bg-[color:var(--status-info-bg)] text-[color:var(--status-info)]',
  success:
    'border-[color:var(--status-success)] bg-[color:var(--status-success-bg)] text-[color:var(--status-success)]',
  warning:
    'border-[color:var(--status-warning)] bg-[color:var(--status-warning-bg)] text-[color:var(--status-warning)]',
  error:
    'border-[color:var(--status-error)] bg-[color:var(--status-error-bg)] text-[color:var(--status-error)]',
};

const ToastProvider = ToastPrimitive.Provider;

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & {
    variant?: ToastVariant;
  }
>(({ className, variant = 'info', ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    role='status'
    className={cn(
      'grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-[var(--spacing-sm)] gap-y-[var(--spacing-xs)] rounded-[var(--radius-lg)] border p-[var(--spacing-md)] shadow-lg [font-family:var(--font-rubik)] data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-2 data-[state=open]:sm:slide-in-from-right-full',
      toastVariantClasses[variant],
      className
    )}
    {...props}
  />
));
Toast.displayName = ToastPrimitive.Root.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn(
      'text-[length:var(--font-size-body-md)] font-semibold leading-[140%] text-[color:var(--text-title)] [font-family:var(--font-heading)]',
      className
    )}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn(
      'col-start-1 text-[length:var(--font-size-body-sm)] leading-[150%] text-[color:var(--text-secondary)]',
      className
    )}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, children, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      'row-span-2 inline-flex size-9 items-center justify-center rounded-[var(--radius-md)] text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-hover)] hover:text-[color:var(--text-title)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]',
      className
    )}
    {...props}
  >
    {children ?? <X className='size-4' aria-hidden='true' />}
  </ToastPrimitive.Close>
));
ToastClose.displayName = ToastPrimitive.Close.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      'col-start-1 inline-flex min-h-9 w-fit items-center justify-center rounded-[var(--radius-md)] border border-current px-[var(--spacing-sm)] text-[length:var(--font-size-body-sm)] font-semibold transition-colors hover:bg-[color:var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitive.Action.displayName;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => {
  const { toasts } = useToast();

  return (
    <>
      {toasts.map(item => (
        <Toast
          key={item.id}
          variant={item.variant}
          duration={item.duration}
          onOpenChange={open => {
            if (!open) removeToast(item.id);
          }}
        >
          <div className='min-w-0'>
            <ToastTitle>{item.title ?? item.message}</ToastTitle>
            {item.description && <ToastDescription>{item.description}</ToastDescription>}
          </div>
          <ToastClose aria-label='Dismiss notification' />
        </Toast>
      ))}
      <ToastPrimitive.Viewport
        ref={ref}
        className={cn(
          'fixed bottom-0 left-0 z-[var(--z-toast)] flex max-h-screen w-full flex-col-reverse gap-[var(--spacing-sm)] p-[var(--spacing-md)] outline-none sm:bottom-[var(--spacing-lg)] sm:left-auto sm:right-[var(--spacing-lg)] sm:w-[min(420px,calc(100vw-32px))] sm:flex-col sm:p-0',
          className
        )}
        {...props}
      />
    </>
  );
});
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
};
