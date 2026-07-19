'use client';

import { useQuery } from '@tanstack/react-query';
import type { ProjectConfigurationStatus } from '@winniekagendo/componentiq-shared-types';
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Stepper,
  Textarea,
  cn,
  toast,
} from 'componentiq';
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileArchive,
  FolderOpen,
  Github,
  Info,
  Loader2,
  RefreshCcw,
  Search,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import { useForm } from 'react-hook-form';

import { useConnectGithubRepo } from './use-connect-github-repo';

export type { ProjectConfigurationStatus };

export type ProjectConfigurationProject = {
  id: string;
  name: string;
  slug: string;
  status?: string;
};

type ProjectConfigurationDrawerProps = {
  open: boolean;
  project: ProjectConfigurationProject | null;
  initialState?: ConfigurationStateId;
  // eslint-disable-next-line no-unused-vars
  onOpenChange(open: boolean): void;
};

export type ConfigurationStateId =
  | 'sourceChoice'
  | 'localUpload'
  | 'localPreflight'
  | 'localNoDetect'
  | 'githubPermission'
  | 'githubRepoPicker'
  | 'githubReview'
  | 'uploading'
  | 'analyzing'
  | 'analysisWarning'
  | 'analysisFailure'
  | 'reviewSetup'
  | 'success'
  | 'resume';

type ConfigurationFormValues = {
  source: 'github' | 'local';
  githubAccount: string;
  repository: string;
  branch: string;
  projectRoot: string;
  workspace: string;
  framework: string;
  packageManager: string;
  stylingSystem: string;
  componentDirectories: string;
  tokenPath: string;
  notes: string;
};

type LocalSourceSelection = {
  kind: 'folder' | 'zip';
  name: string;
  fileCount: number;
  totalSize: number;
};

type DirectoryPickerAttributes = {
  webkitdirectory: string;
  directory: string;
};

const stageSteps = [
  { id: 'source', label: 'Source' },
  { id: 'setup', label: 'Setup' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'review', label: 'Review' },
];

const repoRows = [
  {
    id: 'checkout-web',
    name: 'acme/checkout-web',
    visibility: 'Private',
    status: 'Available',
    branch: 'main',
  },
  {
    id: 'checkout-mobile',
    name: 'acme/checkout-mobile',
    visibility: 'Private',
    status: 'Already connected',
    branch: 'release/3.4',
  },
  {
    id: 'legacy-admin',
    name: 'acme/legacy-admin',
    visibility: 'Archived',
    status: 'Unavailable',
    branch: 'main',
  },
];

const analysisSteps = [
  'Reading package manifests',
  'Detecting component directories',
  'Finding design token usage',
  'Preparing configuration review',
];

const localExclusions = [
  'node_modules/',
  '.git/',
  'dist/',
  '.next/',
  'coverage/',
  '*.log',
];

const statusLabels: Record<ProjectConfigurationStatus, string> = {
  NOT_CONFIGURED: 'Setup required',
  CONFIGURING: 'Configuring',
  REVIEW_REQUIRED: 'Review setup',
  READY: 'Ready',
  CONFIGURATION_FAILED: 'Setup failed',
  ARCHIVED: 'Archived',
};

export function ProjectConfigurationDrawer({
  open,
  project,
  initialState,
  onOpenChange,
}: ProjectConfigurationDrawerProps) {
  const github = useConnectGithubRepo();
  const [state, setState] = useState<ConfigurationStateId>(
    initialState ?? configurationStateForStatus(getConfigurationStatus(project))
  );
  const [showExclusions, setShowExclusions] = useState(false);
  const [selectedRepoId, setSelectedRepoId] = useState('checkout-web');
  const [repoSearch, setRepoSearch] = useState('');
  const [localSource, setLocalSource] = useState<LocalSourceSelection | null>(null);
  const { register, setValue, watch } = useForm<ConfigurationFormValues>({
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

  const statusQuery = useProjectConfigurationStatus(project);
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

  function confirmConfiguration() {
    setState('success');
    toast({
      variant: 'success',
      title: 'Project configured',
      description: `${project?.name ?? 'Project'} is ready for its first audit.`,
    });
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

            {statusQuery.data && (
              <div className='flex flex-wrap items-center gap-2 rounded-md border border-border bg-background-secondary px-3 py-2 text-sm text-muted-foreground'>
                <span className='font-medium text-foreground'>Current status:</span>
                <ConfigurationStatusBadge status={statusQuery.data.status} />
                <span>{statusQuery.data.detail}</span>
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
                onAnalyze={() => setState('uploading')}
              />
            )}
            {state === 'localNoDetect' && (
              <LocalNoDetectStep
                onUploadAnyway={() => setState('uploading')}
                onChooseAnother={() => setState('localUpload')}
              />
            )}
            {state === 'githubPermission' && (
              <GithubPermissionStep
                githubAvailable={github.isAvailable}
                onAuthorize={() => {
                  void github.connect('repository').catch(() => undefined);
                  setState('githubRepoPicker');
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
              <UploadProgressStep onComplete={() => setState('analyzing')} />
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
                onRetry={() => setState('analyzing')}
                onDetails={() => setState('resume')}
              />
            )}
            {state === 'reviewSetup' && (
              <ReviewSetupStep register={register} values={watch()} />
            )}
            {state === 'success' && <SuccessStep projectName={project?.name ?? 'Project'} />}
            {state === 'resume' && (
              <ResumeStep onResume={() => setState('analyzing')} onRestart={() => setState('sourceChoice')} />
            )}
          </div>
        </SheetBody>

        <SheetFooter className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <Button type='button' variant='outlined' onClick={() => setState(previousState(state))}>
            <ChevronLeft className='mr-2 size-4' aria-hidden='true' />
            Back
          </Button>
          <div className='flex flex-wrap justify-end gap-2'>
            {state === 'sourceChoice' && (
              <Button type='button' variant='outlined' onClick={close}>
                I&apos;ll do this later
              </Button>
            )}
            {state === 'githubRepoPicker' && (
              <Button type='button' onClick={() => setState('githubReview')}>
                Review connection
              </Button>
            )}
            {state === 'githubReview' && (
              <Button type='button' onClick={() => setState('analyzing')}>
                Connect and analyze
              </Button>
            )}
            {state === 'reviewSetup' && (
              <>
                <Button type='button' variant='outlined' onClick={close}>
                  Save and review later
                </Button>
                <Button type='button' onClick={confirmConfiguration}>
                  Confirm configuration
                </Button>
              </>
            )}
            {state === 'success' && (
              <>
                <Button type='button' variant='outlined' onClick={close}>
                  View project
                </Button>
                <Button type='button' disabled title='Audit workflow API is not implemented yet.'>
                  Run first audit
                </Button>
              </>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function ConfigurationStatusBadge({
  status,
}: {
  status: ProjectConfigurationStatus;
}) {
  const meta = {
    NOT_CONFIGURED: { icon: Clock, className: 'border-border bg-background-secondary text-muted-foreground' },
    CONFIGURING: { icon: Loader2, className: 'border-status-info bg-status-info-bg text-status-info' },
    REVIEW_REQUIRED: { icon: AlertCircle, className: 'border-status-warning bg-status-warning-bg text-status-warning' },
    READY: { icon: CheckCircle2, className: 'border-status-success bg-status-success-bg text-status-success' },
    CONFIGURATION_FAILED: { icon: AlertCircle, className: 'border-status-error bg-status-error-bg text-status-error' },
    ARCHIVED: { icon: Archive, className: 'border-border bg-background-secondary text-muted-foreground' },
  } satisfies Record<ProjectConfigurationStatus, { icon: typeof Clock; className: string }>;
  const Icon = meta[status].icon;

  return (
    <span className={cn('inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold', meta[status].className)}>
      <Icon className={cn('size-3.5', status === 'CONFIGURING' && 'animate-spin')} aria-hidden='true' />
      {statusLabels[status]}
    </span>
  );
}

export function getConfigurationStatus(project?: Pick<ProjectConfigurationProject, 'status'> | null): ProjectConfigurationStatus {
  if (!project) return 'NOT_CONFIGURED';
  if (project.status === 'archived') return 'ARCHIVED';
  if (project.status === 'healthy') return 'READY';
  if (project.status === 'needs_attention') return 'REVIEW_REQUIRED';
  if (project.status === 'blocked') return 'CONFIGURATION_FAILED';
  return 'NOT_CONFIGURED';
}

function useProjectConfigurationStatus(project: ProjectConfigurationProject | null) {
  return useQuery({
    queryKey: ['project-configuration', project?.id ?? 'unknown'],
    queryFn: async () => ({
      status: getConfigurationStatus(project),
      detail: 'Configuration state is mocked until source-connection APIs exist.',
    }),
    enabled: Boolean(project),
    staleTime: 1000 * 60,
  });
}

function SourceChoiceStep({
  onGithub,
  onLocal,
}: {
  onGithub(): void;
  onLocal(): void;
}) {
  return (
    <div className='grid gap-3 sm:grid-cols-2'>
      <SourceCard
        icon={<Github className='size-5' />}
        title='Connect Git repository'
        description='Best for team projects and continuous checks. Requires repository read access.'
        action='Choose GitHub'
        onClick={onGithub}
      />
      <SourceCard
        icon={<Upload className='size-5' />}
        title='Upload local project'
        description='Best for a point-in-time snapshot. Uploads can be deleted after analysis.'
        action='Choose upload'
        onClick={onLocal}
      />
    </div>
  );
}

function SourceCard({
  icon,
  title,
  description,
  action,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action: string;
  onClick(): void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='grid gap-3 rounded-md border border-border bg-background px-4 py-4 text-left transition-colors hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
    >
      <span className='text-primary' aria-hidden='true'>{icon}</span>
      <span>
        <span className='block font-semibold text-foreground'>{title}</span>
        <span className='mt-1 block text-sm leading-6 text-muted-foreground'>{description}</span>
      </span>
      <span className='text-sm font-semibold text-primary'>{action}</span>
    </button>
  );
}

function LocalUploadStep({
  showExclusions,
  onToggleExclusions,
  onSourceSelected,
  onNoDetect,
}: {
  showExclusions: boolean;
  onToggleExclusions(): void;
  // eslint-disable-next-line no-unused-vars
  onSourceSelected(selection: LocalSourceSelection): void;
  onNoDetect(): void;
}) {
  const folderInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const directoryPickerAttributes: DirectoryPickerAttributes = {
    webkitdirectory: '',
    directory: '',
  };

  function handleFolderChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const firstFile = files[0] as File & { webkitRelativePath?: string };
    const rootFolder =
      firstFile.webkitRelativePath?.split('/').filter(Boolean)[0] ?? firstFile.name;

    onSourceSelected({
      kind: 'folder',
      name: rootFolder,
      fileCount: files.length,
      totalSize: totalFileSize(files),
    });
    event.target.value = '';
  }

  function handleZipChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    onSourceSelected({
      kind: 'zip',
      name: file.name,
      fileCount: 1,
      totalSize: file.size,
    });
    event.target.value = '';
  }

  return (
    <div className='grid gap-4'>
      <input
        ref={folderInputRef}
        type='file'
        multiple
        className='sr-only'
        onChange={handleFolderChange}
        {...directoryPickerAttributes}
      />
      <input
        ref={zipInputRef}
        type='file'
        accept='.zip,application/zip,application/x-zip-compressed'
        className='sr-only'
        onChange={handleZipChange}
      />
      <div className='grid min-h-52 place-items-center rounded-md border border-dashed border-border bg-background-secondary px-4 py-8 text-center'>
        <div>
          <FolderOpen className='mx-auto size-8 text-primary' aria-hidden='true' />
          <h3 className='mt-3 text-lg font-semibold text-foreground'>Choose a project folder</h3>
          <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground'>
            Upload a folder or .zip archive. ComponentIQ excludes generated files,
            dependencies, and build outputs before analysis.
          </p>
          <div className='mt-4 flex flex-wrap justify-center gap-2'>
            <Button
              type='button'
              onClick={() => folderInputRef.current?.click()}
              startIcon={<FolderOpen className='size-4' />}
            >
              Choose project folder
            </Button>
            <Button
              type='button'
              variant='outlined'
              onClick={() => zipInputRef.current?.click()}
              startIcon={<FileArchive className='size-4' />}
            >
              Upload a .zip instead
            </Button>
          </div>
        </div>
      </div>
      <div className='rounded-md border border-border bg-background px-4 py-3 text-sm text-muted-foreground'>
        <p>
          Max size 250 MB. Folder selection uses the browser file picker; if your
          browser does not support folder picking, upload a .zip instead.
        </p>
        <button type='button' className='mt-2 font-semibold text-primary' onClick={onToggleExclusions}>
          {showExclusions ? 'Hide exclusions' : 'Show auto-excluded paths'}
        </button>
        {showExclusions && (
          <ul className='mt-3 grid gap-1 font-mono text-xs'>
            {localExclusions.map(item => <li key={item}>{item}</li>)}
          </ul>
        )}
      </div>
      <Button type='button' variant='outlined' onClick={onNoDetect}>
        Preview no-detect state
      </Button>
    </div>
  );
}

function LocalPreflightStep({
  source,
  onAnalyze,
}: {
  source: LocalSourceSelection | null;
  onAnalyze(): void;
}) {
  const rows = [
    ['Selected source', source ? source.name : 'No source selected', source ? 'Detected' : 'Warning'],
    ['Framework', 'Next.js', 'Detected'],
    ['Language', 'TypeScript', 'Detected'],
    ['Package manager', 'npm', 'Detected'],
    ['Styling', 'Tailwind CSS', 'Warning'],
    [
      'Files',
      source
        ? `${source.fileCount.toLocaleString()} ${source.fileCount === 1 ? 'file' : 'files'} · ${formatBytes(source.totalSize)}`
        : 'Waiting for selection',
      source ? 'Detected' : 'Warning',
    ],
  ];

  return (
    <div className='grid gap-4'>
      <StatusCallout tone='info' title='Preflight complete' detail='Review what ComponentIQ detected before uploading this snapshot.' />
      <div className='grid gap-2'>
        {rows.map(([label, value, status]) => (
          <div key={label} className='flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2'>
            <span className='text-sm text-muted-foreground'>{label}</span>
            <span className='flex items-center gap-2 text-sm font-medium text-foreground'>
              {value}
              <Badge status={status === 'Warning' ? 'warning' : 'success'}>{status}</Badge>
            </span>
          </div>
        ))}
      </div>
      <Button type='button' onClick={onAnalyze}>Upload and analyze</Button>
    </div>
  );
}

function totalFileSize(files: File[]) {
  return files.reduce((total, file) => total + file.size, 0);
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;

  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
}

function LocalNoDetectStep({
  onUploadAnyway,
  onChooseAnother,
}: {
  onUploadAnyway(): void;
  onChooseAnother(): void;
}) {
  return (
    <div className='grid gap-4'>
      <StatusCallout
        tone='warning'
        title='No recognizable project setup found'
        detail='ComponentIQ could not confidently detect framework or package metadata. You can continue anyway or pick another folder.'
      />
      <div className='flex flex-wrap gap-2'>
        <Button type='button' onClick={onUploadAnyway}>Upload anyway</Button>
        <Button type='button' variant='outlined' onClick={onChooseAnother}>Choose another folder</Button>
      </div>
    </div>
  );
}

function GithubPermissionStep({
  githubAvailable,
  onAuthorize,
}: {
  githubAvailable: boolean;
  onAuthorize(): void;
}) {
  return (
    <div className='grid gap-4'>
      <StatusCallout
        tone='info'
        title='GitHub OAuth is pending backend wiring'
        detail='This pass shows the permission review and repository picker without claiming a real connection.'
      />
      <PermissionList
        title='ComponentIQ requests permission to'
        items={[
          'Read repository metadata and source files',
          'Read branches needed for configuration',
          'Store detected setup for this project',
        ]}
      />
      <PermissionList
        title='ComponentIQ cannot'
        items={[
          'Push code to your repository',
          'Read secrets or encrypted CI variables',
          'Run audits until you confirm configuration',
        ]}
      />
      <Button type='button' disabled={!githubAvailable} title={!githubAvailable ? 'GitHub OAuth/repository picker is not wired yet.' : undefined} onClick={onAuthorize}>
        Continue to repository picker
      </Button>
      {!githubAvailable && (
        <Button type='button' variant='outlined' onClick={onAuthorize}>
          Preview repository picker
        </Button>
      )}
    </div>
  );
}

function PermissionList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className='rounded-md border border-border bg-background py-0 shadow-none'>
      <CardContent className='px-4 py-4'>
        <h3 className='font-semibold text-foreground'>{title}</h3>
        <ul className='mt-3 grid gap-2 text-sm text-muted-foreground'>
          {items.map(item => (
            <li key={item} className='flex gap-2'>
              <ShieldCheck className='mt-0.5 size-4 shrink-0 text-primary' aria-hidden='true' />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function GithubRepoPickerStep({
  repoSearch,
  onRepoSearch,
  repos,
  selectedRepoId,
  onSelectRepo,
  register,
}: {
  repoSearch: string;
  // eslint-disable-next-line no-unused-vars
  onRepoSearch(value: string): void;
  repos: typeof repoRows;
  selectedRepoId: string;
  // eslint-disable-next-line no-unused-vars
  onSelectRepo(repoId: string): void;
  register: ReturnType<typeof useForm<ConfigurationFormValues>>['register'];
}) {
  return (
    <div className='grid gap-4'>
      <Select label='GitHub account' {...register('githubAccount')}>
        <option>Acme</option>
        <option>Personal repositories</option>
      </Select>
      <Input
        label='Search repositories'
        value={repoSearch}
        onChange={event => onRepoSearch(event.target.value)}
        startIcon={<Search className='size-4 text-muted-foreground' />}
      />
      <div className='grid gap-2'>
        {repos.map(repo => {
          const disabled = repo.status !== 'Available';
          const selected = selectedRepoId === repo.id;
          return (
            <button
              key={repo.id}
              type='button'
              disabled={disabled}
              onClick={() => onSelectRepo(repo.id)}
              className={cn(
                'flex flex-col gap-2 rounded-md border px-3 py-3 text-left transition-colors sm:flex-row sm:items-center sm:justify-between',
                selected ? 'border-primary bg-primary-50' : 'border-border bg-background',
                disabled && 'cursor-not-allowed opacity-60'
              )}
            >
              <span>
                <span className='block font-mono text-sm font-semibold text-foreground'>{repo.name}</span>
                <span className='mt-1 block text-xs text-muted-foreground'>{repo.visibility} · default {repo.branch}</span>
              </span>
              <Badge status={repo.status === 'Available' ? 'success' : 'warning'}>{repo.status}</Badge>
            </button>
          );
        })}
      </div>
      <div className='grid gap-3 sm:grid-cols-2'>
        <Input label='Branch' {...register('branch')} />
        <Input label='Project path' placeholder='/' {...register('projectRoot')} />
      </div>
    </div>
  );
}

function GithubReviewStep({
  selectedRepo,
  values,
}: {
  selectedRepo: typeof repoRows[number];
  values: ConfigurationFormValues;
}) {
  return (
    <div className='grid gap-4'>
      <StatusCallout tone='info' title='Review connection' detail='Confirm how ComponentIQ should access this repository before analysis starts.' />
      <SummaryRows rows={[
        ['Repository', selectedRepo.name],
        ['Branch', values.branch],
        ['Project path', values.projectRoot || '/'],
        ['Connection type', 'Continuous'],
        ['Requested access', 'Read-only'],
      ]} />
    </div>
  );
}

function UploadProgressStep({ onComplete }: { onComplete(): void }) {
  return (
    <div className='grid gap-4' aria-live='polite'>
      <Progress value={72} label='Uploading project snapshot' showValue />
      <StatusCallout tone='info' title='Uploading source' detail='Keep this drawer open or continue later. Analysis can resume after upload completes.' />
      <Button type='button' onClick={onComplete}>Simulate upload complete</Button>
    </div>
  );
}

function AnalysisProgressStep({
  onWarning,
  onFailure,
  onReview,
}: {
  onWarning(): void;
  onFailure(): void;
  onReview(): void;
}) {
  return (
    <div className='grid gap-4'>
      <div className='rounded-md border border-border bg-background px-4 py-4'>
        <h3 className='font-semibold text-foreground'>Analyzing source</h3>
        <ol className='mt-4 grid gap-3'>
          {analysisSteps.map((step, index) => (
            <li key={step} className='flex items-center gap-3 text-sm'>
              {index < 2 ? (
                <CheckCircle2 className='size-4 text-status-success' aria-hidden='true' />
              ) : index === 2 ? (
                <Loader2 className='size-4 animate-spin text-primary' aria-hidden='true' />
              ) : (
                <Clock className='size-4 text-muted-foreground' aria-hidden='true' />
              )}
              <span className={index <= 2 ? 'text-foreground' : 'text-muted-foreground'}>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <StatusCallout tone='info' title='You can leave this page' detail='Analysis continues in the background and can be resumed from the project.' />
      <div className='flex flex-wrap gap-2'>
        <Button type='button' onClick={onReview}>Continue to review</Button>
        <Button type='button' variant='outlined' onClick={onWarning}>Preview warning</Button>
        <Button type='button' variant='outlined' onClick={onFailure}>Preview failure</Button>
      </div>
    </div>
  );
}

function AnalysisWarningStep({
  onDetails,
  onContinue,
}: {
  onDetails(): void;
  onContinue(): void;
}) {
  return (
    <div className='grid gap-4'>
      <StatusCallout tone='warning' title='Analysis completed with warnings' detail='ComponentIQ detected a project setup but a few paths need review before audits are enabled.' />
      <div className='flex flex-wrap gap-2'>
        <Button type='button' variant='outlined' onClick={onDetails}>View details</Button>
        <Button type='button' onClick={onContinue}>Continue to review</Button>
      </div>
    </div>
  );
}

function AnalysisFailureStep({
  onRetry,
  onDetails,
}: {
  onRetry(): void;
  onDetails(): void;
}) {
  return (
    <div className='grid gap-4'>
      <StatusCallout tone='error' title='Analysis could not be completed' detail='The uploaded source is still available. Retry analysis or review technical details without exposing raw stack traces here.' />
      <Textarea readOnly value={'Analyzer exited before framework detection. Retry usually resolves transient source parsing failures.'} />
      <div className='flex flex-wrap gap-2'>
        <Button type='button' onClick={onRetry} startIcon={<RefreshCcw className='size-4' />}>Retry analysis</Button>
        <Button type='button' variant='outlined' onClick={onDetails}>View technical details</Button>
      </div>
    </div>
  );
}

function ReviewSetupStep({
  register,
  values,
}: {
  register: ReturnType<typeof useForm<ConfigurationFormValues>>['register'];
  values: ConfigurationFormValues;
}) {
  return (
    <div className='grid gap-4'>
      <StatusCallout tone='info' title='Review detected setup' detail='Only uncertain fields are editable before saving this configuration.' />
      <SummaryRows rows={[
        ['Framework', `${values.framework} · High confidence · package.json`],
        ['Package manager', `${values.packageManager} · High confidence · lockfile`],
        ['Styling system', `${values.stylingSystem} · Medium confidence · CSS imports`],
      ]} />
      <div className='grid gap-3'>
        <Input label='Project root' {...register('projectRoot')} />
        <Input label='Component directories' {...register('componentDirectories')} />
        <Input label='Design-token path' {...register('tokenPath')} />
        <div className='grid gap-2'>
          <label className='text-sm font-medium text-muted-foreground' htmlFor='configuration-reviewer-notes'>
            Reviewer notes
          </label>
          <Textarea id='configuration-reviewer-notes' {...register('notes')} />
        </div>
      </div>
    </div>
  );
}

function SuccessStep({ projectName }: { projectName: string }) {
  return (
    <div className='grid gap-4 text-center'>
      <div className='rounded-md border border-status-success bg-status-success-bg px-4 py-6'>
        <CheckCircle2 className='mx-auto size-8 text-status-success' aria-hidden='true' />
        <h3 className='mt-3 text-lg font-semibold text-foreground'>Project configured</h3>
        <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground'>
          {projectName} has connected source information and saved detected setup.
        </p>
      </div>
    </div>
  );
}

function ResumeStep({
  onResume,
  onRestart,
}: {
  onResume(): void;
  onRestart(): void;
}) {
  return (
    <div className='grid gap-4'>
      <StatusCallout tone='info' title='Resume configuration' detail='Upload complete, analysis pending. Continue from the interrupted state instead of restarting.' />
      <div className='flex flex-wrap gap-2'>
        <Button type='button' onClick={onResume}>Resume setup</Button>
        <Button type='button' variant='outlined' onClick={onRestart}>Start over</Button>
      </div>
    </div>
  );
}

function StatusCallout({
  tone,
  title,
  detail,
}: {
  tone: 'info' | 'warning' | 'error';
  title: string;
  detail: string;
}) {
  const classes = {
    info: 'border-status-info bg-status-info-bg',
    warning: 'border-status-warning bg-status-warning-bg',
    error: 'border-status-error bg-status-error-bg',
  }[tone];
  const Icon = tone === 'info' ? Info : AlertCircle;

  return (
    <div role={tone === 'error' ? 'alert' : undefined} className={cn('flex gap-3 rounded-md border px-4 py-3', classes)}>
      <Icon className='mt-0.5 size-5 shrink-0' aria-hidden='true' />
      <div>
        <h3 className='font-semibold text-foreground'>{title}</h3>
        <p className='mt-1 text-sm leading-6 text-muted-foreground'>{detail}</p>
      </div>
    </div>
  );
}

function SummaryRows({ rows }: { rows: [string, string][] }) {
  return (
    <div className='grid gap-2'>
      {rows.map(([label, value]) => (
        <div key={label} className='flex flex-col gap-1 rounded-md border border-border bg-background px-3 py-2 sm:flex-row sm:items-center sm:justify-between'>
          <span className='text-sm text-muted-foreground'>{label}</span>
          <span className='text-sm font-medium text-foreground'>{value}</span>
        </div>
      ))}
    </div>
  );
}

function stageIndexForState(state: ConfigurationStateId) {
  if (state.startsWith('github') || state.startsWith('local')) return state === 'sourceChoice' ? 0 : 1;
  if (state === 'sourceChoice') return 0;
  if (state === 'uploading' || state === 'analyzing' || state.startsWith('analysis') || state === 'resume') return 2;
  return 3;
}

function titleForState(state: ConfigurationStateId, projectName: string) {
  if (state === 'sourceChoice') return `Configure ${projectName}`;
  if (state === 'success') return 'Project configured';
  if (state === 'resume') return 'Resume project configuration';
  return 'Project configuration';
}

function previousState(state: ConfigurationStateId): ConfigurationStateId {
  const previous: Partial<Record<ConfigurationStateId, ConfigurationStateId>> = {
    localUpload: 'sourceChoice',
    localPreflight: 'localUpload',
    localNoDetect: 'localUpload',
    githubPermission: 'sourceChoice',
    githubRepoPicker: 'githubPermission',
    githubReview: 'githubRepoPicker',
    uploading: 'localPreflight',
    analyzing: 'sourceChoice',
    analysisWarning: 'analyzing',
    analysisFailure: 'analyzing',
    reviewSetup: 'analyzing',
    success: 'reviewSetup',
    resume: 'sourceChoice',
  };

  return previous[state] ?? 'sourceChoice';
}

function configurationStateForStatus(status: ProjectConfigurationStatus): ConfigurationStateId {
  if (status === 'CONFIGURING') return 'resume';
  if (status === 'REVIEW_REQUIRED') return 'reviewSetup';
  if (status === 'CONFIGURATION_FAILED') return 'analysisFailure';
  return 'sourceChoice';
}
