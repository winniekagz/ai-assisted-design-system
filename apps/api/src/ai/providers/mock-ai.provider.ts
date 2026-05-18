import { Injectable } from '@nestjs/common';

import {
  AiProvider,
  AiProviderRequest,
  AiProviderResult,
} from './ai-provider.interface';

@Injectable()
export class MockAiProvider implements AiProvider {
  async completeJson(request: AiProviderRequest): Promise<AiProviderResult> {
    const startedAt = Date.now();

    const raw =
      request.feature === 'pre_pr_audit'
        ? this.auditResponse(request.userPrompt)
        : request.feature === 'setup_guidance'
          ? this.setupGuidanceResponse(request.userPrompt)
          : request.feature === 'pr_note'
            ? this.prNoteResponse()
            : this.recommendationResponse(request.userPrompt);

    return {
      model: 'mock-componentiq-v1',
      raw,
      latencyMs: Date.now() - startedAt,
    };
  }

  private recommendationResponse(prompt: string) {
    const lowerPrompt = prompt.toLowerCase();
    const destructive =
      lowerPrompt.includes('delete') ||
      lowerPrompt.includes('destructive') ||
      lowerPrompt.includes('confirm');
    const component = destructive ? 'Modal' : 'DataState';

    return {
      recommendedComponent: component,
      confidence: destructive ? 'high' : 'medium',
      reason: destructive
        ? 'Use Modal because the provided rules reserve it for blocking decisions and destructive confirmations.'
        : 'Use DataState because the request appears to involve API-driven UI states.',
      guardrails: destructive
        ? ['Include cancel action', 'Trap focus inside modal']
        : ['Include loading, error, empty, and success states'],
      alternatives: [
        {
          component: destructive ? 'Drawer' : 'Card',
          reason: destructive
            ? 'Drawer keeps page context but is not appropriate for critical blocking confirmations.'
            : 'Card can group content but does not cover async state handling.',
          tradeoff: destructive
            ? 'Better for non-blocking edits, not destructive confirmation.'
            : 'Requires separate loading and error states.',
        },
      ],
      prNote: destructive
        ? 'Used Modal because this action requires explicit confirmation under organization rules.'
        : 'Used DataState because API-driven UI must cover loading, error, empty, and success states.',
    };
  }

  private auditResponse(prompt: string) {
    const lowerPrompt = prompt.toLowerCase();
    const findings = [];

    if (lowerPrompt.includes('<button') || lowerPrompt.includes('raw button')) {
      findings.push({
        severity: 'medium',
        category: 'component_usage',
        issue: 'Raw button used instead of shared Button component.',
        suggestion:
          'Use the shared Button component with the appropriate variant.',
        ruleUsed: 'Use shared Button for interactive actions.',
        docsLink: '/components/button',
      });
    }

    if (lowerPrompt.includes('#')) {
      findings.push({
        severity: 'high',
        category: 'design_tokens',
        issue: 'Raw color value appears in UI code.',
        suggestion: 'Use an approved design token instead of a raw hex color.',
        ruleUsed: 'Do not use raw hex colors outside token files.',
      });
    }

    return {
      status: findings.length > 0 ? 'needs_changes' : 'passed',
      summary:
        findings.length > 0
          ? `${findings.length} design-system issue(s) found.`
          : 'No organization-rule issues found by the mock audit.',
      findings,
    };
  }

  private setupGuidanceResponse(prompt: string) {
    const packageManager = prompt.toLowerCase().includes('npm')
      ? 'npm'
      : 'pnpm';

    return {
      installCommand:
        packageManager === 'npm'
          ? 'npm install componentiq'
          : 'pnpm add componentiq',
      steps: [
        'Install the ComponentIQ package.',
        'Wrap the app with the design-system provider.',
        'Import shared components from the package.',
        'Use organization guardrails during review.',
      ],
      exampleUsage:
        "import { Button } from 'componentiq';\n\n<Button variant='primary'>Save</Button>",
      commonMistakes: [
        'Creating custom UI before checking the component catalog.',
        'Using raw colors instead of design tokens.',
        'Treating AI output as approval instead of review guidance.',
      ],
    };
  }

  private prNoteResponse() {
    return {
      prNote:
        'AI review note: recommendations are based on the provided organization rules and require human review before approval.',
    };
  }
}
