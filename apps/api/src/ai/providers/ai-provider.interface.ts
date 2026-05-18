export const AI_PROVIDER = Symbol('AI_PROVIDER');

export type AiProviderFeature =
  | 'component_recommendation'
  | 'pre_pr_audit'
  | 'setup_guidance'
  | 'pr_note';

export interface AiProviderRequest {
  feature: AiProviderFeature;
  systemPrompt: string;
  userPrompt: string;
  responseSchema?: Record<string, unknown>;
}

export interface AiProviderResult {
  model: string;
  raw: unknown;
  inputTokens?: number;
  outputTokens?: number;
  latencyMs?: number;
}

export interface AiProvider {
  completeJson(request: AiProviderRequest): Promise<AiProviderResult>;
}
