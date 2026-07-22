'use client';

import { AnalysisLoadingState } from '@/features/loading';

import { StatusCallout } from '../shared-components';

export function AnalysisProgressStep({
  source,
}: {
  source: 'github' | 'local';
  onWarning(): void;
  onFailure(): void;
  onReview(): void;
}) {
  const title = source === 'github' ? 'Fetching repository' : 'Analyzing source';
  const detail =
    source === 'github'
      ? 'Creating a temporary snapshot from GitHub.'
      : 'Inspecting frameworks, package configuration and design-system paths.';

  return (
    <div className='grid gap-4'>
      <div className='rounded-md border border-border bg-background px-4 py-6'>
        <AnalysisLoadingState title={title} description={detail} progress={0} />
      </div>
      <StatusCallout
        tone='info'
        title='You can leave this page'
        detail='Analysis can be resumed from the project while Component IQ keeps the backend job as the source of truth.'
      />
    </div>
  );
}
