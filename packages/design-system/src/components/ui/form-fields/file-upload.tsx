'use client';

import {
  AlertCircle,
  CheckCircle2,
  FileArchive,
  FileAudio,
  FileCode2,
  FileIcon,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
  FileVideo,
  HelpCircle,
  LoaderCircle,
  UploadCloud,
  X,
} from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { sanitizeDisplayText } from '@/lib/input-security';
import { cn } from '@/lib/utils';

export type FileUploadRejectionReason =
  | 'too_many_files'
  | 'too_large'
  | 'not_accepted_type';

export type FileUploadRejection = {
  file: File;
  reason: FileUploadRejectionReason;
};

export type FileUploadSelection =
  | { status: 'empty' }
  | { status: 'selected'; files: File[]; totalBytes: number };

export const emptyFileUploadSelection: FileUploadSelection = {
  status: 'empty',
};

export type FileUploadAccept = {
  mimeTypes?: string[];
  extensions?: string[];
};

export type FileUploadLimits = {
  maxFiles?: number;
  maxTotalBytes?: number;
};

export type FileUploadStatus = 'idle' | 'loading' | 'success' | 'error';

export type FileUploadDisplayFile = {
  id?: string;
  name: string;
  size?: number;
  type?: string;
  status?: FileUploadStatus;
  progress?: number;
  message?: string;
};

export interface FileTypeIconProps extends React.HTMLAttributes<HTMLDivElement> {
  fileName: string;
  mimeType?: string;
}

export interface FileUploadProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: FileUploadStatus;
  progress?: number;
}

export interface FileDisplayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  file: File | FileUploadDisplayFile;
  status?: FileUploadStatus;
  progress?: number;
  message?: string;
  removable?: boolean;
  onRemove?: () => void;
}

type FileUploadBaseProps = {
  id?: string;
  name?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  success?: boolean;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  accept?: FileUploadAccept;
  limits?: FileUploadLimits;
  className?: string;
  dropzoneLabel?: React.ReactNode;
  supportedFormatsLabel?: string;
  maxSizeLabel?: string;
  helpText?: string;
  cancelLabel?: string;
  nextLabel?: string;
  showFooter?: boolean;
  uploadStatus?: FileUploadStatus;
  progress?: number;
  fileStatuses?: Record<string, FileUploadStatus>;
  fileProgress?: Record<string, number>;
  displayFiles?: FileUploadDisplayFile[];
  onCancel?: () => void;
  onNext?: () => void;
  onHelpClick?: () => void;
  onDisplayFileRemove?: (file: FileUploadDisplayFile, index: number) => void;
  onRejections?: (rejections: FileUploadRejection[]) => void;
};

export type FileUploadProps = FileUploadBaseProps &
  (
    | {
        value: FileUploadSelection;
        defaultValue?: never;
        onSelectionChange: (selection: FileUploadSelection) => void;
      }
    | {
        value?: never;
        defaultValue?: FileUploadSelection;
        onSelectionChange?: (selection: FileUploadSelection) => void;
      }
  );

const extensionTone: Record<string, string> = {
  xls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  xlsx: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  csv: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  txt: 'bg-slate-50 text-slate-700 border-slate-200',
  pdf: 'bg-red-50 text-red-700 border-red-200',
  png: 'bg-sky-50 text-sky-700 border-sky-200',
  jpg: 'bg-sky-50 text-sky-700 border-sky-200',
  jpeg: 'bg-sky-50 text-sky-700 border-sky-200',
  gif: 'bg-sky-50 text-sky-700 border-sky-200',
  doc: 'bg-blue-50 text-blue-700 border-blue-200',
  docx: 'bg-blue-50 text-blue-700 border-blue-200',
  ppt: 'bg-orange-50 text-orange-700 border-orange-200',
  pptx: 'bg-orange-50 text-orange-700 border-orange-200',
  zip: 'bg-violet-50 text-violet-700 border-violet-200',
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

function getFileName(file: File | FileUploadDisplayFile) {
  return sanitizeDisplayText(file.name);
}

function getFileSize(file: File | FileUploadDisplayFile) {
  return typeof file.size === 'number' ? file.size : undefined;
}

function getFileMimeType(file: File | FileUploadDisplayFile) {
  return 'type' in file ? file.type : undefined;
}

function getExtension(fileName: string) {
  const parts = sanitizeDisplayText(fileName).split('.');
  return parts.length > 1 ? (parts.pop()?.toLowerCase() ?? 'file') : 'file';
}

function getFileIcon(fileName: string, mimeType?: string) {
  const extension = getExtension(fileName);

  if (['xls', 'xlsx', 'csv'].includes(extension)) return FileSpreadsheet;
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) {
    return FileImage;
  }
  if (['doc', 'docx', 'txt', 'md', 'rtf'].includes(extension)) return FileText;
  if (['ppt', 'pptx', 'key'].includes(extension)) return FileType;
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return FileArchive;
  if (mimeType?.startsWith('audio/')) return FileAudio;
  if (mimeType?.startsWith('video/')) return FileVideo;
  if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json'].includes(extension)) {
    return FileCode2;
  }

  return FileIcon;
}

function matchesAccept(file: File, accept: FileUploadAccept | undefined) {
  if (!accept || (!accept.mimeTypes?.length && !accept.extensions?.length)) {
    return true;
  }

  const name = file.name.toLowerCase();
  const matchesExtension = accept.extensions?.some(extension =>
    name.endsWith(extension.toLowerCase())
  );
  const matchesMimeType = accept.mimeTypes?.some(
    mimeType => file.type === mimeType
  );

  return Boolean(matchesExtension || matchesMimeType);
}

function partitionFiles(
  files: File[],
  accept: FileUploadAccept | undefined,
  limits: FileUploadLimits | undefined
) {
  const accepted: File[] = [];
  const rejections: FileUploadRejection[] = [];
  let totalBytes = 0;

  for (const file of files) {
    if (!matchesAccept(file, accept)) {
      rejections.push({ file, reason: 'not_accepted_type' });
      continue;
    }

    if (
      typeof limits?.maxFiles === 'number' &&
      accepted.length >= limits.maxFiles
    ) {
      rejections.push({ file, reason: 'too_many_files' });
      continue;
    }

    if (
      typeof limits?.maxTotalBytes === 'number' &&
      totalBytes + file.size > limits.maxTotalBytes
    ) {
      rejections.push({ file, reason: 'too_large' });
      continue;
    }

    accepted.push(file);
    totalBytes += file.size;
  }

  return { accepted, rejections, totalBytes };
}

function acceptAttribute(accept: FileUploadAccept | undefined) {
  return (
    [...(accept?.extensions ?? []), ...(accept?.mimeTypes ?? [])].join(',') ||
    undefined
  );
}

function clampToMode(
  selection: FileUploadSelection,
  multiple: boolean | undefined
): FileUploadSelection {
  if (
    multiple ||
    selection.status !== 'selected' ||
    selection.files.length <= 1
  ) {
    return selection;
  }

  const [first] = selection.files;
  return first
    ? { status: 'selected', files: [first], totalBytes: first.size }
    : emptyFileUploadSelection;
}

function getAcceptSummary(accept: FileUploadAccept | undefined) {
  if (!accept?.extensions?.length) return 'Supported formats: Any file';
  return `Supported formats: ${accept.extensions
    .map(extension => extension.replace(/^\./, '').toUpperCase())
    .join(', ')}`;
}

function getMaxSizeSummary(limits: FileUploadLimits | undefined) {
  if (!limits?.maxTotalBytes) return undefined;
  return `Maximum size: ${formatBytes(limits.maxTotalBytes)}`;
}

function getFileStatus(
  file: File | FileUploadDisplayFile,
  fallback: FileUploadStatus,
  statuses?: Record<string, FileUploadStatus>
) {
  if ('status' in file && file.status) return file.status;
  return statuses?.[getFileName(file)] ?? fallback;
}

function getFileProgress(
  file: File | FileUploadDisplayFile,
  fallback: number | undefined,
  progressByName?: Record<string, number>
) {
  if ('progress' in file && typeof file.progress === 'number') {
    return file.progress;
  }
  return progressByName?.[getFileName(file)] ?? fallback;
}

export function FileTypeIcon({
  fileName,
  mimeType,
  className,
  ...props
}: FileTypeIconProps) {
  const extension = getExtension(fileName);
  const Icon = getFileIcon(fileName, mimeType);

  return (
    <div
      className={cn(
        'relative inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] border bg-[color:var(--bg-surface)]',
        extensionTone[extension] ??
          'border-[color:var(--border-subtle)] text-[color:var(--text-muted)]',
        className
      )}
      {...props}
    >
      <Icon className='size-4' aria-hidden='true' />
      <span className='sr-only'>{extension.toUpperCase()} file</span>
    </div>
  );
}

export function FileUploadProgress({
  status = 'idle',
  progress,
  className,
  ...props
}: FileUploadProgressProps) {
  const clampedProgress =
    typeof progress === 'number'
      ? Math.min(100, Math.max(0, Math.round(progress)))
      : undefined;

  if (status === 'success') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-[color:var(--helper-success)]',
          className
        )}
        {...props}
      >
        <CheckCircle2 className='size-4' aria-hidden='true' />
        Complete
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-[color:var(--helper-error)]',
          className
        )}
        {...props}
      >
        <AlertCircle className='size-4' aria-hidden='true' />
        Failed
      </div>
    );
  }

  if (status !== 'loading') return null;

  return (
    <div
      className={cn(
        'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2',
        className
      )}
      {...props}
    >
      <div
        className='h-1.5 overflow-hidden rounded-[var(--radius-full)] bg-[color:var(--bg-hover)]'
        role='progressbar'
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clampedProgress}
      >
        <div
          className='h-full rounded-[var(--radius-full)] bg-[color:var(--color-primary)] transition-[width] duration-[var(--duration-normal)]'
          style={{ width: `${clampedProgress ?? 35}%` }}
        />
      </div>
      <span className='min-w-9 text-right text-[length:var(--font-size-xs)] text-[color:var(--text-muted)]'>
        {clampedProgress !== undefined ? (
          `${clampedProgress}%`
        ) : (
          <LoaderCircle
            className='inline size-4 animate-spin'
            aria-hidden='true'
          />
        )}
      </span>
    </div>
  );
}

export function FileDisplayCard({
  file,
  status = 'idle',
  progress,
  message,
  removable = true,
  onRemove,
  className,
  ...props
}: FileDisplayCardProps) {
  const name = getFileName(file);
  const size = getFileSize(file);
  const mimeType = getFileMimeType(file);
  const resolvedMessage =
    'message' in file && file.message ? file.message : message;

  return (
    <div
      className={cn(
        'grid gap-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[color:var(--bg-secondary)] p-[var(--spacing-sm)] [font-family:var(--font-rubik)]',
        status === 'success' &&
          'border-[color:var(--helper-success)] bg-[color:var(--helper-success-pastel)]',
        status === 'error' &&
          'border-[color:var(--helper-error)] bg-[color:var(--helper-error-pastel)]',
        className
      )}
      {...props}
    >
      <div className='grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-[var(--spacing-sm)]'>
        <FileTypeIcon fileName={name} mimeType={mimeType} />
        <div className='min-w-0'>
          <p
            className='truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] leading-[var(--line-height-snug)] text-[color:var(--text-title)]'
            title={name}
          >
            {name}
          </p>
          {size !== undefined && (
            <p className='mt-0.5 text-[length:var(--font-size-xs)] leading-[var(--line-height-snug)] text-[color:var(--text-muted)]'>
              {formatBytes(size)}
            </p>
          )}
          {resolvedMessage && (
            <p
              className={cn(
                'mt-1 text-[length:var(--font-size-xs)] leading-[var(--line-height-snug)]',
                status === 'error'
                  ? 'text-[color:var(--helper-error)]'
                  : 'text-[color:var(--text-muted)]'
              )}
            >
              {resolvedMessage}
            </p>
          )}
        </div>
        {removable && onRemove && (
          <button
            type='button'
            onClick={onRemove}
            aria-label={`Remove ${name}`}
            className='inline-flex size-7 items-center justify-center rounded-[var(--radius-md)] text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-hover)] hover:text-[color:var(--text-title)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]'
          >
            <X className='size-4' aria-hidden='true' />
          </button>
        )}
      </div>
      <FileUploadProgress status={status} progress={progress} />
    </div>
  );
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      id,
      name,
      label = 'Upload file',
      helperText,
      error,
      success,
      disabled,
      required,
      multiple,
      accept,
      limits,
      className,
      dropzoneLabel,
      supportedFormatsLabel,
      maxSizeLabel,
      helpText = 'Help Center',
      cancelLabel = 'Cancel',
      nextLabel = 'Next',
      showFooter,
      uploadStatus = 'idle',
      progress,
      fileStatuses,
      fileProgress,
      displayFiles,
      onCancel,
      onNext,
      onHelpClick,
      onDisplayFileRemove,
      onRejections,
      value,
      defaultValue,
      onSelectionChange,
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const [uncontrolledSelection, setUncontrolledSelection] =
      React.useState<FileUploadSelection>(() =>
        clampToMode(defaultValue ?? emptyFileUploadSelection, multiple)
      );
    const selection = clampToMode(value ?? uncontrolledSelection, multiple);

    const visibleFiles =
      displayFiles ?? (selection.status === 'selected' ? selection.files : []);
    const hasFiles = visibleFiles.length > 0;

    const helperColor = error
      ? 'text-[color:var(--helper-error)]'
      : success
        ? 'text-[color:var(--helper-success)]'
        : 'text-[color:var(--text-muted)]';

    const applySelection = (next: FileUploadSelection) => {
      if (value === undefined) {
        setUncontrolledSelection(next);
      }
      onSelectionChange?.(next);
    };

    const applyFiles = (rawFiles: File[]) => {
      const files = multiple ? rawFiles : rawFiles.slice(0, 1);
      const { accepted, rejections, totalBytes } = partitionFiles(
        files,
        accept,
        limits
      );

      applySelection(
        accepted.length > 0
          ? { status: 'selected', files: accepted, totalBytes }
          : emptyFileUploadSelection
      );

      if (rejections.length > 0) {
        onRejections?.(rejections);
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      applyFiles(Array.from(event.target.files ?? []));
      event.target.value = '';
    };

    const handleRemove = (file: File | FileUploadDisplayFile) => {
      if (!(file instanceof File) || selection.status !== 'selected') return;

      const remaining = selection.files.filter(candidate => candidate !== file);
      applySelection(
        remaining.length > 0
          ? {
              status: 'selected',
              files: remaining,
              totalBytes: remaining.reduce((total, f) => total + f.size, 0),
            }
          : emptyFileUploadSelection
      );
    };

    const handleClear = () => applySelection(emptyFileUploadSelection);

    const openPicker = () => {
      if (!disabled) inputRef.current?.click();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      applyFiles(Array.from(event.dataTransfer.files ?? []));
    };

    const supportedFormats = supportedFormatsLabel ?? getAcceptSummary(accept);
    const maximumSize = maxSizeLabel ?? getMaxSizeSummary(limits);

    return (
      <div
        className={cn(
          'grid w-full gap-[var(--spacing-md)] rounded-[var(--radius-lg)] bg-[color:var(--bg-surface)] p-[var(--spacing-lg)] shadow-[var(--shadow-lg)] [font-family:var(--font-rubik)]',
          className
        )}
      >
        <div className='flex items-center justify-between gap-[var(--spacing-md)]'>
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                'text-[length:var(--font-size-body1)] font-[var(--font-weight-medium)] leading-[var(--line-height-snug)] text-[color:var(--text-title)]',
                error && 'text-[color:var(--helper-error)]'
              )}
            >
              {label}
              {required && (
                <span
                  className='ml-1 text-[color:var(--helper-error)]'
                  aria-hidden='true'
                >
                  *
                </span>
              )}
            </label>
          )}
          <button
            type='button'
            className='inline-flex size-7 items-center justify-center rounded-[var(--radius-md)] text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-hover)] hover:text-[color:var(--text-title)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]'
            aria-label='Close upload panel'
            disabled={disabled}
            onClick={onCancel}
          >
            <X className='size-4' aria-hidden='true' />
          </button>
        </div>

        <input
          ref={node => {
            inputRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          id={inputId}
          name={name}
          type='file'
          multiple={multiple}
          disabled={disabled}
          required={required}
          accept={acceptAttribute(accept)}
          className='sr-only'
          tabIndex={-1}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={helperId}
          onChange={handleChange}
        />

        <div
          role='button'
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled ? 'true' : undefined}
          onClick={openPicker}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openPicker();
            }
          }}
          onDragEnter={event => {
            event.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragOver={event => {
            event.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'grid min-h-40 cursor-pointer place-items-center rounded-[var(--radius-md)] border border-dashed border-[color:var(--border-default)] bg-[color:var(--bg-secondary)] p-[var(--spacing-lg)] text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]',
            isDragging &&
              'border-[color:var(--color-primary)] bg-[color:var(--primary-50,var(--bg-hover))]',
            error && 'border-[color:var(--helper-error)]',
            success && 'border-[color:var(--helper-success)]',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <div className='grid justify-items-center gap-[var(--spacing-sm)]'>
            <span className='relative inline-flex size-12 items-center justify-center'>
              <FileText
                className='size-10 text-[color:var(--border-default)]'
                aria-hidden='true'
              />
              <span className='absolute bottom-0 right-0 inline-flex size-5 items-center justify-center rounded-[var(--radius-full)] bg-[color:var(--color-primary)] text-[color:var(--color-primary-fg)]'>
                <UploadCloud className='size-3' aria-hidden='true' />
              </span>
            </span>
            <span className='text-[length:var(--font-size-xs)] leading-[var(--line-height-snug)] text-[color:var(--text-title)]'>
              {dropzoneLabel ?? (
                <>
                  Drag and Drop file here or{' '}
                  <span className='font-[var(--font-weight-medium)] underline underline-offset-2'>
                    {multiple ? 'Choose files' : 'Choose file'}
                  </span>
                </>
              )}
            </span>
          </div>
        </div>

        <Button
          type='button'
          variant='outlined'
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className='sr-only'
        >
          {multiple ? 'Choose files' : 'Choose file'}
        </Button>

        <div className='flex flex-wrap justify-between gap-[var(--spacing-sm)] text-[length:var(--font-size-xs)] text-[color:var(--text-muted)]'>
          <span>{supportedFormats}</span>
          {maximumSize && <span>{maximumSize}</span>}
        </div>

        {hasFiles && (
          <ul className='grid gap-[var(--spacing-sm)]'>
            {visibleFiles.map((file, index) => {
              const status = getFileStatus(file, uploadStatus, fileStatuses);
              const fileName = getFileName(file);
              return (
                <li key={`${fileName}-${index}`}>
                  <FileDisplayCard
                    file={file}
                    status={status}
                    progress={getFileProgress(file, progress, fileProgress)}
                    removable
                    onRemove={() => {
                      if (displayFiles && !(file instanceof File)) {
                        onDisplayFileRemove?.(file, index);
                        return;
                      }

                      handleRemove(file);
                    }}
                  />
                </li>
              );
            })}
          </ul>
        )}

        {selection.status === 'selected' && selection.files.length > 0 && (
          <button
            type='button'
            onClick={handleClear}
            className='self-start text-[length:var(--font-size-xs)] font-semibold text-[color:var(--color-primary)]'
          >
            Clear all
          </button>
        )}

        {helperText && (
          <p
            id={helperId}
            className={cn(
              'text-[length:var(--font-size-xs)] leading-[var(--line-height-snug)]',
              helperColor
            )}
          >
            {helperText}
          </p>
        )}

        {showFooter && (
          <div className='flex flex-wrap items-center justify-between gap-[var(--spacing-md)] border-t border-[color:var(--border-subtle)] pt-[var(--spacing-md)]'>
            <button
              type='button'
              onClick={onHelpClick}
              className='inline-flex items-center gap-1 text-[length:var(--font-size-xs)] text-[color:var(--text-muted)] hover:text-[color:var(--text-title)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]'
            >
              <HelpCircle className='size-4' aria-hidden='true' />
              {helpText}
            </button>
            <div className='flex items-center gap-[var(--spacing-sm)]'>
              <Button
                type='button'
                variant='outlined'
                size='sm'
                onClick={onCancel}
              >
                {cancelLabel}
              </Button>
              <Button
                type='button'
                size='sm'
                disabled={!hasFiles || uploadStatus === 'loading' || disabled}
                onClick={onNext}
              >
                {nextLabel}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);
FileUpload.displayName = 'FileUpload';

export { FileUpload, formatBytes };
