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

export function ProjectsTable({
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

export function ProjectsTableSkeleton({ rowCount = 6 }: { rowCount?: number }) {
  const rows = Array.from({ length: rowCount });
  const headers = [
    'Project',
    'Status',
    'Blocking',
    'Latest audit',
    'Design system',
    'Activity',
    'Actions',
  ];

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-[980px] w-full border-collapse text-left text-sm'>
        <thead className='bg-background-secondary text-xs uppercase tracking-normal text-muted-foreground'>
          <tr>
            {headers.map((header, index) => (
              <th
                key={header}
                scope='col'
                className={cn(
                  'px-4 py-3 font-semibold',
                  index === headers.length - 1 && 'text-right'
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-border'>
          {rows.map((_, index) => (
            <tr key={index}>
              <td className='px-4 py-3'>
                <Skeleton className='h-4 w-36' />
                <Skeleton className='mt-2 h-3 w-48' />
              </td>
              <td className='px-4 py-3'>
                <Skeleton className='h-7 w-28 rounded-md' />
              </td>
              <td className='px-4 py-3'>
                <Skeleton className='h-4 w-6' />
              </td>
              <td className='px-4 py-3'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='mt-2 h-3 w-20' />
              </td>
              <td className='px-4 py-3'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='mt-2 h-3 w-16' />
              </td>
              <td className='max-w-[220px] px-4 py-3'>
                <Skeleton className='h-4 w-full' />
              </td>
              <td className='px-4 py-3'>
                <div className='flex items-center justify-end gap-2'>
                  <Skeleton className='h-8 w-20 rounded-md' />
                  <Skeleton className='h-8 w-16 rounded-md' />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProjectRowItem({
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
  const configurationStatus = getConfigurationStatus(project);
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
              {setupActionLabel}
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

export function setupActionLabelForStatus(status: ReturnType<typeof getConfigurationStatus>) {
  if (status === 'CONFIGURING') return 'Resume setup';
  if (status === 'REVIEW_REQUIRED') return 'Review setup';
  if (status === 'CONFIGURATION_FAILED') return 'Retry setup';
  return 'Configure';
}

export function DesignSystemStateLabel({ project }: { project: ProjectRow }) {
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
