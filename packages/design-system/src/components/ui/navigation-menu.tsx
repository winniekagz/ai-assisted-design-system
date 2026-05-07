'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

const NavigationMenu = React.forwardRef<HTMLElement, NavigationMenuProps>(
  ({ className, children, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {children}
    </nav>
  )
);
NavigationMenu.displayName = 'NavigationMenu';

interface NavigationMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

const NavigationMenuItem = React.forwardRef<
  HTMLLIElement,
  NavigationMenuItemProps
>(({ className, children, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props}>
    {children}
  </li>
));
NavigationMenuItem.displayName = 'NavigationMenuItem';

interface NavigationMenuLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
}

const NavigationMenuLink = React.forwardRef<
  HTMLAnchorElement,
  NavigationMenuLinkProps
>(({ className, children, href, active, ...props }, ref) => (
  <a
    ref={ref}
    href={href}
    className={cn(
      'text-sm font-medium transition-colors hover:text-[color:var(--color-primary)]',
      active
        ? 'text-[color:var(--text-title)]'
        : 'text-[color:var(--text-muted)]',
      className
    )}
    {...props}
  >
    {children}
  </a>
));
NavigationMenuLink.displayName = 'NavigationMenuLink';

export { NavigationMenu, NavigationMenuItem, NavigationMenuLink };
