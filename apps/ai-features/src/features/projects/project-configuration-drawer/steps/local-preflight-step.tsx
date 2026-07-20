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
} from '../constants';
import type {
  ConfigurationFormValues,
  ConfigurationStateId,
  DirectoryPickerAttributes,
  LocalSourceSelection,
  ProjectConfigurationDrawerProps,
  ProjectConfigurationProject,
} from '../types';
import {
  buildConfirmConfigurationInput,
  configurationStateForStatus,
  getConfigurationStatus,
  previousState,
  stageIndexForState,
  titleForState,
} from '../utils';

export type {
  ConfigurationStateId,
  ProjectConfigurationProject,
  ProjectConfigurationStatus,
};
export { getConfigurationStatus };

import { StatusCallout, SummaryRows } from '../shared-components';
export function LocalPreflightStep({
  source,
  onAnalyze,
}: {
  source: LocalSourceSelection | null;
  onAnalyze(): void;
}) {
  const rows = [
    ['Selected source', source ? source.name : 'No source selected', source ? 'Selected' : 'Warning'],
    ['Detection source', 'Backend analysis after upload', 'Pending'],
    [
      'Files',
      source
        ? `${source.fileCount.toLocaleString()} included of ${source.originalFileCount.toLocaleString()} selected · ${formatBytes(source.totalSize)}`
        : 'Waiting for selection',
      source ? 'Selected' : 'Warning',
    ],
    [
      'Ignored files',
      source ? `${source.ignoredFileCount.toLocaleString()} excluded before upload` : 'Waiting for selection',
      source && source.ignoredFileCount > 0 ? 'Selected' : 'Pending',
    ],
  ];
  const limitWarning =
    source && (source.fileCount > localUploadLimits.maxFiles || source.totalSize > localUploadLimits.maxBytes)
      ? `The filtered upload must be ${localUploadLimits.maxFiles.toLocaleString()} files or fewer and under ${formatBytes(localUploadLimits.maxBytes)}.`
      : null;
  const noIncludedFilesWarning =
    source && source.fileCount === 0
      ? 'All selected files were excluded. Choose the project source folder, not a generated output or dependency folder.'
      : null;
  const zipWarning =
    source?.kind === 'zip'
      ? 'Zip upload is not enabled in this slice. Choose a project folder instead.'
      : null;
  const disabledReason = limitWarning ?? noIncludedFilesWarning ?? zipWarning;

  return (
    <div className='grid gap-4'>
      <StatusCallout tone='info' title='Source selected' detail='Framework, language, package manager, and styling are detected by the backend after upload.' />
      {limitWarning && (
        <StatusCallout tone='warning' title='Source is too large' detail={limitWarning} />
      )}
      {noIncludedFilesWarning && (
        <StatusCallout tone='warning' title='No uploadable files' detail={noIncludedFilesWarning} />
      )}
      {zipWarning && (
        <StatusCallout tone='warning' title='Zip upload unavailable' detail={zipWarning} />
      )}
      <div className='grid gap-2'>
        {rows.map(([label, value, status]) => (
          <div key={label} className='flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2'>
            <span className='text-sm text-muted-foreground'>{label}</span>
            <span className='flex items-center gap-2 text-sm font-medium text-foreground'>
              {value}
              <Badge status={status === 'Warning' || status === 'Pending' ? 'warning' : 'success'}>{status}</Badge>
            </span>
          </div>
        ))}
      </div>
      <Button
        type='button'
        disabled={Boolean(disabledReason) || !source}
        title={disabledReason ?? undefined}
        onClick={onAnalyze}
      >
        Upload and analyze
      </Button>
    </div>
  );
}

function totalFileSize(files: File[]) {
  return files.reduce((total, file) => total + file.size, 0);
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;

  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
}

function shouldIgnoreLocalFile(file: File) {
  const relativePath =
    (file as File & { webkitRelativePath?: string }).webkitRelativePath ||
    file.name;
  const normalized = relativePath.replace(/\\/g, '/');
  const parts = normalized.split('/').filter(Boolean);
  const basename = parts.at(-1)?.toLowerCase() ?? '';
  const excludedSegments = new Set([
    'node_modules',
    '.git',
    '.next',
    'dist',
    'build',
    'coverage',
    '.cache',
    '.turbo',
    '.vercel',
    '.output',
  ]);
  const excludedBasenames = new Set([
    '.env',
    '.env.local',
    '.env.development',
    '.env.production',
    'id_rsa',
    'id_dsa',
    'id_ecdsa',
    'id_ed25519',
  ]);

  if (parts.some(part => excludedSegments.has(part))) return true;
  if (excludedBasenames.has(basename)) return true;
  if (basename.endsWith('.pem') || basename.endsWith('.key')) return true;
  if (basename.endsWith('.log') || basename.endsWith('.map')) return true;

  return false;
}
