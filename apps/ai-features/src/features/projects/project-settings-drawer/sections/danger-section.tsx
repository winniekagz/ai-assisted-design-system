import {
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Select,
  Switch,
  Textarea,
  cn,
} from 'componentiq';
import { Archive, ChevronDown, Github, Trash2 } from 'lucide-react';

import type { ProjectRow } from '@/features/projects/types';
import {
  settingsIntegrationsFixture,
  settingsMetadataFixture,
  settingsRepositoriesFixture,
  settingsRulesFixture,
  settingsTeamOptions,
  statusExplanations,
  type ProjectSettingsForm,
} from '@/features/projects/fixtures/settings';

import {
  DangerRow,
  Meta,
  SectionHeading,
  Stat,
  StatusBadge,
} from '../components';
import { statusOptions, type UpdateProjectSettingsForm } from '../types';

export function DangerSection({
  project,
  deleteText,
  onDeleteTextChange,
  onArchive,
}: {
  project: ProjectRow;
  deleteText: string;
  // eslint-disable-next-line no-unused-vars
  onDeleteTextChange(value: string): void;
  onArchive(): void;
}) {
  const deleteEnabled = deleteText === project.name;

  return (
    <div>
      <SectionHeading title='Danger Zone' description='Actions here affect project lifecycle and require deliberate confirmation.' />
      <div className='grid gap-3'>
        <DangerRow
          title='Archive project'
          description='Hide this project from active workflows while keeping history available.'
          action={<Button type='button' variant='outlined' onClick={onArchive} startIcon={<Archive className='size-4' />}>Archive</Button>}
        />
        <DangerRow
          title='Transfer project'
          description='Move ownership to another team while preserving repository connections and audit history.'
          action={<Button type='button' variant='outlined' disabled title='Transfer endpoint is not available yet.'>Transfer</Button>}
        />
        <div className='rounded-md border border-status-error bg-status-error-bg p-4'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
            <div>
              <h3 className='text-sm font-semibold text-foreground'>Delete project</h3>
              <p className='mt-1 text-sm text-muted-foreground'>
                Permanently deletes all findings, audit history, and rule overrides. Repositories themselves are not affected. This cannot be undone.
              </p>
              <label className='mt-4 block text-sm font-medium text-foreground' htmlFor='delete-project-confirm'>
                Type {project.name} to confirm
              </label>
              <Input
                id='delete-project-confirm'
                className='mt-2 bg-background'
                value={deleteText}
                onChange={event => onDeleteTextChange(event.target.value)}
              />
            </div>
            <Button
              type='button'
              variant='destructive'
              disabled={!deleteEnabled}
              title='Delete endpoint is not available yet.'
              startIcon={<Trash2 className='size-4' />}
            >
              Delete permanently
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
