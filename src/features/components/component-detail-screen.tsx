'use client';

import { ArrowLeft, Bot, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReusableTabs } from '@/components/ui/tab/tabs';
import { getComponentBySlug, designSystemComponents, type DesignSystemComponent } from '@/design-system/data/components';
import { AppShell, PageHeader } from '@/features/dashboard/app-shell';

const actions = [
  'Generate documentation',
  'Explain when to use this',
  'Create example usage',
  'Check accessibility',
  'Suggest variants',
  'Compare with another component',
];

export function ComponentDetailScreen({ slug }: { slug: string }) {
  const component = getComponentBySlug(slug);

  if (!component) {
    return (
      <AppShell>
        <PageHeader eyebrow='Component Detail' title='Component not found' description='The requested component is not in the current design-system whitelist.' />
        <Button asChild variant='outlined' startIcon={<ArrowLeft />}>
          <Link href='/components'>Back to components</Link>
        </Button>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow={component.category}
        title={component.name}
        description={component.description}
        actions={<Button asChild variant='outlined' startIcon={<ArrowLeft />}><Link href='/components'>Back</Link></Button>}
      />
      <ComponentTabs component={component} />
    </AppShell>
  );
}

function ComponentTabs({ component }: { component: DesignSystemComponent }) {
  const [aiOutput, setAiOutput] = useState('Choose an AI action to generate reviewable guidance for this component.');
  const tabs = [
    {
      value: 'overview',
      label: 'Overview',
      content: <DocList title='Use When' items={component.usage} />,
    },
    {
      value: 'usage',
      label: 'Usage',
      content: <DocList title='Guidance' items={[...component.usage, 'Prefer composition before local variants.']} />,
    },
    {
      value: 'variants',
      label: 'Variants',
      content: <PillGrid items={component.variants} />,
    },
    {
      value: 'props',
      label: 'Props',
      content: (
        <div className='grid gap-3'>
          {component.props.map(prop => (
            <div key={prop.name} className='rounded-md border border-border bg-background-secondary p-4'>
              <strong>{prop.name}</strong>
              <code className='ml-2 rounded bg-neutral-100 px-2 py-1 text-xs'>{prop.type}</code>
              <p className='mt-2 text-sm text-muted-foreground'>{prop.description}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      value: 'examples',
      label: 'Examples',
      content: <pre className='overflow-x-auto rounded-md bg-neutral-950 p-4 text-sm text-white'><code>{component.examples.join('\n\n')}</code></pre>,
    },
    {
      value: 'accessibility',
      label: 'Accessibility',
      content: <DocList title='Checklist' items={component.accessibility} />,
    },
    {
      value: 'ai',
      label: 'AI Actions',
      content: (
        <div className='grid gap-4 lg:grid-cols-[280px_1fr]'>
          <div className='grid gap-2'>
            {actions.map(action => (
              <Button key={action} type='button' variant='outlined' startIcon={<Bot />} onClick={() => setAiOutput(makeAiActionOutput(component, action))}>
                {action}
              </Button>
            ))}
          </div>
          <Card className='border border-border bg-background-secondary'>
            <CardHeader>
              <CardTitle className='text-base'>Draft guidance</CardTitle>
            </CardHeader>
            <CardContent className='whitespace-pre-wrap text-sm leading-6 text-muted-foreground'>{aiOutput}</CardContent>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <Card className='border border-border bg-card'>
      <CardHeader>
        <div className='flex flex-wrap gap-2'>
          <Badge variant='pastel' status={component.status}>{component.status}</Badge>
          <Badge variant='outlined' status={component.accessibilityStatus}>{component.accessibilityStatus}</Badge>
          <Badge variant='outlined' status={component.documentationStatus}>{component.documentationStatus}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ReusableTabs items={tabs} variant='underlined' contentClassName='pt-6' />
      </CardContent>
    </Card>
  );
}

function DocList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className='grid gap-3'>
      <h2 className='text-lg font-semibold'>{title}</h2>
      <ul className='grid gap-2'>
        {items.map(item => (
          <li key={item} className='flex gap-2 rounded-md bg-background-secondary p-3 text-sm'>
            <CheckCircle2 className='mt-0.5 size-4 text-primary' />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PillGrid({ items }: { items: string[] }) {
  return <div className='flex flex-wrap gap-2'>{items.map(item => <Badge key={item} variant='pastel' status='active'>{item}</Badge>)}</div>;
}

function makeAiActionOutput(component: DesignSystemComponent, action: string) {
  const compare = designSystemComponents.find(item => item.slug !== component.slug)?.name || 'another component';
  if (action === 'Compare with another component') {
    return `${component.name} vs ${compare}: use ${component.name} when the intent matches ${component.category.toLowerCase()} behavior. Prefer the other component only when the workflow changes category or interaction model. Draft guidance; human review required.`;
  }
  return `${action} for ${component.name}\n\nUse approved variants: ${component.variants.join(', ')}.\nAccessibility review: ${component.accessibility.join(' ')}\nGovernance note: reuse this component before proposing local UI. Draft guidance; human review required.`;
}
