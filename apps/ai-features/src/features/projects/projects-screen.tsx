'use client';

import type { ProjectListItem } from '@winniekagendo/componentiq-shared-types';
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  Input,
  Skeleton,
  cn,
} from 'componentiq';
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDashed,
  Download,
  FolderKanban,
  Import,
  Plus,
  Search,
  ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';

import { OrgFrame } from '@/features/org/org-frame';
import { useProjectConfiguration } from '@/hooks/queries/use-project-configuration';
import { useProjects } from '@/hooks/queries/use-projects';

import { CreateProjectDrawer } from './create-project-drawer';
import {
  projectStatuses,
  type ProjectRow,
  type ProjectStatus,
  type ProjectsListState,
} from './fixtures/projects';
import { ImportProjectFlow } from './import-project-flow';
import {
  ConfigurationStatusBadge,
  ProjectConfigurationDrawer,
  type ProjectConfigurationProject,
  getConfigurationStatus,
} from './project-configuration-drawer';

const statusLabels: Record<ProjectStatus, string> = {
  healthy: 'Healthy',
  needs_attention: 'Needs Attention',
  blocked: 'Blocked',
  not_configured: 'Not Configured',
  archived: 'Archived',
};

const auditStateLabels: Record<ProjectRow['latestAudit']['state'], string> = {
  passed: 'Passed',
  failed: 'Failed',
  warning: 'Needs review',
  not_run: 'Not run',
  running: 'Running',
};

const designSystemStateLabels: Record<ProjectRow['designSystem']['state'], string> = {
  current: 'Current',
  outdated: 'Outdated',
  base: 'Base Design System',
  none: 'None',
};

type ProjectFilterValue = string;

export function ProjectsScreen({ orgSlug }: { orgSlug: string }) {
  return (
    <OrgFrame orgSlug={orgSlug}>
      {({ organization, membership }) => (
        <ProjectsCatalogue
          orgSlug={organization.slug}
          organizationName={organization.name}
          role={membership.role}
        />
      )}
    </OrgFrame>
  );
}

function ProjectsCatalogue({
  orgSlug,
  organizationName,
  role,
}: {
  orgSlug: string;
  organizationName: string;
  role: string;
}) {
  const searchParams = useSearchParams();
  const requestedState = searchParams?.get('projects_state') ?? null;
  const listState = isProjectsListState(requestedState) ? requestedState : 'populated';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [teamFilter, setTeamFilter] = useState<ProjectFilterValue>('all');
  const [designSystemFilter, setDesignSystemFilter] = useState<ProjectFilterValue>('all');
  const [auditStateFilter, setAuditStateFilter] = useState<ProjectFilterValue>('all');
  const [frameworkFilter, setFrameworkFilter] = useState<ProjectFilterValue>('all');
  const [page, setPage] = useState(1);
  const projectsQuery = useProjects(orgSlug);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [importFlowOpen, setImportFlowOpen] = useState(false);
  const [configurationProject, setConfigurationProject] =
    useState<ProjectConfigurationProject | null>(null);
  const [configurationDrawerOpen, setConfigurationDrawerOpen] = useState(false);
  const pageSize = 6;
  const projects = useMemo(() => {
    return projectsQuery.data?.map(projectRowFromApiProject) ?? [];
  }, [projectsQuery.data]);
  const teamOptions = useMemo(
    () => uniqueProjectOptions(projects.map(project => project.team)),
    [projects]
  );
  const designSystemOptions = useMemo(
    () =>
      uniqueProjectOptions(
        projects.map(project => designSystemStateLabels[project.designSystem.state])
      ),
    [projects]
  );
  const auditStateOptions = useMemo(
    () =>
      uniqueProjectOptions(
        projects.map(project => auditStateLabels[project.latestAudit.state])
      ),
    [projects]
  );
  const frameworkOptions = useMemo(
    () => uniqueProjectOptions(projects.map(project => project.framework)),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.filter(project => {
      const statusMatches = statusFilter === 'all' || project.status === statusFilter;
      const teamMatches = teamFilter === 'all' || project.team === teamFilter;
      const designSystemMatches =
        designSystemFilter === 'all' ||
        designSystemStateLabels[project.designSystem.state] === designSystemFilter;
      const auditStateMatches =
        auditStateFilter === 'all' ||
        auditStateLabels[project.latestAudit.state] === auditStateFilter;
      const frameworkMatches =
        frameworkFilter === 'all' || project.framework === frameworkFilter;
      const queryMatches =
        !query ||
        [
          project.name,
          project.repository,
          project.team,
          project.designSystem.label,
          project.framework,
          ...project.tags,
        ]
          .join(' ')
          .toLowerCase()
          .includes(query);

      return (
        statusMatches &&
        teamMatches &&
        designSystemMatches &&
        auditStateMatches &&
        frameworkMatches &&
        queryMatches
      );
    });
  }, [
    auditStateFilter,
    designSystemFilter,
    frameworkFilter,
    projects,
    search,
    statusFilter,
    teamFilter,
  ]);

  const pageCount = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function applyStatus(status: ProjectStatus | 'all') {
    setStatusFilter(status);
    setPage(1);
  }

  function applyFilter(
    setFilter: Dispatch<SetStateAction<ProjectFilterValue>>,
    value: ProjectFilterValue
  ) {
    setFilter(value);
    setPage(1);
  }

  function clearFilters() {
    setSearch('');
    setStatusFilter('all');
    setTeamFilter('all');
    setDesignSystemFilter('all');
    setAuditStateFilter('all');
    setFrameworkFilter('all');
    setPage(1);
  }

  function refetchPersistedProjects() {
    clearFilters();
    void projectsQuery.refetch();
  }

  function openConfiguration(project: ProjectConfigurationProject) {
    setConfigurationProject(project);
    setConfigurationDrawerOpen(true);
  }

  if (listState === 'loading' || projectsQuery.isLoading) {
    return <ProjectsSkeleton />;
  }

  if (projectsQuery.isError) {
    return (
      <div className='grid gap-5'>
        <ProjectsHeader
          organizationName={organizationName}
          role={role}
          onCreateProject={() => setCreateDrawerOpen(true)}
          onImportProject={() => setImportFlowOpen(true)}
        />
        <EmptyState
          icon={<AlertCircle className='size-5' />}
          title='Projects could not load'
          description='Refresh the page or try again after the API is available.'
        />
      </div>
    );
  }

  if (listState === 'empty' || projects.length === 0) {
    return (
      <div className='grid gap-5'>
        <ProjectsHeader
          organizationName={organizationName}
          role={role}
          onCreateProject={() => setCreateDrawerOpen(true)}
          onImportProject={() => setImportFlowOpen(true)}
        />
        <EmptyProjectsState
          onCreateProject={() => setCreateDrawerOpen(true)}
          onImportProject={() => setImportFlowOpen(true)}
        />
        <ProjectFlowMounts
          orgSlug={orgSlug}
          createDrawerOpen={createDrawerOpen}
          importFlowOpen={importFlowOpen}
          teamOptions={teamOptions}
          existingProjects={projects}
          onCreateDrawerOpenChange={setCreateDrawerOpen}
          onImportFlowOpenChange={setImportFlowOpen}
          configurationProject={configurationProject}
          configurationDrawerOpen={configurationDrawerOpen}
          onConfigurationDrawerOpenChange={setConfigurationDrawerOpen}
          onConfigureProject={openConfiguration}
          onCreated={clearFilters}
          onImported={refetchPersistedProjects}
        />
      </div>
    );
  }

  return (
    <div className='grid gap-5'>
      <ProjectsHeader
        organizationName={organizationName}
        role={role}
        onCreateProject={() => setCreateDrawerOpen(true)}
        onImportProject={() => setImportFlowOpen(true)}
      />
      <StatusSummaryPills
        activeStatus={statusFilter}
        projects={projects}
        onSelect={applyStatus}
      />
      <section className='border-y border-border bg-transparent'>
        <div className='px-0'>
          <div className='flex flex-col gap-3 border-b border-border px-4 py-4 lg:flex-row lg:items-center lg:justify-between'>
            <div className='min-w-0 flex-1'>
              <Input
                aria-label='Search projects'
                placeholder='Search by project, repository, team, design system, tag, or framework'
                value={search}
                onChange={event => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                startIcon={<Search className='size-4 text-muted-foreground' />}
              />
            </div>
            <div className='flex flex-wrap gap-2' aria-label='Project filters'>
              <StatusFilter status={statusFilter} onSelect={applyStatus} />
              <ProjectMenuFilter
                label='Team'
                value={teamFilter}
                options={teamOptions}
                onSelect={value => applyFilter(setTeamFilter, value)}
              />
              <ProjectMenuFilter
                label='Design system'
                value={designSystemFilter}
                options={designSystemOptions}
                onSelect={value => applyFilter(setDesignSystemFilter, value)}
              />
              <ProjectMenuFilter
                label='Audit state'
                value={auditStateFilter}
                options={auditStateOptions}
                onSelect={value => applyFilter(setAuditStateFilter, value)}
              />
              <ProjectMenuFilter
                label='Framework'
                value={frameworkFilter}
                options={frameworkOptions}
                onSelect={value => applyFilter(setFrameworkFilter, value)}
              />
            </div>
          </div>

          {visibleProjects.length > 0 ? (
            <>
              <ProjectsTable
                orgSlug={orgSlug}
                projects={visibleProjects}
                onConfigureProject={openConfiguration}
              />
              <ProjectsPagination
                page={currentPage}
                pageCount={pageCount}
                total={filteredProjects.length}
                pageSize={pageSize}
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className='p-6'>
              <EmptyState
                icon={<FolderKanban className='size-5' />}
                title='No matching projects'
                description='Adjust search or filters to find projects connected to this organization.'
              >
                <Button type='button' variant='outlined' size='sm' onClick={clearFilters}>
                  Clear filters
                </Button>
              </EmptyState>
            </div>
          )}
        </div>
      </section>
      <ProjectFlowMounts
        orgSlug={orgSlug}
        createDrawerOpen={createDrawerOpen}
        importFlowOpen={importFlowOpen}
        teamOptions={teamOptions}
        existingProjects={projects}
        onCreateDrawerOpenChange={setCreateDrawerOpen}
        onImportFlowOpenChange={setImportFlowOpen}
        configurationProject={configurationProject}
        configurationDrawerOpen={configurationDrawerOpen}
        onConfigurationDrawerOpenChange={setConfigurationDrawerOpen}
        onConfigureProject={openConfiguration}
        onCreated={clearFilters}
        onImported={refetchPersistedProjects}
      />
    </div>
  );
}

function ProjectFlowMounts({
  orgSlug,
  createDrawerOpen,
  importFlowOpen,
  teamOptions,
  existingProjects,
  configurationProject,
  configurationDrawerOpen,
  onCreateDrawerOpenChange,
  onImportFlowOpenChange,
  onConfigurationDrawerOpenChange,
  onConfigureProject,
  onCreated,
  onImported,
}: {
  orgSlug: string;
  createDrawerOpen: boolean;
  importFlowOpen: boolean;
  teamOptions: string[];
  existingProjects: ProjectRow[];
  configurationProject: ProjectConfigurationProject | null;
  configurationDrawerOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onCreateDrawerOpenChange(open: boolean): void;
  // eslint-disable-next-line no-unused-vars
  onImportFlowOpenChange(open: boolean): void;
  // eslint-disable-next-line no-unused-vars
  onConfigurationDrawerOpenChange(open: boolean): void;
  // eslint-disable-next-line no-unused-vars
  onConfigureProject(project: ProjectConfigurationProject): void;
  onCreated(): void;
  onImported(): void;
}) {
  return (
    <>
      <CreateProjectDrawer
        open={createDrawerOpen}
        orgSlug={orgSlug}
        existingProjectNames={existingProjects.map(project => project.name)}
        teamOptions={teamOptions.length > 0 ? teamOptions : ['Unassigned']}
        onOpenChange={onCreateDrawerOpenChange}
        onCreated={onCreated}
        onConfigureProject={project => onConfigureProject(projectRowFromApiProject(project))}
      />
      <ImportProjectFlow
        open={importFlowOpen}
        organizationId={orgSlug}
        onOpenChange={onImportFlowOpenChange}
        onImported={onImported}
      />
      <ProjectConfigurationDrawer
        open={configurationDrawerOpen}
        orgSlug={orgSlug}
        project={configurationProject}
        onOpenChange={onConfigurationDrawerOpenChange}
      />
    </>
  );
}

function ProjectsHeader({
  organizationName,
  role,
  onCreateProject,
  onImportProject,
}: {
  organizationName: string;
  role: string;
  onCreateProject(): void;
  onImportProject(): void;
}) {
  return (
    <header className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
      <div className='max-w-3xl'>
        <p className='text-sm font-medium uppercase tracking-normal text-primary'>
          {organizationName} · {role.toLowerCase()}
        </p>
        <h1 className='mt-2 text-3xl font-semibold leading-tight text-foreground md:text-4xl'>
          Projects
        </h1>
        <p className='mt-3 text-sm leading-6 text-muted-foreground md:text-base'>
          Manage engineering projects connected to ComponentIQ, review release readiness, and open the
          surfaces that need attention.
        </p>
      </div>
      <div className='flex flex-wrap gap-2'>
        <Button type='button' onClick={onCreateProject} startIcon={<Plus className='size-4' />}>
          New project
        </Button>
        <Button type='button' variant='outlined' onClick={onImportProject} startIcon={<Import className='size-4' />}>
          Import
        </Button>
      </div>
    </header>
  );
}

function StatusSummaryPills({
  activeStatus,
  projects,
  onSelect,
}: {
  activeStatus: ProjectStatus | 'all';
  projects: ProjectRow[];
  // eslint-disable-next-line no-unused-vars
  onSelect(status: ProjectStatus | 'all'): void;
}) {
  const counts = {
    all: projects.length,
    blocked: projects.filter(project => project.status === 'blocked').length,
    needs_attention: projects.filter(project => project.status === 'needs_attention').length,
    healthy: projects.filter(project => project.status === 'healthy').length,
  };

  const pills = [
    { status: 'all' as const, label: `${counts.all} Projects`, icon: FolderKanban },
    { status: 'blocked' as const, label: `${counts.blocked} Blocked`, icon: ShieldAlert },
    { status: 'needs_attention' as const, label: `${counts.needs_attention} Need Attention`, icon: AlertCircle },
    { status: 'healthy' as const, label: `${counts.healthy} Healthy`, icon: CheckCircle2 },
  ];

  return (
    <div className='flex flex-wrap gap-2' aria-label='Project status summary filters'>
      {pills.map(pill => {
        const Icon = pill.icon;
        const active = activeStatus === pill.status;
        return (
          <button
            key={pill.status}
            type='button'
            onClick={() => onSelect(pill.status)}
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              active
                ? 'border-primary bg-primary-50 text-primary'
                : 'border-border bg-card text-muted-foreground hover:bg-background-secondary'
            )}
          >
            <Icon className='size-4' aria-hidden='true' />
            {pill.label}
          </button>
        );
      })}
    </div>
  );
}

function StatusFilter({
  status,
  onSelect,
}: {
  status: ProjectStatus | 'all';
  // eslint-disable-next-line no-unused-vars
  onSelect(status: ProjectStatus | 'all'): void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type='button' variant='outlined' size='sm' endIcon={<ChevronDown className='size-4' />}>
          Status: {status === 'all' ? 'All' : statusLabels[status]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={status === 'all'} onCheckedChange={() => onSelect('all')}>
          All statuses
        </DropdownMenuCheckboxItem>
        {projectStatuses.map(projectStatus => (
          <DropdownMenuCheckboxItem
            key={projectStatus}
            checked={status === projectStatus}
            onCheckedChange={() => onSelect(projectStatus)}
          >
            {statusLabels[projectStatus]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProjectMenuFilter({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: ProjectFilterValue;
  options: ProjectFilterValue[];
  // eslint-disable-next-line no-unused-vars
  onSelect(value: ProjectFilterValue): void;
}) {
  const displayValue = value === 'all' ? 'All' : value;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type='button' variant='outlined' size='sm' endIcon={<ChevronDown className='size-4' />}>
          {label}: {displayValue}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-64'>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={value === 'all'} onCheckedChange={() => onSelect('all')}>
          All
        </DropdownMenuCheckboxItem>
        {options.map(option => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={value === option}
            onCheckedChange={() => onSelect(option)}
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProjectsTable({
  orgSlug,
  projects,
  onConfigureProject,
}: {
  orgSlug: string;
  projects: ProjectRow[];
  // eslint-disable-next-line no-unused-vars
  onConfigureProject(project: ProjectConfigurationProject): void;
}) {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-[980px] w-full border-collapse text-left text-sm'>
        <thead className='bg-background-secondary text-xs uppercase tracking-normal text-muted-foreground'>
          <tr>
            <th scope='col' className='px-4 py-3 font-semibold'>Project</th>
            <th scope='col' className='px-4 py-3 font-semibold'>Status</th>
            <th scope='col' className='px-4 py-3 font-semibold'>Blocking</th>
            <th scope='col' className='px-4 py-3 font-semibold'>Latest audit</th>
            <th scope='col' className='px-4 py-3 font-semibold'>Design system</th>
            <th scope='col' className='px-4 py-3 font-semibold'>Activity</th>
            <th scope='col' className='px-4 py-3 text-right font-semibold'>Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-border'>
          {projects.map(project => (
            <ProjectRowItem
              key={project.id}
              orgSlug={orgSlug}
              project={project}
              onConfigureProject={onConfigureProject}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProjectRowItem({
  orgSlug,
  project,
  onConfigureProject,
}: {
  orgSlug: string;
  project: ProjectRow;
  // eslint-disable-next-line no-unused-vars
  onConfigureProject(project: ProjectConfigurationProject): void;
}) {
  const href = `/org/${orgSlug}/projects/${project.slug}`;
  const configurationQuery = useProjectConfiguration(orgSlug, project.id);
  const configurationStatus =
    configurationQuery.data?.projectStatus ?? getConfigurationStatus(project);
  const configurationComplete = configurationStatus === 'READY';
  const archived = configurationStatus === 'ARCHIVED';
  const setupActionLabel = setupActionLabelForStatus(configurationStatus);

  return (
    <tr className='group hover:bg-background-secondary/70'>
      <td className='px-4 py-3'>
        <Link
          href={href}
          className='block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
          <span className='block font-semibold text-foreground'>{project.name}</span>
          <span className='mt-1 block font-mono text-xs text-muted-foreground'>{project.repository}</span>
        </Link>
      </td>
      <td className='px-4 py-3'><ConfigurationStatusBadge status={configurationStatus} /></td>
      <td className='px-4 py-3'>
        <span className={cn('font-semibold', project.blockingCount > 0 ? 'text-status-error' : 'text-muted-foreground')}>
          {project.blockingCount}
        </span>
      </td>
      <td className='px-4 py-3'>
        <span className='block font-medium text-foreground'>{project.latestAudit.label}</span>
        <span className='text-xs text-muted-foreground'>{project.latestAudit.relativeTime}</span>
      </td>
      <td className='px-4 py-3'>
        <DesignSystemStateLabel project={project} />
      </td>
      <td className='max-w-[220px] px-4 py-3 text-muted-foreground'>
        <span className='line-clamp-1'>{project.latestActivity}</span>
      </td>
      <td className='px-4 py-3'>
        <div className='flex items-center justify-end gap-2'>
          {configurationComplete && (
            <Button
              type='button'
              variant='outlined'
              size='sm'
              disabled
              title='Run audit needs the audit workflow API before it can be enabled.'
              className='opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100'
            >
              Run audit
            </Button>
          )}
          {!configurationComplete && !archived && (
            <Button
              type='button'
              size='sm'
              className='bg-status-success text-white hover:bg-status-success/90 focus-visible:ring-status-success/30'
              onClick={() => onConfigureProject(project)}
            >
              {configurationStatus === 'CONFIGURING' && configurationQuery.data?.progress === null
                ? 'Resume setup'
                : setupActionLabel}
            </Button>
          )}
          <Button
            asChild
            size='sm'
            variant={configurationComplete || archived ? undefined : 'outlined'}
            endIcon={<ChevronRight className='size-4' />}
          >
            <Link href={href}>Open</Link>
          </Button>
        </div>
      </td>
    </tr>
  );
}

function setupActionLabelForStatus(status: ReturnType<typeof getConfigurationStatus>) {
  if (status === 'CONFIGURING') return 'Resume setup';
  if (status === 'REVIEW_REQUIRED') return 'Review setup';
  if (status === 'CONFIGURATION_FAILED') return 'Retry setup';
  return 'Configure';
}

export function ProjectStatusPill({ status }: { status: ProjectStatus }) {
  const meta = {
    healthy: {
      icon: CheckCircle2,
      className: 'border-status-success bg-status-success-bg text-status-success',
    },
    needs_attention: {
      icon: AlertCircle,
      className: 'border-status-warning bg-status-warning-bg text-status-warning',
    },
    blocked: {
      icon: ShieldAlert,
      className: 'border-status-error bg-status-error-bg text-status-error',
    },
    not_configured: { icon: CircleDashed, className: 'border-border bg-background-secondary text-muted-foreground' },
    archived: { icon: Archive, className: 'border-border bg-background-secondary text-muted-foreground' },
  } satisfies Record<ProjectStatus, { icon: typeof CheckCircle2; className: string }>;
  const Icon = meta[status].icon;

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold', meta[status].className)}>
      <Icon className='size-3.5' aria-hidden='true' />
      {statusLabels[status]}
    </span>
  );
}

function DesignSystemStateLabel({ project }: { project: ProjectRow }) {
  const state = project.designSystem.state;
  const icon =
    state === 'current' ? '✓' : state === 'outdated' ? '⚠' : state === 'base' ? 'Base' : 'None';
  const label =
    state === 'current'
      ? 'Current'
      : state === 'outdated'
        ? 'Outdated'
        : state === 'base'
          ? 'Base Design System'
          : 'None';

  return (
    <span title={project.designSystem.version ?? label} className='block'>
      <span className='font-medium text-foreground'>{state === 'base' || state === 'none' ? label : `${icon} ${label}`}</span>
      {project.designSystem.version && (
        <span className='mt-0.5 hidden text-xs text-muted-foreground group-hover:block'>
          {project.designSystem.version}
        </span>
      )}
    </span>
  );
}

function ProjectsPagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  // eslint-disable-next-line no-unused-vars
  onPageChange(page: number): void;
}) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  return (
    <div className='flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between'>
      <p className='text-sm text-muted-foreground'>
        Showing {start}-{end} of {total} projects
      </p>
      <div className='flex gap-2'>
        <Button type='button' variant='outlined' size='sm' disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <Button type='button' variant='outlined' size='sm' disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

function EmptyProjectsState({
  onCreateProject,
  onImportProject,
}: {
  onCreateProject(): void;
  onImportProject(): void;
}) {
  return (
    <EmptyState
      icon={<FolderKanban className='size-6' />}
      title='No projects yet'
      description='Create or import a project to connect repositories, design-system rules, and audit workflows.'
    >
      <div className='flex flex-wrap justify-center gap-2'>
        <Button type='button' onClick={onCreateProject} startIcon={<Plus className='size-4' />}>
          Create project
        </Button>
        <Button type='button' variant='outlined' onClick={onImportProject} startIcon={<Download className='size-4' />}>
          Import existing repository
        </Button>
      </div>
    </EmptyState>
  );
}

function ProjectsSkeleton() {
  return (
    <div className='grid gap-5' aria-label='Loading projects'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div className='grid w-full max-w-3xl gap-3'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-10 w-72' />
          <Skeleton className='h-5 w-full max-w-xl' />
        </div>
        <div className='flex gap-2'>
          <Skeleton className='h-10 w-28' />
          <Skeleton className='h-10 w-24' />
        </div>
      </div>
      <div className='flex flex-wrap gap-2'>
        {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className='h-9 w-32 rounded-full' />)}
      </div>
      <section className='border-y border-border bg-transparent'>
        <div className='grid gap-4 px-4 py-4'>
          <Skeleton className='h-10 w-full' />
          {Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className='h-14 w-full' />)}
        </div>
      </section>
    </div>
  );
}

function isProjectsListState(value: string | null): value is ProjectsListState {
  return value === 'populated' || value === 'empty' || value === 'loading';
}

function uniqueProjectOptions(values: string[]) {
  return Array.from(new Set(values)).sort((first, second) =>
    first.localeCompare(second)
  );
}

function projectRowFromApiProject(apiProject: ProjectListItem): ProjectRow {
  return {
    id: apiProject.id,
    name: apiProject.name,
    slug: apiProject.slug,
    repository: apiProject.repositoryUrl ?? 'Repository not connected',
    team: 'Unassigned',
    framework: apiProject.framework,
    tags: ['saved'],
    description: apiProject.description || 'Project reserved in ComponentIQ.',
    status: 'not_configured',
    blockingCount: 0,
    latestAudit: { state: 'not_run', label: 'Not run', relativeTime: 'Never' },
    designSystem: { state: 'none', label: 'None' },
    latestActivity: `Updated ${formatProjectDate(apiProject.updatedAt)}`,
    repoCount: apiProject.repositoryUrl ? 1 : 0,
    lastAudited: 'Never',
  };
}

function formatProjectDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'recently';
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
