'use client';

import {
  ArrowLeft,
  Bot,
  Building2,
  ClipboardCheck,
  Gauge,
  GitBranch,
  History,
  LayoutDashboard,
  ListChecks,
  Monitor,
  Palette,
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
import {
  projectRows,
  sidebarSectionLabels,
  sidebarSections,
  type SidebarSection,
} from '@/features/projects/fixtures/projects';
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

const projectSectionIcons = {
  overview: LayoutDashboard,
  findings: ShieldCheck,
  repositories: GitBranch,
  design_systems: Palette,
  rules: ListChecks,
  audit_history: History,
  settings: Settings,
} satisfies Record<SidebarSection, typeof LayoutDashboard>;

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
  const activeProjectSection = useWorkspaceStore(state => state.activeProjectSection);
  const setActiveProjectSection = useWorkspaceStore(
    state => state.setActiveProjectSection
  );
  const projectDetailBase = orgSlug ? `/org/${orgSlug}/projects/` : '';
  const isProjectDetail = Boolean(orgSlug && pathname.startsWith(projectDetailBase));
  const projectSlug = isProjectDetail ? pathname.slice(projectDetailBase.length).split('/')[0] : '';
  const activeProject = projectRows.find(project => project.slug === projectSlug);
  const activeNavItems = orgSlug
    ? orgNavItems.map(item => ({
        href: `/org/${orgSlug}/${item.path}`,
        label: item.label,
        icon: item.icon,
      }))
    : navItems;

  return (
    <div className='min-h-screen bg-background'>
      <aside className='fixed inset-y-0 left-0 hidden w-56 border-r border-border bg-background lg:block'>
        <div className='flex h-full flex-col gap-5 p-5'>
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

          {isProjectDetail && orgSlug ? (
            <ProjectSidebarNavigation
              orgSlug={orgSlug}
              projectName={activeProject?.name ?? 'Project'}
              activeSection={activeProjectSection}
              onSelect={setActiveProjectSection}
            />
          ) : (
            <>
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
              <PrimaryNavigation activeNavItems={activeNavItems} pathname={pathname} />
            </>
          )}
          <ThemeToggle />
          <div className='mt-auto'>
            <UserButton />
          </div>
        </div>
      </aside>
      <div className='lg:pl-56'>
        <header className='sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden'>
          <div className='flex items-center gap-3'>
            <div className='flex min-w-0 flex-1 items-center gap-2 overflow-x-auto'>
              <Bot className='size-5 shrink-0 text-primary' />
              {isProjectDetail && orgSlug ? (
                <>
                  <Link
                    href={`/org/${orgSlug}/projects`}
                    className='whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground'
                  >
                    All projects
                  </Link>
                  {sidebarSections.map(section => (
                    <button
                      key={section}
                      type='button'
                      onClick={() => setActiveProjectSection(section)}
                      className={cn(
                        'whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground',
                        activeProjectSection === section && 'bg-primary-50 text-primary'
                      )}
                    >
                      {sidebarSectionLabels[section]}
                    </button>
                  ))}
                </>
              ) : (
                activeNavItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className='whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground'
                  >
                    {item.label}
                  </Link>
                ))
              )}
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

function PrimaryNavigation({
  activeNavItems,
  pathname,
}: {
  activeNavItems: { href: string; label: string; icon: typeof Gauge }[];
  pathname: string;
}) {
  return (
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
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-background-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              active && 'bg-primary-50 text-primary'
            )}
          >
            <Icon className='size-4' />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function ProjectSidebarNavigation({
  orgSlug,
  projectName,
  activeSection,
  onSelect,
}: {
  orgSlug: string;
  projectName: string;
  activeSection: SidebarSection;
  // eslint-disable-next-line no-unused-vars
  onSelect(section: SidebarSection): void;
}) {
  return (
    <div className='grid gap-4'>
      <Link
        href={`/org/${orgSlug}/projects`}
        className='flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-background-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      >
        <ArrowLeft className='size-4' aria-hidden='true' />
        All projects
      </Link>
      <div className='px-3'>
        <p className='text-xs font-medium uppercase tracking-normal text-muted-foreground'>
          Project
        </p>
        <p className='mt-1 truncate text-sm font-semibold text-foreground'>
          {projectName}
        </p>
      </div>
      <nav aria-label='Project sections' className='grid gap-1'>
        {sidebarSections.map(section => {
          const Icon = projectSectionIcons[section];
          const active = activeSection === section;
          return (
            <button
              key={section}
              type='button'
              onClick={() => onSelect(section)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-background-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active && 'bg-primary-50 text-primary'
              )}
            >
              <Icon className='size-4' aria-hidden='true' />
              {sidebarSectionLabels[section]}
            </button>
          );
        })}
      </nav>
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
