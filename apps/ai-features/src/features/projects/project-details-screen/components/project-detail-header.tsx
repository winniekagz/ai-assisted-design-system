'use client';

import {
  Button,
  Card,
  CardContent,
  EmptyState,
  Skeleton,
  cn,
} from 'componentiq';
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  Clock,
  GitBranch,
  Palette,
  Package,
  Settings,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import type { AuditFindingResponse, AuditSessionSummary } from '@winniekagendo/componentiq-shared-types';

import { OrgFrame } from '@/features/org/org-frame';
import {
  useProjectAudits,
  useProjectConfiguration,
  useProjects,
} from '@/features/projects/hooks';
import type {
  ProjectActivity,
  ProjectRepository,
  ProjectRow,
  SidebarSection,
} from '@/features/projects/types';
import { formatDate } from '@/shared/format-date';
import { useWorkspaceStore } from '@/stores/workspace-store';

import {
  projectDetailsFixture,
  sidebarSectionLabels,
} from '@/features/projects/fixtures/projects';
import {
  ConfigurationStatusBadge,
  ProjectConfigurationDrawer,
  type ProjectConfigurationStatus,
  getConfigurationStatus,
} from '@/features/projects/project-configuration-drawer';
import { projectRowFromApiProject } from '@/features/projects/project-row-mapper';
import { ProjectSettingsDrawer } from '@/features/projects/project-settings-drawer';
import { RunAuditDrawer } from '@/features/projects/run-audit-drawer';

import { setupActionLabelForStatus } from './project-setup-card';

export function ProjectDetailHeader({
  project,
  role,
  configurationStatus,
  configurationComplete,
  lastAudited,
  onConfigureProject,
  onOpenSettings,
  onRunAudit,
}: {
  project: ProjectRow;
  role: string;
  configurationStatus: ProjectConfigurationStatus;
  configurationComplete: boolean;
  lastAudited: string;
  onConfigureProject(): void;
  onOpenSettings(): void;
  onRunAudit(): void;
}) {
  return (
    <header className='border-b border-border bg-transparent pb-5'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <h1 className='text-3xl font-semibold leading-tight text-foreground'>
              {project.name}
            </h1>
            <ConfigurationStatusBadge status={configurationStatus} />
          </div>
          <p className='mt-3 max-w-3xl text-sm leading-6 text-muted-foreground'>
            {project.description}
          </p>
          <dl className='mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground'>
            <MetaItem label='Team' value={role === 'ENGINEER' ? 'Your project access' : project.team} />
            <MetaItem label='Repositories' value={`${project.repoCount}`} />
            <MetaItem label='Design system' value={project.designSystem.label} />
            <MetaItem label='Last audited' value={lastAudited} />
          </dl>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button type='button' variant='outlined' onClick={onOpenSettings} startIcon={<Settings className='size-4' />}>
            Project settings
          </Button>
          {configurationComplete ? (
            <Button type='button' onClick={onRunAudit} startIcon={<Clock className='size-4' />}>
              Run audit
            </Button>
          ) : configurationStatus !== 'ARCHIVED' ? (
            <Button type='button' onClick={onConfigureProject} startIcon={<Settings className='size-4' />}>
              {setupActionLabelForStatus(configurationStatus)}
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex gap-1.5'>
      <dt className='font-medium text-foreground'>{label}:</dt>
      <dd>{value}</dd>
    </div>
  );
}
