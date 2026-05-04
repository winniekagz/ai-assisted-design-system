import { z } from 'zod';

export const governanceDecisionSchema = z.enum([
  'compose_existing',
  'create_variant',
  'create_pattern',
  'new_component_proposal',
  'local_one_off',
  'needs_design_review',
]);

export const recommendationRequestSchema = z.object({
  prompt: z.string().min(8).max(4000),
  context: z.string().min(1),
  platform: z.string().min(1),
  priorities: z.array(z.string()),
});

export const recommendationResponseSchema = z.object({
  summary: z.string(),
  recommendedComponents: z.array(
    z.object({
      name: z.string(),
      reason: z.string(),
      variant: z.string().optional(),
    })
  ),
  layoutSuggestion: z.string(),
  designTokens: z.array(
    z.object({
      token: z.string(),
      reason: z.string(),
    })
  ),
  implementationPlan: z.array(z.string()),
  accessibilityNotes: z.array(z.string()),
  statesToConsider: z.array(z.string()),
  exampleCode: z.string(),
  governanceDecision: governanceDecisionSchema,
  risks: z.array(z.string()),
  reviewNotes: z.array(z.string()),
});

export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>;
export type RecommendationResponse = z.infer<
  typeof recommendationResponseSchema
>;
export type GovernanceDecision = z.infer<typeof governanceDecisionSchema>;
