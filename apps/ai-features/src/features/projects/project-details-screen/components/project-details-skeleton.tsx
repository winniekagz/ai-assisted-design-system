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

export function ProjectDetailsSkeleton() {
  return (
    <main className='grid min-w-0 gap-4' aria-label='Loading project'>
      <div className='flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-start lg:justify-between'>
        <div className='grid w-full max-w-2xl gap-3'>
          <Skeleton className='h-9 w-64' />
          <Skeleton className='h-5 w-full max-w-lg' />
          <Skeleton className='h-4 w-80' />
        </div>
        <div className='flex gap-2'>
          <Skeleton className='h-10 w-32' />
          <Skeleton className='h-10 w-28' />
        </div>
      </div>
      <Skeleton className='h-24 w-full' />
      <Skeleton className='h-64 w-full' />
    </main>
  );
}
