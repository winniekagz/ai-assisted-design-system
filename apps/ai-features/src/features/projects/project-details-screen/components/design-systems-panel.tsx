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

export function DesignSystemsPanel() {
  const stats = projectDetailsFixture.designSystemStats;

  return (
    <Card className='rounded-none border-y border-border bg-transparent py-0 shadow-none'>
      <CardContent className='px-5 py-5'>
        <div className='flex items-start gap-3'>
          <Palette className='mt-1 size-5 text-primary' aria-hidden='true' />
          <div>
            <h2 className='text-lg font-semibold text-foreground'>{stats.name}</h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Design-system adoption and component compatibility for this project.
            </p>
          </div>
        </div>
        <div className='mt-5 grid gap-3 sm:grid-cols-3'>
          <StatCard label='Coverage' value={`${stats.coverage}%`} />
          <StatCard label='Deprecated components' value={`${stats.deprecated}`} />
          <StatCard label='Outdated components' value={`${stats.outdated}`} />
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-md border border-border bg-background-secondary px-4 py-3'>
      <p className='text-xs font-semibold uppercase tracking-normal text-muted-foreground'>{label}</p>
      <p className='mt-2 text-2xl font-semibold text-foreground'>{value}</p>
    </div>
  );
}
