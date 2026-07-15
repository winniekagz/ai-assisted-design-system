'use client';

import { useAuth } from '@clerk/nextjs';
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
import { CheckCircle2, Github, Loader2, PlayCircle, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { ApiError } from '@/lib/api/client';
import { createProject, type ApiProject } from '@/lib/api/projects';

import type { ProjectRow } from './fixtures/projects';
import { useConnectGithubRepo } from './use-connect-github-repo';

export type CreatedProjectDraft = {
  apiProject: ApiProject;
  description?: string;
  team?: string;
};

type CreateProjectDrawerProps = {
  open: boolean;
  organizationId: string;
  existingProjectNames: string[];
  teamOptions: string[];
  // eslint-disable-next-line no-unused-vars
  onOpenChange(open: boolean): void;
  // eslint-disable-next-line no-unused-vars
  onCreated(project: CreatedProjectDraft): void;
};

type DrawerMode = 'default' | 'loading' | 'success' | 'error';

export function CreateProjectDrawer({
  open,
  organizationId,
  existingProjectNames,
  teamOptions,
  onOpenChange,
  onCreated,
}: CreateProjectDrawerProps) {
  const { getToken } = useAuth();
  const github = useConnectGithubRepo();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<DrawerMode>('default');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [team, setTeam] = useState(teamOptions[0] ?? '');
  const [nameError, setNameError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [createdProject, setCreatedProject] = useState<ProjectRow | null>(null);
  const normalizedExistingNames = useMemo(
    () => existingProjectNames.map(item => item.trim().toLowerCase()),
    [existingProjectNames]
  );
  const dirty = name.trim().length > 0;

  useEffect(() => {
    if (!open) return;
    window.setTimeout(() => nameInputRef.current?.focus(), 0);
  }, [open]);

  useEffect(() => {
    if (team || teamOptions.length === 0) return;
    setTeam(teamOptions[0]);
  }, [team, teamOptions]);

  function reset() {
    setMode('default');
    setName('');
    setDescription('');
    setTeam(teamOptions[0] ?? '');
    setNameError('');
    setSubmitError('');
    setShowDiscardConfirm(false);
    setCreatedProject(null);
  }

  function requestOpenChange(nextOpen: boolean) {
    if (!nextOpen && mode === 'default' && dirty && !showDiscardConfirm) {
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
    const trimmedName = name.trim();

    if (!trimmedName) {
      setNameError('Project name is required.');
      setMode('default');
      return;
    }

    if (normalizedExistingNames.includes(trimmedName.toLowerCase())) {
      setSubmitError('A project with this name already exists in this organization.');
      setMode('error');
      return;
    }

    setNameError('');
    setSubmitError('');
    setShowDiscardConfirm(false);
    setMode('loading');

    try {
      const token = await getToken();
      const apiProject = await createProject(
        organizationId,
        {
          name: trimmedName,
          framework: 'Not configured',
          packageManager: 'Not configured',
          stylingSystem: 'Not configured',
        },
        token
      );
      const draft = { apiProject, description: description.trim(), team };
      onCreated(draft);
      setCreatedProject(projectRowFromCreatedDraft(draft));
      setMode('success');
      toast({
        variant: 'success',
        title: 'Project created',
        description: `${trimmedName} is ready for repository setup.`,
      });
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : 'We could not create this project. Try again.'
      );
      setMode('error');
    }
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
          {mode === 'loading' && (
            <div className='grid min-h-80 place-items-center text-center' aria-live='polite'>
              <div>
                <Loader2 className='mx-auto size-8 animate-spin text-primary' aria-hidden='true' />
                <h2 className='mt-4 text-lg font-semibold text-foreground'>
                  Creating {name.trim()}...
                </h2>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Setting up the project shell.
                </p>
              </div>
            </div>
          )}

          {mode === 'success' && createdProject && (
            <div className='grid gap-5'>
              <div className='rounded-md border border-status-success bg-status-success-bg p-4'>
                <CheckCircle2 className='size-5 text-status-success' aria-hidden='true' />
                <h2 className='mt-3 text-lg font-semibold text-foreground'>
                  {createdProject.name} is ready
                </h2>
                <p className='mt-1 text-sm text-muted-foreground'>
                  Keep going with the setup steps below, or close this drawer and return to
                  the catalogue.
                </p>
              </div>
              <div className='grid gap-3'>
                <NextStepRow
                  icon={<Github className='size-4' />}
                  title='Connect repository'
                  description='Pending GitHub App/OAuth wiring in this repo.'
                  disabled={!github.isAvailable}
                  onClick={() => github.connect('repository')}
                />
                <NextStepRow
                  icon={<ShieldCheck className='size-4' />}
                  title='Choose design system'
                  description='Requires the design-system linking API.'
                  disabled
                />
                <NextStepRow
                  icon={<PlayCircle className='size-4' />}
                  title='Run first audit'
                  description='Requires the audit workflow API.'
                  disabled
                />
              </div>
            </div>
          )}

          {mode === 'error' && (
            <div className='grid gap-4'>
              <div
                role='alert'
                className='rounded-md border border-status-error bg-status-error-bg p-4 text-sm text-status-error'
              >
                {submitError}
              </div>
              <Button type='button' onClick={() => setMode('default')}>
                Edit name
              </Button>
              <Button type='button' variant='outlined' onClick={submit}>
                Try again
              </Button>
            </div>
          )}

          {mode === 'default' && (
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
                    Your project name has not been saved yet.
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

              <Input
                ref={nameInputRef}
                label='Project name'
                required
                value={name}
                onChange={event => {
                  setName(event.target.value);
                  setNameError('');
                }}
                error={Boolean(nameError)}
                helperText={nameError || 'Use the name your team recognizes.'}
              />
              <div className='grid gap-2'>
                <label className='text-sm font-medium text-muted-foreground' htmlFor='project-description'>
                  Description
                </label>
                <Textarea
                  id='project-description'
                  value={description}
                  onChange={event => setDescription(event.target.value)}
                  placeholder='What surface does this project own?'
                />
              </div>
              <Select
                label='Team'
                value={team}
                onChange={event => setTeam(event.target.value)}
              >
                {teamOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
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

        {mode !== 'loading' && (
          <SheetFooter>
            {mode === 'success' ? (
              <Button type='button' onClick={discardAndClose}>
                Done
              </Button>
            ) : (
              <>
                <Button type='button' variant='outlined' onClick={() => requestOpenChange(false)}>
                  Cancel
                </Button>
                <Button type='button' onClick={submit}>
                  Create project
                </Button>
              </>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

function NextStepRow({
  icon,
  title,
  description,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      title={disabled ? description : undefined}
      className='flex w-full items-start gap-3 rounded-md border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60'
    >
      <span className='mt-0.5 text-primary' aria-hidden='true'>
        {icon}
      </span>
      <span>
        <span className='block text-sm font-semibold text-foreground'>{title}</span>
        <span className='mt-1 block text-xs text-muted-foreground'>{description}</span>
      </span>
    </button>
  );
}

function projectRowFromCreatedDraft({ apiProject, description, team }: CreatedProjectDraft): ProjectRow {
  return {
    id: apiProject.id,
    name: apiProject.name,
    slug: apiProject.slug,
    repository: apiProject.repositoryUrl ?? 'Repository not connected',
    team: team || 'Unassigned',
    framework: apiProject.framework,
    tags: ['new'],
    description: description || 'Project reserved in ComponentIQ.',
    status: 'not_configured',
    blockingCount: 0,
    latestAudit: { state: 'not_run', label: 'Not run', relativeTime: 'Never' },
    designSystem: { state: 'none', label: 'None' },
    latestActivity: 'Project created',
    repoCount: apiProject.repositoryUrl ? 1 : 0,
    lastAudited: 'Never',
  };
}
