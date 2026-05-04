'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col h-full bg-background border-r', className)}
      {...props}
    >
      {children}
    </div>
  )
);
Sidebar.displayName = 'Sidebar';

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex h-16 items-center px-4 border-b', className)}
      {...props}
    >
      {children}
    </div>
  )
);
SidebarHeader.displayName = 'SidebarHeader';

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 overflow-auto', className)} {...props}>
      {children}
    </div>
  )
);
SidebarContent.displayName = 'SidebarContent';

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-4 p-4 border-t', className)}
      {...props}
    >
      {children}
    </div>
  )
);
SidebarFooter.displayName = 'SidebarFooter';

export { Sidebar, SidebarContent, SidebarFooter, SidebarHeader };
