'use client';

import { Radio } from 'lucide-react';
import { useEffect } from 'react';

import { ErrorPage, RetryAction } from '@/features/error-pages';

export default function GlobalError({
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
    <html lang='en'>
      <body>
        <ErrorPage
          kind='server'
          title='The app shell could not load'
          description='A root-level error stopped the app before the page could render. Try again, or return to the start page.'
          digest={error.digest}
          actions={<GlobalErrorActions onRetry={reset} />}
        />
      </body>
    </html>
  );
}

function GlobalErrorActions({ onRetry }: { onRetry(): void }) {
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
