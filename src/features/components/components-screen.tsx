'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/form-fields/select';
import { AppShell, PageHeader } from '@/features/dashboard/app-shell';
import { designSystemComponents } from '@/design-system/data/components';

export function ComponentsScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(designSystemComponents.map(component => component.category)))];
  const filtered = useMemo(
    () =>
      designSystemComponents.filter(component => {
        const matchesQuery = [component.name, component.description, component.category].join(' ').toLowerCase().includes(query.toLowerCase());
        return matchesQuery && (category === 'All' || component.category === category);
      }),
    [category, query]
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow='Component Library'
        title='Search the whitelist before designing new UI.'
        description='The catalog shows component purpose, status, accessibility readiness, docs maturity, and AI governance cues.'
      />
      <Card className='mb-6 border border-border bg-card'>
        <CardContent className='grid gap-4 pt-6 md:grid-cols-[1fr_240px]'>
          <label className='grid gap-2 text-sm font-medium'>
            Search components
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
              <Input className='pl-9' value={query} onChange={event => setQuery(event.target.value)} placeholder='Button, forms, feedback, data display' />
            </div>
          </label>
          <label className='grid gap-2 text-sm font-medium'>
            Category
            <Select value={category} onChange={event => setCategory(event.target.value)}>
              {categories.map(item => <option key={item}>{item}</option>)}
            </Select>
          </label>
        </CardContent>
      </Card>
      {filtered.length === 0 ? (
        <div className='rounded-md border border-border bg-card p-8 text-center text-muted-foreground'>
          No components match this filter. Try a broader category before proposing new UI.
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {filtered.map(component => (
            <Link key={component.slug} href={`/components/${component.slug}`} className='rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
              <Card className='h-full border border-border bg-card transition-colors hover:bg-background-secondary'>
                <CardHeader>
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <CardTitle className='text-lg'>{component.name}</CardTitle>
                      <p className='mt-1 text-sm text-muted-foreground'>{component.category}</p>
                    </div>
                    <Badge variant='pastel' status={component.status}>{component.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className='grid gap-4'>
                  <p className='text-sm leading-6 text-muted-foreground'>{component.description}</p>
                  <div className='rounded-md border border-border bg-background p-4 text-sm'>{component.preview}</div>
                  <div className='flex flex-wrap gap-2'>
                    <Badge variant='outlined' status={component.accessibilityStatus}>{component.accessibilityStatus}</Badge>
                    <Badge variant='outlined' status={component.documentationStatus}>{component.documentationStatus}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
