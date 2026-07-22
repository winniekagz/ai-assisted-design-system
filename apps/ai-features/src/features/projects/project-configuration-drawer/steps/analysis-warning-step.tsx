'use client';

import { Button } from 'componentiq';
import { StatusCallout } from '../shared-components';
export function AnalysisWarningStep({
  onDetails,
  onContinue,
}: {
  onDetails(): void;
  onContinue(): void;
}) {
  return (
    <div className='grid gap-4'>
      <StatusCallout tone='warning' title='Analysis completed with warnings' detail='ComponentIQ detected a project setup but a few paths need review before audits are enabled.' />
      <div className='flex flex-wrap gap-2'>
        <Button type='button' variant='outlined' onClick={onDetails}>View details</Button>
        <Button type='button' onClick={onContinue}>Continue to review</Button>
      </div>
    </div>
  );
}
