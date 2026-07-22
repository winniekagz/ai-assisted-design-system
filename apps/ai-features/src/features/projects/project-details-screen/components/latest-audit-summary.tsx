'use client';

import type { AuditSessionSummary } from '@winniekagendo/componentiq-shared-types';
import { Card, CardContent } from 'componentiq';

import type { ProjectRow } from '@/features/projects/types';
import { formatDate } from '@/shared/format-date';

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
