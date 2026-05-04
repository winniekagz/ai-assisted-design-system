import { buildAuditPrompt } from './prompts/audit.prompt';
import { buildGovernancePrompt } from './prompts/governance.prompt';
import { buildRecommendationPrompt } from './prompts/component-recommendation.prompt';
import { createMockAudit, createMockGovernance, createMockRecommendation } from './mock-service';
import { auditResponseSchema, type AuditRequest } from './schemas/audit.schema';
import { governanceResponseSchema, type GovernanceRequest } from './schemas/governance.schema';
import {
  recommendationResponseSchema,
  type RecommendationRequest,
} from './schemas/recommendation.schema';

async function callCompatibleJsonApi<T>(
  prompt: string,
  schemaParse: (value: unknown) => T
): Promise<T | null> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY;
  const baseUrl = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.LLM_MODEL || 'gpt-4o-mini';

  if (!apiKey) return null;

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'Return valid JSON only. Never include markdown fences or prose outside JSON.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) return null;

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') return null;

    return schemaParse(JSON.parse(content));
  } catch {
    return null;
  }
}

export async function getRecommendation(input: RecommendationRequest) {
  const prompt = buildRecommendationPrompt(input);
  return (
    (await callCompatibleJsonApi(prompt, value =>
      recommendationResponseSchema.parse(value)
    )) || createMockRecommendation(input)
  );
}

export async function getAudit(input: AuditRequest) {
  const prompt = buildAuditPrompt(input);
  return (
    (await callCompatibleJsonApi(prompt, value =>
      auditResponseSchema.parse(value)
    )) || createMockAudit(input)
  );
}

export async function getGovernance(input: GovernanceRequest) {
  const prompt = buildGovernancePrompt(input);
  return (
    (await callCompatibleJsonApi(prompt, value =>
      governanceResponseSchema.parse(value)
    )) || createMockGovernance(input)
  );
}
