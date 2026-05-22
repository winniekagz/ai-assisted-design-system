import { GuardrailCategory, Severity } from '@prisma/client';

export const ids = {
  organization: '8bbd7a98-6e91-4eb7-a7a3-6ceaf2c4d711',
  project: '45787d86-5a54-4e62-a52d-a2c7b78bdf61',
  component: 'e09a7c78-fb75-4d17-a7ac-bcf58d817f41',
  rule: '44d8aa30-1f1d-44fb-9c18-e85096aab905',
  guardrail: 'c40f7d2f-598d-4c33-8c5e-fb6e1ae18f68',
  recommendation: '68bc4f37-7c3c-4cb6-b26d-6e4de73eb4c5',
  audit: '03a721b7-1d1b-4f02-911f-ff491bf82b18',
  user: '7de7ec3b-4972-481f-82de-9e36e9fb7e6c',
};

export const timestamps = {
  createdAt: '2026-05-23T09:30:00.000Z',
  updatedAt: '2026-05-23T09:35:00.000Z',
};

export const organizationExample = {
  id: ids.organization,
  name: 'Acme Design System',
  slug: 'acme-design-system',
  ...timestamps,
};

export const projectExample = {
  id: ids.project,
  organizationId: ids.organization,
  name: 'Acme Web App',
  slug: 'acme-web-app',
  framework: 'Next.js',
  packageManager: 'npm',
  stylingSystem: 'Tailwind CSS',
  repositoryUrl: 'https://github.com/acme/acme-web-app',
  ...timestamps,
};

export const componentRuleExample = {
  id: ids.rule,
  componentId: ids.component,
  ruleType: 'accessibility',
  ruleText: 'Icon-only buttons must include an accessible label.',
  severity: Severity.HIGH,
  exampleGood: '<Button aria-label="Close"><XIcon /></Button>',
  exampleBad: '<Button><XIcon /></Button>',
  ...timestamps,
};

export const componentExample = {
  id: ids.component,
  organizationId: ids.organization,
  name: 'Button',
  description: 'Primary interaction component for actions and form submission.',
  category: 'Inputs',
  docsUrl: 'https://design.acme.com/components/button',
  storybookUrl: 'https://storybook.acme.com/?path=/docs/components-button--docs',
  status: 'stable',
  ...timestamps,
};

export const componentWithRulesExample = {
  ...componentExample,
  rules: [componentRuleExample],
};

export const guardrailExample = {
  id: ids.guardrail,
  organizationId: ids.organization,
  category: GuardrailCategory.ACCESSIBILITY,
  title: 'Interactive controls need accessible names',
  ruleText:
    'Every interactive icon-only control must provide an aria-label or visible text.',
  severity: Severity.HIGH,
  enabled: true,
  ...timestamps,
};

export const recommendationExample = {
  id: ids.recommendation,
  recommendedComponent: 'Button',
  confidence: 'high',
  reason:
    'The documented Button component supports destructive actions and accessibility requirements.',
  guardrails: ['Interactive controls need accessible names'],
  alternatives: [
    {
      component: 'IconButton',
      reason: 'Useful when the action is visually compact.',
      tradeoff: 'Requires a clear accessible label and may be less explicit.',
    },
  ],
  prNote:
    'Use the design-system Button with variant="destructive" and provide an accessible label.',
};

export const recommendationSessionExample = {
  id: ids.recommendation,
  organizationId: ids.organization,
  projectId: ids.project,
  userId: ids.user,
  userGoal: 'I need a destructive confirmation action in a settings panel.',
  recommendedComponent: 'Button',
  confidence: 'high',
  reasoning:
    'The documented Button component supports destructive actions and accessibility requirements.',
  prNote:
    'Use the design-system Button with variant="destructive" and provide an accessible label.',
  rawResponse: recommendationExample,
  createdAt: timestamps.createdAt,
  alternatives: [
    {
      id: '78641d64-0465-42c2-8eba-917f03a03dc1',
      sessionId: ids.recommendation,
      componentName: 'IconButton',
      reason: 'Useful when the action is visually compact.',
      tradeoff: 'Requires a clear accessible label and may be less explicit.',
    },
  ],
};

export const auditExample = {
  id: ids.audit,
  status: 'needs_changes',
  summary:
    'The submitted JSX uses an icon-only button without an accessible name.',
  findings: [
    {
      severity: 'high',
      category: 'accessibility',
      issue: 'Icon-only button has no aria-label or visible text.',
      suggestion: 'Add aria-label="Delete item" or use visible text.',
      ruleUsed: 'Interactive controls need accessible names',
      filePath: 'src/components/DeleteButton.tsx',
      lineNumber: 12,
      docsLink: 'https://design.acme.com/accessibility/buttons',
    },
  ],
};

export const auditSessionExample = {
  id: ids.audit,
  organizationId: ids.organization,
  projectId: ids.project,
  userId: ids.user,
  auditType: 'pre-pr',
  inputType: 'jsx',
  inputContent: '<button className="icon-btn"><TrashIcon /></button>',
  status: 'NEEDS_CHANGES',
  summary:
    'The submitted JSX uses an icon-only button without an accessible name.',
  rawResponse: auditExample,
  createdAt: timestamps.createdAt,
  findings: [
    {
      id: '4a19695d-317d-4ed4-9a10-319a47bc5a14',
      auditSessionId: ids.audit,
      severity: Severity.HIGH,
      category: 'accessibility',
      issue: 'Icon-only button has no aria-label or visible text.',
      suggestion: 'Add aria-label="Delete item" or use visible text.',
      ruleUsed: 'Interactive controls need accessible names',
      filePath: 'src/components/DeleteButton.tsx',
      lineNumber: 12,
      docsLink: 'https://design.acme.com/accessibility/buttons',
      createdAt: timestamps.createdAt,
    },
  ],
};

export const setupGuidanceExample = {
  installCommand: 'npm install @acme/design-system',
  steps: [
    'Import the global stylesheet in app/layout.tsx.',
    'Wrap the app with the design-system provider.',
    'Use documented components before creating custom UI.',
  ],
  exampleUsage:
    'import { Button } from "@acme/design-system";\n\n<Button variant="primary">Save</Button>',
  commonMistakes: [
    'Mixing raw color values instead of design tokens.',
    'Using icon-only buttons without accessible labels.',
  ],
};

export const prNoteExample = {
  prNote:
    'This PR replaces a custom destructive action with the documented Button component and preserves required accessible labeling.',
};
