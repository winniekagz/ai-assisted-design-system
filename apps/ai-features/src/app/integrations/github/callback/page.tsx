'use client';

import { Suspense } from 'react';

import { GithubCallbackStatus } from '@/features/integrations/github/github-callback-status';
import { useCompleteGithubCallback } from '@/features/integrations/github/use-complete-github-callback';

export default function GithubCallbackPage() {
  return (
    <Suspense fallback={<GithubCallbackStatus state={{ status: 'loading' }} />}>
      <GithubCallbackContent />
    </Suspense>
  );
}

function GithubCallbackContent() {
  const { state, returnToPreviousPage } = useCompleteGithubCallback();

  return (
    <GithubCallbackStatus state={state} onBack={returnToPreviousPage} />
  );
}
