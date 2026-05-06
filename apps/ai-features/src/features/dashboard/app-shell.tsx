'use client';

import {
  Bot,
  ClipboardCheck,
  Gauge,
  Moon,
  ShieldCheck,
  Sun,
  Workflow,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { cn } from '@winniekagendo/componentiq';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Gauge },
  { href: '/assistant', label: 'AI Assistant', icon: Bot },
  { href: '/audit', label: 'Audit', icon: ClipboardCheck },
  { href: '/governance', label: 'Governance', icon: Workflow },
  { href: '/safety', label: 'Guardrails', icon: ShieldCheck },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className='min-h-screen bg-background'>
      <aside className='fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card lg:block'>
        <div className='flex h-full flex-col gap-6 p-5'>
          <Link
            href='/'
            className='flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            <span className='grid size-10 place-items-center rounded-md bg-primary text-primary-foreground'>
              <Bot className='size-5' />
            </span>
            <span>
              <span className='block text-base font-semibold'>ComponentIQ AI</span>
              <span className='block text-xs text-muted-foreground'>
                AI design-system mentor
              </span>
            </span>
          </Link>
          <nav aria-label='Primary navigation' className='grid gap-1'>
            {navItems.map(item => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    active && 'bg-primary-50 text-primary'
                  )}
                >
                  <Icon className='size-4' />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
        </div>
      </aside>
      <div className='lg:pl-64'>
        <header className='sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden'>
          <div className='flex items-center gap-3'>
            <div className='flex min-w-0 flex-1 items-center gap-2 overflow-x-auto'>
              <Bot className='size-5 shrink-0 text-primary' />
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className='whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground'
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <ThemeToggle compact />
          </div>
        </header>
        <main className='mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8'>
          {children}
        </main>
      </div>
    </div>
  );
}

function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const isDark = theme === 'dark';

  useEffect(() => {
    const stored = window.localStorage.getItem('componentiq-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = stored === 'dark' || (!stored && prefersDark) ? 'dark' : 'light';
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  function toggleTheme() {
    const nextTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
    window.localStorage.setItem('componentiq-theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  }

  return (
    <button
      type='button'
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-border bg-background-secondary text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        compact ? 'size-10 shrink-0' : 'h-10 gap-2 px-3 text-sm font-medium'
      )}
    >
      {isDark ? <Sun className='size-4' /> : <Moon className='size-4' />}
      {!compact && <span>{isDark ? 'Light mode' : 'Dark mode'}</span>}
    </button>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className='mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
      <div className='max-w-3xl'>
        <p className='text-sm font-medium uppercase text-primary'>{eyebrow}</p>
        <h1 className='mt-2 text-3xl font-semibold leading-tight text-foreground md:text-4xl'>
          {title}
        </h1>
        <p className='mt-3 text-sm leading-6 text-muted-foreground md:text-base'>
          {description}
        </p>
      </div>
      {actions && <div className='flex flex-wrap gap-2'>{actions}</div>}
    </header>
  );
}
