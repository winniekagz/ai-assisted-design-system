import { z } from 'zod';

import { governanceDecisionSchema } from './recommendation.schema';

export const governanceRequestSchema = z.object({
  need: z.string().min(6).max(3000),
  existingCoverage: z.string().default('unknown'),
  repeatability: z.string().default('unknown'),
  reusableAcrossProduct: z.boolean().default(false),
});

export const governanceResponseSchema = z.object({
  decision: governanceDecisionSchema,
  rationale: z.string(),
  nextSteps: z.array(z.string()),
  requiredReviewers: z.array(z.string()),
  evidenceNeeded: z.array(z.string()),
});

export type GovernanceRequest = z.infer<typeof governanceRequestSchema>;
export type GovernanceResponse = z.infer<typeof governanceResponseSchema>;
