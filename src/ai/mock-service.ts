import {
  auditResponseSchema,
  type AuditRequest,
  type AuditResponse,
} from './schemas/audit.schema';
import {
  governanceResponseSchema,
  type GovernanceRequest,
  type GovernanceResponse,
} from './schemas/governance.schema';
import {
  recommendationResponseSchema,
  type RecommendationRequest,
  type RecommendationResponse,
} from './schemas/recommendation.schema';

function includesAny(value: string, terms: string[]) {
  const lower = value.toLowerCase();
  return terms.some(term => lower.includes(term));
}

export function createMockRecommendation(
  input: RecommendationRequest
): RecommendationResponse {
  const prompt = input.prompt.toLowerCase();
  const isForm = input.context === 'Form' || includesAny(prompt, ['form', 'settings', 'checkout']);
  const isData = input.context === 'Data Display' || includesAny(prompt, ['table', 'dashboard', 'filter']);
  const isFeedback = input.context === 'Feedback' || includesAny(prompt, ['empty', 'error', 'failed', 'toast']);

  const components = isData
    ? [
        { name: 'Table', reason: 'The request needs structured, comparable data with clear review states.', variant: 'enhanced' },
        { name: 'Input', reason: 'Use for search and keyword filtering.' },
        { name: 'Select', reason: 'Use for constrained filter dimensions.' },
        { name: 'Badge', reason: 'Use for status and severity metadata.', variant: 'pastel' },
      ]
    : isForm
      ? [
          { name: 'Card', reason: 'Groups the workflow without creating a new component.' },
          { name: 'Input', reason: 'Use for labeled text entry and validation.' },
          { name: 'Select', reason: 'Use for constrained choices.' },
          { name: 'Button', reason: 'Use for save, cancel, and retry actions.', variant: 'contained' },
        ]
      : isFeedback
        ? [
            { name: 'Alert', reason: 'Use for persistent feedback and recovery guidance.', variant: 'warning' },
            { name: 'Card', reason: 'Frames the empty or failed state content.' },
            { name: 'Button', reason: 'Provides a clear recovery action.' },
          ]
        : [
            { name: 'Card', reason: 'Start with composition before proposing a new component.' },
            { name: 'Button', reason: 'Use approved action variants.' },
            { name: 'Badge', reason: 'Use for compact metadata and status.' },
          ];

  const response: RecommendationResponse = {
    summary:
      'Use existing primitives and compose the interface before proposing new design-system surface area.',
    recommendedComponents: components,
    layoutSuggestion:
      'Use a responsive two-column layout on desktop that collapses to a single column on mobile. Keep actions close to the form or data region they affect.',
    designTokens: [
      { token: 'background-paper', reason: 'Use for contained cards and panels.' },
      { token: 'spacing-4', reason: 'Default rhythm between related controls.' },
      { token: 'spacing-6', reason: 'Section spacing for readable review surfaces.' },
      { token: 'border-default', reason: 'Approved boundary for inputs and cards.' },
      { token: 'focus-ring', reason: 'Required visible keyboard focus treatment.' },
    ],
    implementationPlan: [
      'Start with known components and local state.',
      'Add visible labels, helper text, and validation/error messaging.',
      'Cover loading, empty, error, disabled, and responsive states.',
      'Review token usage before creating a PR.',
    ],
    accessibilityNotes: [
      'Every form control needs a visible label and programmatic association.',
      'Do not encode status by color alone; pair badges with text.',
      'Keep keyboard focus order aligned with the visual workflow.',
    ],
    statesToConsider: ['loading', 'empty', 'error', 'disabled', 'mobile/responsive'],
    exampleCode: `// Draft only - review required before production use.
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/form-fields/select';

export function DraftComposition() {
  return (
    <Card className="border border-border bg-card">
      <CardHeader>
        <CardTitle>${isData ? 'Filter results' : isForm ? 'Update settings' : 'Review state'}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Search
          <Input placeholder="Search by name or status" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Status
          <Select defaultValue="all">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
          </Select>
        </label>
        <Button className="md:w-fit">Apply</Button>
      </CardContent>
    </Card>
  );
}`,
    governanceDecision: isData ? 'create_pattern' : 'compose_existing',
    risks: [
      'Creating a bespoke surface too early could duplicate existing Card, Input, Select, and Button behavior.',
      'Missing disabled and error states will push accessibility fixes late in PR review.',
    ],
    reviewNotes: [
      'Approved as draft composition if the team uses only whitelisted tokens and components.',
      'Escalate to pattern review only after repeated usage appears in at least two workflows.',
    ],
  };

  return recommendationResponseSchema.parse(response);
}

export function createMockAudit(input: AuditRequest): AuditResponse {
  const hasRawHex = /#[0-9a-fA-F]{3,8}/.test(input.code);
  const hasButton = input.code.includes('<button') || input.code.includes('Button');
  const response: AuditResponse = {
    overallResult: hasRawHex ? 'needs_changes' : 'pass',
    summary:
      'The draft is directionally reusable, but it needs token and state review before it should be treated as PR-ready.',
    blockingIssues: hasButton
      ? []
      : ['No clear action component was found for the primary workflow.'],
    suggestions: [
      'Prefer existing Card, Input, Select, Button, Badge, and Table primitives before adding local UI.',
      'Document loading, empty, error, disabled, and mobile behavior in the PR description.',
    ],
    tokenViolations: hasRawHex
      ? ['Raw color values detected. Replace with approved design tokens such as primary-500 or background-paper.']
      : [],
    accessibilityRisks: [
      'Verify every input has a visible label.',
      'Confirm keyboard focus order and focus-visible treatment.',
      'Pair status color with readable text.',
    ],
    recommendedComponents: ['Card', 'Button', 'Input', 'Select', 'Badge'],
    governanceDecision: 'compose_existing',
    suggestedRewrite: `// Draft rewrite - review required.
<Card className="border border-border bg-card">
  <CardHeader>
    <CardTitle>Review-ready UI</CardTitle>
  </CardHeader>
  <CardContent className="grid gap-4">
    <label className="grid gap-2 text-sm font-medium">
      Name
      <Input />
    </label>
    <Button>Continue</Button>
  </CardContent>
</Card>`,
  };

  return auditResponseSchema.parse(response);
}

export function createMockGovernance(
  input: GovernanceRequest
): GovernanceResponse {
  const need = input.need.toLowerCase();
  if (input.existingCoverage === 'unclear') {
    return governanceResponseSchema.parse({
      decision: 'needs_design_review',
      rationale:
        'Signals conflict or missing evidence. A short design-system review should align on scope, reuse, and accessibility before engineering invests in implementation.',
      nextSteps: [
        'Schedule a 25-minute triage with design and frontend platform.',
        'Bring screenshots, user flows, and two alternative compositions using existing components.',
      ],
      requiredReviewers: ['Design partner', 'Design system owner', 'Accessibility reviewer'],
      evidenceNeeded: [
        'Clarify whether the need is one-off or recurring.',
        'List components already evaluated and why they fail.',
      ],
    });
  }

  const decision =
    input.existingCoverage === 'yes'
      ? 'compose_existing'
      : input.existingCoverage === 'eighty'
        ? 'create_variant'
        : input.repeatability === 'repeated'
          ? 'create_pattern'
          : input.reusableAcrossProduct || includesAny(need, ['global', 'product-wide'])
            ? 'new_component_proposal'
            : 'local_one_off';

  return governanceResponseSchema.parse({
    decision,
    rationale:
      decision === 'compose_existing'
        ? 'Existing primitives appear sufficient; adding new design-system API would create avoidable duplication.'
        : decision === 'create_variant'
          ? 'An existing component covers most behavior, so a constrained variant is less costly than a new primitive.'
          : decision === 'create_pattern'
            ? 'The need is repeated and composed from several primitives, which fits pattern governance.'
            : decision === 'new_component_proposal'
              ? 'The need appears reusable across product areas and should enter proposal review with evidence.'
              : 'This looks one-off and should remain local until repeat usage is proven.',
    nextSteps: [
      'Document current examples and affected workflows.',
      'Map the solution to approved components and tokens.',
      'Get design and accessibility review before adding new API surface.',
    ],
    requiredReviewers:
      decision === 'new_component_proposal'
        ? ['Design system owner', 'Accessibility reviewer', 'Frontend platform lead']
        : ['Feature engineer', 'Design partner'],
    evidenceNeeded: [
      'Screens or PRs showing repeated need.',
      'Known states and responsive behavior.',
      'Why existing components cannot solve the workflow cleanly.',
    ],
  });
}
