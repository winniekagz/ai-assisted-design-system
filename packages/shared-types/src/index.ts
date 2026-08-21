
import { z } from 'zod';

export const ROLES = [
  'OWNER',
  'ADMIN',
  'MAINTAINER',
  'ENGINEER',
  'VIEWER',
] as const;

export type Role = (typeof ROLES)[number];
export type AssignableRole = Exclude<Role, 'OWNER'>;

export const ASSIGNABLE_ROLES = [
  'ADMIN',
  'MAINTAINER',
  'ENGINEER',
  'VIEWER',
] as const satisfies readonly AssignableRole[];

export const PERMISSIONS = {
  ORG_MANAGE: 'org.manage',
  MEMBERS_INVITE: 'members.invite',
  MEMBERS_REMOVE: 'members.remove',
  PROJECT_VIEW: 'projects.view',
  PROJECT_CREATE: 'projects.manage',
  PROJECT_UPDATE: 'projects.manage',
  PROJECT_ARCHIVE: 'projects.manage',
  PROJECT_DELETE: 'projects.manage',
  COMPONENT_VIEW: 'components.view',
  COMPONENT_MANAGE: 'components.manage',
  GUARDRAIL_VIEW: 'guardrails.view',
  GUARDRAIL_MANAGE: 'guardrails.manage',
  AI_RUN: 'ai.run',
  AUDIT_VIEW: 'audits.view',
  AUDIT_VIEW_OWN: 'audits.viewOwn',
  RECOMMENDATION_VIEW: 'recommendations.view',
  RECOMMENDATION_VIEW_OWN: 'recommendations.viewOwn',
} as const;

export const permissions = [
  PERMISSIONS.ORG_MANAGE,
  PERMISSIONS.MEMBERS_INVITE,
  PERMISSIONS.MEMBERS_REMOVE,
  PERMISSIONS.PROJECT_VIEW,
  PERMISSIONS.PROJECT_CREATE,
  PERMISSIONS.COMPONENT_VIEW,
  PERMISSIONS.COMPONENT_MANAGE,
  PERMISSIONS.GUARDRAIL_VIEW,
  PERMISSIONS.GUARDRAIL_MANAGE,
  PERMISSIONS.AI_RUN,
  PERMISSIONS.AUDIT_VIEW,
  PERMISSIONS.AUDIT_VIEW_OWN,
  PERMISSIONS.RECOMMENDATION_VIEW,
  PERMISSIONS.RECOMMENDATION_VIEW_OWN,
] as const;

export type Permission = (typeof permissions)[number];

export const rolePermissions = {
  OWNER: [
    PERMISSIONS.ORG_MANAGE,
    PERMISSIONS.MEMBERS_INVITE,
    PERMISSIONS.MEMBERS_REMOVE,
    PERMISSIONS.PROJECT_VIEW,
    PERMISSIONS.PROJECT_CREATE,
    PERMISSIONS.COMPONENT_VIEW,
    PERMISSIONS.COMPONENT_MANAGE,
    PERMISSIONS.GUARDRAIL_VIEW,
    PERMISSIONS.GUARDRAIL_MANAGE,
    PERMISSIONS.AI_RUN,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.RECOMMENDATION_VIEW,
  ],
  ADMIN: [
    PERMISSIONS.MEMBERS_INVITE,
    PERMISSIONS.MEMBERS_REMOVE,
    PERMISSIONS.PROJECT_VIEW,
    PERMISSIONS.PROJECT_CREATE,
    PERMISSIONS.COMPONENT_VIEW,
    PERMISSIONS.COMPONENT_MANAGE,
    PERMISSIONS.GUARDRAIL_VIEW,
    PERMISSIONS.GUARDRAIL_MANAGE,
    PERMISSIONS.AI_RUN,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.RECOMMENDATION_VIEW,
  ],
  MAINTAINER: [
    PERMISSIONS.PROJECT_VIEW,
    PERMISSIONS.COMPONENT_VIEW,
    PERMISSIONS.COMPONENT_MANAGE,
    PERMISSIONS.GUARDRAIL_VIEW,
    PERMISSIONS.GUARDRAIL_MANAGE,
    PERMISSIONS.AI_RUN,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.RECOMMENDATION_VIEW,
  ],
  ENGINEER: [
    PERMISSIONS.PROJECT_VIEW,
    PERMISSIONS.COMPONENT_VIEW,
    PERMISSIONS.GUARDRAIL_VIEW,
    PERMISSIONS.AI_RUN,
    PERMISSIONS.AUDIT_VIEW_OWN,
    PERMISSIONS.RECOMMENDATION_VIEW_OWN,
  ],
  VIEWER: [
    PERMISSIONS.PROJECT_VIEW,
    PERMISSIONS.COMPONENT_VIEW,
    PERMISSIONS.GUARDRAIL_VIEW,
    PERMISSIONS.AUDIT_VIEW_OWN,
    PERMISSIONS.RECOMMENDATION_VIEW_OWN,
  ],
} as const satisfies Record<Role, readonly Permission[]>;

export function hasPermission(role: Role | undefined, permission: unknown) {
  if (!role || !isPermission(permission)) {
    return false;
  }

  return (rolePermissions[role] as readonly Permission[]).includes(permission);
}

export function isPermission(permission: unknown): permission is Permission {
  return (
    typeof permission === 'string' &&
    (permissions as readonly string[]).includes(permission)
  );
}

export const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

export const GUARDRAIL_CATEGORIES = [
  'ACCESSIBILITY',
  'DESIGN_TOKENS',
  'COMPONENT_USAGE',
  'UI_STATES',
  'COPY',
  'AI_SAFETY',
] as const;

export const PROMPT_TYPES = [
  'COMPONENT_RECOMMENDATION',
  'PRE_PR_AUDIT',
  'SETUP_GUIDANCE',
  'DECISION_SUMMARY',
] as const;

export const AUDIT_STATUSES = ['PASSED', 'NEEDS_CHANGES', 'FAILED'] as const;

export const PROJECT_CONFIGURATION_STATUSES = [
  'NOT_CONFIGURED',
  'CONFIGURING',
  'REVIEW_REQUIRED',
  'READY',
  'CONFIGURATION_FAILED',
  'ARCHIVED',
] as const;

export const CONFIGURATION_SOURCE_TYPES = [
  'LOCAL_UPLOAD',
  'GIT_REPOSITORY',
] as const;

export const CONFIGURATION_JOB_STATUSES = [
  'PENDING',
  'UPLOADING',
  'ANALYZING',
  'REVIEW_REQUIRED',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
] as const;

export const SOURCE_PROVIDERS = ['LOCAL', 'GITHUB'] as const;

export const PROJECT_SOURCE_TYPES = [
  'LOCAL_UPLOAD',
  'GITHUB_REPOSITORY',
] as const;

export const SOURCE_CONNECTION_STATUSES = [
  'ACTIVE',
  'DISCONNECTED',
  'REVOKED',
  'FAILED',
] as const;

export const GIT_PROVIDER_CONNECTION_STATUSES = [
  'ACTIVE',
  'DISCONNECTED',
  'REVOKED',
  'FAILED',
] as const;

export type Severity = (typeof SEVERITIES)[number];
export type GuardrailCategory = (typeof GUARDRAIL_CATEGORIES)[number];
export type PromptType = (typeof PROMPT_TYPES)[number];
export type AuditStatus = (typeof AUDIT_STATUSES)[number];
export type ProjectConfigurationStatus =
  (typeof PROJECT_CONFIGURATION_STATUSES)[number];
export type ConfigurationSourceType =
  (typeof CONFIGURATION_SOURCE_TYPES)[number];
export type ConfigurationJobStatus =
  (typeof CONFIGURATION_JOB_STATUSES)[number];
export type SourceProvider = (typeof SOURCE_PROVIDERS)[number];
export type ProjectSourceType = (typeof PROJECT_SOURCE_TYPES)[number];
export type SourceConnectionStatus =
  (typeof SOURCE_CONNECTION_STATUSES)[number];
export type GitProviderConnectionStatus =
  (typeof GIT_PROVIDER_CONNECTION_STATUSES)[number];

export type Confidence = 'low' | 'medium' | 'high';
export type DetectionConfidence = 'LOW' | 'MEDIUM' | 'HIGH';
export type AuditResponseStatus = 'passed' | 'needs_changes' | 'failed';
export type AuditInputType = 'jsx' | 'plan' | 'diff';
export type ProjectFramework =
  | 'NEXTJS'
  | 'REACT_VITE'
  | 'REACT'
  | 'VUE'
  | 'NUXT'
  | 'ANGULAR'
  | 'SVELTE'
  | 'SVELTEKIT'
  | 'REMIX'
  | 'ASTRO'
  | 'MOBILE_WEB'
  | 'UNKNOWN';
export type ProjectLanguage = 'TYPESCRIPT' | 'JAVASCRIPT' | 'UNKNOWN';
export type PackageManager = 'PNPM' | 'NPM' | 'YARN' | 'BUN' | 'UNKNOWN';
export type StylingSystem =
  | 'TAILWIND'
  | 'CSS_MODULES'
  | 'SASS'
  | 'STYLED_COMPONENTS'
  | 'EMOTION'
  | 'PLAIN_CSS'
  | 'UNKNOWN';
export type MonorepoTool = 'PNPM_WORKSPACE' | 'TURBO' | 'NX' | 'LERNA' | 'PACKAGE_WORKSPACES' | 'UNKNOWN';

export const PROJECT_FRAMEWORKS = [
  'NEXTJS',
  'REACT_VITE',
  'REACT',
  'VUE',
  'NUXT',
  'ANGULAR',
  'SVELTE',
  'SVELTEKIT',
  'REMIX',
  'ASTRO',
  'MOBILE_WEB',
  'UNKNOWN',
] as const satisfies readonly ProjectFramework[];
export const PROJECT_LANGUAGES = [
  'TYPESCRIPT',
  'JAVASCRIPT',
  'UNKNOWN',
] as const satisfies readonly ProjectLanguage[];
export const PACKAGE_MANAGERS = [
  'PNPM',
  'NPM',
  'YARN',
  'BUN',
  'UNKNOWN',
] as const satisfies readonly PackageManager[];
export const STYLING_SYSTEMS = [
  'TAILWIND',
  'CSS_MODULES',
  'SASS',
  'STYLED_COMPONENTS',
  'EMOTION',
  'PLAIN_CSS',
  'UNKNOWN',
] as const satisfies readonly StylingSystem[];

export interface DetectionEvidence {
  type: string;
  path: string;
  detail: string;
}

export interface DetectionField<T> {
  value: T | null;
  confidence: DetectionConfidence;
  evidence: DetectionEvidence[];
  warnings: string[];
}

export interface DetectedProjectSetup {
  framework: DetectionField<ProjectFramework>;
  language: DetectionField<ProjectLanguage>;
  packageManager: DetectionField<PackageManager>;
  stylingSystem: DetectionField<StylingSystem[]>;
  monorepo: DetectionField<{
    detected: boolean;
    tool: MonorepoTool | null;
    candidateWorkspaceRoots: string[];
  }>;
  storybook: DetectionField<boolean>;
  projectRoot: DetectionField<string>;
  componentPaths: DetectionField<string[]>;
  tokenPaths: DetectionField<string[]>;
  candidateProjectRoots: Array<{
    path: string;
    score: number;
    evidence: DetectionEvidence[];
  }>;
  globalWarnings: string[];
  analyzedFileCount: number;
  ignoredFileCount: number;
  analyzedAt: string;
  detectorVersion: string;
  sourceSnapshotId: string | null;
}

export interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSummary {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description?: string | null;
  framework: string;
  packageManager: string;
  stylingSystem: string;
  repositoryUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const createProjectSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    description: z
      .string()
      .trim()
      .max(500)
      .optional()
      .transform(value => (value ? value : undefined)),
  })
  .strict();

export type CreateProjectInput = z.input<typeof createProjectSchema>;
export type NormalizedCreateProjectInput = z.output<typeof createProjectSchema>;

export interface ProjectListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  framework: string;
  packageManager: string;
  stylingSystem: string;
  configurationStatus: ProjectConfigurationStatus;
  repositoryUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConfigurationJobSummary {
  id: string;
  projectId: string;
  organizationId: string;
  sourceType: ConfigurationSourceType;
  status: ConfigurationJobStatus;
  progress: number | null;
  errorCode: string | null;
  errorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DetectedProjectConfiguration {
  configurationJobId: string;
  framework: string | null;
  language: string | null;
  packageManager: string | null;
  stylingSystem: string | null;
  projectRoot: string | null;
  componentPaths: string[];
  tokenPaths: string[];
  monorepoDetected: boolean;
  storybookDetected: boolean;
  confidence: string | null;
  evidence: unknown | null;
  setup: DetectedProjectSetup | null;
  warnings: string[];
  candidateProjectRoots: DetectedProjectSetup['candidateProjectRoots'];
  detectorVersion: string | null;
  analyzedAt: string | null;
  sourceSnapshotId: string | null;
}

const relativePathSchema = z
  .string()
  .trim()
  .min(1)
  .max(300)
  .refine(value => isSafeRelativeConfigurationPath(value), {
    message: 'Path must be relative and stay inside the project.',
  })
  .transform(normalizeConfigurationPath);

const confirmedPathListSchema = z
  .array(relativePathSchema)
  .max(50)
  .transform(values => Array.from(new Set(values)))
  .optional();

export const confirmProjectConfigurationSchema = z
  .object({
    expectedConfigurationJobId: z.string().trim().min(1).max(120),
    expectedDetectedAt: z.string().trim().min(1).max(80).optional(),
    framework: z.enum(PROJECT_FRAMEWORKS).optional(),
    language: z.enum(PROJECT_LANGUAGES).optional(),
    packageManager: z.enum(PACKAGE_MANAGERS).optional(),
    stylingSystem: z.enum(STYLING_SYSTEMS).optional(),
    projectRoot: relativePathSchema.optional(),
    componentPaths: confirmedPathListSchema,
    tokenPaths: confirmedPathListSchema,
    notes: z.string().trim().max(1000).optional(),
  })
  .strict();

export type ConfirmProjectConfigurationInput = z.input<
  typeof confirmProjectConfigurationSchema
>;
export type NormalizedConfirmProjectConfigurationInput = z.output<
  typeof confirmProjectConfigurationSchema
>;

export interface ConfirmedProjectConfiguration {
  id: string;
  projectId: string;
  organizationId: string;
  configurationJobId: string | null;
  sourceType: ConfigurationSourceType | null;
  framework: string | null;
  language: string | null;
  packageManager: string | null;
  stylingSystem: string | null;
  projectRoot: string | null;
  componentPaths: string[];
  tokenPaths: string[];
  notes: string | null;
  confirmedByUserId: string | null;
  confirmedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSourceSummary {
  id: string;
  type: ProjectSourceType;
  provider: SourceProvider;
  repositoryFullName: string | null;
  repositoryOwner: string | null;
  repositoryName: string | null;
  defaultBranch: string | null;
  selectedBranch: string | null;
  latestCommitSha: string | null;
  projectRoot: string | null;
  sourceSnapshotId: string | null;
  originalName: string | null;
  fileCount: number | null;
  totalBytes: number | null;
  updatedAt: string;
}

export interface ProjectConfigurationSummary {
  projectId: string;
  projectStatus: ProjectConfigurationStatus;
  latestJobId: string | null;
  latestJobStatus: ConfigurationJobStatus | null;
  sourceType: ConfigurationSourceType | null;
  progress: number | null;
  requiresReview: boolean;
  canRetry: boolean;
  lastError: {
    code: string | null;
    message: string | null;
  } | null;
  detectedConfiguration: DetectedProjectConfiguration | null;
  confirmedConfiguration: ConfirmedProjectConfiguration | null;
  projectSource: ProjectSourceSummary | null;
  updatedAt: string;
}

export interface ProjectConfigurationConfirmResponse {
  configuration: ProjectConfigurationSummary;
  confirmedConfiguration: ConfirmedProjectConfiguration;
}

export interface LocalProjectUploadResponse {
  projectId: string;
  sourceId: string;
  configurationJobId: string;
  configuration: ProjectConfigurationSummary;
}

export type ProjectSourceAnalysisResponse = LocalProjectUploadResponse;

export interface ConnectGithubRepositorySourceInput {
  connectionId: string;
  repositoryOwner: string;
  repositoryName: string;
  branch?: string;
}

function isSafeRelativeConfigurationPath(value: string) {
  const normalized = value.trim().replace(/\\/g, '/');
  const parts = normalized.split('/').filter(Boolean);

  return (
    normalized.length > 0 &&
    (normalized === '.' ||
      (!normalized.startsWith('/') &&
        !/^[a-zA-Z]:/.test(normalized) &&
        !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(normalized) &&
        !normalized.includes('\0') &&
        !/[;&|`$<>]/.test(normalized) &&
        parts.every(part => part !== '..' && part !== '.')))
  );
}

function normalizeConfigurationPath(value: string) {
  const normalized = value.trim().replace(/\\/g, '/').replace(/^\.\/+/, '');

  return normalized === '' ? '.' : normalized.replace(/\/+/g, '/');
}

export interface GitProviderConnectionSummary {
  id: string;
  provider: Extract<SourceProvider, 'GITHUB'>;
  accountLogin: string;
  accountType: string | null;
  status: GitProviderConnectionStatus;
  installedAt: string | null;
  lastVerifiedAt: string | null;
  canDisconnect: boolean;
  configureUrl?: string;
}

export interface GitHubConnectionStartResponse {
  provider: Extract<SourceProvider, 'GITHUB'>;
  installationUrl: string;
  expiresAt: string;
}

export interface GitHubConnectionCallbackResult {
  status: 'connected';
  connection: GitProviderConnectionSummary;
  returnPath: string;
}

export interface GitHubRepositorySummary {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  defaultBranch: string;
  private: boolean;
  updatedAt: string | null;
  sizeKb: number | null;
}

export interface GitHubRepositoryListResponse {
  repositories: GitHubRepositorySummary[];
  pagination: {
    nextCursor: string | null;
  };
  connection: {
    id: string;
    accountLogin: string;
    accountType: string | null;
    status: GitProviderConnectionStatus;
    repositoryAccess: 'ALL' | 'SELECTED' | 'UNKNOWN';
  };
  configureUrl: string;
}

export interface ComponentRuleSummary {
  id: string;
  componentId: string;
  ruleType: string;
  ruleText: string;
  severity: Severity;
  exampleGood?: string | null;
  exampleBad?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ComponentSummary {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  category: string;
  docsUrl?: string | null;
  storybookUrl?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  rules?: ComponentRuleSummary[];
}

export interface GuardrailSummary {
  id: string;
  organizationId: string;
  category: GuardrailCategory;
  title: string;
  ruleText: string;
  severity: Severity;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecommendComponentRequest {
  organizationId: string;
  projectId?: string;
  userId?: string;
  userGoal: string;
  context?: {
    surface?: string;
    riskLevel?: string;
    framework?: string;
  };
}

export interface RecommendationAlternativeResponse {
  component: string;
  reason?: string;
  tradeoff?: string;
}

export interface RecommendComponentResponse {
  id: string;
  recommendedComponent: string;
  confidence: Confidence | string;
  reason: string;
  guardrails: string[];
  alternatives: RecommendationAlternativeResponse[];
  prNote?: string;
}

export interface AuditRequest {
  organizationId: string;
  projectId?: string;
  userId?: string;
  auditType: string;
  inputType: AuditInputType;
  content: string;
  categories?: string[];
}

export interface AuditFindingResponse {
  severity: Lowercase<Severity>;
  category: string;
  issue: string;
  suggestion: string;
  ruleUsed?: string;
  filePath?: string;
  lineNumber?: number;
  docsLink?: string;
}

export interface AuditResponse {
  id: string;
  status: AuditResponseStatus;
  summary: string;
  findings: AuditFindingResponse[];
}

export interface AuditSessionSummary {
  id: string;
  projectId: string | null;
  auditType: string;
  inputType: AuditInputType;
  status: AuditResponseStatus;
  summary: string;
  createdAt: string;
  findings: AuditFindingResponse[];
}

export interface SetupGuidanceRequest {
  organizationId: string;
  framework: string;
  packageManager: string;
  typescript: boolean;
  storybook: boolean;
}

export interface SetupGuidanceResponse {
  installCommand: string;
  steps: string[];
  exampleUsage: string;
  commonMistakes: string[];
}

export interface GeneratePrNoteRequest {
  organizationId: string;
  recommendationId?: string;
  auditId?: string;
  context?: string;
}

export interface GeneratePrNoteResponse {
  prNote: string;
}
