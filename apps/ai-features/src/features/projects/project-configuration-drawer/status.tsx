import type { ProjectConfigurationStatus } from '@winniekagendo/componentiq-shared-types';
import { cn } from 'componentiq';
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react';

import { statusLabels } from './constants';

export function ConfigurationStatusBadge({
  status,
}: {
  status: ProjectConfigurationStatus;
}) {
  const meta = {
    NOT_CONFIGURED: { icon: Clock, className: 'border-border bg-background-secondary text-muted-foreground' },
    CONFIGURING: { icon: Loader2, className: 'border-status-info bg-status-info-bg text-status-info' },
    REVIEW_REQUIRED: { icon: AlertCircle, className: 'border-status-warning bg-status-warning-bg text-status-warning' },
    READY: { icon: CheckCircle2, className: 'border-status-success bg-status-success-bg text-status-success' },
    CONFIGURATION_FAILED: { icon: AlertCircle, className: 'border-status-error bg-status-error-bg text-status-error' },
    ARCHIVED: { icon: Archive, className: 'border-border bg-background-secondary text-muted-foreground' },
  } satisfies Record<ProjectConfigurationStatus, { icon: typeof Clock; className: string }>;
  const Icon = meta[status].icon;

  return (
    <span className={cn('inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold', meta[status].className)}>
      <Icon className={cn('size-3.5', status === 'CONFIGURING' && 'animate-spin')} aria-hidden='true' />
      {statusLabels[status]}
    </span>
  );
}

export function configurationDetail(summary: {
  projectStatus: ProjectConfigurationStatus;
  latestJobStatus: string | null;
  lastError: { message: string | null } | null;
}) {
  if (summary.projectStatus === 'REVIEW_REQUIRED') {
    return 'Backend detection is ready for human review.';
  }
  if (summary.projectStatus === 'CONFIGURING') {
    return `Configuration job is ${summary.latestJobStatus?.toLowerCase() ?? 'running'}.`;
  }
  if (summary.projectStatus === 'CONFIGURATION_FAILED') {
    return summary.lastError?.message ?? 'Detection failed with a safe recoverable error.';
  }

  return statusLabels[summary.projectStatus];
}
