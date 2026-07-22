'use client';

import { Button } from 'componentiq';
import { Clock, Settings } from 'lucide-react';

import {
  ConfigurationStatusBadge,
  type ProjectConfigurationStatus,
} from '@/features/projects/project-configuration-drawer';
import type { ProjectRow } from '@/features/projects/types';

import { setupActionLabelForStatus } from './project-setup-card';

export function ProjectDetailHeader({
  project,
  role,
  configurationStatus,
  configurationComplete,
  lastAudited,
  onConfigureProject,
  onOpenSettings,
  onRunAudit,
}: {
  project: ProjectRow;
  role: string;
  configurationStatus: ProjectConfigurationStatus;
  configurationComplete: boolean;
  lastAudited: string;
  onConfigureProject(): void;
  onOpenSettings(): void;
  onRunAudit(): void;
}) {
  return (
    <header className='border-b border-border bg-transparent pb-5'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <h1 className='text-3xl font-semibold leading-tight text-foreground'>
              {project.name}
            </h1>
            <ConfigurationStatusBadge status={configurationStatus} />
          </div>
          <p className='mt-3 max-w-3xl text-sm leading-6 text-muted-foreground'>
            {project.description}
          </p>
          <dl className='mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground'>
            <MetaItem label='Team' value={role === 'ENGINEER' ? 'Your project access' : project.team} />
            <MetaItem label='Repositories' value={`${project.repoCount}`} />
            <MetaItem label='Design system' value={project.designSystem.label} />
            <MetaItem label='Last audited' value={lastAudited} />
          </dl>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button type='button' variant='outlined' onClick={onOpenSettings} startIcon={<Settings className='size-4' />}>
            Project settings
          </Button>
          {configurationComplete ? (
            <Button
              type='button'
              disabled
              title='Audit execution is coming in a later slice.'
              onClick={onRunAudit}
              startIcon={<Clock className='size-4' />}
            >
              Run first audit
            </Button>
          ) : configurationStatus !== 'ARCHIVED' ? (
            <Button type='button' onClick={onConfigureProject} startIcon={<Settings className='size-4' />}>
              {setupActionLabelForStatus(configurationStatus)}
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex gap-1.5'>
      <dt className='font-medium text-foreground'>{label}:</dt>
      <dd>{value}</dd>
    </div>
  );
}
