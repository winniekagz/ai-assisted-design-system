'use client';

import { Radio } from 'lucide-react';
import { useEffect } from 'react';

import { ErrorPage, RetryAction } from '@/features/error-pages';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset(): void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPage
      kind={getErrorKind(error)}
      digest={error.digest}
      actions={<ErrorBoundaryActions onRetry={reset} />}
    />
  );
}

function ErrorBoundaryActions({ onRetry }: { onRetry(): void }) {
  return (
    <>
      <RetryAction onRetry={onRetry} />
      <a
        href='https://www.vercel-status.com/'
        className='inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-[18px] text-[13.5px] font-medium text-foreground transition-colors hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      >
        <Radio className='size-4' aria-hidden='true' />
        View status page
      </a>
    </>
  );
}

function getErrorKind(error: Error & { digest?: string }) {
  const status = getStatusCode(error);

  if (status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  if (status && status >= 500) return 'server';

  return 'boundary';
}

function getStatusCode(error: unknown) {
  if (typeof error !== 'object' || error === null) return null;

  const record = error as Record<string, unknown>;
  const status = record.status ?? record.statusCode;

  return typeof status === 'number' ? status : null;
}
