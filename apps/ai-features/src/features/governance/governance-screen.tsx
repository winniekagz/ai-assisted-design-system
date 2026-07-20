'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { GitBranch, Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createMockGovernance } from '@/ai/mock-service';
import {
  governanceRequestSchema,
  governanceResponseSchema,
  type GovernanceRequest,
  type GovernanceResponse,
} from '@/ai/schemas/governance.schema';
import type { GovernanceDecision } from '@/ai/schemas/recommendation.schema';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AppShell, PageHeader } from '@/features/layout';
import { toast } from 'componentiq';

const needOnlySchema = z.object({
  need: z.string().min(6).max(3000),
});

type TreeOutcome =
  | { kind: 'terminal'; decision: GovernanceDecision }
  | { kind: 'proposal'; decision: 'new_component_proposal' };

type TreeNode = {
  title: string;
  yesLabel: string;
  noLabel: string;
  yes: TreeOutcome;
  no: TreeOutcome | 'next';
};

const treeNodes: TreeNode[] = [
  {
    title: 'Can existing components solve the full need without a new primitive?',
    yesLabel: 'Yes — reuse and compose',
    noLabel: 'No — still missing capability',
    yes: { kind: 'terminal', decision: 'compose_existing' },
    no: 'next',
  },
  {
    title: 'Can a single existing component cover roughly 80% with a focused variant?',
    yesLabel: 'Yes — ship a variant',
    noLabel: 'No — needs more than one primitive',
    yes: { kind: 'terminal', decision: 'create_variant' },
    no: 'next',
  },
  {
    title: 'Is this a repeated UI need composed from multiple existing components?',
    yesLabel: 'Yes — codify a pattern',
    noLabel: 'No — not a repeated composition',
    yes: { kind: 'terminal', decision: 'create_pattern' },
    no: 'next',
  },
  {
    title: 'Is it truly new and reusable across multiple product areas?',
    yesLabel: 'Yes — propose a new component',
    noLabel: 'No — scope is narrower',
    yes: { kind: 'proposal', decision: 'new_component_proposal' },
    no: 'next',
  },
  {
    title: 'Is this a strict one-off?',
    yesLabel: 'Yes — keep it local',
    noLabel: 'No — signals are conflicting',
    yes: { kind: 'terminal', decision: 'local_one_off' },
    no: { kind: 'terminal', decision: 'needs_design_review' },
  },
];

const decisionLabels: Record<GovernanceDecision, string> = {
  compose_existing: 'Compose with existing components',
  create_variant: 'Create variant',
  create_pattern: 'Create reusable pattern',
  new_component_proposal: 'Submit new component proposal',
  local_one_off: 'Keep as local one-off implementation',
  needs_design_review: 'Needs design review',
};

export function GovernanceScreen() {
  const [phase, setPhase] = useState<'tree' | 'proposal' | 'memo'>('tree');
  const [treeIndex, setTreeIndex] = useState(0);
  const [path, setPath] = useState<string[]>([]);
  const [outcome, setOutcome] = useState<TreeOutcome | null>(null);
  const [aiResult, setAiResult] = useState<GovernanceResponse | null>(null);
  const [banner, setBanner] = useState('');

  const proposalForm = useForm({
    defaultValues: { title: '', problem: '', evidence: '' },
  });

  const needForm = useForm<{ need: string }>({
    resolver: zodResolver(needOnlySchema),
    defaultValues: { need: '' },
  });

  const mappedRequest = useMemo((): GovernanceRequest | null => {
    const parsedNeed = needForm.getValues('need').trim();
    if (parsedNeed.length < 6 || !outcome) return null;
    if (outcome.kind === 'proposal') {
      const extra = proposalForm.getValues();
      const composed = [
        parsedNeed,
        extra.title && `Proposal title: ${extra.title}`,
        extra.problem && `Problem statement: ${extra.problem}`,
        extra.evidence && `Evidence / links: ${extra.evidence}`,
      ]
        .filter(Boolean)
        .join('\n\n');
      return {
        need: composed,
        existingCoverage: 'no',
        repeatability: 'once',
        reusableAcrossProduct: true,
      };
    }
    return mapTerminalToRequest(parsedNeed, outcome.decision);
  }, [needForm, outcome, proposalForm]);

  function resetAll() {
    setPhase('tree');
    setTreeIndex(0);
    setPath([]);
    setOutcome(null);
    setAiResult(null);
    setBanner('');
    proposalForm.reset();
  }

  function handleTreeAnswer(yes: boolean) {
    const node = treeNodes[treeIndex];
    if (!node) return;
    const branch = yes ? node.yes : node.no;
    const label = yes ? node.yesLabel : node.noLabel;
    setPath(current => [...current, label]);

    if (branch === 'next') {
      setTreeIndex(index => index + 1);
      return;
    }

    setOutcome(branch);
    setPhase(branch.kind === 'proposal' ? 'proposal' : 'memo');
  }

  async function fetchRationale() {
    const body = mappedRequest;
    if (!body) {
      setBanner('Describe the need in at least one complete sentence before requesting an AI memo.');
      return;
    }
    setBanner('');
    try {
      const response = await fetch('/api/ai/governance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(governanceRequestSchema.parse(body)),
      });
      if (!response.ok) throw new Error('Governance request failed');
      const data = governanceResponseSchema.parse(await response.json());
      setAiResult(data);
    } catch {
      setAiResult(createMockGovernance(governanceRequestSchema.parse(body)));
      toast({
        variant: 'warning',
        title: 'Using mocked governance memo because the API response was unavailable or failed validation.',
      });
    }
  }

  const currentNode = treeNodes[treeIndex];
  const resolvedDecision: GovernanceDecision | null =
    outcome?.kind === 'proposal' ? 'new_component_proposal' : outcome?.decision ?? null;

  return (
    <AppShell>
      <PageHeader
        eyebrow='Governance'
        title='Decision tree first. Paperwork only when a proposal is real.'
        description='Walk the reuse ladder: composition, variant, pattern, proposal, or local one-off. AI enriches the rationale; humans still approve any new design-system surface.'
      />

      <Card className='mb-6 border border-border bg-card'>
        <CardHeader>
          <CardTitle className='text-base font-semibold'>Need summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-2'>
            <label className='grid gap-2 text-sm font-medium' htmlFor='gov-need'>
              What problem are you solving?
            </label>
            <textarea
              id='gov-need'
              rows={4}
              className='rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              placeholder='Describe the UI need, constraints, and where it shows up in the product.'
              {...needForm.register('need')}
            />
            {needForm.formState.errors.need && (
              <p className='text-sm text-error-600' role='alert'>
                {needForm.formState.errors.need.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {phase === 'tree' && currentNode && (
        <Card className='border border-border bg-card'>
          <CardHeader className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <CardTitle className='text-lg'>Governance decision tree</CardTitle>
            <Button type='button' variant='outlined' size='sm' onClick={resetAll}>
              Reset
            </Button>
          </CardHeader>
          <CardContent className='grid gap-4'>
            {path.length > 0 && (
              <ol className='list-decimal space-y-1 pl-5 text-sm text-muted-foreground'>
                {path.map((entry, index) => (
                  <li key={`${index}-${entry}`}>{entry}</li>
                ))}
              </ol>
            )}
            <p className='text-base font-medium leading-snug'>{currentNode.title}</p>
            <div className='flex flex-wrap gap-2'>
              <Button type='button' onClick={() => handleTreeAnswer(true)}>
                Yes
              </Button>
              <Button type='button' variant='outlined' onClick={() => handleTreeAnswer(false)}>
                No
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === 'proposal' && outcome?.kind === 'proposal' && (
        <Card className='mb-6 border border-border bg-card'>
          <CardHeader>
            <CardTitle className='text-lg'>New component proposal</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <p className='text-sm text-muted-foreground'>
              This path assumes the need is reusable across the product. Capture enough context for design-system and
              accessibility reviewers—still no authentication or persistence in this MVP.
            </p>
            <label className='grid gap-2 text-sm font-medium' htmlFor='proposal-title'>
              Working name
              <Input id='proposal-title' placeholder='e.g. InlineBanner' {...proposalForm.register('title')} />
            </label>
            <label className='grid gap-2 text-sm font-medium' htmlFor='proposal-problem'>
              Problem and user impact
              <textarea
                id='proposal-problem'
                rows={4}
                className='rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                {...proposalForm.register('problem')}
              />
            </label>
            <label className='grid gap-2 text-sm font-medium' htmlFor='proposal-evidence'>
              Evidence (PRs, screenshots, metrics)
              <textarea
                id='proposal-evidence'
                rows={3}
                className='rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                {...proposalForm.register('evidence')}
              />
            </label>
            <div className='flex flex-wrap gap-2'>
              <Button type='button' onClick={() => setPhase('memo')}>
                Continue to memo
              </Button>
              <Button type='button' variant='outlined' onClick={resetAll}>
                Restart tree
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === 'memo' && outcome && resolvedDecision && (
        <Card className='border border-border bg-card'>
          <CardHeader className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <CardTitle className='text-lg'>Decision</CardTitle>
              <p className='mt-1 text-sm text-muted-foreground'>
                Tree outcome:{' '}
                <Badge className='ml-1' variant='pastel' status='active'>
                  {decisionLabels[resolvedDecision]}
                </Badge>
              </p>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button type='button' startIcon={<Send />} onClick={() => void fetchRationale()}>
                Generate governance memo
              </Button>
              <Button type='button' variant='outlined' startIcon={<GitBranch />} onClick={resetAll}>
                Restart
              </Button>
            </div>
          </CardHeader>
          <CardContent className='grid gap-4'>
            {banner && (
              <div
                className='rounded-md border border-status-error bg-status-error-bg p-3 text-sm text-status-error'
                role='alert'
              >
                {banner}
              </div>
            )}
            {!aiResult ? (
              <p className='text-sm text-muted-foreground'>
                The tree encodes the platform decision model. Generate a memo for reviewer-ready language, required
                reviewers, and evidence expectations.
              </p>
            ) : (
              <GovernanceMemo memo={aiResult} />
            )}
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}

function mapTerminalToRequest(need: string, decision: GovernanceDecision): GovernanceRequest {
  switch (decision) {
    case 'compose_existing':
      return { need, existingCoverage: 'yes', repeatability: 'once', reusableAcrossProduct: false };
    case 'create_variant':
      return { need, existingCoverage: 'eighty', repeatability: 'once', reusableAcrossProduct: false };
    case 'create_pattern':
      return { need, existingCoverage: 'no', repeatability: 'repeated', reusableAcrossProduct: false };
    case 'new_component_proposal':
      return { need, existingCoverage: 'no', repeatability: 'once', reusableAcrossProduct: true };
    case 'local_one_off':
      return { need, existingCoverage: 'no', repeatability: 'once', reusableAcrossProduct: false };
    case 'needs_design_review':
      return { need, existingCoverage: 'unclear', repeatability: 'unknown', reusableAcrossProduct: false };
    default:
      return { need, existingCoverage: 'no', repeatability: 'once', reusableAcrossProduct: false };
  }
}

function GovernanceMemo({ memo }: { memo: GovernanceResponse }) {
  return (
    <div className='grid gap-5'>
      <section>
        <h3 className='text-sm font-semibold uppercase text-muted-foreground'>Rationale</h3>
        <p className='mt-2 text-sm leading-6'>{memo.rationale}</p>
      </section>
      <section>
        <h3 className='text-sm font-semibold uppercase text-muted-foreground'>Next steps</h3>
        <ul className='mt-2 grid gap-2'>
          {memo.nextSteps.map(item => (
            <li key={item} className='rounded-md bg-background-secondary p-3 text-sm'>
              {item}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className='text-sm font-semibold uppercase text-muted-foreground'>Required reviewers</h3>
        <div className='mt-2 flex flex-wrap gap-2'>
          {memo.requiredReviewers.map(name => (
            <Badge key={name} variant='outlined' status='active'>
              {name}
            </Badge>
          ))}
        </div>
      </section>
      <section>
        <h3 className='text-sm font-semibold uppercase text-muted-foreground'>Evidence needed</h3>
        <ul className='mt-2 grid gap-2'>
          {memo.evidenceNeeded.map(item => (
            <li key={item} className='rounded-md border border-border p-3 text-sm'>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
