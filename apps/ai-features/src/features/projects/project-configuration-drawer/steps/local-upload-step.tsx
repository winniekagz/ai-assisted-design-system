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
export function LocalUploadStep({
  showExclusions,
  onToggleExclusions,
  onSourceSelected,
  onNoDetect,
}: {
  showExclusions: boolean;
  onToggleExclusions(): void;
  // eslint-disable-next-line no-unused-vars
  onSourceSelected(selection: LocalSourceSelection): void;
  onNoDetect(): void;
}) {
  const folderInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const directoryPickerAttributes: DirectoryPickerAttributes = {
    webkitdirectory: '',
    directory: '',
  };

  function handleFolderChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const firstFile = files[0] as File & { webkitRelativePath?: string };
    const rootFolder =
      firstFile.webkitRelativePath?.split('/').filter(Boolean)[0] ?? firstFile.name;
    const filteredFiles = files.filter(file => !shouldIgnoreLocalFile(file));

    onSourceSelected({
      kind: 'folder',
      name: rootFolder,
      fileCount: filteredFiles.length,
      ignoredFileCount: files.length - filteredFiles.length,
      originalFileCount: files.length,
      totalSize: totalFileSize(filteredFiles),
      files: filteredFiles,
    });
    event.target.value = '';
  }

  function handleZipChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    onSourceSelected({
      kind: 'zip',
      name: file.name,
      fileCount: 1,
      ignoredFileCount: 0,
      originalFileCount: 1,
      totalSize: file.size,
      files: [file],
    });
    event.target.value = '';
  }

  return (
    <div className='grid gap-4'>
      <input
        ref={folderInputRef}
        type='file'
        multiple
        className='sr-only'
        onChange={handleFolderChange}
        {...directoryPickerAttributes}
      />
      <input
        ref={zipInputRef}
        type='file'
        accept='.zip,application/zip,application/x-zip-compressed'
        className='sr-only'
        onChange={handleZipChange}
      />
      <div className='grid min-h-52 place-items-center rounded-md border border-dashed border-border bg-background-secondary px-4 py-8 text-center'>
        <div>
          <FolderOpen className='mx-auto size-8 text-primary' aria-hidden='true' />
          <h3 className='mt-3 text-lg font-semibold text-foreground'>Choose a project folder</h3>
          <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground'>
            Upload a folder or .zip archive. ComponentIQ excludes generated files,
            dependencies, and build outputs before analysis.
          </p>
          <div className='mt-4 flex flex-wrap justify-center gap-2'>
            <Button
              type='button'
              onClick={() => folderInputRef.current?.click()}
              startIcon={<FolderOpen className='size-4' />}
            >
              Choose project folder
            </Button>
            <Button
              type='button'
              variant='outlined'
              disabled
              title='Zip extraction is deferred until archive safety handling is implemented.'
              startIcon={<FileArchive className='size-4' />}
            >
              Zip upload unavailable
            </Button>
          </div>
        </div>
      </div>
      <div className='rounded-md border border-border bg-background px-4 py-3 text-sm text-muted-foreground'>
        <p>
          Max size {formatBytes(localUploadLimits.maxBytes)} and {localUploadLimits.maxFiles.toLocaleString()} included files after exclusions. Folder selection uses the browser file picker.
          Zip upload is deferred until archive extraction safety is implemented.
        </p>
        <button type='button' className='mt-2 font-semibold text-primary' onClick={onToggleExclusions}>
          {showExclusions ? 'Hide exclusions' : 'Show auto-excluded paths'}
        </button>
        {showExclusions && (
          <ul className='mt-3 grid gap-1 font-mono text-xs'>
            {localExclusions.map(item => <li key={item}>{item}</li>)}
          </ul>
        )}
      </div>
      <Button type='button' variant='outlined' onClick={onNoDetect}>
        Preview no-detect state
      </Button>
    </div>
  );
}

function LocalPreflightStep({
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

export function totalFileSize(files: File[]) {
  return files.reduce((total, file) => total + file.size, 0);
}

export function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;

  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
}

export function shouldIgnoreLocalFile(file: File) {
  const path = ('webkitRelativePath' in file && typeof file.webkitRelativePath === 'string'
    ? file.webkitRelativePath
    : file.name
  ).replace(/\\/g, '/');
  const normalized = path.toLowerCase();

  return localExclusions.some(pattern => {
    const value = pattern.toLowerCase();

    if (value.endsWith('/')) {
      return normalized.split('/').includes(value.slice(0, -1));
    }

    if (value.startsWith('*.')) {
      return normalized.endsWith(value.slice(1));
    }

    if (value.endsWith('*')) {
      return normalized.includes(value.slice(0, -1));
    }

    return normalized === value || normalized.endsWith(`/${value}`);
  });
}
