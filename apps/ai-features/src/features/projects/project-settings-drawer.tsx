'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Select,
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Switch,
  Textarea,
  toast,
  cn,
} from 'componentiq';
import {
  Archive,
  ChevronDown,
  Github,
  Loader2,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

import type { ProjectRow } from './fixtures/projects';
import {
  initialSettingsFromProject,
  settingsIntegrationsFixture,
  settingsMetadataFixture,
  settingsRepositoriesFixture,
  settingsRulesFixture,
  settingsSections,
  settingsTeamOptions,
  statusExplanations,
  type ProjectSettingsForm,
  type ProjectSettingsSection,
  type ProjectSettingsStatus,
} from './fixtures/settings';
import { useConnectGithubRepo } from './use-connect-github-repo';

type ProjectSettingsDrawerProps = {
  open: boolean;
  project: ProjectRow;
  orgSlug: string;
  existingProjectNames: string[];
  // eslint-disable-next-line no-unused-vars
  onOpenChange(open: boolean): void;
};

const statusOptions: Array<{ value: ProjectSettingsStatus; label: string }> = [
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
  { value: 'read_only', label: 'Read Only' },
  { value: 'pending_setup', label: 'Pending Setup' },
];

export function ProjectSettingsDrawer({
  open,
  project,
  orgSlug,
  existingProjectNames,
  onOpenChange,
}: ProjectSettingsDrawerProps) {
  const github = useConnectGithubRepo();
  const initialSettings = useMemo(() => initialSettingsFromProject(project), [project]);
  const [section, setSection] = useState<ProjectSettingsSection>('general');
  const [form, setForm] = useState<ProjectSettingsForm>(initialSettings);
  const [savedForm, setSavedForm] = useState<ProjectSettingsForm>(initialSettings);
  const [tagDraft, setTagDraft] = useState('');
  const [nameError, setNameError] = useState('');
  const [footerError, setFooterError] = useState('');
  const [footerSuccess, setFooterSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [archiveConfirm, setArchiveConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const dirty = JSON.stringify(form) !== JSON.stringify(savedForm);
  const activeAudits = settingsMetadataFixture.auditCount > 0;

  useEffect(() => {
    if (!open) return;
    const next = initialSettingsFromProject(project);
    setForm(next);
    setSavedForm(next);
    setSection('general');
    setTagDraft('');
    setNameError('');
    setFooterError('');
    setFooterSuccess('');
    setArchiveConfirm(false);
    setDeleteText('');
  }, [open, project]);

  // eslint-disable-next-line no-unused-vars
  function updateForm(updater: (current: ProjectSettingsForm) => ProjectSettingsForm) {
    setForm(current => updater(current));
    setFooterSuccess('');
    setFooterError('');
  }

  function requestOpenChange(nextOpen: boolean) {
    if (!nextOpen && dirty) {
      setDiscardOpen(true);
      return;
    }

    onOpenChange(nextOpen);
  }

  function discardChanges() {
    setDiscardOpen(false);
    setForm(savedForm);
    onOpenChange(false);
  }

  async function save() {
    const trimmedName = form.name.trim();
    const duplicateName = existingProjectNames
      .filter(name => name !== project.name)
      .some(name => name.trim().toLowerCase() === trimmedName.toLowerCase());

    if (!trimmedName) {
      setNameError('Project name is required.');
      setSection('general');
      return;
    }

    if (trimmedName.length > 120) {
      setNameError('Project name must be 120 characters or fewer.');
      setSection('general');
      return;
    }

    if (duplicateName) {
      setNameError('Project name already exists.');
      setSection('general');
      return;
    }

    if (!form.team) {
      setFooterError('Team is required before saving.');
      setSection('general');
      return;
    }

    if (form.status === 'archived' && activeAudits && !archiveConfirm) {
      setFooterError('Confirm active audits before archiving this project.');
      setSection('general');
      return;
    }

    setSaving(true);
    setNameError('');
    setFooterError('');

    window.setTimeout(() => {
      setSaving(false);
      setSavedForm(form);
      setFooterSuccess('Project updated successfully.');
      toast({
        variant: 'success',
        title: 'Project updated',
        description: `${form.name} settings were saved for this session.`,
      });
    }, 600);
  }

  return (
    <>
      <Sheet open={open} onOpenChange={requestOpenChange}>
        <SheetContent side='right' size='xl' aria-describedby='project-settings-description'>
          <SheetHeader>
            <SheetTitle>Project settings</SheetTitle>
            <p id='project-settings-description' className='mt-1 text-sm text-muted-foreground'>
              Manage ownership, connections, audits, and lifecycle settings for {project.name}.
            </p>
          </SheetHeader>

          <SheetBody className='p-0'>
            <div className='grid min-h-full lg:grid-cols-[210px_minmax(0,1fr)]'>
              <nav
                aria-label='Project settings sections'
                className='border-b border-border bg-background-secondary p-4 lg:border-b-0 lg:border-r'
              >
                <div className='grid gap-1'>
                  {settingsSections.map(item => {
                    const active = section === item.id;
                    const danger = item.id === 'danger';
                    return (
                      <button
                        key={item.id}
                        type='button'
                        onClick={() => setSection(item.id)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'rounded-md px-3 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                          active && 'bg-background text-foreground shadow-sm',
                          !active && !danger && 'text-muted-foreground hover:bg-background hover:text-foreground',
                          danger && !active && 'text-status-error hover:bg-status-error-bg',
                          danger && active && 'text-status-error'
                        )}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </nav>
              <section className='min-w-0 px-6 py-5'>
                {section === 'general' && (
                  <GeneralSection
                    project={project}
                    form={form}
                    nameError={nameError}
                    tagDraft={tagDraft}
                    archiveConfirm={archiveConfirm}
                    onTagDraftChange={setTagDraft}
                    onArchiveConfirmChange={setArchiveConfirm}
                    onChange={updateForm}
                  />
                )}
                {section === 'repositories' && (
                  <RepositoriesSection githubAvailable={github.isAvailable} onConnect={() => github.connect('repository')} />
                )}
                {section === 'team' && <TeamSection form={form} />}
                {section === 'audit' && <AuditSection form={form} onChange={updateForm} />}
                {section === 'rules' && <RulesSection orgSlug={orgSlug} />}
                {section === 'integrations' && <IntegrationsSection />}
                {section === 'advanced' && <AdvancedSection project={project} />}
                {section === 'danger' && (
                  <DangerSection
                    project={project}
                    deleteText={deleteText}
                    onDeleteTextChange={setDeleteText}
                    onArchive={() => {
                      updateForm(current => ({ ...current, status: 'archived' }));
                      setArchiveConfirm(true);
                      setSection('general');
                    }}
                  />
                )}
              </section>
            </div>
          </SheetBody>

          {section !== 'danger' && (
            <SheetFooter className='items-center sm:justify-between'>
              <div className='min-h-5 text-sm'>
                {footerError && (
                  <p role='alert' className='text-status-error'>
                    {footerError}
                  </p>
                )}
                {footerSuccess && !footerError && (
                  <p className='text-status-success'>{footerSuccess}</p>
                )}
              </div>
              <div className='flex flex-col-reverse gap-2 sm:flex-row'>
                <Button type='button' variant='outlined' onClick={() => requestOpenChange(false)}>
                  Cancel
                </Button>
                <Button type='button' disabled={!dirty || saving} onClick={save}>
                  {saving && <Loader2 className='size-4 animate-spin' aria-hidden='true' />}
                  {saving ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <DialogContent size='sm'>
          <DialogHeader>
            <DialogTitle>Discard unsaved changes?</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className='text-sm text-muted-foreground'>
              Your project settings have unsaved edits. Continue editing or discard them.
            </p>
          </DialogBody>
          <DialogFooter>
            <Button type='button' variant='outlined' onClick={() => setDiscardOpen(false)}>
              Continue editing
            </Button>
            <Button type='button' variant='destructive' onClick={discardChanges}>
              Discard changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className='mb-5'>
      <h2 className='text-xl font-semibold text-foreground'>{title}</h2>
      <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
    </div>
  );
}

function GeneralSection({
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
  // eslint-disable-next-line no-unused-vars
  onChange(updater: (current: ProjectSettingsForm) => ProjectSettingsForm): void;
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

function RepositoriesSection({
  githubAvailable,
  onConnect,
}: {
  githubAvailable: boolean;
  onConnect(): void;
}) {
  return (
    <div>
      <SectionHeading
        title='Repositories'
        description='Review connected repositories and connection health. Repository removal is never accidental.'
      />
      <div className='grid gap-3'>
        {settingsRepositoriesFixture.map(repo => (
          <Card key={repo.id} className='rounded-md border border-border bg-background py-0 shadow-none'>
            <CardContent className='flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='font-mono text-sm font-semibold text-foreground'>{repo.name}</p>
                <p className='mt-1 text-xs text-muted-foreground'>
                  {repo.provider} · {repo.defaultBranch} · latest audit {repo.latestAudit}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <StatusBadge label={repo.status} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type='button' variant='outlined' size='sm' endIcon={<ChevronDown className='size-4' />}>
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem disabled>Disconnect requires repository API</DropdownMenuItem>
                    <DropdownMenuItem disabled>Reconnect requires GitHub OAuth</DropdownMenuItem>
                    <DropdownMenuItem disabled>Set as default requires repository API</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button
        type='button'
        className='mt-4'
        variant='outlined'
        disabled={!githubAvailable}
        title='GitHub OAuth/repository picker is not wired yet.'
        startIcon={<Github className='size-4' />}
        onClick={onConnect}
      >
        Connect repository
      </Button>
    </div>
  );
}

function TeamSection({ form }: { form: ProjectSettingsForm }) {
  return (
    <div>
      <SectionHeading
        title='Team'
        description='Projects belong to teams rather than individuals. This makes ownership more resilient over time.'
      />
      <dl className='grid gap-4 text-sm'>
        <Meta label='Owning team' value={form.team} />
        <Meta label='Managers' value='Winnie Kagendo, Commerce Leads' />
        <Meta label='Members' value='14 members' />
      </dl>
      <p className='mt-5 rounded-md border border-border bg-background-secondary p-4 text-sm text-muted-foreground'>
        To change ownership, use Transfer project in Danger Zone so repository connections and audit history are preserved intentionally.
      </p>
    </div>
  );
}

function AuditSection({
  form,
  onChange,
}: {
  form: ProjectSettingsForm;
  // eslint-disable-next-line no-unused-vars
  onChange(updater: (current: ProjectSettingsForm) => ProjectSettingsForm): void;
}) {
  const toggles = [
    ['cliAudits', 'CLI audits', 'Allow local CLI runs to report findings for this project.'],
    ['githubChecks', 'GitHub checks', 'Show audit results on pull requests.'],
    ['prePushHook', 'Pre-push hook', 'Warn contributors before code leaves their machine.'],
    ['ciPipeline', 'CI pipeline', 'Run audit checks during continuous integration.'],
  ] as const;

  return (
    <div>
      <SectionHeading title='Audit' description='Choose where audit signals appear and how severe default findings should be.' />
      <div className='grid gap-4'>
        {toggles.map(([key, label, description]) => (
          <div key={key} className='flex items-start justify-between gap-4 rounded-md border border-border bg-background px-4 py-3'>
            <div>
              <p className='text-sm font-semibold text-foreground'>{label}</p>
              <p className='mt-1 text-xs text-muted-foreground'>{description}</p>
            </div>
            <Switch
              checked={form.audit[key]}
              onCheckedChange={checked =>
                onChange(current => ({
                  ...current,
                  audit: { ...current.audit, [key]: checked },
                }))
              }
              aria-label={label}
            />
          </div>
        ))}
        <Select
          label='Default severity'
          value={form.audit.defaultSeverity}
          helperText='Used when a project-specific rule does not define its own severity.'
          onChange={event =>
            onChange(current => ({
              ...current,
              audit: {
                ...current.audit,
                defaultSeverity: event.target.value as ProjectSettingsForm['audit']['defaultSeverity'],
              },
            }))
          }
        >
          <option value='Blocking'>Blocking</option>
          <option value='Warning'>Warning</option>
          <option value='Advisory'>Advisory</option>
        </Select>
      </div>
    </div>
  );
}

function RulesSection({ orgSlug }: { orgSlug: string }) {
  return (
    <div>
      <SectionHeading title='Rules' description='Review the rule footprint for this project. Editing belongs in rule management.' />
      <div className='grid gap-3 sm:grid-cols-2'>
        <Stat label='Inherited rules' value={settingsRulesFixture.inherited} />
        <Stat label='Project overrides' value={settingsRulesFixture.overrides} />
        <Stat label='Custom rules' value={settingsRulesFixture.custom} />
        <Stat label='Active exceptions' value={settingsRulesFixture.exceptions} />
      </div>
      <a href={`/org/${orgSlug}/guardrails`} className='mt-5 inline-flex text-sm font-semibold text-primary hover:underline'>
        Open rule management
      </a>
    </div>
  );
}

function IntegrationsSection() {
  return (
    <div>
      <SectionHeading title='Integrations' description='See which tools currently send signals to this project.' />
      <div className='grid gap-3'>
        {settingsIntegrationsFixture.map(item => (
          <div key={item.id} className='flex items-center justify-between rounded-md border border-border bg-background px-4 py-3'>
            <div>
              <p className='text-sm font-semibold text-foreground'>{item.name}</p>
              {item.future && <p className='mt-1 text-xs text-muted-foreground'>Coming soon</p>}
            </div>
            <StatusBadge label={item.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AdvancedSection({ project }: { project: ProjectRow }) {
  return (
    <div>
      <SectionHeading title='Advanced' description='For tooling and support. These values are read-only.' />
      <dl className='grid gap-3 text-sm'>
        <Meta label='Project ID' value={project.id} mono />
        <Meta label='Webhook endpoint URL' value={settingsMetadataFixture.webhookEndpoint} mono />
        <Meta label='Environment' value={settingsMetadataFixture.environment} mono />
      </dl>
    </div>
  );
}

function DangerSection({
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

function DangerRow({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <div className='flex flex-col gap-3 rounded-md border border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between'>
      <div>
        <h3 className='text-sm font-semibold text-foreground'>{title}</h3>
        <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
      </div>
      {action}
    </div>
  );
}

function Meta({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className='text-xs font-semibold uppercase tracking-normal text-muted-foreground'>{label}</dt>
      <dd className={cn('mt-1 text-sm text-foreground', mono && 'font-mono break-all')}>{value}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className='rounded-md border border-border bg-background-secondary px-4 py-3'>
      <p className='text-xs font-semibold uppercase tracking-normal text-muted-foreground'>{label}</p>
      <p className='mt-2 text-2xl font-semibold text-foreground'>{value}</p>
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  const colorStatus =
    label === 'Connected'
      ? 'success'
      : label === 'Needs reconnect' || label === 'Needs attention'
        ? 'warning'
        : label === 'Disconnected'
          ? 'error'
          : 'neutral';

  return (
    <Badge status={label} colorStatus={colorStatus} variant='pastel' size='sm'>
      {label}
    </Badge>
  );
}
