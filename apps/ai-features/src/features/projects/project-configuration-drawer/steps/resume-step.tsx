'use client';

import { Button } from 'componentiq';

import { StatusCallout } from '../shared-components';
export function ResumeStep({
  onResume,
  onRestart,
}: {
  onResume(): void;
  onRestart(): void;
}) {
  return (
    <div className='grid gap-4'>
      <StatusCallout tone='info' title='Resume configuration' detail='Upload complete, analysis pending. Continue from the interrupted state instead of restarting.' />
      <div className='flex flex-wrap gap-2'>
        <Button type='button' onClick={onResume}>Resume setup</Button>
        <Button type='button' variant='outlined' onClick={onRestart}>Start over</Button>
      </div>
    </div>
  );
}
