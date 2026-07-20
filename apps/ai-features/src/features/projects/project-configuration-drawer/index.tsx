'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  DetectedProjectConfiguration,
  ProjectConfigurationStatus,
} from '@winniekagendo/componentiq-shared-types';
import type { GitProviderConnectionSummary } from '@winniekagendo/componentiq-shared-types';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Progress,
  Select,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Stepper,
  Textarea,
  cn,
  toast,
} from 'componentiq';
import {
  FileArchive,
  FolderOpen,
  Github,
  Info,
  RefreshCcw,
  Search,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import { useForm } from 'react-hook-form';

import {
  useDisconnectGithubConnection,
  useStartGithubConnection,
} from '@/hooks/mutations/use-connect-github';
import { useGithubConnections } from '@/hooks/queries/use-github-connections';
import { useProjectConfiguration } from '@/features/projects/hooks';
import {
  confirmProjectConfiguration as confirmProjectConfigurationRequest,
  uploadLocalProjectSource,
} from '@/lib/api/projects';
import { requireClerkSessionToken } from '@/lib/auth/clerk-session-token';
import { queryKeys } from '@/lib/query/query-keys';

import {
  analysisSteps,
  localExclusions,
  localUploadLimits,
  repoRows,
  stageSteps,
} from './constants';
import type {
  ConfigurationFormValues,
  ConfigurationStateId,
  DirectoryPickerAttributes,
  LocalSourceSelection,
  ProjectConfigurationDrawerProps,
  ProjectConfigurationProject,
} from './types';
import {
  buildConfirmConfigurationInput,
  configurationStateForStatus,
  formatBytes,
  getConfigurationStatus,
  stageIndexForState,
  titleForState,
} from './utils';
import {
  ConfigurationStatusBadge,
  configurationDetail,
} from './status';
import { ProjectConfigurationFooter } from './footer';
import {
  AnalysisFailureStep,
  AnalysisProgressStep,
  AnalysisWarningStep,
  GithubPermissionStep,
  GithubRepoPickerStep,
  GithubReviewStep,
  LocalNoDetectStep,
  LocalPreflightStep,
  LocalUploadStep,
  ResumeStep,
  ReviewSetupStep,
  SourceChoiceStep,
  SuccessStep,
  UploadProgressStep,
} from './steps';

export type {
  ConfigurationStateId,
  ProjectConfigurationProject,
  ProjectConfigurationStatus,
};
export { getConfigurationStatus };
export { ConfigurationStatusBadge };

export function ProjectConfigurationDrawer({
  open,
  orgSlug,
  project,
  initialState,
  onOpenChange,
}: ProjectConfigurationDrawerProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const githubConnections = useGithubConnections(orgSlug);
  const startGithubConnection = useStartGithubConnection(orgSlug);
  const disconnectGithubConnection = useDisconnectGithubConnection(orgSlug);
  const configurationQuery = useProjectConfiguration(orgSlug, project?.id ?? '');
  const [state, setState] = useState<ConfigurationStateId>(
    initialState ?? configurationStateForStatus(getConfigurationStatus(project))
  );
  const [showExclusions, setShowExclusions] = useState(false);
  const [selectedRepoId, setSelectedRepoId] = useState('checkout-web');
  const [repoSearch, setRepoSearch] = useState('');
  const [localSource, setLocalSource] = useState<LocalSourceSelection | null>(null);
  const { getValues, register, setValue, watch } = useForm<ConfigurationFormValues>({
    defaultValues: {
      source: 'github',
      githubAccount: 'Acme',
      repository: 'acme/checkout-web',
      branch: 'main',
      projectRoot: '/',
      workspace: 'apps/web',
      framework: 'Next.js',
      packageManager: 'npm',
      stylingSystem: 'Tailwind CSS',
      componentDirectories: 'src/components, src/features',
      tokenPath: 'src/styles/tokens.css',
      notes: '',
    },
  });

  const currentConfigurationStatus = configurationQuery.data
    ? {
        status: configurationQuery.data.projectStatus,
        detail: configurationDetail(configurationQuery.data),
      }
    : null;
  const uploadLocalSource = useMutation({
    mutationFn: async (selection: LocalSourceSelection) => {
      if (!project) {
        throw new Error('Project is required before uploading source.');
      }
      if (selection.kind === 'zip') {
        throw new Error('Zip extraction is not enabled yet. Choose a folder snapshot for this slice.');
      }
      if (selection.fileCount > localUploadLimits.maxFiles) {
        throw new Error(`Filtered source still contains more than ${localUploadLimits.maxFiles.toLocaleString()} files.`);
      }
      if (selection.totalSize > localUploadLimits.maxBytes) {
        throw new Error(`Filtered source still exceeds ${formatBytes(localUploadLimits.maxBytes)}.`);
      }

      const formData = new FormData();
      for (const file of selection.files) {
        const relativePath =
          (file as File & { webkitRelativePath?: string }).webkitRelativePath ||
          file.name;
        formData.append('files', file, relativePath);
      }

      const token = await requireClerkSessionToken(getToken);
      return uploadLocalProjectSource(orgSlug, project.id, formData, token);
    },
    onSuccess: async response => {
      setState('reviewSetup');
      toast({
        variant: 'success',
        title: 'Source analyzed',
        description: 'Backend detection is ready for review.',
      });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.projectConfiguration(orgSlug, response.projectId),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.projects(orgSlug) }),
      ]);
    },
    onError: error => {
      setState('analysisFailure');
      toast({
        variant: 'error',
        title: 'Upload failed',
        description:
          error instanceof Error
            ? error.message
            : 'ComponentIQ could not upload this local source.',
      });
    },
  });
  const confirmProjectConfiguration = useMutation({
    mutationFn: async () => {
      if (!project) {
        throw new Error('Project is required before confirming configuration.');
      }

      const token = await requireClerkSessionToken(getToken);

      return confirmProjectConfigurationRequest(
        orgSlug,
        project.id,
        buildConfirmConfigurationInput(
          getValues(),
          configurationQuery.data?.detectedConfiguration ?? null
        ),
        token
      );
    },
    onSuccess: async response => {
      setState('success');
      toast({
        variant: 'success',
        title: 'Project configured',
        description: `${project?.name ?? 'Project'} is ready for its first audit.`,
      });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.projectConfiguration(
            orgSlug,
            response.configuration.projectId
          ),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.projects(orgSlug) }),
      ]);
    },
    onError: error => {
      toast({
        variant: 'error',
        title: 'Configuration was not saved',
        description:
          error instanceof Error
            ? error.message
            : 'ComponentIQ could not confirm this project configuration.',
      });
    },
  });
  const githubConnection = githubConnections.data?.[0] ?? null;
  const selectedRepo = repoRows.find(repo => repo.id === selectedRepoId) ?? repoRows[0];
  const filteredRepos = repoRows.filter(repo =>
    repo.name.toLowerCase().includes(repoSearch.trim().toLowerCase())
  );
  const stage = stageIndexForState(state);
  const title = titleForState(state, project?.name ?? 'Project');

  useEffect(() => {
    if (!open) return;
    setState(initialState ?? configurationStateForStatus(getConfigurationStatus(project)));
  }, [initialState, open, project]);

  useEffect(() => {
    if (!open) return;

    const detectedConfiguration = configurationQuery.data?.detectedConfiguration;
    if (!detectedConfiguration) return;

    const setup = detectedConfiguration.setup;
    setValue(
      'framework',
      setup?.framework.value ?? detectedConfiguration.framework ?? 'UNKNOWN'
    );
    setValue(
      'packageManager',
      setup?.packageManager.value ?? detectedConfiguration.packageManager ?? 'UNKNOWN'
    );
    setValue(
      'stylingSystem',
      setup?.stylingSystem.value?.join(', ') ??
        detectedConfiguration.stylingSystem ??
        'UNKNOWN'
    );
    setValue(
      'projectRoot',
      setup?.projectRoot.value ?? detectedConfiguration.projectRoot ?? '/'
    );
    setValue(
      'componentDirectories',
      (setup?.componentPaths.value ?? detectedConfiguration.componentPaths).join(', ')
    );
    setValue(
      'tokenPath',
      (setup?.tokenPaths.value ?? detectedConfiguration.tokenPaths).join(', ')
    );
  }, [configurationQuery.data?.detectedConfiguration, open, setValue]);

  function close() {
    onOpenChange(false);
  }

  function chooseGithub() {
    setValue('source', 'github');
    setState('githubPermission');
  }

  function chooseLocal() {
    setValue('source', 'local');
    setState('localUpload');
  }

  function selectRepo(repoId: string) {
    const repo = repoRows.find(item => item.id === repoId);
    if (!repo || repo.status !== 'Available') return;
    setSelectedRepoId(repoId);
    setValue('repository', repo.name);
    setValue('branch', repo.branch);
  }

  function selectLocalSource(selection: LocalSourceSelection) {
    setLocalSource(selection);
    setState('localPreflight');
  }

  function uploadSelectedLocalSource() {
    if (!localSource) return;
    setState('uploading');
    uploadLocalSource.mutate(localSource);
  }

  function confirmReviewedConfiguration() {
    confirmProjectConfiguration.mutate();
  }

  async function startGithubInstall() {
    const returnPath = pathname ?? `/org/${orgSlug}/projects`;
    const response = await startGithubConnection.mutateAsync(returnPath);

    window.location.assign(response.installationUrl);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        size='lg'
        aria-describedby='project-configuration-description'
        className='sm:w-[min(100vw,680px)]'
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription id='project-configuration-description'>
            Connect a source so ComponentIQ can detect framework, components,
            design tokens, and audit configuration.
          </SheetDescription>
        </SheetHeader>

        <SheetBody>
          <div className='grid gap-5'>
            <Stepper
              steps={stageSteps}
              currentStep={stage}
              className='grid-cols-2 gap-3 sm:grid-cols-4 [&>li]:gap-2'
              aria-label='Configuration progress'
            />

            {currentConfigurationStatus && (
              <div className='flex flex-wrap items-center gap-2 rounded-md border border-border bg-background-secondary px-3 py-2 text-sm text-muted-foreground'>
                <span className='font-medium text-foreground'>Current status:</span>
                <ConfigurationStatusBadge status={currentConfigurationStatus.status} />
                <span>{currentConfigurationStatus.detail}</span>
              </div>
            )}

            {state === 'sourceChoice' && (
              <SourceChoiceStep onGithub={chooseGithub} onLocal={chooseLocal} />
            )}
            {state === 'localUpload' && (
              <LocalUploadStep
                showExclusions={showExclusions}
                onToggleExclusions={() => setShowExclusions(value => !value)}
                onSourceSelected={selectLocalSource}
                onNoDetect={() => setState('localNoDetect')}
              />
            )}
            {state === 'localPreflight' && (
              <LocalPreflightStep
                source={localSource}
                onAnalyze={uploadSelectedLocalSource}
              />
            )}
            {state === 'localNoDetect' && (
              <LocalNoDetectStep
                onUploadAnyway={uploadSelectedLocalSource}
                onChooseAnother={() => setState('localUpload')}
              />
            )}
            {state === 'githubPermission' && (
              <GithubPermissionStep
                connection={githubConnection}
                isLoading={githubConnections.isLoading}
                isStarting={startGithubConnection.isPending}
                isDisconnecting={disconnectGithubConnection.isPending}
                errorMessage={
                  githubConnections.isError
                    ? 'GitHub connection status could not be loaded.'
                    : startGithubConnection.error instanceof Error
                      ? startGithubConnection.error.message
                      : null
                }
                onAuthorize={() => {
                  void startGithubInstall();
                }}
                onDisconnect={connectionId => {
                  void disconnectGithubConnection.mutateAsync(connectionId);
                }}
              />
            )}
            {state === 'githubRepoPicker' && (
              <GithubRepoPickerStep
                repoSearch={repoSearch}
                onRepoSearch={setRepoSearch}
                repos={filteredRepos}
                selectedRepoId={selectedRepoId}
                onSelectRepo={selectRepo}
                register={register}
              />
            )}
            {state === 'githubReview' && (
              <GithubReviewStep selectedRepo={selectedRepo} values={watch()} />
            )}
            {state === 'uploading' && (
              <UploadProgressStep source={localSource} isPending={uploadLocalSource.isPending} />
            )}
            {state === 'analyzing' && (
              <AnalysisProgressStep
                onWarning={() => setState('analysisWarning')}
                onFailure={() => setState('analysisFailure')}
                onReview={() => setState('reviewSetup')}
              />
            )}
            {state === 'analysisWarning' && (
              <AnalysisWarningStep
                onDetails={() => setState('reviewSetup')}
                onContinue={() => setState('reviewSetup')}
              />
            )}
            {state === 'analysisFailure' && (
              <AnalysisFailureStep
                errorMessage={
                  uploadLocalSource.error instanceof Error
                    ? uploadLocalSource.error.message
                    : configurationQuery.data?.lastError?.message ?? null
                }
                onRetry={uploadSelectedLocalSource}
                onDetails={() => setState('resume')}
              />
            )}
            {state === 'reviewSetup' && (
              <ReviewSetupStep
                detectedConfiguration={configurationQuery.data?.detectedConfiguration ?? null}
                register={register}
                values={watch()}
              />
            )}
            {state === 'success' && <SuccessStep projectName={project?.name ?? 'Project'} />}
            {state === 'resume' && (
              <ResumeStep onResume={() => setState('analyzing')} onRestart={() => setState('sourceChoice')} />
            )}
          </div>
        </SheetBody>

        <ProjectConfigurationFooter
          state={state}
          isConfirming={confirmProjectConfiguration.isPending}
          onStateChange={setState}
          onClose={close}
          onConfirm={confirmReviewedConfiguration}
        />
      </SheetContent>
    </Sheet>
  );
}
