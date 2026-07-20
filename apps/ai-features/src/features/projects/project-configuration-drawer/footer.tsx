import { Button, SheetFooter } from 'componentiq';
import { ChevronLeft, Loader2 } from 'lucide-react';

import type { ConfigurationStateId } from './types';
import { previousState } from './utils';

export function ProjectConfigurationFooter({
  state,
  isConfirming,
  onStateChange,
  onClose,
  onConfirm,
}: {
  state: ConfigurationStateId;
  isConfirming: boolean;
  // eslint-disable-next-line no-unused-vars
  onStateChange(state: ConfigurationStateId): void;
  onClose(): void;
  onConfirm(): void;
}) {
  return (
    <SheetFooter className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
      <Button type='button' variant='outlined' onClick={() => onStateChange(previousState(state))}>
        <ChevronLeft className='mr-2 size-4' aria-hidden='true' />
        Back
      </Button>
      <div className='flex flex-wrap justify-end gap-2'>
        {state === 'sourceChoice' && (
          <Button type='button' variant='outlined' onClick={onClose}>
            I&apos;ll do this later
          </Button>
        )}
        {state === 'githubRepoPicker' && (
          <Button type='button' onClick={() => onStateChange('githubReview')}>
            Review connection
          </Button>
        )}
        {state === 'githubReview' && (
          <Button type='button' onClick={() => onStateChange('analyzing')}>
            Connect and analyze
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
