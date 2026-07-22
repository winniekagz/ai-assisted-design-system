'use client';

import { Card, CardContent } from 'componentiq';
import { GitBranch } from 'lucide-react';

import type { ProjectRepository } from '@/features/projects/types';

export function RepositoriesPanel({ repositories }: { repositories: ProjectRepository[] }) {
  return (
    <div className='grid gap-3'>
      {repositories.map(repository => (
        <Card key={repository.id} className='rounded-none border-y border-border bg-transparent py-0 shadow-none'>
          <CardContent className='flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h2 className='font-mono text-sm font-semibold text-foreground'>{repository.name}</h2>
              <p className='mt-1 text-sm text-muted-foreground'>
                {repository.branch} · {repository.lastCommit}
              </p>
            </div>
            <span className='inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-background-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground'>
              <GitBranch className='size-3.5' aria-hidden='true' />
              {repository.status}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
