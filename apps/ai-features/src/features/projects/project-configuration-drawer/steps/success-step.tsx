'use client';

import { CheckCircle2 } from 'lucide-react';
export function SuccessStep({ projectName }: { projectName: string }) {
  return (
    <div className='grid gap-4 text-center'>
      <div className='rounded-md border border-status-success bg-status-success-bg px-4 py-6'>
        <CheckCircle2 className='mx-auto size-8 text-status-success' aria-hidden='true' />
        <h3 className='mt-3 text-lg font-semibold text-foreground'>Project configured</h3>
        <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground'>
          {projectName} has connected source information and saved detected setup.
        </p>
      </div>
    </div>
  );
}
