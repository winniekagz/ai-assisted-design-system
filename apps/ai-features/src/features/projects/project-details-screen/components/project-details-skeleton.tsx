'use client';

import { Skeleton } from 'componentiq';

export function ProjectDetailsSkeleton() {
  return (
    <main className='grid min-w-0 gap-4' aria-label='Loading project'>
      <div className='flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-start lg:justify-between'>
        <div className='grid w-full max-w-2xl gap-3'>
          <Skeleton className='h-9 w-64' />
          <Skeleton className='h-5 w-full max-w-lg' />
          <Skeleton className='h-4 w-80' />
        </div>
        <div className='flex gap-2'>
          <Skeleton className='h-10 w-32' />
          <Skeleton className='h-10 w-28' />
        </div>
      </div>
      <Skeleton className='h-24 w-full' />
      <Skeleton className='h-64 w-full' />
    </main>
  );
}
