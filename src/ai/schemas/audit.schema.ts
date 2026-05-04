import { z } from 'zod';

import { governanceDecisionSchema } from './recommendation.schema';

export const auditRequestSchema = z.object({
  description: z.string().min(6).max(3000),
  code: z.string().max(8000),
});

export const auditResponseSchema = z.object({
  overallResult: z.enum(['pass', 'needs_changes', 'blocked']),
  summary: z.string(),
  blockingIssues: z.array(z.string()),
  suggestions: z.array(z.string()),
  tokenViolations: z.array(z.string()),
  accessibilityRisks: z.array(z.string()),
  recommendedComponents: z.array(z.string()),
  governanceDecision: governanceDecisionSchema,
  suggestedRewrite: z.string(),
});

export type AuditRequest = z.infer<typeof auditRequestSchema>;
export type AuditResponse = z.infer<typeof auditResponseSchema>;
