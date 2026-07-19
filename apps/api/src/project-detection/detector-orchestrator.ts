import type { DetectedProjectSetup } from '@winniekagendo/componentiq-shared-types';

import {
  detectComponentPaths,
  detectFramework,
  detectLanguage,
  detectMonorepo,
  detectPackageManager,
  detectProjectRoot,
  detectStorybook,
  detectStyling,
  detectTokenPaths,
} from './detectors';
import { PROJECT_DETECTOR_VERSION, type DetectionContext, type SourceManifest } from './detection.types';
import { parsePackageJsons } from './package-json';

export function detectProjectSetup(
  manifest: SourceManifest,
  sourceSnapshotId: string | null
): DetectedProjectSetup {
  const { packages, warnings: packageWarnings } = parsePackageJsons(manifest);
  const projectRoot = detectProjectRoot(manifest, packages);
  const selectedRoot = projectRoot.value ?? '.';
  const primaryPackageJson =
    packages.find(pkg => (pkg.root || '.') === selectedRoot && !pkg.malformed) ??
    packages.find(pkg => !pkg.malformed) ??
    null;
  const context: DetectionContext = {
    manifest,
    selectedRoot,
    packageJsons: packages,
    primaryPackageJson,
  };

  const framework = detectFramework(context);
  const language = detectLanguage(context);
  const packageManager = detectPackageManager(context);
  const stylingSystem = detectStyling(context);
  const monorepo = detectMonorepo(context);
  const storybook = detectStorybook(context);
  const componentPaths = detectComponentPaths(context);
  const tokenPaths = detectTokenPaths(context);
  const globalWarnings = [
    ...manifest.warnings,
    ...packageWarnings,
    ...projectRoot.warnings,
    ...framework.warnings,
    ...packageManager.warnings,
  ];

  if (framework.value === 'UNKNOWN') {
    globalWarnings.push('No supported frontend framework was confidently detected.');
  }

  return {
    framework,
    language,
    packageManager,
    stylingSystem,
    monorepo,
    storybook,
    projectRoot,
    componentPaths,
    tokenPaths,
    candidateProjectRoots: projectRoot.candidates,
    globalWarnings: Array.from(new Set(globalWarnings)),
    analyzedFileCount: manifest.analyzedFileCount,
    ignoredFileCount: manifest.ignoredFileCount,
    analyzedAt: new Date().toISOString(),
    detectorVersion: PROJECT_DETECTOR_VERSION,
    sourceSnapshotId,
  };
}

