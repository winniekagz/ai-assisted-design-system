
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

export type Confidence = 'low' | 'medium' | 'high';
export type AuditResponseStatus = 'passed' | 'needs_changes' | 'failed';
export type AuditInputType = 'jsx' | 'plan' | 'diff';

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
  updatedAt: string;
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
