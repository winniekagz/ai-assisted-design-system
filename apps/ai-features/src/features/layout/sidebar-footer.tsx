'use client';

import { UserButton, useClerk } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';

import { ThemeToggle } from './theme-toggle';

export function SidebarFooter() {
  const { signOut } = useClerk();

  return (
    <div className='mt-auto grid gap-3 border-t border-border pt-4'>
      <ThemeToggle />
      <div className='flex items-center justify-between gap-3'>
        <UserButton />
        <button
          type='button'
          onClick={() => signOut({ redirectUrl: '/sign-in' })}
          className='inline-flex h-9 items-center gap-2 rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-background-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
          <LogOut className='size-4' aria-hidden='true' />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
