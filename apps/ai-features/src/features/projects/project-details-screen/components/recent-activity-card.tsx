'use client';

import { Card, CardContent, cn } from 'componentiq';

import type { ProjectActivity } from '@/features/projects/types';

export function RecentActivityCard({ activity }: { activity: ProjectActivity[] }) {
  return (
    <Card className='rounded-none border-y border-border bg-transparent py-0 shadow-none'>
      <CardContent className='px-5 py-5'>
        <h2 className='text-lg font-semibold text-foreground'>Recent activity</h2>
        <div className='mt-4 grid gap-3'>
          {activity.map(item => (
            <div key={item.id} className='flex gap-3 rounded-md border border-border bg-background px-3 py-3'>
              <span className={cn('mt-1 size-2 rounded-full', activityToneClass(item.tone))} aria-hidden='true' />
              <div className='min-w-0'>
                <p className='font-medium text-foreground'>{item.title}</p>
                <p className='mt-1 text-sm text-muted-foreground'>{item.detail}</p>
                <p className='mt-1 text-xs text-muted-foreground'>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function activityToneClass(tone: ProjectActivity['tone']) {
  return {
    error: 'bg-status-error',
    warning: 'bg-status-warning',
    success: 'bg-status-success',
    muted: 'bg-muted-foreground',
  }[tone];
}
