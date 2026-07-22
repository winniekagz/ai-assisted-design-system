'use client';

import { Button } from 'componentiq';
import { Plus } from 'lucide-react';

export function ProjectsHeader({
  organizationName,
  role,
  onCreateProject,
}: {
  organizationName: string;
  role: string;
  onCreateProject(): void;
}) {
  return (
    <header className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
      <div className='max-w-3xl'>
        <p className='text-sm font-medium uppercase tracking-normal text-primary'>
          {organizationName} · {role.toLowerCase()}
        </p>
        <h1 className='mt-2 text-3xl font-semibold leading-tight text-foreground md:text-4xl'>
          Projects
        </h1>
        <p className='mt-3 text-sm leading-6 text-muted-foreground md:text-base'>
          Manage engineering projects connected to ComponentIQ, review release readiness, and open the
          surfaces that need attention.
        </p>
      </div>
      <div className='flex flex-wrap gap-2'>
        <Button type='button' onClick={onCreateProject} startIcon={<Plus className='size-4' />}>
          New project
        </Button>
      </div>
    </header>
  );
}
