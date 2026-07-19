import type {
  DetectionConfidence,
  DetectionEvidence,
  DetectionField,
  DetectedProjectSetup,
  MonorepoTool,
  PackageManager,
  ProjectFramework,
  ProjectLanguage,
  StylingSystem,
} from '@winniekagendo/componentiq-shared-types';

export const PROJECT_DETECTOR_VERSION = '1';

export const SOURCE_LIMITS = {
  maxFiles: 5000,
  maxTotalBytes: 250 * 1024 * 1024,
  maxInspectedFileBytes: 256 * 1024,
  maxPackageManifests: 40,
  maxPathCandidates: 12,
  maxComponentFilesSampled: 250,
  maxTokenFilesSampled: 80,
} as const;

export type SourceManifestEntry = {
  relativePath: string;
  basename: string;
  extension: string;
  size: number;
  sourceRoot: string;
  content?: string;
};

export type SourceManifest = {
  entries: SourceManifestEntry[];
  analyzedFileCount: number;
  ignoredFileCount: number;
  warnings: string[];
};

export type PackageJsonInfo = {
  path: string;
  root: string;
  dependencies: Record<string, string>;
  packageManager?: string;
  malformed?: boolean;
};

export type ProjectRootCandidate = {
  path: string;
  score: number;
  evidence: DetectionEvidence[];
};

export type RootDetectionResult = DetectionField<string> & {
  candidates: ProjectRootCandidate[];
};

export type DetectionContext = {
  manifest: SourceManifest;
  selectedRoot: string;
  packageJsons: PackageJsonInfo[];
  primaryPackageJson: PackageJsonInfo | null;
};

export type Field<T> = DetectionField<T>;
export type Confidence = DetectionConfidence;
export type Evidence = DetectionEvidence;
export type Framework = ProjectFramework;
export type Language = ProjectLanguage;
export type Manager = PackageManager;
export type Styling = StylingSystem;
export type MonoTool = MonorepoTool;
export type Setup = DetectedProjectSetup;

