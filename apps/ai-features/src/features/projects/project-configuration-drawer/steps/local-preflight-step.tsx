'use client';

import { Badge, Button } from 'componentiq';

import { localUploadLimits } from '../constants';
import { StatusCallout } from '../shared-components';
import type { LocalSourceSelection } from '../types';

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

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;

  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
}
