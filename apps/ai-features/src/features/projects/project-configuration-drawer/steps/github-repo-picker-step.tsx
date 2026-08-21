'use client';

import type {
  GitHubRepositorySummary,
  GitProviderConnectionSummary,
} from '@winniekagendo/componentiq-shared-types';
import { Button, Input, cn } from 'componentiq';
import { RefreshCcw, Search } from 'lucide-react';
import React from 'react';
import type { UseFormRegister } from 'react-hook-form';

import { getGithubRepositoryPickerState } from '../github-repository-picker-state';
import type { ConfigurationFormValues } from '../types';

import {
  GithubConnectionContext,
  type GithubRepositoryErrorKind,
  RepositoryAccessEmptyState,
  RepositoryAutocompleteResults,
  RepositoryErrorState,
  RepositoryLoadingState,
  RepositorySearchEmptyState,
  SelectedRepositorySummary,
} from './github-repo-picker-parts';

export function GithubRepoPickerFooterActions({
  canReviewGithub,
  onReview,
}: {
  canReviewGithub?: boolean;
  onReview(): void;
}) {
  return (
    <Button type='button' disabled={!canReviewGithub} onClick={onReview}>
      Review connection
    </Button>
  );
}

export function GithubRepoPickerStep({
  repoSearch,
  onRepoSearch,
  repositories,
  selectedRepoId,
  onSelectRepo,
  register,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onRefresh,
  onConfigureAccess,
  onReconnectGithub,
  onClearSearch,
  onChangeRepository,
  nextCursor,
  isFetching,
  isRefreshing,
  onNextPage,
  connection,
  configureUrl,
  errorKind,
  selectedRepository,
}: {
  repoSearch: string;
  // eslint-disable-next-line no-unused-vars
  onRepoSearch(value: string): void;
  repositories: GitHubRepositorySummary[];
  selectedRepoId: string;
  // eslint-disable-next-line no-unused-vars
  onSelectRepo(repository: GitHubRepositorySummary): void;
  register: UseFormRegister<ConfigurationFormValues>;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  onRetry(): void;
  onRefresh(): void;
  onConfigureAccess(): void;
  onReconnectGithub(): void;
  onClearSearch(): void;
  onChangeRepository(): void;
  nextCursor: string | null;
  isFetching: boolean;
  isRefreshing: boolean;
  onNextPage(): void;
  connection: Pick<
    GitProviderConnectionSummary,
    'accountLogin' | 'accountType' | 'status'
  > | null;
  configureUrl: string | null;
  errorKind?: GithubRepositoryErrorKind;
  selectedRepository: GitHubRepositorySummary | null;
}) {
  const pickerState = getGithubRepositoryPickerState({
    repositories,
    search: repoSearch,
    isLoading,
    isError,
  });
  const selectedRepositoryUnavailable =
    Boolean(selectedRepository) &&
    Boolean(selectedRepoId) &&
    !repositories.some(repository => repository.id === selectedRepoId);
  const isChoosingRepository = !selectedRepository;

  return (
    <section className='grid gap-4' aria-labelledby='github-repository-picker-heading'>
      <GithubConnectionContext connection={connection} />
      {selectedRepository ? (
        <SelectedRepositorySummary
          repository={selectedRepository}
          isUnavailable={selectedRepositoryUnavailable}
          onChangeRepository={onChangeRepository}
        />
      ) : (
        <div className='grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end'>
          <Input
            label='Search repositories'
            value={repoSearch}
            onChange={event => onRepoSearch(event.target.value)}
            startIcon={<Search className='size-4 text-muted-foreground' />}
          />
          <Button
            type='button'
            variant='outlined'
            disabled={isRefreshing || isLoading}
            onClick={onRefresh}
          >
            <RefreshCcw
              className={cn('mr-2 size-4', isRefreshing && 'animate-spin')}
              aria-hidden='true'
            />
            {isRefreshing ? 'Refreshing' : 'Refresh repositories'}
          </Button>
        </div>
      )}

      {isChoosingRepository && pickerState.status === 'loading' && (
        <RepositoryLoadingState />
      )}

      {isChoosingRepository && pickerState.status === 'failure' && (
        <RepositoryErrorState
          errorKind={errorKind}
          errorMessage={errorMessage}
          configureUrl={configureUrl}
          onConfigureAccess={onConfigureAccess}
          onReconnectGithub={onReconnectGithub}
          onRetry={onRetry}
        />
      )}

      {isChoosingRepository && pickerState.status === 'access-empty' && (
        <RepositoryAccessEmptyState
          configureUrl={configureUrl}
          isRefreshing={isRefreshing}
          onConfigureAccess={onConfigureAccess}
          onRefresh={onRefresh}
        />
      )}

      {isChoosingRepository && pickerState.status === 'search-empty' && (
        <RepositorySearchEmptyState
          query={repoSearch.trim()}
          configureUrl={configureUrl}
          isRefreshing={isRefreshing}
          onConfigureAccess={onConfigureAccess}
          onClearSearch={onClearSearch}
          onRefresh={onRefresh}
        />
      )}

      {isChoosingRepository && pickerState.status === 'success' && (
        <div className='grid gap-3'>
          <RepositoryAutocompleteResults
            repositories={pickerState.repositories}
            selectedRepoId={selectedRepoId}
            onSelectRepo={onSelectRepo}
          />
          {nextCursor && (
            <Button
              type='button'
              variant='outlined'
              disabled={isFetching}
              onClick={onNextPage}
            >
              {isFetching ? 'Loading' : 'Next page'}
            </Button>
          )}
        </div>
      )}

      <div className='grid gap-3 sm:grid-cols-2'>
        <Input label='Branch' {...register('branch')} />
        <Input label='Project path' placeholder='/' {...register('projectRoot')} />
      </div>
    </section>
  );
}
