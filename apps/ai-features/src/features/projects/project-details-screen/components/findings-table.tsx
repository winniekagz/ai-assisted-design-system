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

export function FindingsTable({ audits }: { audits: AuditSessionSummary[] }) {
  const findings = audits.flatMap(session =>
    session.findings.map(finding => ({ session, finding }))
  );

  return (
    <Card className='gap-0 rounded-none border-y border-border bg-transparent py-0 shadow-none'>
      <CardContent className='px-0'>
        <div className='border-b border-border px-5 py-4'>
          <h2 className='text-lg font-semibold text-foreground'>Audit findings</h2>
          <p className='mt-1 text-sm leading-6 text-muted-foreground'>
            Findings from this project&apos;s audits, most recent first.
          </p>
        </div>
        {findings.length === 0 ? (
          <EmptyState
            className='rounded-none border-none'
            icon={<ShieldAlert className='size-5' />}
            title='No audits yet'
            description='Run an audit from the project header to see findings here.'
          />
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-[720px] w-full border-collapse text-left text-sm'>
              <thead className='bg-background-secondary text-xs uppercase tracking-normal text-muted-foreground'>
                <tr>
                  <th scope='col' className='px-4 py-3 font-semibold'>Severity</th>
                  <th scope='col' className='px-4 py-3 font-semibold'>Finding</th>
                  <th scope='col' className='px-4 py-3 font-semibold'>Rule</th>
                  <th scope='col' className='px-4 py-3 font-semibold'>Audited</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {findings.map(({ session, finding }, index) => (
                  <tr key={`${session.id}-${index}`} className='hover:bg-background-secondary/70'>
                    <td className='px-4 py-3'><SeverityPill severity={finding.severity} /></td>
                    <td className='px-4 py-3'>
                      <span className='block font-medium text-foreground'>{finding.issue}</span>
                      <span className='mt-1 block text-xs text-muted-foreground'>{finding.suggestion}</span>
                      {finding.filePath && (
                        <span className='mt-1 block font-mono text-xs text-muted-foreground'>
                          {finding.filePath}
                          {finding.lineNumber ? `:${finding.lineNumber}` : ''}
                        </span>
                      )}
                    </td>
                    <td className='px-4 py-3 text-muted-foreground'>{finding.ruleUsed ?? finding.category}</td>
                    <td className='px-4 py-3 text-muted-foreground'>{formatDate(session.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SeverityPill({ severity }: { severity: AuditFindingResponse['severity'] }) {
  const classes = {
    critical: 'border-status-error bg-status-error-bg text-status-error',
    high: 'border-status-warning bg-status-warning-bg text-status-warning',
    medium: 'border-status-info bg-status-info-bg text-status-info',
    low: 'border-border bg-background-secondary text-muted-foreground',
  }[severity];

  return (
    <span className={cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize', classes)}>
      {severity}
    </span>
  );
}
