'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'componentiq';
import { ChevronDown } from 'lucide-react';

import { projectStatuses } from '@/features/projects/fixtures/projects';
import type { ProjectStatus } from '@/features/projects/types';

const statusLabels: Record<ProjectStatus, string> = {
  healthy: 'Healthy',
  needs_attention: 'Needs Attention',
  blocked: 'Blocked',
  not_configured: 'Not Configured',
  archived: 'Archived',
};

export function StatusFilter({
  status,
  onSelect,
}: {
  status: ProjectStatus | 'all';
  // eslint-disable-next-line no-unused-vars
  onSelect(status: ProjectStatus | 'all'): void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type='button' variant='outlined' size='sm' endIcon={<ChevronDown className='size-4' />}>
          Status: {status === 'all' ? 'All' : statusLabels[status]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={status === 'all'} onCheckedChange={() => onSelect('all')}>
          All statuses
        </DropdownMenuCheckboxItem>
        {projectStatuses.map(projectStatus => (
          <DropdownMenuCheckboxItem
            key={projectStatus}
            checked={status === projectStatus}
            onCheckedChange={() => onSelect(projectStatus)}
          >
            {statusLabels[projectStatus]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
