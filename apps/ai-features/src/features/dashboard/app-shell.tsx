'use client';

import {
  Bot,
  Building2,
  ClipboardCheck,
  Gauge,
  Monitor,
  Settings,
  ShieldCheck,
  Sun,
  Users,
  Workflow,
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { cn } from 'componentiq';
import { useWorkspaceStore } from '@/stores/workspace-store';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Gauge },
  { href: '/assistant', label: 'AI Assistant', icon: Bot },
  { href: '/audit', label: 'Audit', icon: ClipboardCheck },
  { href: '/governance', label: 'Governance', icon: Workflow },
  { href: '/safety', label: 'Guardrails', icon: ShieldCheck },
];

const orgNavItems = [
  { path: 'dashboard', label: 'Dashboard', icon: Gauge },
  { path: 'projects', label: 'Projects', icon: Building2 },
  { path: 'components', label: 'Components', icon: Bot },
  { path: 'guardrails', label: 'Guardrails', icon: ShieldCheck },
  { path: 'ai/recommend', label: 'Recommend', icon: Workflow },
  { path: 'ai/audit', label: 'Audit', icon: ClipboardCheck },
  { path: 'settings/members', label: 'Members', icon: Users },
  { path: 'settings/invites', label: 'Invites', icon: Settings },
];

export function AppShell({
  children,
  orgSlug,
  orgName,
  organizations = [],
}: {
  children: ReactNode;
  orgSlug?: string;
  orgName?: string;
  organizations?: { slug: string; name: string }[];
}) {
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const activeNavItems = orgSlug
    ? orgNavItems.map(item => ({
        href: `/org/${orgSlug}/${item.path}`,
        label: item.label,
        icon: item.icon,
      }))
    : navItems;

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
                {orgName ?? 'AI design-system mentor'}
              </span>
            </span>
          </Link>
          {organizations.length > 1 && orgSlug && (
            <label className='grid gap-2 text-xs font-medium text-muted-foreground'>
              Organization
              <select
                value={orgSlug}
                onChange={event => router.push(`/org/${event.target.value}/dashboard`)}
                className='h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              >
                {organizations.map(organization => (
                  <option key={organization.slug} value={organization.slug}>
                    {organization.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <nav aria-label='Primary navigation' className='grid gap-1'>
            {activeNavItems.map(item => {
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
          <div className='mt-auto'>
            <UserButton />
          </div>
        </div>
      </aside>
      <div className='lg:pl-64'>
        <header className='sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden'>
          <div className='flex items-center gap-3'>
            <div className='flex min-w-0 flex-1 items-center gap-2 overflow-x-auto'>
              <Bot className='size-5 shrink-0 text-primary' />
              {activeNavItems.map(item => (
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
  const themeMode = useWorkspaceStore(state => state.themeMode);
  const setThemeMode = useWorkspaceStore(state => state.setThemeMode);
  const isSystem = themeMode === 'system';

  function toggleTheme() {
    setThemeMode(isSystem ? 'light' : 'system');
  }

  return (
    <button
      type='button'
      onClick={toggleTheme}
      aria-label={isSystem ? 'Use light theme' : 'Use system theme'}
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-border bg-background-secondary text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        compact ? 'size-10 shrink-0' : 'h-10 gap-2 px-3 text-sm font-medium'
      )}
    >
      {isSystem ? <Monitor className='size-4' /> : <Sun className='size-4' />}
      {!compact && <span>{isSystem ? 'System theme' : 'Light theme'}</span>}
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
