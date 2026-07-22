import type {
  ConfirmProjectConfigurationInput,
  DetectedProjectConfiguration,
} from '@winniekagendo/componentiq-shared-types';

import type {
  ConfigurationFormValues,
  ConfigurationStateId,
  ProjectConfigurationProject,
  ProjectConfigurationStatus,
} from './types';
import { localExclusions } from './constants';

export function getConfigurationStatus(project?: Pick<ProjectConfigurationProject, 'configurationStatus' | 'status'> | null): ProjectConfigurationStatus {
  if (!project) return 'NOT_CONFIGURED';
  if (project.configurationStatus) return project.configurationStatus;
  if (project.status === 'archived') return 'ARCHIVED';
  if (project.status === 'healthy') return 'READY';
  if (project.status === 'needs_attention') return 'REVIEW_REQUIRED';
  if (project.status === 'blocked') return 'CONFIGURATION_FAILED';
  return 'NOT_CONFIGURED';
}

export function buildConfirmConfigurationInput(
  values: ConfigurationFormValues,
  detectedConfiguration: DetectedProjectConfiguration | null
): ConfirmProjectConfigurationInput {
  const setup = detectedConfiguration?.setup;
  const componentPaths = parsePathList(values.componentDirectories);
  const tokenPaths = parsePathList(values.tokenPath);

  return {
    framework:
      cleanOptional(values.framework) ??
      setup?.framework.value ??
      detectedConfiguration?.framework ??
      undefined,
    language:
      setup?.language.value ?? detectedConfiguration?.language ?? undefined,
    packageManager:
      cleanOptional(values.packageManager) ??
      setup?.packageManager.value ??
      detectedConfiguration?.packageManager ??
      undefined,
    stylingSystem:
      cleanOptional(values.stylingSystem) ??
      setup?.stylingSystem.value?.join(', ') ??
      detectedConfiguration?.stylingSystem ??
      undefined,
    projectRoot:
      cleanOptional(values.projectRoot) ??
      setup?.projectRoot.value ??
      detectedConfiguration?.projectRoot ??
      undefined,
    componentPaths:
      componentPaths.length > 0
        ? componentPaths
        : setup?.componentPaths.value ?? detectedConfiguration?.componentPaths ?? undefined,
    tokenPaths:
      tokenPaths.length > 0
        ? tokenPaths
        : setup?.tokenPaths.value ?? detectedConfiguration?.tokenPaths ?? undefined,
    notes: cleanOptional(values.notes),
  };
}

export function parsePathList(value: string) {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

export function cleanOptional(value: string) {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) return `${kilobytes.toFixed(1)} KB`;
  const megabytes = kilobytes / 1024;
  if (megabytes < 1024) return `${megabytes.toFixed(1)} MB`;

  return `${(megabytes / 1024).toFixed(1)} GB`;
}

export function shouldIgnoreLocalFile(file: File) {
  const relativePath =
    (file as File & { webkitRelativePath?: string }).webkitRelativePath ||
    file.name;
  const normalized = relativePath.replace(/\\/g, '/');
  const parts = normalized.split('/').filter(Boolean);
  const basename = parts.at(-1)?.toLowerCase() ?? '';
  const excludedSegments = new Set([
    'node_modules',
    '.git',
    '.next',
    'dist',
    'build',
    'coverage',
    '.cache',
    '.turbo',
    '.vercel',
    '.output',
  ]);

  if (parts.some(part => excludedSegments.has(part.toLowerCase()))) return true;

  return localExclusions.some(pattern => {
    if (pattern.endsWith('/')) return normalized.includes(`/${pattern}`) || normalized.startsWith(pattern);
    if (pattern.startsWith('*.')) return basename.endsWith(pattern.slice(1));
    if (pattern.endsWith('*')) return basename.startsWith(pattern.slice(0, -1));
    return basename === pattern.toLowerCase();
  });
}

export function stageIndexForState(state: ConfigurationStateId) {
  if (state === 'sourceChoice' || state === 'localUpload' || state === 'localPreflight' || state === 'localNoDetect') return 0;
  if (state.startsWith('github')) return 1;
  if (state === 'uploading' || state === 'analyzing' || state.startsWith('analysis') || state === 'resume') return 2;
  return 3;
}

export function titleForState(state: ConfigurationStateId, projectName: string) {
  if (state === 'sourceChoice') return `Configure ${projectName}`;
  if (state === 'success') return 'Project configured';
  if (state === 'resume') return 'Resume project configuration';
  return 'Project configuration';
}

export function previousState(state: ConfigurationStateId): ConfigurationStateId {
  const previous: Partial<Record<ConfigurationStateId, ConfigurationStateId>> = {
    localUpload: 'sourceChoice',
    localPreflight: 'localUpload',
    localNoDetect: 'localUpload',
    githubPermission: 'sourceChoice',
    githubRepoPicker: 'githubPermission',
    githubReview: 'githubRepoPicker',
    githubReadyToAnalyze: 'githubReview',
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

export function configurationStateForStatus(status: ProjectConfigurationStatus): ConfigurationStateId {
  if (status === 'CONFIGURING') return 'resume';
  if (status === 'REVIEW_REQUIRED') return 'reviewSetup';
  if (status === 'CONFIGURATION_FAILED') return 'analysisFailure';
  return 'sourceChoice';
}
