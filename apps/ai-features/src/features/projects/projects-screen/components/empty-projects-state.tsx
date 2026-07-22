'use client';

import { Button, EmptyState } from 'componentiq';
import { FolderKanban, Plus } from 'lucide-react';

export function EmptyProjectsState({
  onCreateProject,
}: {
  onCreateProject(): void;
}) {
  return (
    <EmptyState
      icon={<FolderKanban className='size-6' />}
      title='No projects yet'
      description='Create a project to connect repositories, design-system rules, and audit workflows.'
    >
      <div className='flex flex-wrap justify-center gap-2'>
        <Button type='button' onClick={onCreateProject} startIcon={<Plus className='size-4' />}>
          Create project
        </Button>
      </div>
    </EmptyState>
  );
}
