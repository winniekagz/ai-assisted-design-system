import { z } from 'zod';

export const auditResponseSchema = z.object({
  status: z.enum(['passed', 'needs_changes', 'failed']),
  summary: z.string().min(1),
  findings: z
    .array(
      z.object({
        severity: z.enum(['low', 'medium', 'high', 'critical']),
        category: z.string().min(1),
        issue: z.string().min(1),
        suggestion: z.string().min(1),
        ruleUsed: z.string().optional(),
        filePath: z.string().optional(),
        lineNumber: z.number().int().positive().optional(),
        docsLink: z.string().optional(),
      })
    )
    .default([]),
});

export type AuditResponse = z.infer<typeof auditResponseSchema>;
