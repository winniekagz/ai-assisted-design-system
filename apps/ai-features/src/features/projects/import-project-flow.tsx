'use client';

import { useAuth } from '@clerk/nextjs';
import {
  Button,
  Card,
  CardContent,
  Progress,
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Stepper,
  toast,
} from 'componentiq';
import {
  AlertCircle,
  CheckCircle2,
  FileArchive,
  Github,
  Loader2,
  RefreshCcw,
  Upload,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { createProject, type ApiProject } from '@/lib/api/projects';

import {
  discoveryResultFixture,
  discoverySources,
  discoverySteps,
  recentUploadFixtures,
  type DiscoverySource,
  type DiscoverySourceId,
} from './fixtures/import-flow';
import type { ProjectRow } from './fixtures/projects';
import { useConnectGithubRepo } from './use-connect-github-repo';

type ImportProjectFlowProps = {
  open: boolean;
  organizationId: string;
  // eslint-disable-next-line no-unused-vars
  onOpenChange(open: boolean): void;
  // eslint-disable-next-line no-unused-vars
  onImported(project: ProjectRow): void;
};

type FlowStep = 0 | 1 | 2 | 3 | 4;
type DiscoveryError = 'repo_unavailable' | 'github_expired' | 'corrupted_archive' | 'failed' | null;

const flowSteps = [
  { id: 'source', label: 'Choose source', description: 'Pick where we discover from.' },
  { id: 'connect', label: 'Connect', description: 'Connect or select source data.' },
  { id: 'discover', label: 'Discover', description: 'Analyse the project.' },
  { id: 'review', label: 'Review', description: 'Check suggested setup.' },
  { id: 'confirm', label: 'Import', description: 'Save when ready.' },
];

export function ImportProjectFlow({
  open,
  organizationId,
  onOpenChange,
  onImported,
}: ImportProjectFlowProps) {
  const { getToken } = useAuth();
  const github = useConnectGithubRepo();
  const [step, setStep] = useState<FlowStep>(0);
  const [sourceId, setSourceId] = useState<DiscoverySourceId>('github_repository');
  const [completedDiscoverySteps, setCompletedDiscoverySteps] = useState(0);
  const [suggestions, setSuggestions] = useState(discoveryResultFixture.suggestions);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<DiscoveryError>(null);
  const selectedSource = discoverySources.find(source => source.id === sourceId) ?? discoverySources[0];
  const isGithubSource = sourceId === 'github_repository' || sourceId === 'github_organization';
  const progressValue = Math.round((completedDiscoverySteps / discoverySteps.length) * 100);

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  useEffect(() => {
    if (step !== 2 || error) return;

    setCompletedDiscoverySteps(0);
    const interval = window.setInterval(() => {
      setCompletedDiscoverySteps(current => {
        const next = current + 1;

        if (next >= discoverySteps.length) {
          window.clearInterval(interval);
          window.setTimeout(() => setStep(3), 450);
          return discoverySteps.length;
        }

        return next;
      });
    }, 450);

    return () => window.clearInterval(interval);
  }, [error, step]);

  function reset() {
    setStep(0);
    setSourceId('github_repository');
    setCompletedDiscoverySteps(0);
    setSuggestions(discoveryResultFixture.suggestions);
    setIsImporting(false);
    setError(null);
  }

  function close() {
    reset();
    onOpenChange(false);
  }

  async function importProject() {
    setIsImporting(true);

    try {
      const token = await getToken();
      const apiProject = await createProject(
        organizationId,
        {
          name: discoveryResultFixture.projectName,
          framework: discoveryResultFixture.framework,
          packageManager: 'npm',
          stylingSystem: 'Tailwind CSS',
          repositoryUrl: `https://github.com/${discoveryResultFixture.repositories[0]}`,
        },
        token
      );
      onImported(projectRowFromImport(apiProject));
      toast({
        variant: 'success',
        title: 'Project imported',
        description: `${apiProject.name} was added to the catalogue.`,
      });
      close();
    } catch {
      setError('failed');
      setStep(1);
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={nextOpen => (nextOpen ? onOpenChange(true) : close())}>
      <SheetContent side='right' size='full' aria-describedby='import-project-description'>
        <SheetHeader>
          <SheetTitle>Discover or import project</SheetTitle>
          <p id='import-project-description' className='mt-1 text-sm text-muted-foreground'>
            Let ComponentIQ inspect an existing project before anything is saved.
          </p>
        </SheetHeader>

        <SheetBody className='bg-background'>
          <div className='mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]'>
            <aside className='rounded-md border border-border bg-background px-4 py-4'>
              <Stepper steps={flowSteps} currentStep={step} aria-label='Import project steps' />
            </aside>
            <section className='min-w-0'>
              {step === 0 && (
                <ChooseSourceStep
                  selectedSourceId={sourceId}
                  onSelect={setSourceId}
                />
              )}
              {step === 1 && (
                <ConnectSourceStep
                  source={selectedSource}
                  isGithubSource={isGithubSource}
                  githubAvailable={github.isAvailable}
                  error={error}
                  onUseFixture={() => {
                    setError(null);
                    setStep(2);
                  }}
                  onSimulateError={setError}
                  onReconnect={() => github.connect(isGithubSource ? 'repository' : 'organization')}
                />
              )}
              {step === 2 && (
                <DiscoveryProgressStep
                  completed={completedDiscoverySteps}
                  progressValue={progressValue}
                />
              )}
              {step === 3 && (
                <DiscoveryResultsStep
                  suggestions={suggestions}
                  onToggleSuggestion={id =>
                    setSuggestions(items =>
                      items.map(item =>
                        item.id === id ? { ...item, enabled: !item.enabled } : item
                      )
                    )
                  }
                />
              )}
              {step === 4 && <ConfirmationStep selectedSource={selectedSource} />}
            </section>
          </div>
        </SheetBody>

        <SheetFooter>
          <Button type='button' variant='outlined' onClick={close}>
            Cancel
          </Button>
          {step > 0 && (
            <Button
              type='button'
              variant='outlined'
              onClick={() => setStep((step - 1) as FlowStep)}
              disabled={step === 2 || isImporting}
            >
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button
              type='button'
              onClick={() => setStep((step + 1) as FlowStep)}
              disabled={step === 1 && Boolean(error)}
            >
              {step === 1 ? 'Start discovery' : 'Continue'}
            </Button>
          ) : (
            <Button type='button' onClick={importProject} disabled={isImporting}>
              {isImporting && <Loader2 className='size-4 animate-spin' aria-hidden='true' />}
              Import
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function ChooseSourceStep({
  selectedSourceId,
  onSelect,
}: {
  selectedSourceId: DiscoverySourceId;
  // eslint-disable-next-line no-unused-vars
  onSelect(source: DiscoverySourceId): void;
}) {
  return (
    <div>
      <h2 className='text-2xl font-semibold text-foreground'>Choose discovery source</h2>
      <p className='mt-2 text-sm text-muted-foreground'>
        Pick where ComponentIQ should look. Nothing is saved until the final import step.
      </p>
      <div className='mt-6 grid gap-3 md:grid-cols-2'>
        {discoverySources.map(source => {
          const active = selectedSourceId === source.id;
          return (
            <button
              key={source.id}
              type='button'
              onClick={() => onSelect(source.id)}
              className={`rounded-md border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active
                  ? 'border-primary bg-primary-50'
                  : 'border-border bg-background hover:bg-background-secondary'
              }`}
            >
              <span className='text-sm font-semibold text-foreground'>{source.title}</span>
              <span className='mt-2 block text-sm text-muted-foreground'>{source.description}</span>
              <span className='mt-3 block text-xs text-muted-foreground'>
                Discovers: {source.discovers}
              </span>
              <span className='mt-1 block text-xs text-muted-foreground'>
                Permissions: {source.permissions}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ConnectSourceStep({
  source,
  isGithubSource,
  githubAvailable,
  error,
  onUseFixture,
  onSimulateError,
  onReconnect,
}: {
  source: DiscoverySource;
  isGithubSource: boolean;
  githubAvailable: boolean;
  error: DiscoveryError;
  onUseFixture(): void;
  // eslint-disable-next-line no-unused-vars
  onSimulateError(error: DiscoveryError): void;
  onReconnect(): void;
}) {
  return (
    <div className='grid gap-5'>
      <div>
        <h2 className='text-2xl font-semibold text-foreground'>Connect or select source</h2>
        <p className='mt-2 text-sm text-muted-foreground'>
          Source selected: <span className='font-medium text-foreground'>{source.title}</span>
        </p>
      </div>

      {error && <DiscoveryErrorBanner error={error} onRecover={onUseFixture} onReconnect={onReconnect} />}

      {isGithubSource ? (
        <Card className='rounded-md border border-border bg-background py-0 shadow-none'>
          <CardContent className='px-5 py-5'>
            <Github className='size-6 text-primary' aria-hidden='true' />
            <h3 className='mt-3 text-lg font-semibold text-foreground'>GitHub connection</h3>
            <p className='mt-2 text-sm text-muted-foreground'>
              No GitHub OAuth or repository picker exists in this repo yet. This screen is
              wired to a single pending hook so the real integration can replace it later.
            </p>
            <div className='mt-4 flex flex-wrap gap-2'>
              <Button type='button' disabled={!githubAvailable} onClick={onReconnect}>
                Connect GitHub
              </Button>
              <Button type='button' variant='outlined' onClick={onUseFixture}>
                Use fixture repository
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className='rounded-md border border-dashed border-border bg-background py-0 shadow-none'>
          <CardContent className='px-5 py-8'>
            <Upload className='mx-auto size-8 text-primary' aria-hidden='true' />
            <h3 className='mt-4 text-center text-lg font-semibold text-foreground'>
              Prepare source for discovery
            </h3>
            <p className='mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground'>
              This source is out of scope for real upload/analysis in this pass. Use the
              fixture discovery path to preview the remaining flow.
            </p>
            <div className='mt-5 flex justify-center gap-2'>
              <Button type='button' variant='outlined' disabled title='Upload analysis API is not available yet.'>
                Browse files
              </Button>
              <Button type='button' onClick={onUseFixture}>
                Use fixture discovery
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className='text-sm font-semibold text-foreground'>Recent sources</h3>
        <div className='mt-2 grid gap-2'>
          {recentUploadFixtures.map(item => (
            <div
              key={item}
              className='flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground'
            >
              <FileArchive className='size-4' aria-hidden='true' />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-wrap gap-2'>
        <Button type='button' variant='outlined' size='sm' onClick={() => onSimulateError('repo_unavailable')}>
          Preview repo unavailable
        </Button>
        <Button type='button' variant='outlined' size='sm' onClick={() => onSimulateError('github_expired')}>
          Preview expired auth
        </Button>
        <Button type='button' variant='outlined' size='sm' onClick={() => onSimulateError('corrupted_archive')}>
          Preview corrupted archive
        </Button>
      </div>
    </div>
  );
}

function DiscoveryErrorBanner({
  error,
  onRecover,
  onReconnect,
}: {
  error: Exclude<DiscoveryError, null>;
  onRecover(): void;
  onReconnect(): void;
}) {
  const meta = {
    repo_unavailable: {
      title: 'Repository unavailable',
      detail: 'We could not read this repository. Choose a different source or retry.',
      action: 'Retry with fixture',
      recover: onRecover,
    },
    github_expired: {
      title: "We couldn't analyse this repository because GitHub access has expired.",
      detail: 'Reconnect GitHub to continue.',
      action: 'Reconnect GitHub',
      recover: onReconnect,
    },
    corrupted_archive: {
      title: 'Archive could not be read',
      detail: 'Choose a different source or use fixture discovery for now.',
      action: 'Choose fixture source',
      recover: onRecover,
    },
    failed: {
      title: 'Discovery failed',
      detail: 'The discovery job did not complete. Retry when the backend job is available.',
      action: 'Retry with fixture',
      recover: onRecover,
    },
  }[error];

  return (
    <div
      role='alert'
      className='rounded-md border border-status-error bg-status-error-bg p-4'
    >
      <div className='flex gap-3'>
        <AlertCircle className='mt-0.5 size-5 text-status-error' aria-hidden='true' />
        <div>
          <h3 className='text-sm font-semibold text-foreground'>{meta.title}</h3>
          <p className='mt-1 text-sm text-muted-foreground'>{meta.detail}</p>
          <Button type='button' size='sm' className='mt-3' onClick={meta.recover}>
            <RefreshCcw className='size-4' aria-hidden='true' />
            {meta.action}
          </Button>
        </div>
      </div>
    </div>
  );
}

function DiscoveryProgressStep({
  completed,
  progressValue,
}: {
  completed: number;
  progressValue: number;
}) {
  return (
    <div aria-live='polite'>
      <h2 className='text-2xl font-semibold text-foreground'>Automatic discovery</h2>
      <p className='mt-2 text-sm text-muted-foreground'>
        ComponentIQ is inspecting the project and preparing review-only results.
      </p>
      <Progress className='mt-6' value={progressValue} label='Discovery progress' showValue />
      <ol className='mt-6 grid gap-3'>
        {discoverySteps.map((item, index) => {
          const done = index < completed;
          const active = index === completed;
          return (
            <li
              key={item.id}
              className='flex gap-3 rounded-md border border-border bg-background px-4 py-3'
            >
              {done ? (
                <CheckCircle2 className='mt-0.5 size-5 text-status-success' aria-hidden='true' />
              ) : active ? (
                <Loader2 className='mt-0.5 size-5 animate-spin text-primary' aria-hidden='true' />
              ) : (
                <span className='mt-1 size-3 rounded-full border border-border' aria-hidden='true' />
              )}
              <span>
                <span className='block text-sm font-semibold text-foreground'>{item.label}</span>
                <span className='mt-1 block text-xs text-muted-foreground'>{item.detail}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function DiscoveryResultsStep({
  suggestions,
  onToggleSuggestion,
}: {
  suggestions: typeof discoveryResultFixture.suggestions;
  // eslint-disable-next-line no-unused-vars
  onToggleSuggestion(id: string): void;
}) {
  return (
    <div>
      <h2 className='text-2xl font-semibold text-foreground'>Review discovery results</h2>
      <p className='mt-2 text-sm text-muted-foreground'>
        Nothing is saved yet. Review the detected setup before importing.
      </p>
      <div className='mt-5 flex flex-wrap gap-2'>
        {discoveryResultFixture.techTags.map(tag => (
          <span
            key={tag}
            className='rounded-full border border-border bg-background-secondary px-3 py-1 text-xs font-semibold text-muted-foreground'
          >
            {tag}
          </span>
        ))}
      </div>
      <Card className='mt-5 rounded-md border border-border bg-background py-0 shadow-none'>
        <CardContent className='px-5 py-5'>
          <p className='text-sm font-semibold text-foreground'>Potential design system</p>
          <p className='mt-2 text-lg font-semibold text-foreground'>
            {discoveryResultFixture.designSystem}
          </p>
          <p className='mt-1 text-sm text-muted-foreground'>
            {discoveryResultFixture.confidence}% confidence from token and component matches.
          </p>
        </CardContent>
      </Card>
      <div className='mt-5 grid gap-3'>
        {suggestions.map(suggestion => (
          <label
            key={suggestion.id}
            className='flex gap-3 rounded-md border border-border bg-background px-4 py-3'
          >
            <input
              type='checkbox'
              checked={suggestion.enabled}
              onChange={() => onToggleSuggestion(suggestion.id)}
              className='mt-1'
            />
            <span>
              <span className='block text-sm font-semibold text-foreground'>{suggestion.label}</span>
              <span className='mt-1 block text-xs text-muted-foreground'>{suggestion.detail}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ConfirmationStep({ selectedSource }: { selectedSource: DiscoverySource }) {
  const rows = [
    ['Project name', discoveryResultFixture.projectName],
    ['Source', selectedSource.title],
    ['Repositories', discoveryResultFixture.repositories.join(', ')],
    ['Framework', discoveryResultFixture.framework],
    ['Design system', discoveryResultFixture.designSystem],
    ['Components found', `${discoveryResultFixture.componentsFound}`],
    ['Configuration', '3 suggestions selected'],
  ];

  return (
    <div>
      <h2 className='text-2xl font-semibold text-foreground'>Confirm and import</h2>
      <p className='mt-2 text-sm text-muted-foreground'>
        Import saves this project and its reviewed setup into ComponentIQ.
      </p>
      <div className='mt-6 overflow-hidden rounded-md border border-border bg-background'>
        <table className='w-full text-left text-sm'>
          <tbody className='divide-y divide-border'>
            {rows.map(([label, value]) => (
              <tr key={label}>
                <th scope='row' className='w-48 px-4 py-3 font-semibold text-muted-foreground'>
                  {label}
                </th>
                <td className='px-4 py-3 text-foreground'>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function projectRowFromImport(apiProject: ApiProject): ProjectRow {
  return {
    id: apiProject.id,
    name: apiProject.name,
    slug: apiProject.slug,
    repository: discoveryResultFixture.repositories[0],
    team: 'Commerce',
    framework: discoveryResultFixture.framework,
    tags: ['imported', 'checkout'],
    description: 'Imported from discovery results.',
    status: 'needs_attention',
    blockingCount: 0,
    latestAudit: { state: 'warning', label: 'Needs review', relativeTime: 'Just now' },
    designSystem: {
      state: 'current',
      label: 'Current',
      version: discoveryResultFixture.designSystem,
    },
    latestActivity: 'Project imported from discovery',
    repoCount: discoveryResultFixture.repositories.length,
    lastAudited: 'Never',
  };
}
