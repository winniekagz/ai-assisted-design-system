'use client';

import type { ProjectConfigurationSummary } from '@winniekagendo/componentiq-shared-types';
import { Button, Card, CardContent, EmptyState } from 'componentiq';
import { CheckCircle2, GitBranch, Settings } from 'lucide-react';
import React from 'react';

import { formatDate } from '@/shared/format-date';

export function ReadyProjectOverview({
  configuration,
  onReviewConfiguration,
}: {
  configuration: ProjectConfigurationSummary;
  onReviewConfiguration(): void;
}) {
  const confirmed = configuration.confirmedConfiguration;
  const source = configuration.projectSource;

  if (!confirmed) {
    return (
      <EmptyState
        icon={<Settings className='size-5' />}
        title='Confirmed configuration unavailable'
        description='Refresh this project to load the confirmed setup.'
      />
    );
  }

  return (
    <div className='grid gap-4'>
      <Card className='rounded-md border-status-success bg-status-success-bg shadow-none'>
        <CardContent className='flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between'>
          <div className='flex gap-3'>
            <CheckCircle2 className='mt-0.5 size-5 shrink-0 text-status-success' />
            <div>
              <h2 className='text-lg font-semibold text-foreground'>
                Project setup complete
              </h2>
              <p className='mt-1 max-w-3xl text-sm leading-6 text-muted-foreground'>
                Component IQ has a confirmed project configuration for future
                audits. Audit execution is coming next.
              </p>
            </div>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button type='button' variant='outlined' onClick={onReviewConfiguration}>
              Review configuration
            </Button>
            <Button type='button' disabled title='Audit execution is not available in this slice.'>
              Run first audit
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className='grid gap-4 lg:grid-cols-[1fr_0.9fr]'>
        <Card className='rounded-md shadow-none'>
          <CardContent className='px-5 py-5'>
            <h2 className='text-base font-semibold text-foreground'>
              Confirmed configuration
            </h2>
            <dl className='mt-4 grid gap-3 text-sm'>
              <SummaryItem label='Framework' value={confirmed.framework} />
              <SummaryItem label='Language' value={confirmed.language} />
              <SummaryItem label='Package manager' value={confirmed.packageManager} />
              <SummaryItem label='Styling' value={confirmed.stylingSystem} />
              <SummaryItem label='Project root' value={confirmed.projectRoot} />
              <SummaryItem
                label='Component paths'
                value={confirmed.componentPaths.join(', ') || null}
              />
              <SummaryItem
                label='Token paths'
                value={confirmed.tokenPaths.join(', ') || null}
              />
            </dl>
          </CardContent>
        </Card>

        <Card className='rounded-md shadow-none'>
          <CardContent className='px-5 py-5'>
            <div className='flex items-center gap-2'>
              <GitBranch className='size-4 text-muted-foreground' />
              <h2 className='text-base font-semibold text-foreground'>
                Connected source
              </h2>
            </div>
            <dl className='mt-4 grid gap-3 text-sm'>
              <SummaryItem label='Source type' value={sourceLabel(source?.type)} />
              <SummaryItem
                label='Repository'
                value={source?.repositoryFullName ?? source?.originalName ?? null}
              />
              <SummaryItem label='Branch' value={source?.selectedBranch} />
              <SummaryItem
                label='Commit'
                value={shortCommit(source?.latestCommitSha)}
                title={source?.latestCommitSha ?? undefined}
              />
              <SummaryItem
                label='Configured'
                value={formatDate(confirmed.confirmedAt)}
              />
              <SummaryItem
                label='Source snapshot'
                value={source?.sourceSnapshotId ?? null}
              />
            </dl>
          </CardContent>
        </Card>
      </div>

      {confirmed.notes && (
        <Card className='rounded-md shadow-none'>
          <CardContent className='px-5 py-5'>
            <h2 className='text-base font-semibold text-foreground'>Review notes</h2>
            <p className='mt-2 text-sm leading-6 text-muted-foreground'>
              {confirmed.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SummaryItem({
  label,
  value,
  title,
}: {
  label: string;
  value: string | null | undefined;
  title?: string;
}) {
  return (
    <div className='grid gap-1 sm:grid-cols-[140px_1fr]'>
      <dt className='font-medium text-muted-foreground'>{label}</dt>
      <dd className='min-w-0 break-words text-foreground' title={title}>
        {value || 'Not configured'}
      </dd>
    </div>
  );
}

function shortCommit(commit: string | null | undefined) {
  return commit ? commit.slice(0, 12) : null;
}

function sourceLabel(sourceType: string | null | undefined) {
  if (sourceType === 'GITHUB_REPOSITORY') return 'GitHub repository';
  if (sourceType === 'LOCAL_UPLOAD') return 'Local upload';

  return sourceType ?? null;
}
