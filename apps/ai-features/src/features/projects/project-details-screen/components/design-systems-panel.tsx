'use client';

import { Card, CardContent } from 'componentiq';
import { Palette } from 'lucide-react';

import { projectDetailsFixture } from '@/features/projects/fixtures/projects';

export function DesignSystemsPanel() {
  const stats = projectDetailsFixture.designSystemStats;

  return (
    <Card className='rounded-none border-y border-border bg-transparent py-0 shadow-none'>
      <CardContent className='px-5 py-5'>
        <div className='flex items-start gap-3'>
          <Palette className='mt-1 size-5 text-primary' aria-hidden='true' />
          <div>
            <h2 className='text-lg font-semibold text-foreground'>{stats.name}</h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Design-system adoption and component compatibility for this project.
            </p>
          </div>
        </div>
        <div className='mt-5 grid gap-3 sm:grid-cols-3'>
          <StatCard label='Coverage' value={`${stats.coverage}%`} />
          <StatCard label='Deprecated components' value={`${stats.deprecated}`} />
          <StatCard label='Outdated components' value={`${stats.outdated}`} />
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-md border border-border bg-background-secondary px-4 py-3'>
      <p className='text-xs font-semibold uppercase tracking-normal text-muted-foreground'>{label}</p>
      <p className='mt-2 text-2xl font-semibold text-foreground'>{value}</p>
    </div>
  );
}
