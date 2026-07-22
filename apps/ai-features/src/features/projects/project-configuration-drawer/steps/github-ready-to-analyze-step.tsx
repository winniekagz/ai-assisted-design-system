'use client';

import React from 'react';

import { StatusCallout, SummaryRows } from '../shared-components';
import type { SelectedGithubRepository } from '../types';

export function GithubReadyToAnalyzeStep({
  selectedRepo,
  isPending,
}: {
  selectedRepo: SelectedGithubRepository | null;
  isPending?: boolean;
}) {
  return (
    <div className='grid gap-4'>
      <StatusCallout
        tone='info'
        title={isPending ? 'Starting analysis' : 'Ready to Analyze'}
        detail='Component IQ will fetch a temporary snapshot of this repository to detect its project setup. The temporary source workspace is deleted after analysis.'
      />
      <SummaryRows
        rows={[
          ['Repository', selectedRepo?.repositoryFullName ?? 'Not selected'],
          ['Default branch', selectedRepo?.defaultBranch ?? 'Not selected'],
          ['GitHub installation', selectedRepo?.installationAccountLogin ?? 'Not selected'],
          ['Source access', 'Starts only when you choose Analyze repository'],
          ['After analysis', 'Review required before configuration is confirmed'],
        ]}
      />
    </div>
  );
}
