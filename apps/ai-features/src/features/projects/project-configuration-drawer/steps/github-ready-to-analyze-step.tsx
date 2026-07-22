'use client';

import React from 'react';

import { StatusCallout, SummaryRows } from '../shared-components';
import type { SelectedGithubRepository } from '../types';

export function GithubReadyToAnalyzeStep({
  selectedRepo,
}: {
  selectedRepo: SelectedGithubRepository | null;
}) {
  return (
    <div className='grid gap-4'>
      <StatusCallout
        tone='info'
        title='Ready to Analyze'
        detail='The repository selection has been saved to this setup draft. Source download and analysis are not started in this step.'
      />
      <SummaryRows
        rows={[
          ['Repository', selectedRepo?.repositoryFullName ?? 'Not selected'],
          ['Default branch', selectedRepo?.defaultBranch ?? 'Not selected'],
          ['GitHub installation', selectedRepo?.installationAccountLogin ?? 'Not selected'],
          ['Source code downloaded', 'No'],
          ['Files stored', 'No'],
          ['Configuration job created', 'No'],
        ]}
      />
    </div>
  );
}
