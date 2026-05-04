'use client';

import {
  ArrowRight,
  Bot,
  ClipboardCheck,
  FileText,
  GitPullRequest,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { AppShell, PageHeader } from './app-shell';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const actions = [
  { title: 'Ask which component to use', href: '/assistant', icon: Bot },
  { title: 'Audit UI before PR', href: '/audit', icon: ClipboardCheck },
  { title: 'Generate component docs', href: '/components/button', icon: FileText },
  { title: 'Review component proposal', href: '/governance', icon: GitPullRequest },
  { title: 'Check token usage', href: '/audit', icon: ShieldCheck },
];

const activity = [
  'Recommended Filter Bar pattern for dashboard reporting.',
  'Flagged raw #2563eb color in PR audit simulation.',
  'Governance decision: compose existing Card + Badge + Table.',
  'Saved recommendation for settings form validation states.',
];

export function DashboardScreen() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () =>
      actions.filter(action =>
        action.title.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <AppShell>
      <section
        className='mb-6 rounded-xl border border-border bg-gradient-to-br from-primary-50 via-card to-card p-6 shadow-sm dark:bg-card dark:bg-none md:p-8'
        aria-labelledby='dashboard-welcome-heading'
      >
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div className='max-w-2xl'>
            <p className='text-sm font-medium uppercase text-primary'>Welcome</p>
            <h2 id='dashboard-welcome-heading' className='mt-2 text-2xl font-semibold tracking-tight text-foreground'>
              You are in the mentor lane, not the guesswork lane.
            </h2>
            <p className='mt-2 text-sm leading-6 text-muted-foreground md:text-base'>
              ComponentIQ simulates how a senior frontend platform lead would steer a team: pick the right primitive, keep
              tokens honest, catch accessibility gaps early, and route duplication into governance before it ships.
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button asChild endIcon={<ArrowRight />}>
              <Link href='/assistant'>Ask for a component</Link>
            </Button>
            <Button asChild variant='outlined'>
              <Link href='/safety'>Read AI guardrails</Link>
            </Button>
          </div>
        </div>
      </section>

      <PageHeader
        eyebrow='ComponentIQ MVP'
        title='Design-system decisions before the PR gets expensive.'
        description='A polished internal-tool simulation for component choice, token compliance, UI audits, governance, and AI safety.'
        actions={
          <Button asChild endIcon={<ArrowRight />}>
            <Link href='/assistant'>Start recommendation</Link>
          </Button>
        }
      />

      <section className='grid gap-4 md:grid-cols-4' aria-label='Metrics'>
        {[
          ['Reusable coverage', '84%', 'Existing components before variants'],
          ['Token adherence', '91%', 'Mocked audit pass rate'],
          ['A11y checks', '37', 'Risks surfaced before PR'],
          ['Duplicate patterns', '6', 'Routed to governance'],
        ].map(metric => (
          <Card key={metric[0]} className='border border-border bg-card'>
            <CardHeader className='gap-2'>
              <CardTitle className='text-sm text-muted-foreground'>{metric[0]}</CardTitle>
              <div className='text-3xl font-semibold'>{metric[1]}</div>
            </CardHeader>
            <CardContent className='text-sm text-muted-foreground'>{metric[2]}</CardContent>
          </Card>
        ))}
      </section>

      <section className='mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]'>
        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Sparkles className='size-5 text-primary' />
              Quick actions
            </CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <label className='grid gap-2 text-sm font-medium'>
              Search workflows
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  className='pl-9'
                  placeholder='Search actions, audits, docs, governance'
                />
              </div>
            </label>
            <div className='grid gap-3 md:grid-cols-2'>
              {filtered.map(action => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className='rounded-md border border-border bg-background-secondary p-4 transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  >
                    <Icon className='mb-3 size-5 text-primary' />
                    <span className='font-medium'>{action.title}</span>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='text-lg'>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='grid gap-3'>
              {activity.map(item => (
                <li key={item} className='rounded-md border border-border bg-background-secondary p-3 text-sm leading-6'>
                  {item}
                </li>
              ))}
            </ul>
            <Badge className='mt-4' variant='pastel' status='active'>
              Mock history
            </Badge>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
