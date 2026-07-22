import { Button, SheetFooter } from 'componentiq';
import { ChevronLeft, Loader2 } from 'lucide-react';
import React from 'react';

import type { ConfigurationStateId } from './types';
import { previousState } from './utils';

const stackedIconButtonClass = 'h-auto min-h-10 flex-col gap-1 px-3 py-2 text-xs leading-tight';

export function ProjectConfigurationFooter({
  state,
  isConfirming,
  isAnalyzingGithub,
  canReviewGithub,
  onStateChange,
  onClose,
  onConfirm,
  onConfirmGithubRepository,
  onAnalyzeGithubRepository,
}: {
  state: ConfigurationStateId;
  isConfirming: boolean;
  isAnalyzingGithub?: boolean;
  canReviewGithub?: boolean;
  // eslint-disable-next-line no-unused-vars
  onStateChange(state: ConfigurationStateId): void;
  onClose(): void;
  onConfirm(): void;
  onConfirmGithubRepository(): void;
  onAnalyzeGithubRepository(): void;
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
        {state === 'sourceChoice' && (
          <Button type='button' variant='outlined' onClick={onClose}>
            I&apos;ll do this later
          </Button>
        )}
        {state === 'githubRepoPicker' && (
          <Button
            type='button'
            disabled={!canReviewGithub}
            onClick={() => onStateChange('githubReview')}
          >
            Review connection
          </Button>
        )}
        {state === 'githubReview' && (
          <Button
            type='button'
            disabled={!canReviewGithub}
            onClick={onConfirmGithubRepository}
          >
            Confirm repository
          </Button>
        )}
        {state === 'githubReadyToAnalyze' && (
          <>
            <Button type='button' variant='outlined' onClick={() => onStateChange('githubRepoPicker')}>
              Change repository
            </Button>
            <Button
              type='button'
              disabled={isAnalyzingGithub}
              onClick={onAnalyzeGithubRepository}
              startIcon={
                isAnalyzingGithub
                  ? <Loader2 className='size-4 animate-spin' />
                  : undefined
              }
            >
              {isAnalyzingGithub ? 'Analyzing' : 'Analyze repository'}
            </Button>
          </>
        )}
        {state === 'uploading' && (
          <Button type='button' disabled startIcon={<Loader2 className='size-4 animate-spin' />}>
            Uploading
          </Button>
        )}
        {state === 'reviewSetup' && (
          <>
            <Button type='button' variant='outlined' onClick={onClose}>
              Save and review later
            </Button>
            <Button
              type='button'
              disabled={isConfirming}
              onClick={onConfirm}
              startIcon={
                isConfirming
                  ? <Loader2 className='size-4 animate-spin' />
                  : undefined
              }
            >
              {isConfirming ? 'Confirming' : 'Confirm configuration'}
            </Button>
          </>
        )}
        {state === 'success' && (
          <>
            <Button type='button' variant='outlined' onClick={onClose}>
              View project
            </Button>
            <Button type='button' disabled title='Run your first audit from the project page.'>
              Run first audit
            </Button>
          </>
        )}
      </div>
    </SheetFooter>
  );
}
