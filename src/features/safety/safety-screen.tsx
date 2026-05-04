'use client';

import { AlertOctagon, KeyRound, Lock, Shield, Sparkles, Terminal } from 'lucide-react';

import { Badge } from '@/components/ui/badge/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell, PageHeader } from '@/features/dashboard/app-shell';

const principles = [
  {
    title: 'AI suggestions are drafts',
    body: 'Every recommendation, audit finding, and governance memo is starting material. It is not a merge-ready spec and not a substitute for team standards.',
    icon: Sparkles,
  },
  {
    title: 'Generated code requires human review',
    body: 'Draft snippets are displayed only. They are never executed in this product shell, and they should not be pasted blindly into production without review.',
    icon: Terminal,
  },
  {
    title: 'AI output is untrusted',
    body: 'Models can drift, overfit to prompts, or mirror unsafe patterns. Treat responses like external contributor diffs: read, validate, and test.',
    icon: AlertOctagon,
  },
  {
    title: 'API keys stay server-side',
    body: 'Keys live in environment variables consumed by Next.js API routes. The browser only sees JSON results, never secrets.',
    icon: KeyRound,
  },
  {
    title: 'No secrets or private data in prompts',
    body: 'Do not paste customer payloads, auth tokens, or proprietary algorithms. Assume prompts may be logged for debugging.',
    icon: Lock,
  },
];

const risks = [
  {
    title: 'Hallucinated components',
    body: 'Models may import components that do not exist. ComponentIQ whitelists catalog components and tokens in prompts and validates structured responses with Zod before rendering.',
  },
  {
    title: 'Prompt injection',
    body: 'Malicious strings embedded in UI copy could attempt to override instructions. Keep system prompts strict, scope tools narrowly, and never execute model-produced code.',
  },
  {
    title: 'Token misuse',
    body: 'Even valid-sounding classnames can drift from approved tokens. Pair automated checks with human review, especially for color and spacing.',
  },
  {
    title: 'Accessibility regressions',
    body: 'AI can miss focus order, live regions, or contrast edge cases. Accessibility notes are mandatory in recommendations, but they are not a WCAG sign-off.',
  },
];

const controls = [
  'Component whitelist embedded in prompts and UI catalog.',
  'Token whitelist embedded in prompts and audit heuristics.',
  'Structured JSON outputs parsed with Zod; invalid payloads fall back to deterministic mocks.',
  'Human approval required before adding new reusable components to the design system.',
  'Draft-only rendering for any generated code blocks.',
];

export function SafetyScreen() {
  return (
    <AppShell>
      <PageHeader
        eyebrow='Safety'
        title='Guardrails for AI-assisted design systems.'
        description='ComponentIQ pairs pragmatic velocity with platform discipline: mentor-first guidance, direct technical framing, and reviewer-grade skepticism about anything that could ship without humans in the loop.'
      />

      <div className='grid gap-6 lg:grid-cols-2'>
        {principles.map(item => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className='border border-border bg-card'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <Icon className='size-5 text-primary' aria-hidden />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='text-sm leading-6 text-muted-foreground'>{item.body}</CardContent>
            </Card>
          );
        })}
      </div>

      <section className='mt-8 grid gap-4'>
        <h2 className='text-xl font-semibold'>Risk surface</h2>
        <div className='grid gap-4 md:grid-cols-2'>
          {risks.map(risk => (
            <Card key={risk.title} className='border border-border bg-card'>
              <CardHeader>
                <CardTitle className='text-base'>{risk.title}</CardTitle>
              </CardHeader>
              <CardContent className='text-sm leading-6 text-muted-foreground'>{risk.body}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card className='mt-8 border border-border bg-card'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <Shield className='size-5 text-primary' aria-hidden />
            Controls in this MVP
          </CardTitle>
        </CardHeader>
        <CardContent className='grid gap-3'>
          {controls.map(control => (
            <div key={control} className='flex items-start gap-3 rounded-md bg-background-secondary p-3 text-sm leading-6'>
              <Badge variant='pastel' status='active'>
                Control
              </Badge>
              <span>{control}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
