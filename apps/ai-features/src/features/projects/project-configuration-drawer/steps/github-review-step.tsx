'use client';

import { Button } from 'componentiq';
import React from 'react';

import { StatusCallout, SummaryRows } from '../shared-components';
import type { ConfigurationFormValues, SelectedGithubRepository } from '../types';

export function GithubReviewStep({
  selectedRepo,
  values,
  onChangeRepository,
}: {
  selectedRepo: SelectedGithubRepository | null;
  values: ConfigurationFormValues;
  onChangeRepository(): void;
}) {
  return (
    <div className='grid gap-4'>
      <StatusCallout
        tone='info'
        title='Review repository'
        detail='Confirm the selected repository metadata before analysis is enabled. ComponentIQ has not downloaded source code.'
      />
      <SummaryRows
        rows={[
          ['Repository name', selectedRepo?.repositoryName ?? values.repository],
          ['Owner', selectedRepo?.repositoryOwner ?? values.githubAccount],
          ['Default branch', selectedRepo?.defaultBranch ?? values.branch],
          ['Visibility', selectedRepo ? (selectedRepo.private ? 'Private' : 'Public') : 'Not selected'],
          ['Last updated', formatUpdatedAt(selectedRepo?.updatedAt ?? null)],
          ['Estimated repository size', formatRepositorySize(selectedRepo?.sizeKb ?? null)],
          ['Connected GitHub installation', selectedRepo?.installationAccountLogin ?? 'Not selected'],
        ]}
      />
      <div>
        <Button type='button' variant='outlined' onClick={onChangeRepository}>
          Change repository
        </Button>
      </div>
    </div>
  );
}

function formatUpdatedAt(updatedAt: string | null) {
  if (!updatedAt) return 'Unknown';

  try {
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(updatedAt));
  } catch {
    return 'Unknown';
  }
}

function formatRepositorySize(sizeKb: number | null) {
  if (typeof sizeKb !== 'number') return 'Not available';
  if (sizeKb < 1024) return `${sizeKb.toLocaleString()} KB`;

  return `${(sizeKb / 1024).toFixed(1)} MB`;
}
