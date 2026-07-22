'use client';

import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  toast,
  cn,
} from 'componentiq';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import {
  initialSettingsFromProject,
  settingsMetadataFixture,
  settingsSections,
  type ProjectSettingsForm,
  type ProjectSettingsSection,
} from '@/features/projects/fixtures/settings';
import { useConnectGithubRepo } from '@/features/projects/use-connect-github-repo';

import {
  AdvancedSection,
  AuditSection,
  DangerSection,
  GeneralSection,
  IntegrationsSection,
  RepositoriesSection,
  RulesSection,
  TeamSection,
} from './sections';
import type { ProjectSettingsDrawerProps } from './types';

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
  function updateForm(updater: (form: ProjectSettingsForm) => ProjectSettingsForm) {
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
              <SettingsNavigation activeSection={section} onSelect={setSection} />
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

function SettingsNavigation({
  activeSection,
  onSelect,
}: {
  activeSection: ProjectSettingsSection;
  // eslint-disable-next-line no-unused-vars
  onSelect(section: ProjectSettingsSection): void;
}) {
  return (
    <nav
      aria-label='Project settings sections'
      className='border-b border-border bg-background-secondary p-4 lg:border-b-0 lg:border-r'
    >
      <div className='grid gap-1'>
        {settingsSections.map(item => {
          const active = activeSection === item.id;
          const danger = item.id === 'danger';
          return (
            <button
              key={item.id}
              type='button'
              onClick={() => onSelect(item.id)}
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
  );
}
