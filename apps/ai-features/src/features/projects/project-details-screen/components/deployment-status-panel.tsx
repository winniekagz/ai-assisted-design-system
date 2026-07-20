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

import { blockingFindingCount } from './latest-audit-summary';

export function DeploymentStatusPanel({
  audits,
  onRunAudit,
}: {
  audits: AuditSessionSummary[];
  onRunAudit(): void;
}) {
  const latest = audits[0] ?? null;
  const notRun = !latest;
  const blockingCount = blockingFindingCount(latest);
  const blocked = blockingCount > 0;
  const tone = notRun ? 'warning' : blocked ? 'error' : 'success';
  const classes = {
    error: 'border-l-status-error bg-status-error-bg',
    warning: 'border-l-status-warning bg-status-warning-bg',
    success: 'border-l-status-success bg-status-success-bg',
  }[tone];
  const Icon = notRun ? AlertCircle : blocked ? ShieldAlert : CheckCircle2;

  return (
    <Card className={cn('rounded-none border-y border-l-[3px] border-r-0 py-0 shadow-none', classes)}>
      <CardContent className='flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex gap-3'>
          <Icon className='mt-0.5 size-5 shrink-0' aria-hidden='true' />
          <div>
            <h2 className='text-lg font-semibold text-foreground'>
              {notRun ? 'No audits yet' : blocked ? 'Deployment blocked' : 'Ready to deploy'}
            </h2>
            <p className='mt-1 text-sm leading-6 text-muted-foreground'>
              {notRun
                ? 'Run an audit to check for blocking findings before release.'
                : blocked
                  ? `${blockingCount} blocking finding${blockingCount === 1 ? '' : 's'} must be resolved before this project can deploy.`
                  : 'Latest audit passed and no active blocking findings were found.'}
            </p>
          </div>
        </div>
        <Button type='button' onClick={onRunAudit}>
          {blocked ? 'Review findings' : 'Run audit'}
        </Button>
      </CardContent>
    </Card>
  );
}

export function SummaryMetric({
  label,
  value,
  detail,
  mono = false,
}: {
  label: string;
  value: string;
  detail: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className='text-xs font-semibold uppercase tracking-normal text-muted-foreground'>{label}</p>
      <p className={cn('mt-1 text-base font-semibold text-foreground', mono && 'font-mono text-sm')}>
        {value}
      </p>
      <p className='mt-1 text-xs text-muted-foreground'>{detail}</p>
    </div>
  );
}
