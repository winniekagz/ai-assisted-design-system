'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, CheckCircle2, ClipboardList, Loader2, ShieldAlert } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';

import { createMockAudit } from '@/ai/mock-service';
import {
  auditRequestSchema,
  auditResponseSchema,
  type AuditRequest,
  type AuditResponse,
} from '@/ai/schemas/audit.schema';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell, PageHeader } from '@/features/dashboard/app-shell';

export function AuditScreen() {
  const [result, setResult] = useState<AuditResponse | null>(null);
  const [banner, setBanner] = useState('');
  const form = useForm<AuditRequest>({
    resolver: zodResolver(auditRequestSchema as never),
    defaultValues: { description: '', code: '' },
  });

  async function submit(values: AuditRequest) {
    setBanner('');
    try {
      const response = await fetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Audit request failed');
      const data = auditResponseSchema.parse(await response.json());
      setResult(data);
    } catch {
      setResult(createMockAudit(values));
      setBanner('Showing mocked audit output because the API response was unavailable or failed validation.');
    }
  }

  const overall = result?.overallResult;

  return (
    <AppShell>
      <PageHeader
        eyebrow='PR-style audit'
        title='Review UI the way a platform team would before merge.'
        description='Paste a UI description and optional JSX. You get blocking issues, token violations, accessibility risks, governance guidance, and a draft rewrite—never executed, display only.'
      />

      <div className='grid gap-6 xl:grid-cols-[minmax(0,420px)_1fr]'>
        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <ClipboardList className='size-5 text-primary' />
              Inputs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className='grid gap-4' onSubmit={form.handleSubmit(submit)} noValidate>
              <label className='grid gap-2 text-sm font-medium' htmlFor='audit-description'>
                Describe the UI
                <textarea
                  id='audit-description'
                  rows={5}
                  className='min-h-32 rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  placeholder='e.g. Checkout summary with discounts, tax, and CTA…'
                  {...form.register('description')}
                />
              </label>
              {form.formState.errors.description && (
                <p className='text-sm text-error-600' role='alert'>
                  {form.formState.errors.description.message}
                </p>
              )}
              <label className='grid gap-2 text-sm font-medium' htmlFor='audit-code'>
                Paste JSX or code (optional)
                <textarea
                  id='audit-code'
                  rows={10}
                  className='min-h-48 rounded-md border border-input bg-background px-3 py-2 font-mono text-xs leading-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  placeholder={'<div className="p-4">\n  ...\n</div>'}
                  {...form.register('code')}
                />
              </label>
              <Button type='submit' loading={form.formState.isSubmitting} startIcon={<ShieldAlert />}>
                Run audit
              </Button>
            </form>
          </CardContent>
        </Card>

        <section className='grid gap-4' aria-live='polite'>
          {form.formState.isSubmitting && (
            <Card className='border border-border bg-card'>
              <CardContent className='flex items-center gap-3 py-8 text-sm text-muted-foreground'>
                <Loader2 className='size-5 animate-spin text-primary' aria-hidden />
                Running audit…
              </CardContent>
            </Card>
          )}

          {banner && (
            <div className='rounded-md border border-warning-500 bg-warning-50 p-3 text-sm text-warning-900' role='status'>
              {banner}
            </div>
          )}

          {!result && !form.formState.isSubmitting ? (
            <Card className='border border-dashed border-border bg-card'>
              <CardContent className='grid min-h-64 place-items-center text-center text-muted-foreground'>
                <p className='max-w-md text-sm leading-6'>
                  Add context in plain language first. Code helps catch token literals and missing primitives, but the
                  description alone can still surface governance and accessibility risks.
                </p>
              </CardContent>
            </Card>
          ) : null}

          {result && !form.formState.isSubmitting ? (
            <Card className='border border-border bg-card'>
              <CardHeader className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <CardTitle className='text-lg'>Review result</CardTitle>
                <ResultBadge overall={overall} />
              </CardHeader>
              <CardContent className='grid gap-6'>
                <AuditBlock title='Summary' icon={<CheckCircle2 className='size-4 text-primary' />}>
                  <p className='text-sm leading-6'>{result.summary}</p>
                </AuditBlock>
                <AuditBlock title='Blocking issues' icon={<AlertTriangle className='size-4 text-error-600' />}>
                  {result.blockingIssues.length === 0 ? (
                    <p className='text-sm text-muted-foreground'>No blocking issues flagged in this pass.</p>
                  ) : (
                    <ul className='grid gap-2'>
                      {result.blockingIssues.map(issue => (
                        <li key={issue} className='rounded-md border border-error-200 bg-error-50 p-3 text-sm text-error-900'>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  )}
                </AuditBlock>
                <AuditBlock title='Suggestions' icon={<ClipboardList className='size-4 text-primary' />}>
                  <ul className='grid gap-2'>
                    {result.suggestions.map(s => (
                      <li key={s} className='rounded-md bg-background-secondary p-3 text-sm'>
                        {s}
                      </li>
                    ))}
                  </ul>
                </AuditBlock>
                <AuditBlock title='Token violations' icon={<ShieldAlert className='size-4 text-warning-700' />}>
                  {result.tokenViolations.length === 0 ? (
                    <p className='text-sm text-muted-foreground'>No obvious token violations detected in this snapshot.</p>
                  ) : (
                    <ul className='grid gap-2'>
                      {result.tokenViolations.map(v => (
                        <li key={v} className='rounded-md border border-warning-200 bg-warning-50 p-3 text-sm'>
                          {v}
                        </li>
                      ))}
                    </ul>
                  )}
                </AuditBlock>
                <AuditBlock title='Accessibility risks' icon={<AlertTriangle className='size-4 text-warning-700' />}>
                  <ul className='grid gap-2'>
                    {result.accessibilityRisks.map(r => (
                      <li key={r} className='rounded-md bg-background-secondary p-3 text-sm'>
                        {r}
                      </li>
                    ))}
                  </ul>
                </AuditBlock>
                <AuditBlock title='Recommended components' icon={<CheckCircle2 className='size-4 text-primary' />}>
                  <div className='flex flex-wrap gap-2'>
                    {result.recommendedComponents.map(name => (
                      <Badge key={name} variant='pastel' status='active'>
                        {name}
                      </Badge>
                    ))}
                  </div>
                </AuditBlock>
                <AuditBlock title='Governance decision' icon={<ShieldAlert className='size-4 text-primary' />}>
                  <Badge variant='outlined' status='active'>
                    {result.governanceDecision}
                  </Badge>
                </AuditBlock>
                <AuditBlock title='Suggested rewrite (draft only)' icon={<ClipboardList className='size-4 text-primary' />}>
                  <pre className='overflow-x-auto rounded-md bg-neutral-950 p-4 text-xs text-white md:text-sm'>
                    <code>{result.suggestedRewrite}</code>
                  </pre>
                </AuditBlock>
              </CardContent>
            </Card>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}

function ResultBadge({ overall }: { overall?: AuditResponse['overallResult'] }) {
  if (!overall) return null;
  const label =
    overall === 'pass' ? 'Pass with notes' : overall === 'needs_changes' ? 'Needs changes' : 'Blocked';
  const status = overall === 'pass' ? 'active' : overall === 'needs_changes' ? 'pending' : 'error';
  return (
    <Badge variant={overall === 'pass' ? 'pastel' : 'outlined'} status={status}>
      {label}
    </Badge>
  );
}

function AuditBlock({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className='grid gap-2'>
      <h2 className='flex items-center gap-2 text-sm font-semibold uppercase text-muted-foreground'>
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}
