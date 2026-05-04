import { z } from 'zod';

export const documentationRequestSchema = z.object({
  componentName: z.string().min(1),
  action: z.enum([
    'generate_docs',
    'when_to_use',
    'example_usage',
    'accessibility',
    'suggest_variants',
    'compare',
  ]),
  compareWith: z.string().optional(),
});

export const documentationResponseSchema = z.object({
  title: z.string(),
  guidance: z.string(),
  examples: z.array(z.string()),
  accessibilityNotes: z.array(z.string()),
  reviewNotes: z.array(z.string()),
});

export type DocumentationRequest = z.infer<typeof documentationRequestSchema>;
export type DocumentationResponse = z.infer<typeof documentationResponseSchema>;
