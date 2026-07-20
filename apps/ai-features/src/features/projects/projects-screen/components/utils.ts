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

export function isProjectsListState(value: string | null): value is ProjectsListState {
  return value === 'populated' || value === 'empty' || value === 'loading';
}

export function uniqueProjectOptions(values: string[]) {
  return Array.from(new Set(values)).sort((first, second) =>
    first.localeCompare(second)
  );
}
