import { Button, Input, Select, Textarea, cn } from 'componentiq';

import {
  settingsMetadataFixture,
  settingsTeamOptions,
  statusExplanations,
  type ProjectSettingsForm,
} from '@/features/projects/fixtures/settings';
import type { ProjectRow } from '@/features/projects/types';

import { Meta, SectionHeading } from '../components';
import { statusOptions, type UpdateProjectSettingsForm } from '../types';

export function GeneralSection({
  project,
  form,
  nameError,
  tagDraft,
  archiveConfirm,
  onTagDraftChange,
  onArchiveConfirmChange,
  onChange,
}: {
  project: ProjectRow;
  form: ProjectSettingsForm;
  nameError: string;
  tagDraft: string;
  archiveConfirm: boolean;
  // eslint-disable-next-line no-unused-vars
  onTagDraftChange(value: string): void;
  // eslint-disable-next-line no-unused-vars
  onArchiveConfirmChange(value: boolean): void;
  onChange: UpdateProjectSettingsForm;
}) {
  function addTag() {
    const nextTag = tagDraft.trim();
    if (!nextTag || form.tags.some(tag => tag.toLowerCase() === nextTag.toLowerCase())) return;
    onChange(current => ({ ...current, tags: [...current.tags, nextTag] }));
    onTagDraftChange('');
  }

  return (
    <div>
      <SectionHeading
        title='General'
        description='Edit the project identity and lifecycle status your team sees across ComponentIQ.'
      />
      <div className='grid gap-5'>
        <Input
          label='Project name'
          required
          value={form.name}
          maxLength={120}
          error={Boolean(nameError)}
          helperText={nameError || 'Required. Must be unique within this organization.'}
          onChange={event => onChange(current => ({ ...current, name: event.target.value }))}
        />
        <div className='grid gap-2'>
          <label className='text-sm font-medium text-muted-foreground' htmlFor='settings-description'>
            Description
          </label>
          <Textarea
            id='settings-description'
            maxLength={280}
            value={form.description}
            onChange={event => onChange(current => ({ ...current, description: event.target.value }))}
            placeholder='What does this project own?'
          />
          <p className='text-xs text-muted-foreground'>Optional. Keep it short enough for table and header previews.</p>
        </div>
        <Select
          label='Team'
          required
          value={form.team}
          helperText='Projects belong to teams so ownership remains resilient over time.'
          onChange={event => onChange(current => ({ ...current, team: event.target.value }))}
        >
          {settingsTeamOptions.map(team => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </Select>
        <div>
          <label className='text-sm font-medium text-muted-foreground' htmlFor='settings-tag'>
            Tags
          </label>
          <div className='mt-2 flex gap-2'>
            <Input
              id='settings-tag'
              value={tagDraft}
              onChange={event => onTagDraftChange(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addTag();
                }
              }}
              placeholder='Add tag'
            />
            <Button type='button' variant='outlined' onClick={addTag}>
              Add
            </Button>
          </div>
          <div className='mt-3 flex flex-wrap gap-2'>
            {form.tags.map(tag => (
              <button
                key={tag}
                type='button'
                onClick={() =>
                  onChange(current => ({
                    ...current,
                    tags: current.tags.filter(item => item !== tag),
                  }))
                }
                className='rounded-full border border-border bg-background-secondary px-3 py-1 text-xs font-semibold text-muted-foreground'
              >
                {tag} x
              </button>
            ))}
          </div>
          <p className='mt-2 text-xs text-muted-foreground'>No duplicate tags are allowed.</p>
        </div>
        <div>
          <p className='text-sm font-medium text-muted-foreground'>Project status</p>
          <div className='mt-2 flex flex-wrap gap-2' role='group' aria-label='Project status'>
            {statusOptions.map(option => (
              <button
                key={option.value}
                type='button'
                onClick={() => onChange(current => ({ ...current, status: option.value }))}
                className={cn(
                  'rounded-md border px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  form.status === option.value
                    ? 'border-primary bg-primary-50 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:bg-background-secondary'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className='mt-2 text-sm text-muted-foreground'>{statusExplanations[form.status]}</p>
          {form.status === 'archived' && (
            <label className='mt-3 flex gap-2 rounded-md border border-status-warning bg-status-warning-bg p-3 text-sm text-foreground'>
              <input
                type='checkbox'
                checked={archiveConfirm}
                onChange={event => onArchiveConfirmChange(event.target.checked)}
              />
              Confirm archiving while active audits exist.
            </label>
          )}
        </div>
        <div className='border-t border-border pt-5'>
          <h3 className='text-sm font-semibold text-foreground'>Metadata</h3>
          <dl className='mt-3 grid gap-3 text-sm sm:grid-cols-2'>
            <Meta label='Project ID' value={project.id} mono />
            <Meta label='Primary design system' value={project.designSystem.label} />
            <Meta label='Created' value={`${settingsMetadataFixture.createdAt} by ${settingsMetadataFixture.createdBy}`} />
            <Meta label='Last updated' value={settingsMetadataFixture.updatedAt} />
            <Meta label='Repository count' value={`${project.repoCount}`} />
            <Meta label='Audit count' value={`${settingsMetadataFixture.auditCount}`} />
          </dl>
        </div>
      </div>
    </div>
  );
}
