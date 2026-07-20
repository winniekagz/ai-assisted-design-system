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
