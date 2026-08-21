'use client';

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

// Discriminated on presence of files — eliminates a "selected" status with no files.
export type FileUploadSelection =
  | { status: 'empty' }
  | { status: 'selected'; files: File[]; totalBytes: number };

export const emptyFileUploadSelection: FileUploadSelection = { status: 'empty' };

export type FileUploadAccept = {
  mimeTypes?: string[];
  extensions?: string[];
};


export type FileUploadLimits = {
  maxFiles?: number;
  maxTotalBytes?: number;
};

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
  // eslint-disable-next-line no-unused-vars
  onRejections?: (rejections: FileUploadRejection[]) => void;
};

// Controlled `value` without `onSelectionChange` is a compile-time error — same fix
// applied to Input/Textarea's `inputSecurityPolicy` (see input.tsx) — a controlled
// file list with nowhere for changes to go is a footgun, not a valid state.
export type FileUploadProps = FileUploadBaseProps &
  (
    | {
      value: FileUploadSelection;
      defaultValue?: never;
      // eslint-disable-next-line no-unused-vars
      onSelectionChange: (selection: FileUploadSelection) => void;
    }
    | {
      value?: never;
      defaultValue?: FileUploadSelection;
      // eslint-disable-next-line no-unused-vars
      onSelectionChange?: (selection: FileUploadSelection) => void;
    }
  );

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
  return [...(accept?.extensions ?? []), ...(accept?.mimeTypes ?? [])].join(',') || undefined;
}
function clampToMode(
  selection: FileUploadSelection,
  multiple: boolean | undefined
): FileUploadSelection {
  if (multiple || selection.status !== 'selected' || selection.files.length <= 1) {
    return selection;
  }

  const [first] = selection.files;
  return first
    ? { status: 'selected', files: [first], totalBytes: first.size }
    : emptyFileUploadSelection;
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      id,
      name,
      label,
      helperText,
      error,
      success,
      disabled,
      required,
      multiple,
      accept,
      limits,
      className,
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

    const [uncontrolledSelection, setUncontrolledSelection] =
      React.useState<FileUploadSelection>(() =>
        clampToMode(defaultValue ?? emptyFileUploadSelection, multiple)
      );
    const selection = clampToMode(value ?? uncontrolledSelection, multiple);

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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawFiles = Array.from(event.target.files ?? []);

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

      event.target.value = '';
    };

    const handleRemove = (file: File) => {
      if (selection.status !== 'selected') return;

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

    return (
      <div className={cn('flex flex-col gap-[var(--spacing-xs)] w-full', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] leading-[var(--line-height-snug)] font-[family-name:var(--font-rubik)]',
              error
                ? 'text-[color:var(--helper-error)]'
                : 'text-[color:var(--text-secondary)]'
            )}
          >
            {label}
            {required && (
              <span className='text-[color:var(--helper-error)] ml-1' aria-hidden='true'>*</span>
            )}
          </label>
        )}

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
          // `sr-only` hides this natively-focusable element visually but not from the
          // tab order — without tabIndex={-1} a keyboard user would land on an
          // invisible focus target with no visible indicator. The <label htmlFor>
          // association above still holds for screen-reader forms-mode navigation;
          // the visible Button below is the sole sequential-tab-order entry point.
          tabIndex={-1}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={helperId}
          onChange={handleChange}
        />

        <Button
          type='button'
          variant='outlined'
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          {multiple ? 'Choose files' : 'Choose file'}
        </Button>

        {selection.status === 'selected' && (
          <ul className='grid gap-1 text-[length:var(--font-size-sm)]'>
            {selection.files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className='flex items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-[color:var(--border-subtle)] px-[var(--spacing-sm)] py-1'
              >
                <span className='truncate' title={sanitizeDisplayText(file.name)}>
                  {sanitizeDisplayText(file.name)}
                </span>
                <span className='flex items-center gap-2 text-[color:var(--text-muted)]'>
                  {formatBytes(file.size)}
                  <button
                    type='button'
                    onClick={() => handleRemove(file)}
                    aria-label={`Remove ${sanitizeDisplayText(file.name)}`}
                    className='text-[color:var(--text-muted)] hover:text-[color:var(--text-paragraph)]'
                  >
                    ×
                  </button>
                </span>
              </li>
            ))}
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
              'text-[length:var(--font-size-xs)] leading-[var(--line-height-snug)] font-[family-name:var(--font-rubik)]',
              helperColor
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
FileUpload.displayName = 'FileUpload';

export { FileUpload };
