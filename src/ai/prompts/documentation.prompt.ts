export function buildDocumentationPrompt(input: {
  componentName: string;
  action: string;
  compareWith?: string;
}) {
  return [
    'You are ComponentIQ generating concise, reviewable design-system documentation.',
    'Use known local component behavior only. Mark any uncertainty for human review.',
    `Component: ${input.componentName}`,
    `Action: ${input.action}`,
    input.compareWith ? `Compare with: ${input.compareWith}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');
}
