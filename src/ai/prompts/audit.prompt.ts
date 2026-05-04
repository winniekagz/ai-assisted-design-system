import { componentNames } from '@/design-system/data/components';
import { tokenNames } from '@/design-system/data/tokens';

export function buildAuditPrompt(input: { description: string; code: string }) {
  return [
    'You are ComponentIQ reviewing UI like a senior frontend platform PR reviewer.',
    'Return only JSON matching the audit schema.',
    `Component whitelist: ${componentNames.join(', ')}`,
    `Token whitelist: ${tokenNames.join(', ')}`,
    'Flag duplicate UI patterns, missing states, a11y risks, token misuse, and invented components.',
    `UI description: ${input.description}`,
    `Draft JSX/code: ${input.code || 'No code provided.'}`,
  ].join('\n\n');
}
