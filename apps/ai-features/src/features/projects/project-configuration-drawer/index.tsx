'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  GitHubRepositorySummary,
  ProjectConfigurationStatus,
} from '@winniekagendo/componentiq-shared-types';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Stepper,
  toast,
} from 'componentiq';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useProjectConfiguration } from '@/features/projects/hooks';
import {
  useDisconnectGithubConnection,
  useStartGithubConnection,
} from '@/hooks/mutations/use-connect-github';
import { useGithubConnections } from '@/hooks/queries/use-github-connections';
import { useGithubRepositories } from '@/hooks/queries/use-github-repositories';
import { ApiError } from '@/lib/api/client';
import {
  confirmProjectConfiguration as confirmProjectConfigurationRequest,
  uploadLocalProjectSource,
} from '@/lib/api/projects';
import { requireClerkSessionToken } from '@/lib/auth/clerk-session-token';
import { queryKeys } from '@/lib/query/query-keys';

import {
  localUploadLimits,
  stageSteps,
} from './constants';
import { ProjectConfigurationFooter } from './footer';
import {
  ConfigurationStatusBadge,
  configurationDetail,
} from './status';
import {
  AnalysisFailureStep,
  AnalysisProgressStep,
  AnalysisWarningStep,
  GithubPermissionStep,
  GithubReadyToAnalyzeStep,
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
import type {
  ConfigurationFormValues,
  ConfigurationStateId,
  LocalSourceSelection,
  ProjectConfigurationDrawerProps,
  ProjectConfigurationProject,
  SelectedGithubRepository,
} from './types';
import {
  buildConfirmConfigurationInput,
  configurationStateForStatus,
  formatBytes,
  getConfigurationStatus,
  stageIndexForState,
  titleForState,
} from './utils';

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
  const githubConnection = githubConnections.data?.[0] ?? null;
  const [repositoryCursor, setRepositoryCursor] = useState<string | null>(null);
  const githubRepositories = useGithubRepositories(
    orgSlug,
    githubConnection?.id,
    repositoryCursor
  );
  const [state, setState] = useState<ConfigurationStateId>(
    initialState ?? configurationStateForStatus(getConfigurationStatus(project))
  );
  const [showExclusions, setShowExclusions] = useState(false);
  const [selectedGithubRepository, setSelectedGithubRepository] =
    useState<SelectedGithubRepository | null>(null);
  const [confirmedGithubRepository, setConfirmedGithubRepository] =
    useState<SelectedGithubRepository | null>(null);
  const [repoSearch, setRepoSearch] = useState('');
  const [localSource, setLocalSource] = useState<LocalSourceSelection | null>(null);
  const { getValues, register, setValue, watch } = useForm<ConfigurationFormValues>({
    defaultValues: {
      source: 'github',
      githubAccount: '',
      repository: '',
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
  const repositories = githubRepositories.data?.repositories ?? [];
  const selectedRepo = selectedGithubRepository;
  const selectedRepositoryForPicker: GitHubRepositorySummary | null =
    selectedGithubRepository
      ? {
          id: selectedGithubRepository.repositoryId,
          owner: selectedGithubRepository.repositoryOwner,
          name: selectedGithubRepository.repositoryName,
          fullName: selectedGithubRepository.repositoryFullName,
          defaultBranch: selectedGithubRepository.defaultBranch,
          private: selectedGithubRepository.private,
          updatedAt: selectedGithubRepository.updatedAt,
          sizeKb: selectedGithubRepository.sizeKb,
        }
      : null;
  const stage = stageIndexForState(state);
  const title = titleForState(state, project?.name ?? 'Project');
  const analysisErrorMessage =
    uploadLocalSource.error instanceof Error
      ? uploadLocalSource.error.message
      : configurationQuery.data?.lastError?.message ?? null;

  useEffect(() => {
    if (!open) return;
    setState(initialState ?? configurationStateForStatus(getConfigurationStatus(project)));
  }, [initialState, open, project]);

  useEffect(() => {
    if (!open) return;
    setRepositoryCursor(null);
    setRepoSearch('');
    setSelectedGithubRepository(null);
    setConfirmedGithubRepository(null);
  }, [githubConnection?.id, open]);

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
    setLocalSource(null);
    setState('githubPermission');
  }

  function chooseLocal() {
    setValue('source', 'local');
    setSelectedGithubRepository(null);
    setState('localUpload');
  }

  function selectRepo(repo: GitHubRepositorySummary) {
    if (!githubConnection) return;

    setSelectedGithubRepository({
      connectionId: githubConnection.id,
      repositoryId: repo.id,
      repositoryOwner: repo.owner,
      repositoryName: repo.name,
      repositoryFullName: repo.fullName,
      defaultBranch: repo.defaultBranch,
      private: repo.private,
      updatedAt: repo.updatedAt,
      sizeKb: repo.sizeKb,
      installationAccountLogin: githubConnection.accountLogin,
    });
    setConfirmedGithubRepository(null);
    setValue('repository', repo.fullName);
    setValue('branch', repo.defaultBranch);
    setValue('githubAccount', repo.owner);
  }

  function changeGithubRepository() {
    setSelectedGithubRepository(null);
    setConfirmedGithubRepository(null);
    setRepoSearch('');
    setValue('repository', '');
    setValue('githubAccount', '');
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

  function confirmGithubRepository() {
    if (!selectedGithubRepository) return;

    setConfirmedGithubRepository({
      ...selectedGithubRepository,
      defaultBranch: getValues('branch') || selectedGithubRepository.defaultBranch,
    });
    setState('githubReadyToAnalyze');
    toast({
      variant: 'success',
      title: 'Repository confirmed',
      description: 'Repository metadata is saved to this setup draft.',
    });
  }

  function confirmReviewedConfiguration() {
    confirmProjectConfiguration.mutate();
  }

  function configureGithubAccess() {
    const configureUrl =
      githubRepositories.data?.configureUrl ?? githubConnection?.configureUrl;

    if (!configureUrl || !isSafeGithubUrl(configureUrl)) {
      toast({
        variant: 'error',
        title: 'GitHub access could not be opened',
        description: 'Reconnect GitHub and try configuring repository access again.',
      });
      return;
    }

    window.open(configureUrl, '_blank', 'noopener,noreferrer');
  }

  function refreshGithubRepositories() {
    void githubRepositories.refetch();
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
                onContinue={() => setState('githubRepoPicker')}
                onDisconnect={connectionId => {
                  void disconnectGithubConnection.mutateAsync(connectionId);
                }}
              />
            )}
            {state === 'githubRepoPicker' && (
              <GithubRepoPickerStep
                repoSearch={repoSearch}
                onRepoSearch={setRepoSearch}
                repositories={repositories}
                selectedRepoId={selectedGithubRepository?.repositoryId ?? ''}
                onSelectRepo={selectRepo}
                register={register}
                isLoading={githubRepositories.isLoading}
                isError={githubRepositories.isError}
                isFetching={githubRepositories.isFetching}
                errorMessage={
                  githubRepositories.error instanceof Error
                    ? githubRepositories.error.message
                    : null
                }
                nextCursor={
                  githubRepositories.data?.pagination.nextCursor ?? null
                }
                onRetry={() => {
                  void githubRepositories.refetch();
                }}
                onRefresh={refreshGithubRepositories}
                onConfigureAccess={configureGithubAccess}
                onReconnectGithub={() => {
                  void startGithubInstall();
                }}
                onClearSearch={() => setRepoSearch('')}
                onNextPage={() => {
                  setRepositoryCursor(
                    githubRepositories.data?.pagination.nextCursor ?? null
                  );
                  setRepoSearch('');
                }}
                connection={githubRepositories.data?.connection ?? githubConnection}
                configureUrl={
                  githubRepositories.data?.configureUrl ??
                  githubConnection?.configureUrl ??
                  null
                }
                errorKind={getGithubRepositoryErrorKind(githubRepositories.error)}
                isRefreshing={
                  githubRepositories.isFetching && !githubRepositories.isLoading
                }
                selectedRepository={selectedRepositoryForPicker}
                onChangeRepository={changeGithubRepository}
              />
            )}
            {state === 'githubReview' && (
              <GithubReviewStep
                selectedRepo={selectedRepo}
                values={watch()}
                onChangeRepository={() => setState('githubRepoPicker')}
              />
            )}
            {state === 'githubReadyToAnalyze' && (
              <GithubReadyToAnalyzeStep
                selectedRepo={confirmedGithubRepository ?? selectedRepo}
              />
            )}
            {state === 'uploading' && (
              <UploadProgressStep
                source={localSource}
                isPending={uploadLocalSource.isPending}
              />
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
                errorMessage={analysisErrorMessage}
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
          canReviewGithub={Boolean(selectedRepo)}
          onStateChange={setState}
          onClose={close}
          onConfirm={confirmReviewedConfiguration}
          onConfirmGithubRepository={confirmGithubRepository}
        />
      </SheetContent>
    </Sheet>
  );
}

function isSafeGithubUrl(value: string) {
  try {
    const url = new URL(value);
    return url.origin === 'https://github.com';
  } catch {
    return false;
  }
}

function getGithubRepositoryErrorKind(error: unknown) {
  if (!(error instanceof ApiError)) {
    return error ? 'network' : undefined;
  }

  const errorCode =
    typeof error.details === 'object' &&
    error.details !== null &&
    'errorCode' in error.details
      ? String((error.details as { errorCode?: unknown }).errorCode)
      : '';

  if (errorCode === 'source_installation_revoked') return 'revoked';
  if (errorCode === 'source_github_rate_limited') return 'rate-limit';
  if (errorCode === 'source_fetch_failed' && error.status >= 500) {
    return 'temporary';
  }
  if (error.status === 410) return 'revoked';
  if (error.status === 429) return 'rate-limit';
  if (error.status >= 500) return 'temporary';
  if (error.status === 403 || error.status === 401) return 'inactive';

  return 'generic';
}
