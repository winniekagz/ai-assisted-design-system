'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, RefreshCw, Save, Send, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { recommendationRequestSchema, recommendationResponseSchema, type RecommendationRequest, type RecommendationResponse, createMockRecommendation } from '@winniekagendo/componentiq-ai';
import { Badge } from 'componentiq';
import { Button } from 'componentiq';
import { Card, CardContent, CardHeader, CardTitle } from 'componentiq';
import { Select } from 'componentiq';
import { AppShell, PageHeader } from '@/features/dashboard/app-shell';

const contexts = ['Feature UI', 'Form', 'Dashboard', 'Marketing', 'Data Display', 'Navigation', 'Feedback', 'Settings', 'Checkout'];
const platforms = ['Web', 'Mobile Web', 'Admin Dashboard', 'React Native'];
const priorities = ['Reuse existing components', 'Accessibility', 'Responsive behavior', 'Fast implementation', 'Production-ready code', 'Design-token compliance'];
const suggestions = ['Dashboard filter bar', 'Checkout summary card', 'User settings form', 'Empty state for failed payment', 'Pricing card with three tiers'];

export function AssistantScreen() {
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [history, setHistory] = useState<RecommendationResponse[]>([]);
  const [error, setError] = useState('');

  const form = useForm<RecommendationRequest>({
    resolver: zodResolver(recommendationRequestSchema),
    defaultValues: {
      prompt: '',
      context: 'Feature UI',
      platform: 'Web',
      priorities: ['Reuse existing components', 'Accessibility', 'Design-token compliance'],
    },
  });

  useEffect(() => {
    const stored = window.sessionStorage.getItem('componentiq-recommendations');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) setHistory(parsed.slice(0, 5));
    }
  }, []);

  async function submit(values: RecommendationRequest) {
    setError('');
    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Recommendation failed');
      const parsed = recommendationResponseSchema.parse(await response.json());
      setResult(parsed);
    } catch {
      setResult(createMockRecommendation(values));
      setError('Using mocked fallback because the API response was unavailable.');
    }
  }

  function saveRecommendation() {
    if (!result) return;
    const next = [result, ...history].slice(0, 5);
    setHistory(next);
    window.sessionStorage.setItem('componentiq-recommendations', JSON.stringify(next));
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow='AI Assistant'
        title='Choose components with a mentor, not a blank prompt.'
        description='Describe the UI, add context and priorities, then review a structured recommendation grounded in the local component and token whitelist.'
      />

      <div className='grid gap-6 xl:grid-cols-[420px_1fr]'>
        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Bot className='size-5 text-primary' />
              Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className='grid gap-4' onSubmit={form.handleSubmit(submit)}>
              <label className='grid gap-2 text-sm font-medium' htmlFor='assistant-prompt'>
                Prompt
                <textarea
                  id='assistant-prompt'
                  {...form.register('prompt')}
                  rows={7}
                  placeholder='Describe the interface, feature, or component you want to build…'
                  className='min-h-40 rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                />
              </label>
              {form.formState.errors.prompt && (
                <p className='text-sm text-error-600' role='alert'>
                  {form.formState.errors.prompt.message}
                </p>
              )}
              <div className='grid gap-4 sm:grid-cols-2'>
                <label className='grid gap-2 text-sm font-medium'>
                  Context
                  <Select {...form.register('context')}>
                    {contexts.map(context => <option key={context}>{context}</option>)}
                  </Select>
                </label>
                <label className='grid gap-2 text-sm font-medium'>
                  Platform
                  <Select {...form.register('platform')}>
                    {platforms.map(platform => <option key={platform}>{platform}</option>)}
                  </Select>
                </label>
              </div>
              <fieldset className='grid gap-3'>
                <legend className='text-sm font-medium'>Priorities</legend>
                <Controller
                  name='priorities'
                  control={form.control}
                  render={({ field }) => (
                    <div className='grid gap-2 sm:grid-cols-2'>
                      {priorities.map(priority => {
                        const selected = field.value?.includes(priority) ?? false;
                        return (
                          <label
                            key={priority}
                            className='flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background-secondary px-3 py-2 text-sm'
                          >
                            <input
                              type='checkbox'
                              className='size-4 rounded border border-input'
                              checked={selected}
                              onChange={event => {
                                const next = event.target.checked
                                  ? [...(field.value ?? []), priority]
                                  : (field.value ?? []).filter(item => item !== priority);
                                field.onChange(next);
                              }}
                            />
                            {priority}
                          </label>
                        );
                      })}
                    </div>
                  )}
                />
              </fieldset>
              <div className='flex flex-wrap gap-2'>
                <Button type='submit' loading={form.formState.isSubmitting} startIcon={<Send />}>
                  Recommend
                </Button>
                <Button
                  type='button'
                  variant='outlined'
                  startIcon={<RefreshCw />}
                  onClick={() => void submit(form.getValues())}
                >
                  Regenerate
                </Button>
              </div>
              <div className='grid gap-2'>
                <p className='text-sm font-medium'>Prompt suggestions</p>
                <div className='flex flex-wrap gap-2'>
                  {suggestions.map(suggestion => (
                    <button
                      key={suggestion}
                      type='button'
                      onClick={() => form.setValue('prompt', suggestion)}
                      className='rounded-md border border-border px-3 py-2 text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <section className='grid gap-4' aria-live='polite'>
          {error && <div className='rounded-md border border-warning-500 bg-warning-50 p-3 text-sm text-warning-900'>{error}</div>}
          {!result ? (
            <Card className='border border-border bg-card'>
              <CardContent className='grid min-h-96 place-items-center text-center'>
                <div className='max-w-md'>
                  <Sparkles className='mx-auto mb-4 size-8 text-primary' />
                  <h2 className='text-xl font-semibold'>Recommendation will appear here</h2>
                  <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                    Results include components, tokens, draft code, accessibility notes, states, and governance guidance.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <RecommendationPanel result={result} onSave={saveRecommendation} />
          )}
          <Card className='border border-border bg-card'>
            <CardHeader>
              <CardTitle className='text-lg'>Recent recommendation history</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-3'>
              {history.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No saved recommendations in this session yet.</p>
              ) : history.map((item, index) => (
                <button key={`${item.summary}-${index}`} className='rounded-md border border-border p-3 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring' onClick={() => setResult(item)}>
                  {item.summary}
                </button>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}

function RecommendationPanel({ result, onSave }: { result: RecommendationResponse; onSave: () => void }) {
  return (
    <Card className='border border-border bg-card'>
      <CardHeader>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <CardTitle className='text-lg'>Structured recommendation</CardTitle>
          <Button type='button' variant='outlined' startIcon={<Save />} onClick={onSave}>
            Save
          </Button>
        </div>
      </CardHeader>
      <CardContent className='grid gap-5'>
        <ResultSection title='Summary'>{result.summary}</ResultSection>
        <ResultSection title='Layout suggestion'>{result.layoutSuggestion}</ResultSection>
        <ResultSection title='Recommended Components'>
          <div className='grid gap-3 md:grid-cols-2'>
            {result.recommendedComponents.map(component => (
              <div key={`${component.name}-${component.reason}`} className='rounded-md border border-border bg-background-secondary p-3'>
                <div className='flex items-center gap-2'>
                  <strong>{component.name}</strong>
                  {component.variant && <Badge variant='pastel' status='active'>{component.variant}</Badge>}
                </div>
                <p className='mt-2 text-sm text-muted-foreground'>{component.reason}</p>
              </div>
            ))}
          </div>
        </ResultSection>
        <ResultSection title='Design Tokens'><BulletList items={result.designTokens.map(token => `${token.token}: ${token.reason}`)} /></ResultSection>
        <ResultSection title='Implementation Plan'><BulletList items={result.implementationPlan} /></ResultSection>
        <ResultSection title='Draft Code'><pre className='overflow-x-auto rounded-md bg-neutral-950 p-4 text-sm text-white'><code>{result.exampleCode}</code></pre></ResultSection>
        <ResultSection title='Accessibility Notes'><BulletList items={result.accessibilityNotes} /></ResultSection>
        <ResultSection title='States to Consider'><BulletList items={result.statesToConsider} /></ResultSection>
        <ResultSection title='Governance Decision'><Badge variant='outlined' status='active'>{result.governanceDecision}</Badge></ResultSection>
        <ResultSection title='Risks'><BulletList items={result.risks} /></ResultSection>
        <ResultSection title='Review Notes'><BulletList items={result.reviewNotes} /></ResultSection>
      </CardContent>
    </Card>
  );
}

function ResultSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className='grid gap-2'>
      <h2 className='text-sm font-semibold uppercase text-muted-foreground'>{title}</h2>
      <div className='text-sm leading-6'>{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className='text-sm text-muted-foreground'>None noted for this response.</p>;
  }
  return (
    <ul className='grid gap-2'>
      {items.map(item => <li key={item} className='rounded-md bg-background-secondary p-3'>{item}</li>)}
    </ul>
  );
}
