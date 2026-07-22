'use client';

import { Button } from 'componentiq';
import { FileArchive, FolderOpen } from 'lucide-react';
import { useRef, type ChangeEvent } from 'react';

import { localExclusions, localUploadLimits } from '../constants';
import type {
  DirectoryPickerAttributes,
  LocalSourceSelection,
} from '../types';

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
