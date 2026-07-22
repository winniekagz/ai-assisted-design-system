'use client';

import { Button, Textarea } from 'componentiq';
import { RefreshCcw } from 'lucide-react';
import { StatusCallout } from '../shared-components';
export function AnalysisFailureStep({
  errorMessage,
  onRetry,
  onDetails,
}: {
  errorMessage: string | null;
  onRetry(): void;
  onDetails(): void;
}) {
  return (
    <div className='grid gap-4'>
      <StatusCallout tone='error' title='Analysis could not be completed' detail='The uploaded source is still available. Retry analysis or review technical details without exposing raw stack traces here.' />
      <Textarea readOnly value={errorMessage ?? 'Analyzer exited before framework detection. Retry usually resolves transient source parsing failures.'} />
      <div className='flex flex-wrap gap-2'>
        <Button type='button' onClick={onRetry} startIcon={<RefreshCcw className='size-4' />}>Retry analysis</Button>
        <Button type='button' variant='outlined' onClick={onDetails}>View technical details</Button>
      </div>
    </div>
  );
}
