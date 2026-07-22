'use client';

import { cn } from 'componentiq';
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  CircleDashed,
  ShieldAlert,
} from 'lucide-react';

import type { ProjectStatus } from '@/features/projects/types';

const statusLabels: Record<ProjectStatus, string> = {
  healthy: 'Healthy',
  needs_attention: 'Needs Attention',
  blocked: 'Blocked',
  not_configured: 'Not Configured',
  archived: 'Archived',
};

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
