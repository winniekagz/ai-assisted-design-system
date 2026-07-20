'use client';

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
import { useProjects } from '@/features/projects/hooks';
import type {
  ProjectRow,
  ProjectStatus,
  ProjectsListState,
} from '@/features/projects/types';

import { CreateProjectDrawer } from '@/features/projects/create-project-drawer';
import { projectStatuses } from '@/features/projects/fixtures/projects';
import { ImportProjectFlow } from '@/features/projects/import-project-flow';
import {
  ConfigurationStatusBadge,
  ProjectConfigurationDrawer,
  type ProjectConfigurationProject,
  getConfigurationStatus,
} from '@/features/projects/project-configuration-drawer';
import { projectRowFromApiProject } from '@/features/projects/project-row-mapper';

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

import {
  EmptyProjectsState,
  ProjectFlowMounts,
  ProjectMenuFilter,
  ProjectsHeader,
  ProjectsPagination,
  ProjectsSkeleton,
  ProjectsTable,
  StatusFilter,
  StatusSummaryPills,
  isProjectsListState,
  uniqueProjectOptions,
} from './components';
