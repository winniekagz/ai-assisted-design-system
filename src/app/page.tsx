'use client';

import {
  ArrowRight,
  BookOpen,
  Code2,
  Layers3,
  MessageSquareText,
  Palette,
  SlidersHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/form-fields/select';
import { Separator } from '@/components/ui/separator';

const demoRoutes = [
  {
    href: '/button-demo',
    title: 'Buttons',
    description:
      'Contained, outlined, text, loading, icon, and disabled states.',
  },
  {
    href: '/badge-demo',
    title: 'Badges',
    description: 'Status indicators and soft variants for product surfaces.',
  },
  {
    href: '/table',
    title: 'Tables',
    description: 'Structured data with pagination, badges, and row hierarchy.',
  },
];

const docs = [
  {
    href: '/docs#design-tokens',
    title: 'Design Tokens',
    description: 'Color, spacing, type, motion, and state foundations.',
  },
  {
    href: '/docs#form-fields',
    title: 'Form Fields',
    description: 'Inputs, selects, dates, checkboxes, and RHF examples.',
  },
  {
    href: '/docs#tabs',
    title: 'Tabs',
    description: 'Reusable tab variants and usage guidance.',
  },
];

const tokenOptions = {
  primary: [
    { label: 'Primary 500', value: 'var(--primary-500)' },
    { label: 'Info 500', value: 'var(--info-500)' },
    { label: 'Success 500', value: 'var(--success-500)' },
  ],
  radius: [
    { label: 'Small', value: 'var(--radius-sm)' },
    { label: 'Medium', value: 'var(--radius-md)' },
    { label: 'Large', value: 'var(--radius-lg)' },
  ],
  density: [
    { label: 'Comfortable', value: 'comfortable' },
    { label: 'Compact', value: 'compact' },
  ],
};

export default function HomePage() {
  const [primary, setPrimary] = useState(tokenOptions.primary[0].value);
  const [radius, setRadius] = useState(tokenOptions.radius[1].value);
  const [density, setDensity] = useState(tokenOptions.density[0].value);
  const [prompt, setPrompt] = useState(
    'Create a calm settings panel for API usage, billing status, and model controls.'
  );

  const previewSpacing = density === 'compact' ? 'gap-3 p-4' : 'gap-4 p-6';
  const promptLength = prompt.trim().length;

  const cssPreview = useMemo(
    () => `:root {
  --primary: ${primary};
  --radius: ${radius};
}`,
    [primary, radius]
  );

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className='min-h-screen bg-background'>
      <section className='mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 lg:px-8 lg:py-12'>
        <header className='grid gap-8 lg:grid-cols-3 lg:items-end'>
          <div className='flex max-w-3xl flex-col gap-5 lg:col-span-2'>
            <Badge variant='pastel' status='active' size='md'>
              AI assisted design system
            </Badge>
            <div className='flex flex-col gap-4'>
              <h1 className='text-4xl font-semibold leading-tight text-foreground md:text-5xl'>
                Build product UI from tokens, components, and AI prompts.
              </h1>
              <p className='max-w-2xl text-base leading-7 text-muted-foreground'>
                A focused developer landing experience for exploring Leja
                components, previewing token changes, and preparing playground
                flows for the Vercel AI SDK.
              </p>
            </div>
            <div className='flex flex-wrap gap-3'>
              <Button
                startIcon={<Palette />}
                onClick={() => scrollToSection('token-customization')}
              >
                Customize tokens
              </Button>
              <Button
                variant='outlined'
                startIcon={<BookOpen />}
                onClick={() => scrollToSection('docs')}
              >
                Read docs
              </Button>
            </div>
          </div>

          <Card className='border border-border bg-card'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <MessageSquareText className='size-4 text-primary' />
                Playground status
              </CardTitle>
              <CardDescription>
                Mocked locally now, ready to swap to AI SDK state.
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              <div className='rounded-lg border border-border bg-background-secondary p-4'>
                <p className='text-sm leading-6 text-muted-foreground'>
                  Prompt drafts should change component copy, surface token
                  recommendations, and preserve design-system constraints.
                </p>
              </div>
              <div className='grid grid-cols-2 gap-3 text-sm'>
                <div>
                  <p className='text-muted-foreground'>Mode</p>
                  <p className='font-medium text-foreground'>Mock preview</p>
                </div>
                <div>
                  <p className='text-muted-foreground'>Next adapter</p>
                  <p className='font-medium text-foreground'>Vercel AI SDK</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </header>

        <section
          aria-labelledby='component-demos'
          className='flex flex-col gap-4'
        >
          <div className='flex flex-col gap-2'>
            <h2 id='component-demos' className='text-2xl font-semibold'>
              Component library
            </h2>
            <p className='text-sm leading-6 text-muted-foreground'>
              Start with the existing primitives before composing product
              workflows.
            </p>
          </div>
          <div className='grid gap-4 md:grid-cols-3'>
            {demoRoutes.map(route => (
              <Card key={route.href} className='border border-border bg-card'>
                <CardHeader>
                  <CardTitle className='text-base'>{route.title}</CardTitle>
                  <CardDescription>{route.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href={route.href}
                    className='inline-flex items-center gap-2 text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                  >
                    Open demo <ArrowRight className='size-4' />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        <section
          id='token-customization'
          aria-labelledby='token-customization-title'
          className='grid gap-6 lg:grid-cols-3'
        >
          <Card className='border border-border bg-card'>
            <CardHeader>
              <CardTitle
                id='token-customization-title'
                className='flex items-center gap-2 text-base'
              >
                <SlidersHorizontal className='size-4 text-primary' />
                Token customization
              </CardTitle>
              <CardDescription>
                Local state is the right first step for live preview. Persist
                later only when export or sharing is defined.
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              <label className='flex flex-col gap-2 text-sm font-medium'>
                Primary color
                <Select
                  value={primary}
                  onChange={event => setPrimary(event.target.value)}
                  aria-label='Primary color'
                >
                  {tokenOptions.primary.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </label>
              <label className='flex flex-col gap-2 text-sm font-medium'>
                Radius
                <Select
                  value={radius}
                  onChange={event => setRadius(event.target.value)}
                  aria-label='Radius'
                >
                  {tokenOptions.radius.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </label>
              <label className='flex flex-col gap-2 text-sm font-medium'>
                Density
                <Select
                  value={density}
                  onChange={event => setDensity(event.target.value)}
                  aria-label='Density'
                >
                  {tokenOptions.density.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </label>
            </CardContent>
          </Card>

          <Card
            className='border border-border bg-card lg:col-span-2'
            style={
              {
                '--preview-primary': primary,
                '--preview-radius': radius,
              } as CSSProperties
            }
          >
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <Layers3 className='size-4 text-primary' />
                Live preview
              </CardTitle>
              <CardDescription>
                Preview uses token values without mutating global theme state.
              </CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4 md:grid-cols-3'>
              <div
                className={`flex flex-col rounded-lg border border-border bg-background-secondary md:col-span-2 ${previewSpacing}`}
                style={{ borderRadius: 'var(--preview-radius)' }}
              >
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <h3 className='text-lg font-semibold'>API usage summary</h3>
                    <p className='text-sm text-muted-foreground'>
                      Generated from the current prompt and token choices.
                    </p>
                  </div>
                  <Badge variant='pastel' status='pending'>
                    Preview
                  </Badge>
                </div>
                <div className='grid gap-3 md:grid-cols-3'>
                  {['Requests', 'Latency', 'Budget'].map((item, index) => (
                    <div
                      key={item}
                      className='rounded-md border border-border bg-card p-4'
                    >
                      <p className='text-sm text-muted-foreground'>{item}</p>
                      <p className='mt-2 text-xl font-semibold'>
                        {index === 0 ? '2.4k' : index === 1 ? '640ms' : '72%'}
                      </p>
                    </div>
                  ))}
                </div>
                <Button
                  style={{ backgroundColor: 'var(--preview-primary)' }}
                  className='self-start'
                >
                  Apply token set
                </Button>
              </div>
              <pre className='overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground'>
                <code>{cssPreview}</code>
              </pre>
            </CardContent>
          </Card>
        </section>

        <section
          aria-labelledby='ai-playground'
          className='grid gap-6 lg:grid-cols-2'
        >
          <Card className='border border-border bg-card'>
            <CardHeader>
              <CardTitle
                id='ai-playground'
                className='flex items-center gap-2 text-base'
              >
                <MessageSquareText className='size-4 text-primary' />
                AI playground
              </CardTitle>
              <CardDescription>
                Mock prompt state keeps the UI usable while API contracts are
                still open.
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              <label className='flex flex-col gap-2 text-sm font-medium'>
                Prompt
                <Input
                  value={prompt}
                  onChange={event => setPrompt(event.target.value)}
                  placeholder='Describe the product UI you want to test'
                />
              </label>
              <div className='rounded-lg border border-border bg-background-secondary p-4'>
                {promptLength > 0 ? (
                  <p className='text-sm leading-6 text-muted-foreground'>
                    The assistant will respond with constrained component
                    suggestions, token adjustments, and implementation notes.
                  </p>
                ) : (
                  <p className='text-sm leading-6 text-muted-foreground'>
                    Add a prompt to preview the response structure.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card id='docs' className='border border-border bg-card'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <Code2 className='size-4 text-primary' />
                Docs
              </CardTitle>
              <CardDescription>
                Keep docs close to the working surface until dedicated docs
                pages are added.
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-3'>
              {docs.map(doc => (
                <a
                  key={doc.href}
                  href={doc.href}
                  className='rounded-lg border border-border bg-background-secondary p-4 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                >
                  <span className='flex items-center justify-between gap-3'>
                    <span>
                      <span className='block text-sm font-medium text-foreground'>
                        {doc.title}
                      </span>
                      <span className='mt-1 block text-sm text-muted-foreground'>
                        {doc.description}
                      </span>
                    </span>
                    <ArrowRight className='size-4 text-primary' />
                  </span>
                </a>
              ))}
            </CardContent>
          </Card>
        </section>
      </section>
    </main>
  );
}
