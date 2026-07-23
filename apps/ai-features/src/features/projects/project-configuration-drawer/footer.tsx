import type { GitProviderConnectionSummary } from '@winniekagendo/componentiq-shared-types';
import { Button, SheetFooter } from 'componentiq';
import { ChevronLeft } from 'lucide-react';
import React from 'react';

import { GithubPermissionFooterActions } from './steps/github-permission-step';
import { GithubReadyToAnalyzeFooterActions } from './steps/github-ready-to-analyze-step';
import { GithubRepoPickerFooterActions } from './steps/github-repo-picker-step';
import { GithubReviewFooterActions } from './steps/github-review-step';
import { ReviewSetupFooterActions } from './steps/review-setup-step';
import { SourceChoiceFooterActions } from './steps/source-choice-step';
import { SuccessFooterActions } from './steps/success-step';
import { UploadProgressFooterActions } from './steps/upload-progress-step';
import type { ConfigurationStateId } from './types';
import { previousState } from './utils';

const stackedIconButtonClass = 'h-auto min-h-10 flex-col gap-1 px-3 py-2 text-xs leading-tight';

export function ProjectConfigurationFooter({
  state,
  isConfirming,
  isAnalyzingGithub,
  canReviewGithub,
  githubConnection,
  isGithubConnectionLoading,
  isStartingGithubConnection,
  isDisconnectingGithub,
  onStateChange,
  onClose,
  onConfirm,
  onConfirmGithubRepository,
  onAnalyzeGithubRepository,
  onAuthorizeGithub,
  onContinueToGithubRepos,
  onDisconnectGithub,
}: {
  state: ConfigurationStateId;
  isConfirming: boolean;
  isAnalyzingGithub?: boolean;
  canReviewGithub?: boolean;
  githubConnection?: GitProviderConnectionSummary | null;
  isGithubConnectionLoading?: boolean;
  isStartingGithubConnection?: boolean;
  isDisconnectingGithub?: boolean;
  // eslint-disable-next-line no-unused-vars
  onStateChange(state: ConfigurationStateId): void;
  onClose(): void;
  onConfirm(): void;
  onConfirmGithubRepository(): void;
  onAnalyzeGithubRepository(): void;
  onAuthorizeGithub?(): void;
  onContinueToGithubRepos?(): void;
  // eslint-disable-next-line no-unused-vars
  onDisconnectGithub?(connectionId: string): void;
}) {
  return (
    <SheetFooter className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
      <Button
        type='button'
        variant='outlined'
        className={stackedIconButtonClass}
        startIcon={<ChevronLeft className='size-4' />}
        onClick={() => onStateChange(previousState(state))}
      >
        Back
      </Button>
      <div className='flex flex-wrap justify-end gap-2'>
        {state === 'sourceChoice' && <SourceChoiceFooterActions onClose={onClose} />}
        {state === 'githubPermission' && (
          <GithubPermissionFooterActions
            connection={githubConnection ?? null}
            isLoading={Boolean(isGithubConnectionLoading)}
            isStarting={Boolean(isStartingGithubConnection)}
            isDisconnecting={Boolean(isDisconnectingGithub)}
            onAuthorize={() => onAuthorizeGithub?.()}
            onContinue={() => onContinueToGithubRepos?.()}
            onDisconnect={connectionId => onDisconnectGithub?.(connectionId)}
          />
        )}
        {state === 'githubRepoPicker' && (
          <GithubRepoPickerFooterActions
            canReviewGithub={canReviewGithub}
            onReview={() => onStateChange('githubReview')}
          />
        )}
        {state === 'githubReview' && (
          <GithubReviewFooterActions
            canReviewGithub={canReviewGithub}
            onConfirm={onConfirmGithubRepository}
          />
        )}
        {state === 'githubReadyToAnalyze' && (
          <GithubReadyToAnalyzeFooterActions
            isAnalyzingGithub={isAnalyzingGithub}
            onChangeRepository={() => onStateChange('githubRepoPicker')}
            onAnalyze={onAnalyzeGithubRepository}
          />
        )}
        {state === 'uploading' && <UploadProgressFooterActions />}
        {state === 'reviewSetup' && (
          <ReviewSetupFooterActions
            isConfirming={isConfirming}
            onClose={onClose}
            onConfirm={onConfirm}
          />
        )}
        {state === 'success' && <SuccessFooterActions onClose={onClose} />}
      </div>
    </SheetFooter>
  );
}
