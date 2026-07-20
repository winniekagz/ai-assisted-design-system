'use client';

import { Skeleton } from 'componentiq';

import { ProjectsTableSkeleton } from './projects-table';

export function ProjectsSkeleton() {
  return (
    <div className='grid gap-5' aria-label='Loading projects'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div className='grid w-full max-w-3xl gap-3'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-10 w-72' />
          <Skeleton className='h-5 w-full max-w-xl' />
        </div>
        <div className='flex gap-2'>
          <Skeleton className='h-10 w-28' />
          <Skeleton className='h-10 w-24' />
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-5 border-b border-border'>
        {[120, 104, 148, 104].map((width, index) => (
          <Skeleton key={index} className='mb-[-1px] h-10 rounded-none' style={{ width }} />
        ))}
      </div>

      <section className='border-y border-border bg-transparent'>
        <div className='px-0'>
          <div className='flex flex-col gap-3 border-b border-border px-4 py-4 lg:flex-row lg:items-center lg:justify-between'>
            <Skeleton className='h-10 w-full min-w-0 flex-1' />
            <div className='flex flex-wrap gap-2'>
              {[88, 84, 136, 112, 104].map((width, index) => (
                <Skeleton key={index} className='h-10 rounded-md' style={{ width }} />
              ))}
            </div>
          </div>
          <ProjectsTableSkeleton />
          <div className='flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between'>
            <Skeleton className='h-4 w-44' />
            <div className='flex items-center gap-2'>
              <Skeleton className='h-8 w-20 rounded-md' />
              <Skeleton className='h-8 w-24 rounded-md' />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
