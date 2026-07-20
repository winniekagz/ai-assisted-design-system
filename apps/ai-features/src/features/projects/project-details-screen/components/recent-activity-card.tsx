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

export function RecentActivityCard({ activity }: { activity: ProjectActivity[] }) {
  return (
    <Card className='rounded-none border-y border-border bg-transparent py-0 shadow-none'>
      <CardContent className='px-5 py-5'>
        <h2 className='text-lg font-semibold text-foreground'>Recent activity</h2>
        <div className='mt-4 grid gap-3'>
          {activity.map(item => (
            <div key={item.id} className='flex gap-3 rounded-md border border-border bg-background px-3 py-3'>
              <span className={cn('mt-1 size-2 rounded-full', activityToneClass(item.tone))} aria-hidden='true' />
              <div className='min-w-0'>
                <p className='font-medium text-foreground'>{item.title}</p>
                <p className='mt-1 text-sm text-muted-foreground'>{item.detail}</p>
                <p className='mt-1 text-xs text-muted-foreground'>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function activityToneClass(tone: ProjectActivity['tone']) {
  return {
    error: 'bg-status-error',
    warning: 'bg-status-warning',
    success: 'bg-status-success',
    muted: 'bg-muted-foreground',
  }[tone];
}
