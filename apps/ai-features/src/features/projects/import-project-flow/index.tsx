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

import { createProject } from '@/lib/api/projects';

import {
  discoveryResultFixture,
  discoverySources,
  discoverySteps,
  recentUploadFixtures,
  type DiscoverySource,
  type DiscoverySourceId,
} from '@/features/projects/fixtures/import-flow';
import { useConnectGithubRepo } from '@/features/projects/use-connect-github-repo';
import { projectRowFromImport } from './mapper';
import { flowSteps, type DiscoveryError, type FlowStep, type ImportProjectFlowProps } from './types';

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
          description: 'Imported from discovery results.',
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

import {
  ChooseSourceStep,
  ConfirmationStep,
  ConnectSourceStep,
  DiscoveryErrorBanner,
  DiscoveryProgressStep,
  DiscoveryResultsStep,
} from './steps';
