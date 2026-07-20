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

import { SummaryMetric } from './deployment-status-panel';

export function LatestAuditSummary({
  project,
  audits,
}: {
  project: ProjectRow;
  audits: AuditSessionSummary[];
}) {
  const latest = audits[0] ?? null;
  const blockingCount = blockingFindingCount(latest);

  return (
    <Card className='rounded-none border-y border-border bg-transparent py-0 shadow-none'>
      <CardContent className='grid gap-4 px-5 py-5 md:grid-cols-3'>
        <SummaryMetric
          label='Latest audit'
          value={latest ? auditStatusLabel(latest.status) : 'Not run'}
          detail={latest ? formatDate(latest.createdAt) : 'Never'}
        />
        <SummaryMetric
          label='Blocking findings'
          value={`${blockingCount}`}
          detail={latest ? 'High and critical severity' : 'No audits yet'}
        />
        <SummaryMetric label='Repository' value={project.repository} detail={project.framework} mono />
      </CardContent>
    </Card>
  );
}

export function auditStatusLabel(status: AuditSessionSummary['status']) {
  return { passed: 'Passed', needs_changes: 'Needs changes', failed: 'Failed' }[status];
}

export function blockingFindingCount(session: AuditSessionSummary | null) {
  if (!session) return 0;

  return session.findings.filter(
    finding => finding.severity === 'high' || finding.severity === 'critical'
  ).length;
}
