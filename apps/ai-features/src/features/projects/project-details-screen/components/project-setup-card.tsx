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

export function ProjectSetupCard({
  project,
  status,
  onConfigureProject,
}: {
  project: ProjectRow;
  status: ProjectConfigurationStatus;
  onConfigureProject(): void;
}) {
  const meta = setupCardContent(status, project.name);
  const Icon = meta.icon;

  return (
    <Card className={cn('rounded-none border-y border-l-[3px] border-r-0 py-0 shadow-none', meta.className)}>
      <CardContent className='flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex gap-3'>
          <Icon className='mt-0.5 size-5 shrink-0' aria-hidden='true' />
          <div>
            <h2 className='text-lg font-semibold text-foreground'>{meta.title}</h2>
            <p className='mt-1 max-w-3xl text-sm leading-6 text-muted-foreground'>
              {meta.description}
            </p>
          </div>
        </div>
        <Button type='button' onClick={onConfigureProject}>
          {meta.action}
        </Button>
      </CardContent>
    </Card>
  );
}

export function SetupRequiredPanel({ status }: { status: ProjectConfigurationStatus }) {
  const archived = status === 'ARCHIVED';

  return (
    <EmptyState
      icon={archived ? <Archive className='size-5' /> : <Settings className='size-5' />}
      title={archived ? 'Project archived' : 'Project setup required'}
      description={
        archived
          ? 'Archived projects are read-only until they are restored.'
          : 'Connect source and confirm detected setup before audit findings and deployment status are enabled.'
      }
    />
  );
}

export function setupCardContent(status: ProjectConfigurationStatus, projectName: string) {
  const shared = {
    NOT_CONFIGURED: {
      icon: Settings,
      title: 'Configure this project',
      description: `${projectName} needs source access before ComponentIQ can detect components, tokens, and audit settings.`,
      action: 'Configure project',
      className: 'border-l-status-info bg-status-info-bg',
    },
    CONFIGURING: {
      icon: Clock,
      title: 'Project configuration in progress',
      description: 'Resume source analysis and finish setup review before running audits.',
      action: 'Resume setup',
      className: 'border-l-status-info bg-status-info-bg',
    },
    REVIEW_REQUIRED: {
      icon: AlertCircle,
      title: 'Review detected setup',
      description: 'ComponentIQ found a setup, but detected paths need confirmation before audits are enabled.',
      action: 'Review setup',
      className: 'border-l-status-warning bg-status-warning-bg',
    },
    CONFIGURATION_FAILED: {
      icon: ShieldAlert,
      title: 'Setup failed',
      description: 'The previous analysis could not finish. Retry setup or inspect the saved details.',
      action: 'Retry setup',
      className: 'border-l-status-error bg-status-error-bg',
    },
    READY: {
      icon: CheckCircle2,
      title: 'Project configured',
      description: 'Source configuration is complete.',
      action: 'View configuration',
      className: 'border-l-status-success bg-status-success-bg',
    },
    ARCHIVED: {
      icon: Archive,
      title: 'Project archived',
      description: 'Archived projects are read-only.',
      action: 'View project',
      className: 'border-l-border bg-background-secondary',
    },
  } satisfies Record<
    ProjectConfigurationStatus,
    {
      icon: LucideIcon;
      title: string;
      description: string;
      action: string;
      className: string;
    }
  >;

  return shared[status];
}

export function setupActionLabelForStatus(status: ProjectConfigurationStatus) {
  if (status === 'CONFIGURING') return 'Resume setup';
  if (status === 'REVIEW_REQUIRED') return 'Review setup';
  if (status === 'CONFIGURATION_FAILED') return 'Retry setup';
  return 'Configure project';
}
