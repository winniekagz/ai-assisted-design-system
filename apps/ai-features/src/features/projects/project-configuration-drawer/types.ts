import type { ProjectConfigurationStatus } from '@winniekagendo/componentiq-shared-types';

export type { ProjectConfigurationStatus };

export type ProjectConfigurationProject = {
  id: string;
  name: string;
  slug: string;
  status?: string;
  configurationStatus?: ProjectConfigurationStatus;
};

export type ProjectConfigurationDrawerProps = {
  open: boolean;
  orgSlug: string;
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
  | 'githubReadyToAnalyze'
  | 'uploading'
  | 'analyzing'
  | 'analysisWarning'
  | 'analysisFailure'
  | 'reviewSetup'
  | 'success'
  | 'resume';

export type ConfigurationFormValues = {
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

export type LocalSourceSelection = {
  kind: 'folder' | 'zip';
  name: string;
  fileCount: number;
  ignoredFileCount: number;
  originalFileCount: number;
  totalSize: number;
  files: File[];
};

export type SelectedGithubRepository = {
  connectionId: string;
  repositoryId: string;
  repositoryOwner: string;
  repositoryName: string;
  repositoryFullName: string;
  defaultBranch: string;
  private: boolean;
  updatedAt: string | null;
  sizeKb: number | null;
  installationAccountLogin: string;
};

export type DirectoryPickerAttributes = {
  webkitdirectory: string;
  directory: string;
};
