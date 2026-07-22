'use client';

import type {
  GitHubRepositorySummary,
  GitProviderConnectionSummary,
} from '@winniekagendo/componentiq-shared-types';
import { Badge, Button, cn } from 'componentiq';
import { ExternalLink, Loader2, RefreshCcw } from 'lucide-react';
import React from 'react';

export type GithubRepositoryErrorKind =
  | 'inactive'
  | 'revoked'
  | 'invalid-config'
  | 'rate-limit'
  | 'temporary'
  | 'network'
  | 'generic';

const stackedIconButtonClass = 'h-auto min-h-10 flex-col gap-1 px-3 py-2 text-xs leading-tight';

export function GithubConnectionContext({
  connection,
}: {
  connection: Pick<
    GitProviderConnectionSummary,
    'accountLogin' | 'accountType' | 'status'
  > | null;
}) {
  return (
    <div className='rounded-md border border-border bg-background-secondary px-3 py-3 text-sm'>
      <h3 id='github-repository-picker-heading' className='font-medium text-foreground'>
        GitHub repository access
      </h3>
      <p className='mt-1 text-muted-foreground'>
        {connection
          ? `Connected to ${connection.accountLogin}${connection.accountType ? ` (${connection.accountType})` : ''}. Component IQ can only display repositories shared with this GitHub App installation.`
          : 'Connect GitHub before selecting a repository.'}
      </p>
    </div>
  );
}

export function RepositoryLoadingState() {
  return (
    <div
      role='status'
      aria-live='polite'
      className='grid gap-2 rounded-md border border-border bg-background-secondary px-3 py-3'
    >
      {[0, 1, 2].map(index => (
        <div key={index} className='flex items-center gap-3 rounded-md border border-border bg-background px-3 py-3'>
          <Loader2 className='size-4 animate-spin text-muted-foreground' aria-hidden='true' />
          <span className='text-sm text-muted-foreground'>Loading repositories</span>
        </div>
      ))}
    </div>
  );
}

export function RepositoryAutocompleteResults({
  repositories,
  selectedRepoId,
  onSelectRepo,
}: {
  repositories: GitHubRepositorySummary[];
  selectedRepoId: string;
  // eslint-disable-next-line no-unused-vars
  onSelectRepo(repository: GitHubRepositorySummary): void;
}) {
  return (
    <div
      className='grid max-h-72 gap-1 overflow-y-auto rounded-md border border-border bg-background p-1'
      role='listbox'
      aria-label='Accessible GitHub repositories'
    >
      {repositories.map(repository => (
        <RepositoryOption
          key={repository.id}
          repository={repository}
          selected={selectedRepoId === repository.id}
          onSelectRepo={onSelectRepo}
        />
      ))}
    </div>
  );
}

function RepositoryOption({
  repository,
  selected,
  onSelectRepo,
}: {
  repository: GitHubRepositorySummary;
  selected: boolean;
  // eslint-disable-next-line no-unused-vars
  onSelectRepo(repository: GitHubRepositorySummary): void;
}) {
  return (
    <button
      type='button'
      role='option'
      aria-selected={selected}
      aria-label={`${selected ? 'Selected repository' : 'Select repository'} ${repository.fullName}`}
      onClick={() => onSelectRepo(repository)}
      className={cn(
        'flex w-full flex-col gap-2 rounded-sm px-3 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex-row sm:items-center sm:justify-between',
        selected ? 'bg-primary-50' : 'hover:bg-background-secondary'
      )}
    >
      <span>
        <span className='block font-mono text-sm font-semibold text-foreground'>
          {repository.name}
        </span>
        <span className='mt-1 block text-xs text-muted-foreground'>
          {repository.owner} · default {repository.defaultBranch} · updated{' '}
          {formatUpdatedAt(repository.updatedAt)}
        </span>
      </span>
      <Badge status={repository.private ? 'warning' : 'success'}>
        {repository.private ? 'Private' : 'Public'}
      </Badge>
    </button>
  );
}

export function SelectedRepositorySummary({
  repository,
  isUnavailable,
  onChangeRepository,
}: {
  repository: GitHubRepositorySummary;
  isUnavailable: boolean;
  onChangeRepository(): void;
}) {
  return (
    <div className='grid gap-2 rounded-md border border-border bg-background px-3 py-3'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <p className='text-xs font-medium uppercase text-muted-foreground'>
            Selected repository
          </p>
          <p className='mt-1 font-mono text-sm font-semibold text-foreground'>
            {repository.fullName}
          </p>
          <p className='mt-1 text-xs text-muted-foreground'>
            {repository.private ? 'Private' : 'Public'} · default{' '}
            {repository.defaultBranch} · updated {formatUpdatedAt(repository.updatedAt)}
          </p>
        </div>
        <Button type='button' variant='outlined' onClick={onChangeRepository}>
          Change
        </Button>
      </div>
      {isUnavailable && (
        <p className='rounded-sm border border-status-warning bg-status-warning-bg px-3 py-2 text-sm text-muted-foreground'>
          <span className='font-medium text-foreground'>
            This repository is not currently visible.
          </span>{' '}
          It may no longer be shared with this GitHub App installation.
        </p>
      )}
    </div>
  );
}

export function RepositoryAccessEmptyState({
  configureUrl,
  isRefreshing,
  onConfigureAccess,
  onRefresh,
}: {
  configureUrl: string | null;
  isRefreshing: boolean;
  onConfigureAccess(): void;
  onRefresh(): void;
}) {
  return (
    <RepositoryAccessHelp
      title='No repositories are accessible'
      detail='Component IQ is connected to GitHub, but this installation does not currently have access to any repositories.'
      configureUrl={configureUrl}
      isRefreshing={isRefreshing}
      onConfigureAccess={onConfigureAccess}
      onRefresh={onRefresh}
    />
  );
}

export function RepositorySearchEmptyState({
  query,
  configureUrl,
  isRefreshing,
  onConfigureAccess,
  onClearSearch,
  onRefresh,
}: {
  query: string;
  configureUrl: string | null;
  isRefreshing: boolean;
  onConfigureAccess(): void;
  onClearSearch(): void;
  onRefresh(): void;
}) {
  return (
    <div className='grid gap-3 rounded-md border border-border bg-background-secondary px-3 py-4 text-sm'>
      <div>
        <p className='font-medium text-foreground'>
          No repositories match &ldquo;{query}&rdquo;
        </p>
        <p className='mt-1 text-muted-foreground'>
          The repository may not have been shared with the Component IQ GitHub App.
        </p>
      </div>
      <RepositoryPickerActions
        configureUrl={configureUrl}
        isRefreshing={isRefreshing}
        onConfigureAccess={onConfigureAccess}
        onRefresh={onRefresh}
        onClearSearch={onClearSearch}
      />
    </div>
  );
}

function RepositoryAccessHelp({
  title,
  detail,
  configureUrl,
  isRefreshing,
  onConfigureAccess,
  onRefresh,
}: {
  title: string;
  detail: string;
  configureUrl: string | null;
  isRefreshing: boolean;
  onConfigureAccess(): void;
  onRefresh(): void;
}) {
  return (
    <div className='grid gap-3 rounded-md border border-border bg-background-secondary px-3 py-4 text-sm'>
      <div>
        <p className='font-medium text-foreground'>{title}</p>
        <p className='mt-1 text-muted-foreground'>{detail}</p>
        <p className='mt-2 text-muted-foreground'>
          Repository access is managed in GitHub. Grant Component IQ access to one
          or more repositories, then return here and refresh.
        </p>
      </div>
      <RepositoryPickerActions
        configureUrl={configureUrl}
        isRefreshing={isRefreshing}
        onConfigureAccess={onConfigureAccess}
        onRefresh={onRefresh}
      />
    </div>
  );
}

export function RepositoryErrorState({
  errorKind,
  errorMessage,
  configureUrl,
  onConfigureAccess,
  onReconnectGithub,
  onRetry,
}: {
  errorKind?: GithubRepositoryErrorKind;
  errorMessage: string | null;
  configureUrl: string | null;
  onConfigureAccess(): void;
  onReconnectGithub(): void;
  onRetry(): void;
}) {
  const copy = getErrorCopy(errorKind, errorMessage);

  return (
    <div
      role='alert'
      className='grid gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-4 text-sm'
    >
      <div>
        <p className='font-medium text-foreground'>{copy.title}</p>
        <p className='mt-1 text-muted-foreground'>{copy.detail}</p>
      </div>
      <div className='flex flex-col gap-2 sm:flex-row'>
        {(errorKind === 'inactive' || errorKind === 'revoked') && (
          <Button type='button' onClick={onReconnectGithub}>
            Reconnect GitHub
          </Button>
        )}
        {(errorKind === 'inactive' || errorKind === 'revoked') && configureUrl && (
          <Button
            type='button'
            variant='outlined'
            className={stackedIconButtonClass}
            startIcon={<ExternalLink className='size-4' />}
            onClick={onConfigureAccess}
          >
            Configure GitHub access
          </Button>
        )}
        <Button type='button' variant='outlined' onClick={onRetry}>
          <RefreshCcw className='mr-2 size-4' aria-hidden='true' />
          Retry
        </Button>
      </div>
    </div>
  );
}

export function RepositoryPickerActions({
  configureUrl,
  isRefreshing,
  onConfigureAccess,
  onRefresh,
  onClearSearch,
}: {
  configureUrl: string | null;
  isRefreshing: boolean;
  onConfigureAccess(): void;
  onRefresh(): void;
  onClearSearch?: () => void;
}) {
  return (
    <div className='flex flex-col gap-2 sm:flex-row'>
      <Button
        type='button'
        className={stackedIconButtonClass}
        disabled={!configureUrl}
        startIcon={<ExternalLink className='size-4' />}
        onClick={onConfigureAccess}
      >
        Configure GitHub access
      </Button>
      {onClearSearch && (
        <Button type='button' variant='outlined' onClick={onClearSearch}>
          Clear search
        </Button>
      )}
      <Button
        type='button'
        variant='outlined'
        disabled={isRefreshing}
        onClick={onRefresh}
      >
        <RefreshCcw
          className={cn('mr-2 size-4', isRefreshing && 'animate-spin')}
          aria-hidden='true'
        />
        {isRefreshing ? 'Refreshing' : 'Refresh repositories'}
      </Button>
    </div>
  );
}

function getErrorCopy(
  errorKind: GithubRepositoryErrorKind | undefined,
  errorMessage: string | null
) {
  if (errorKind === 'inactive' || errorKind === 'revoked') {
    return {
      title: 'GitHub access needs attention',
      detail:
        'The GitHub App installation may have been removed or its permissions changed.',
    };
  }

  if (errorKind === 'invalid-config') {
    return {
      title: 'GitHub connection is not configured',
      detail:
        'The GitHub App settings need to be completed before repositories can be listed.',
    };
  }

  if (errorKind === 'rate-limit') {
    return {
      title: 'GitHub is temporarily limiting requests',
      detail: 'Wait a moment, then refresh the repository list.',
    };
  }

  if (errorKind === 'temporary' || errorKind === 'network') {
    return {
      title: 'We could not load your repositories',
      detail: 'Your connection is still saved. Try loading the list again.',
    };
  }

  return {
    title: 'We could not load your repositories',
    detail:
      errorMessage && !errorMessage.toLowerCase().includes('github')
        ? errorMessage
        : 'Your connection is still saved. Try loading the list again.',
  };
}

function formatUpdatedAt(updatedAt: string | null) {
  if (!updatedAt) return 'unknown';

  try {
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(updatedAt));
  } catch {
    return 'unknown';
  }
}
