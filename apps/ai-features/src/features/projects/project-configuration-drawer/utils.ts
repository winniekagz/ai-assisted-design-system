import type {
  ConfirmProjectConfigurationInput,
  DetectedProjectConfiguration,
} from '@winniekagendo/componentiq-shared-types';
import {
  PACKAGE_MANAGERS,
  PROJECT_FRAMEWORKS,
  PROJECT_LANGUAGES,
  STYLING_SYSTEMS,
  type PackageManager,
  type ProjectFramework,
  type ProjectLanguage,
  type StylingSystem,
} from '@winniekagendo/componentiq-shared-types';

import { localExclusions } from './constants';
import type {
  ConfigurationFormValues,
  ConfigurationStateId,
  ProjectConfigurationProject,
  ProjectConfigurationStatus,
} from './types';

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
    expectedConfigurationJobId: detectedConfiguration?.configurationJobId ?? '',
    expectedDetectedAt: detectedConfiguration?.analyzedAt ?? undefined,
    framework:
      canonicalProjectFramework(cleanOptional(values.framework)) ??
      setup?.framework.value ??
      canonicalProjectFramework(detectedConfiguration?.framework ?? undefined) ??
      undefined,
    language:
      setup?.language.value ??
      canonicalProjectLanguage(detectedConfiguration?.language ?? undefined) ??
      undefined,
    packageManager:
      canonicalPackageManager(cleanOptional(values.packageManager)) ??
      setup?.packageManager.value ??
      canonicalPackageManager(detectedConfiguration?.packageManager ?? undefined) ??
      undefined,
    stylingSystem:
      canonicalStylingSystem(cleanOptional(values.stylingSystem)) ??
      setup?.stylingSystem.value?.[0] ??
      canonicalStylingSystem(detectedConfiguration?.stylingSystem ?? undefined) ??
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

function canonicalProjectFramework(value: string | undefined): ProjectFramework | undefined {
  return canonicalEnumValue(value, PROJECT_FRAMEWORKS, {
    next: 'NEXTJS',
    nextjs: 'NEXTJS',
    reactvite: 'REACT_VITE',
    vite: 'REACT_VITE',
    vuejs: 'VUE',
    nuxtjs: 'NUXT',
    sveltekit: 'SVELTEKIT',
    mobileweb: 'MOBILE_WEB',
  });
}

function canonicalProjectLanguage(value: string | undefined): ProjectLanguage | undefined {
  return canonicalEnumValue(value, PROJECT_LANGUAGES, {
    ts: 'TYPESCRIPT',
    js: 'JAVASCRIPT',
  });
}

function canonicalPackageManager(value: string | undefined): PackageManager | undefined {
  return canonicalEnumValue(value, PACKAGE_MANAGERS);
}

function canonicalStylingSystem(value: string | undefined): StylingSystem | undefined {
  return canonicalEnumValue(value, STYLING_SYSTEMS, {
    tailwindcss: 'TAILWIND',
    cssmodules: 'CSS_MODULES',
    cssmodule: 'CSS_MODULES',
    scss: 'SASS',
    styledcomponents: 'STYLED_COMPONENTS',
    emotioncss: 'EMOTION',
    css: 'PLAIN_CSS',
    plaincss: 'PLAIN_CSS',
  });
}

function canonicalEnumValue<T extends string>(
  value: string | undefined,
  options: readonly T[],
  aliases: Record<string, T> = {}
): T | undefined {
  if (!value) return undefined;

  const exact = value.trim().toUpperCase();
  if (options.includes(exact as T)) return exact as T;

  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const aliased = aliases[normalized] ?? aliases[exact.toLowerCase()];
  if (aliased && options.includes(aliased)) return aliased;

  return undefined;
}

export function parsePathList(value: string) {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

export function validateConfigurationPath(value: string) {
  const normalized = value.trim().replace(/\\/g, '/');
  const parts = normalized.split('/').filter(Boolean);

  if (!normalized) return 'Path is required.';
  if (normalized.startsWith('/') || /^[a-zA-Z]:/.test(normalized)) {
    return 'Use a relative path inside the project.';
  }
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(normalized)) {
    return 'URI-style paths are not allowed.';
  }
  if (normalized.includes('\0') || /[;&|`$<>]/.test(normalized)) {
    return 'Path contains unsupported characters.';
  }
  if (parts.some(part => part === '..' || part === '.')) {
    return 'Path cannot traverse outside the project.';
  }

  return null;
}

export function validateConfigurationPathList(value: string) {
  const paths = parsePathList(value);
  const invalid = paths.find(path => validateConfigurationPath(path));

  return invalid ? validateConfigurationPath(invalid) : null;
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
