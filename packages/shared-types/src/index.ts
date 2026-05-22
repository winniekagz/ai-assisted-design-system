
export const ROLES = [
  'OWNER',
  'ADMIN',
  'MAINTAINER',
  'ENGINEER',
  'VIEWER',
] as const;

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

export type Role = (typeof ROLES)[number];
export type Severity = (typeof SEVERITIES)[number];
export type GuardrailCategory = (typeof GUARDRAIL_CATEGORIES)[number];
export type PromptType = (typeof PROMPT_TYPES)[number];
export type AuditStatus = (typeof AUDIT_STATUSES)[number];

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
  framework: string;
  packageManager: string;
  stylingSystem: string;
  repositoryUrl?: string | null;
  createdAt: string;
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
