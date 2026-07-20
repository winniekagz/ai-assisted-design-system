'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  DetectedProjectConfiguration,
  ProjectConfigurationStatus,
} from '@winniekagendo/componentiq-shared-types';
import type { GitProviderConnectionSummary } from '@winniekagendo/componentiq-shared-types';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Progress,
  Select,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Stepper,
  Textarea,
  cn,
  toast,
} from 'componentiq';
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileArchive,
  FolderOpen,
  Github,
  Info,
  Loader2,
  RefreshCcw,
  Search,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import { useForm } from 'react-hook-form';

import {
  useDisconnectGithubConnection,
  useStartGithubConnection,
} from '@/hooks/mutations/use-connect-github';
import { useGithubConnections } from '@/hooks/queries/use-github-connections';
import { useProjectConfiguration } from '@/features/projects/hooks';
import {
  confirmProjectConfiguration as confirmProjectConfigurationRequest,
  uploadLocalProjectSource,
} from '@/lib/api/projects';
import { requireClerkSessionToken } from '@/lib/auth/clerk-session-token';
import { queryKeys } from '@/lib/query/query-keys';

import {
  analysisSteps,
  localExclusions,
  localUploadLimits,
  repoRows,
  stageSteps,
  statusLabels,
} from './constants';
import type {
  ConfigurationFormValues,
  ConfigurationStateId,
  DirectoryPickerAttributes,
  LocalSourceSelection,
  ProjectConfigurationDrawerProps,
  ProjectConfigurationProject,
} from './types';
import {
  buildConfirmConfigurationInput,
  configurationStateForStatus,
  getConfigurationStatus,
  previousState,
  stageIndexForState,
  titleForState,
} from './utils';

export type {
  ConfigurationStateId,
  ProjectConfigurationProject,
  ProjectConfigurationStatus,
};
export { getConfigurationStatus };

export function StatusCallout({
  tone,
  title,
  detail,
}: {
  tone: 'info' | 'warning' | 'error';
  title: string;
  detail: string;
}) {
  const classes = {
    info: 'border-status-info bg-status-info-bg',
    warning: 'border-status-warning bg-status-warning-bg',
    error: 'border-status-error bg-status-error-bg',
  }[tone];
  const Icon = tone === 'info' ? Info : AlertCircle;

  return (
    <div role={tone === 'error' ? 'alert' : undefined} className={cn('flex gap-3 rounded-md border px-4 py-3', classes)}>
      <Icon className='mt-0.5 size-5 shrink-0' aria-hidden='true' />
      <div>
        <h3 className='font-semibold text-foreground'>{title}</h3>
        <p className='mt-1 text-sm leading-6 text-muted-foreground'>{detail}</p>
      </div>
    </div>
  );
}

export function SummaryRows({ rows }: { rows: [string, string][] }) {
  return (
    <div className='grid gap-2'>
      {rows.map(([label, value]) => (
        <div key={label} className='flex flex-col gap-1 rounded-md border border-border bg-background px-3 py-2 sm:flex-row sm:items-center sm:justify-between'>
          <span className='text-sm text-muted-foreground'>{label}</span>
          <span className='text-sm font-medium text-foreground'>{value}</span>
        </div>
      ))}
    </div>
  );
}
