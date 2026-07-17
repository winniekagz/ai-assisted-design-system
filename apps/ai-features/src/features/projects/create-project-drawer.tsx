'use client';

import { createProjectSchema, type ProjectListItem } from '@winniekagendo/componentiq-shared-types';
import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Textarea,
  toast,
} from 'componentiq';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useCreateProject } from '@/hooks/mutations/use-create-project';
import { ApiError } from '@/lib/api/client';

export type CreatedProjectDraft = {
  apiProject: ProjectListItem;
};

type CreateProjectDrawerProps = {
  open: boolean;
  orgSlug: string;
  existingProjectNames: string[];
  teamOptions: string[];
  // eslint-disable-next-line no-unused-vars
  onOpenChange(open: boolean): void;
  // eslint-disable-next-line no-unused-vars
  onCreated(project: CreatedProjectDraft): void;
  // eslint-disable-next-line no-unused-vars
  onConfigureProject?(project: ProjectListItem): void;
};

type FieldErrors = {
  name?: string;
  description?: string;
};

export function CreateProjectDrawer({
  open,
  orgSlug,
  existingProjectNames,
  teamOptions,
  onOpenChange,
  onCreated,
  onConfigureProject,
}: CreateProjectDrawerProps) {
  const createProject = useCreateProject(orgSlug);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [createdProject, setCreatedProject] = useState<ProjectListItem | null>(null);
  const normalizedExistingNames = useMemo(
    () => existingProjectNames.map(item => item.trim().toLowerCase()),
    [existingProjectNames]
  );
  const trimmedName = name.trim();
  const dirty = trimmedName.length > 0 || description.trim().length > 0;
  const duplicateNameHint = normalizedExistingNames.includes(trimmedName.toLowerCase());
  const validation = createProjectSchema.safeParse({
    name,
    description,
  });
  const canSubmit = validation.success && !createProject.isPending;

  useEffect(() => {
    if (!open) return;
    window.setTimeout(() => nameInputRef.current?.focus(), 0);
  }, [open]);

  function reset() {
    setName('');
    setDescription('');
    setFieldErrors({});
    setSubmitError('');
    setShowDiscardConfirm(false);
    setCreatedProject(null);
    createProject.reset();
  }

  function requestOpenChange(nextOpen: boolean) {
    if (!nextOpen && dirty && !showDiscardConfirm && !createdProject) {
      setShowDiscardConfirm(true);
      return;
    }

    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  }

  function discardAndClose() {
    reset();
    onOpenChange(false);
  }

  async function submit() {
    if (createProject.isPending) {
      return;
    }

    const parsed = createProjectSchema.safeParse({
      name,
      description,
    });

    if (!parsed.success) {
      const nextErrors = fieldErrorsFromIssuePaths(parsed.error.issues);
      setFieldErrors(nextErrors);
      setSubmitError('');
      focusFirstInvalidField(nextErrors);
      return;
    }

    setFieldErrors({});
    setSubmitError('');
    setShowDiscardConfirm(false);

    try {
      const apiProject = await createProject.mutateAsync(parsed.data);
      setCreatedProject(apiProject);
      onCreated({ apiProject });
      toast({
        variant: 'success',
        title: 'Project created',
        description: `${apiProject.name} is ready for repository setup.`,
      });
    } catch (error) {
      setSubmitError(errorMessageFromCreateFailure(error));
    }
  }

  function configureCreatedProject() {
    if (!createdProject) return;

    onConfigureProject?.(createdProject);
    reset();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={requestOpenChange}>
      <SheetContent side='right' size='md' aria-describedby='create-project-description'>
        <SheetHeader>
          <SheetTitle>Create project</SheetTitle>
          <SheetDescription id='create-project-description'>
            Reserve a project in ComponentIQ now. Repository connection and first audit
            can happen next.
          </SheetDescription>
        </SheetHeader>

        <SheetBody>
          {createdProject ? (
            <div className='grid gap-5' aria-live='polite'>
              <div className='rounded-md border border-status-success bg-status-success-bg p-4'>
                <h2 className='text-lg font-semibold text-foreground'>
                  {createdProject.name} is ready
                </h2>
                <p className='mt-1 text-sm text-muted-foreground'>
                  Configure source access now, or come back to setup from the project list.
                </p>
              </div>
            </div>
          ) : (
            <form
              className='grid gap-5'
              onSubmit={event => {
                event.preventDefault();
                submit();
              }}
            >
              {showDiscardConfirm && (
                <div
                  role='alert'
                  className='rounded-md border border-status-warning bg-status-warning-bg p-4'
                >
                  <p className='text-sm font-semibold text-foreground'>Discard this project?</p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    Your project details have not been saved yet.
                  </p>
                  <div className='mt-3 flex gap-2'>
                    <Button type='button' size='sm' variant='outlined' onClick={discardAndClose}>
                      Discard
                    </Button>
                    <Button
                      type='button'
                      size='sm'
                      onClick={() => setShowDiscardConfirm(false)}
                    >
                      Keep editing
                    </Button>
                  </div>
                </div>
              )}

              {submitError && (
                <div
                  role='alert'
                  className='rounded-md border border-status-error bg-status-error-bg p-4 text-sm text-status-error'
                >
                  {submitError}
                </div>
              )}

              <Input
                ref={nameInputRef}
                name='project-name'
                label='Project name'
                required
                value={name}
                onChange={event => {
                  setName(event.target.value);
                  setFieldErrors(current => ({ ...current, name: undefined }));
                  setSubmitError('');
                }}
                error={Boolean(fieldErrors.name)}
                helperText={
                  fieldErrors.name ||
                  (duplicateNameHint
                    ? 'A project with this name may already exist here.'
                    : 'Use the name your team recognizes.')
                }
              />
              <div className='grid gap-2'>
                <label className='text-sm font-medium text-muted-foreground' htmlFor='project-description'>
                  Description
                </label>
                <Textarea
                  id='project-description'
                  value={description}
                  onChange={event => {
                    setDescription(event.target.value);
                    setFieldErrors(current => ({ ...current, description: undefined }));
                    setSubmitError('');
                  }}
                  placeholder='What surface does this project own?'
                  aria-invalid={Boolean(fieldErrors.description)}
                  aria-describedby='project-description-help'
                />
                <p
                  id='project-description-help'
                  className={
                    fieldErrors.description
                      ? 'text-sm text-status-error'
                      : 'text-sm text-muted-foreground'
                  }
                >
                  {fieldErrors.description || 'Optional, up to 500 characters.'}
                </p>
              </div>
              <Select label='Team' value='unavailable' disabled>
                <option value='unavailable'>
                  {teamOptions.length > 0 ? 'Teams unavailable in Phase One' : 'Teams unavailable'}
                </option>
              </Select>

              <Card className='rounded-md border border-border bg-background-secondary py-0 shadow-none'>
                <CardContent className='px-4 py-4'>
                  <p className='text-sm font-semibold text-foreground'>After creating, you can:</p>
                  <ul className='mt-3 grid gap-2 text-sm text-muted-foreground'>
                    <li>Connect repository</li>
                    <li>Choose design system</li>
                    <li>Run first audit</li>
                  </ul>
                  <p className='mt-3 text-xs text-muted-foreground'>
                    None of these are required to reserve the project.
                  </p>
                </CardContent>
              </Card>
            </form>
          )}
        </SheetBody>

        <SheetFooter>
          {createdProject ? (
            <>
              <Button type='button' variant='outlined' onClick={discardAndClose}>
                I&apos;ll do this later
              </Button>
              <Button type='button' onClick={configureCreatedProject}>
                Configure project
              </Button>
            </>
          ) : (
            <>
              <Button
                type='button'
                variant='outlined'
                disabled={createProject.isPending}
                onClick={() => requestOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type='button'
                disabled={!canSubmit}
                onClick={submit}
                startIcon={
                  createProject.isPending ? (
                    <Loader2 className='size-4 animate-spin' />
                  ) : undefined
                }
              >
                {createProject.isPending ? 'Creating...' : 'Create project'}
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function fieldErrorsFromIssuePaths(
  issues: { path: PropertyKey[]; message: string }[]
): FieldErrors {
  return issues.reduce<FieldErrors>((errors, issue) => {
    const field = issue.path[0];

    if (field === 'name' && !errors.name) {
      errors.name = humanizeValidationMessage(issue.message, 'Project name');
    }

    if (field === 'description' && !errors.description) {
      errors.description = humanizeValidationMessage(issue.message, 'Description');
    }

    return errors;
  }, {});
}

function humanizeValidationMessage(message: string, label: string) {
  if (message.includes('Too small')) return `${label} must be at least 2 characters.`;
  if (message.includes('Too big')) return `${label} is too long.`;
  if (message.includes('Invalid input')) return `${label} is invalid.`;
  return message;
}

function errorMessageFromCreateFailure(error: unknown) {
  if (error instanceof ApiError) {
    if (error.code === 'conflict') {
      return 'A project with this name already exists in this organization.';
    }

    if (error.code === 'forbidden') {
      return 'You do not have permission to create projects in this organization.';
    }

    return error.message;
  }

  return 'We could not create this project. Try again.';
}

function focusFirstInvalidField(errors: FieldErrors) {
  if (errors.name) {
    document.querySelector<HTMLInputElement>('input[name="project-name"]')?.focus();
    return;
  }

  if (errors.description) {
    document.getElementById('project-description')?.focus();
  }
}
