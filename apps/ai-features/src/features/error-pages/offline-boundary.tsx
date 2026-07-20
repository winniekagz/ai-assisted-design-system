'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';

import { ErrorPage, RetryAction } from './error-page';

const MAX_RETRY_ATTEMPTS = 5;
const RETRY_DELAY_MS = 3000;

export function OfflineBoundary({ children }: { children: ReactNode }) {
  const [online, setOnline] = useState(true);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    if (navigator.onLine) {
      setOnline(true);
      setAttempt(0);
      return;
    }

    setOnline(false);
    setAttempt(current => Math.min(current + 1, MAX_RETRY_ATTEMPTS));
  }, []);

  useEffect(() => {
    setOnline(navigator.onLine);

    function handleOnline() {
      setOnline(true);
      setAttempt(0);
    }

    function handleOffline() {
      setOnline(false);
      setAttempt(1);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (online || attempt >= MAX_RETRY_ATTEMPTS) {
      return;
    }

    const timer = window.setTimeout(retry, RETRY_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [attempt, online, retry]);

  return (
    <>
      <div className='contents' hidden={!online}>
        {children}
      </div>
      {!online ? (
        <div className='fixed inset-0 z-50 overflow-y-auto bg-background'>
          <ErrorPage
            kind='offline'
            retryStatus={
              attempt >= MAX_RETRY_ATTEMPTS
                ? `Automatic retries paused after ${MAX_RETRY_ATTEMPTS} attempts.`
                : `Retrying automatically... attempt ${Math.max(attempt, 1)} of ${MAX_RETRY_ATTEMPTS}`
            }
            actions={<RetryAction onRetry={retry} />}
          />
        </div>
      ) : null}
    </>
  );
}
