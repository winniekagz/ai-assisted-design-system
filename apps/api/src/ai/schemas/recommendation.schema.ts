import { z } from 'zod';

export const recommendationResponseSchema = z.object({
  recommendedComponent: z.string().min(1),
  confidence: z.string().min(1),
  reason: z.string().min(1),
  guardrails: z.array(z.string()).default([]),
  alternatives: z
    .array(
      z.object({
        component: z.string().min(1),
        reason: z.string().optional().default(''),
        tradeoff: z.string().optional(),
      })
    )
    .default([]),
  prNote: z.string().optional(),
});

export type RecommendationResponse = z.infer<
  typeof recommendationResponseSchema
>;
