'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';
import { cn } from '@/lib/utils';

// ─── Provider ────────────────────────────────────────────────────────────────
// Wrap your app (or just a section) once with TooltipProvider.
// DashboardLayout does this automatically; consumers outside it must add it.

const TooltipProvider = TooltipPrimitive.Provider;

// ─── Root ─────────────────────────────────────────────────────────────────────

const TooltipRoot = TooltipPrimitive.Root;

// ─── Trigger ─────────────────────────────────────────────────────────────────

const TooltipTrigger = TooltipPrimitive.Trigger;

// ─── Content ─────────────────────────────────────────────────────────────────

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  /** Visual style. 'dark' (default) is a dark pill; 'light' uses surface tokens. */
  variant?: 'dark' | 'light';
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, variant = 'dark', sideOffset = 6, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        // base
        'z-50 max-w-xs rounded-[var(--radius-md)] px-3 py-1.5 text-[length:var(--font-size-body-sm)] leading-snug [font-family:var(--font-rubik)]',
        // enter / exit animations
        'animate-in fade-in-0 zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        // side-based slide-in
        'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1',
        'data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1',
        // variants
        variant === 'dark'
          ? 'bg-[color:var(--text-title)] text-[color:var(--text-inverse)] shadow-[var(--shadow-md)]'
          : 'bg-[color:var(--bg-surface)] text-[color:var(--text-paragraph)] border border-[color:var(--border-default)] shadow-[var(--shadow-md)]',
        className
      )}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow
        className={
          variant === 'dark'
            ? 'fill-[color:var(--text-title)]'
            : 'fill-[color:var(--bg-surface)]'
        }
      />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// ─── Convenience wrapper ──────────────────────────────────────────────────────
// <Tooltip content="Save changes"><Button>Save</Button></Tooltip>

export interface TooltipProps {
  /** Text or node shown inside the tooltip. */
  content: React.ReactNode;
  /** The element that triggers the tooltip. */
  children: React.ReactNode;
  /** Which side the tooltip prefers. */
  side?: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>['side'];
  /** Offset from the trigger in pixels. */
  sideOffset?: number;
  /** Delay before the tooltip appears (ms). */
  delayDuration?: number;
  /** Visual style. */
  variant?: TooltipContentProps['variant'];
  /** Override tooltip open state (controlled). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

function Tooltip({
  content,
  children,
  side = 'right',
  sideOffset = 6,
  delayDuration = 300,
  variant = 'dark',
  open,
  onOpenChange,
  className,
}: TooltipProps) {
  return (
    <TooltipRoot
      delayDuration={delayDuration}
      open={open}
      onOpenChange={onOpenChange}
    >
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} sideOffset={sideOffset} variant={variant} className={className}>
        {content}
      </TooltipContent>
    </TooltipRoot>
  );
}

export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
};
