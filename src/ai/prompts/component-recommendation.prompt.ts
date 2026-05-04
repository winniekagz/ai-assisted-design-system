import { designSystemComponents } from '@/design-system/data/components';
import { designPatterns } from '@/design-system/data/patterns';
import { designSystemRules } from '@/design-system/data/rules';
import { designTokens } from '@/design-system/data/tokens';

export function buildRecommendationPrompt(input: {
  prompt: string;
  context: string;
  platform: string;
  priorities: string[];
}) {
  return [
    'You are ComponentIQ: 70% senior engineer mentor, 20% direct technical partner, 10% strict reviewer.',
    'Return only JSON matching the provided schema.',
    'Treat design-system output as constrained by these whitelists.',
    `Available components: ${designSystemComponents.map(component => component.name).join(', ')}`,
    `Available tokens: ${designTokens.map(token => token.name).join(', ')}`,
    `Reusable patterns: ${designPatterns.map(pattern => pattern.name).join(', ')}`,
    `Rules: ${designSystemRules.join(' ')}`,
    'Prefer composition with existing components before variants, patterns, or new proposals.',
    'Generated code must be marked draft/review required and must not execute anything.',
    `User context: ${input.context}`,
    `Platform: ${input.platform}`,
    `Priorities: ${input.priorities.join(', ') || 'none provided'}`,
    `Request: ${input.prompt}`,
  ].join('\n\n');
}
