'use client';

import {
  AlertCircle,
  CheckCircle2,
  Info,
  LoaderCircle,
  TriangleAlert,
  X,
} from 'lucide-react';
import * as React from 'react';
import {
  Toaster as SonnerToaster,
  toast as sonnerToast,
  useSonner,
  type ExternalToast,
  type ToasterProps as SonnerToasterProps,
} from 'sonner';

import { cn } from '@/lib/utils';

export type ToastVariant =
  | 'default'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'pending';

export interface ToastActionOptions {
  label: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ToastCustomColors {
  accent?: string;
  background?: string;
  border?: string;
  iconBackground?: string;
}

export interface ToastPayload extends Omit<
  ExternalToast,
  'description' | 'action' | 'icon'
> {
  variant?: ToastVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  message?: React.ReactNode;
  icon?: React.ReactNode;
  action?: ToastActionOptions;
  colors?: ToastCustomColors;
}

export interface ToastVisualProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  variant?: ToastVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: ToastActionOptions;
  colors?: ToastCustomColors;
  onDismiss?: () => void;
}

export type ToastProps = ToastVisualProps;
export type ToasterProps = SonnerToasterProps;

const toastTone: Record<
  ToastVariant,
  { accent: string; background: string; border: string }
> = {
  default: {
    accent: 'var(--color-primary)',
    background: 'var(--bg-secondary)',
    border: 'var(--border-subtle)',
  },
  info: {
    accent: 'var(--status-info)',
    background: 'var(--status-info-bg)',
    border: 'color-mix(in oklab, var(--status-info) 22%, transparent)',
  },
  success: {
    accent: 'var(--status-success)',
    background: 'var(--status-success-bg)',
    border: 'color-mix(in oklab, var(--status-success) 22%, transparent)',
  },
  warning: {
    accent: 'var(--status-warning)',
    background: 'var(--status-warning-bg)',
    border: 'color-mix(in oklab, var(--status-warning) 24%, transparent)',
  },
  error: {
    accent: 'var(--status-error)',
    background: 'var(--status-error-bg)',
    border: 'color-mix(in oklab, var(--status-error) 22%, transparent)',
  },
  pending: {
    accent: 'var(--color-primary)',
    background: 'var(--primary-50, var(--bg-secondary))',
    border: 'color-mix(in oklab, var(--color-primary) 22%, transparent)',
  },
};

const defaultIcons: Record<ToastVariant, React.ReactNode> = {
  default: <Info className='size-4' aria-hidden='true' />,
  info: <Info className='size-4' aria-hidden='true' />,
  success: <CheckCircle2 className='size-4' aria-hidden='true' />,
  warning: <TriangleAlert className='size-4' aria-hidden='true' />,
  error: <AlertCircle className='size-4' aria-hidden='true' />,
  pending: <LoaderCircle className='size-4 animate-spin' aria-hidden='true' />,
};

function createToastStyles(
  variant: ToastVariant,
  colors?: ToastCustomColors
): React.CSSProperties & Record<`--toast-${string}`, string> {
  const tone = toastTone[variant];
  const background = colors?.background ?? tone.background;
  const accent = colors?.accent ?? tone.accent;

  return {
    '--toast-accent': accent,
    '--toast-bg': background,
    '--toast-border': colors?.border ?? tone.border,
    '--toast-icon-bg':
      colors?.iconBackground ??
      `color-mix(in oklab, ${accent} 10%, var(--bg-surface))`,
  };
}

function getToastTitle(payload: ToastPayload | React.ReactNode) {
  if (isToastPayload(payload)) {
    return payload.title ?? payload.message;
  }

  return payload;
}

function isToastPayload(
  payload: ToastPayload | React.ReactNode
): payload is ToastPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    !React.isValidElement(payload) &&
    ('title' in payload ||
      'message' in payload ||
      'description' in payload ||
      'variant' in payload ||
      'colors' in payload)
  );
}

export const Toast = React.forwardRef<HTMLDivElement, ToastVisualProps>(
  (
    {
      className,
      variant = 'info',
      title,
      description,
      icon,
      action,
      colors,
      onDismiss,
      style,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      aria-atomic='true'
      style={{ ...createToastStyles(variant, colors), ...style }}
      className={cn(
        'relative grid min-h-[88px] w-full grid-cols-[auto_minmax(0,1fr)] gap-x-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[color:var(--toast-border)] px-[var(--spacing-md)] py-[var(--spacing-md)] pr-[calc(var(--spacing-lg)+20px)] text-[color:var(--text-primary)] shadow-[var(--shadow-lg)] [font-family:var(--font-rubik)]',
        'bg-[linear-gradient(90deg,color-mix(in_oklab,var(--toast-bg)_50%,transparent)_0%,var(--bg-surface)_74%)]',
        className
      )}
      {...props}
    >
      <span
        className='mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-[color:var(--toast-icon-bg)] text-[color:var(--toast-accent)]'
        aria-hidden='true'
      >
        {icon ?? defaultIcons[variant]}
      </span>
      <div className='min-w-0 space-y-1'>
        {(title || children) && <ToastTitle>{title ?? children}</ToastTitle>}
        {description && <ToastDescription>{description}</ToastDescription>}
        {action && (
          <ToastAction altText={String(action.label)} onClick={action.onClick}>
            {action.label}
          </ToastAction>
        )}
      </div>
      {onDismiss && (
        <ToastClose aria-label='Dismiss notification' onClick={onDismiss} />
      )}
    </div>
  )
);
Toast.displayName = 'Toast';

export const ToastTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-[length:var(--font-size-body-sm)] font-semibold leading-[var(--line-height-snug)] text-[color:var(--text-title)] [font-family:var(--font-heading)]',
      className
    )}
    {...props}
  />
));
ToastTitle.displayName = 'ToastTitle';

export const ToastDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-[length:var(--font-size-body-sm)] leading-[var(--line-height-body1)] text-[color:var(--text-secondary)]',
      className
    )}
    {...props}
  />
));
ToastDescription.displayName = 'ToastDescription';

export const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    type='button'
    className={cn(
      'absolute right-[var(--spacing-sm)] top-[var(--spacing-sm)] inline-flex size-7 items-center justify-center rounded-[var(--radius-md)] text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-hover)] hover:text-[color:var(--text-title)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]',
      className
    )}
    {...props}
  >
    {children ?? <X className='size-4' aria-hidden='true' />}
  </button>
));
ToastClose.displayName = 'ToastClose';

export const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { altText?: string }
>(({ className, altText: _altText, ...props }, ref) => (
  <button
    ref={ref}
    type='button'
    className={cn(
      'mt-[var(--spacing-xs)] inline-flex min-h-8 w-fit items-center justify-center rounded-[var(--radius-md)] border border-[color:var(--toast-accent)] px-[var(--spacing-sm)] text-[length:var(--font-size-body-sm)] font-semibold text-[color:var(--toast-accent)] transition-colors hover:bg-[color:var(--toast-icon-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--toast-accent)]',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = 'ToastAction';

export const Toaster = React.forwardRef<
  React.ElementRef<typeof SonnerToaster>,
  ToasterProps
>(({ position = 'top-right', toastOptions, ...props }, ref) => (
  <SonnerToaster
    ref={ref}
    position={position}
    closeButton={false}
    gap={12}
    visibleToasts={5}
    offset='var(--spacing-lg)'
    mobileOffset='var(--spacing-md)'
    toastOptions={{
      ...toastOptions,
      unstyled: true,
    }}
    {...props}
  />
));
Toaster.displayName = 'Toaster';

export function toast(payload: ToastPayload | React.ReactNode) {
  const title = getToastTitle(payload);
  const options = isToastPayload(payload) ? payload : {};

  const {
    title: _title,
    message: _message,
    variant = 'info',
    description,
    icon,
    action,
    colors,
    className,
    ...sonnerOptions
  } = options as ToastPayload;

  const id = sonnerToast.custom(
    toastId => (
      <Toast
        variant={variant}
        title={title}
        description={description}
        icon={icon}
        action={action}
        colors={colors}
        className={className}
        onDismiss={() => sonnerToast.dismiss(toastId)}
      />
    ),
    sonnerOptions
  );

  return {
    id,
    dismiss: () => sonnerToast.dismiss(id),
  };
}

export function useToast() {
  const { toasts } = useSonner();

  return {
    toasts,
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof SonnerToaster>,
  ToasterProps
>((props, ref) => <Toaster ref={ref} {...props} />);
ToastViewport.displayName = 'ToastViewport';

export { ToastProvider, ToastViewport, sonnerToast };
