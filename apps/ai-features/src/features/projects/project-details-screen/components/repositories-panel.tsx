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

export function RepositoriesPanel({ repositories }: { repositories: ProjectRepository[] }) {
  return (
    <div className='grid gap-3'>
      {repositories.map(repository => (
        <Card key={repository.id} className='rounded-none border-y border-border bg-transparent py-0 shadow-none'>
          <CardContent className='flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h2 className='font-mono text-sm font-semibold text-foreground'>{repository.name}</h2>
              <p className='mt-1 text-sm text-muted-foreground'>
                {repository.branch} · {repository.lastCommit}
              </p>
            </div>
            <span className='inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-background-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground'>
              <GitBranch className='size-3.5' aria-hidden='true' />
              {repository.status}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
