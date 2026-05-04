'use client';

import { BookOpen, Cpu, Layers, LineChart } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell, PageHeader } from '@/features/dashboard/app-shell';

const pillars = [
  {
    title: 'Mentor-first workflows',
    body: 'Recommendations read like a senior engineer pairing session: grounded in the local component catalog, explicit about trade-offs, and honest about risk.',
    icon: BookOpen,
  },
  {
    title: 'Governance without bureaucracy theater',
    body: 'The governance tree encodes how platform teams actually decide: reuse, variant, pattern, proposal, or local one-off—before Figma files multiply.',
    icon: Layers,
  },
  {
    title: 'Audit early, not after merge',
    body: 'The audit screen simulates PR review language so teams can practice catching token literals, missing states, and accessibility gaps while context is cheap.',
    icon: LineChart,
  },
  {
    title: 'Architecture that respects production rules',
    body: 'Prompts stay outside UI, responses are schema-validated, keys stay on the server, and generated code is always review-only.',
    icon: Cpu,
  },
];

export function CaseStudyScreen() {
  return (
    <AppShell>
      <PageHeader
        eyebrow='Case study / about'
        title='Why ComponentIQ exists.'
        description='Frontend teams drown in choice: similar-looking components, token drift, duplicated cards, and accessibility issues that surface too late. ComponentIQ is a disciplined simulation of how platform teams want AI to help—bounded, review-first, and aligned to a real catalog.'
        actions={
          <Button asChild variant='outlined'>
            <Link href='/assistant'>Try the assistant</Link>
          </Button>
        }
      />

      <section className='grid gap-4 md:grid-cols-2'>
        {pillars.map(pillar => {
          const Icon = pillar.icon;
          return (
            <Card key={pillar.title} className='border border-border bg-card'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <Icon className='size-5 text-primary' aria-hidden />
                  {pillar.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='text-sm leading-6 text-muted-foreground'>{pillar.body}</CardContent>
            </Card>
          );
        })}
      </section>

      <Card className='mt-8 border border-border bg-card'>
        <CardHeader>
          <CardTitle className='text-lg'>MVP scope (intentionally narrow)</CardTitle>
        </CardHeader>
        <CardContent className='grid gap-3 text-sm leading-6 text-muted-foreground'>
          <p>
            This build focuses on education and workflow simulation: dashboard, AI assistant, component catalog, audits,
            governance, and safety documentation. There is no authentication, billing, multi-tenant workspaces, GitHub
            scanning, or Figma automation in this MVP.
          </p>
          <p>
            Persistence is limited to session storage for saved recommendations so demos stay reliable without a
            database. API routes call compatible chat-completions JSON endpoints when keys exist, otherwise structured
            mocks keep the UI populated.
          </p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
