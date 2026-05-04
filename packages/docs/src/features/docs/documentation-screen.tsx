'use client';

import {
  ArrowRight,
  BookOpen,
  Boxes,
  Code2,
  FileText,
  Github,
  PackageCheck,
  Palette,
  Route,
  Share2,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell, PageHeader } from '@/features/dashboard/app-shell';

const docGroups = [
  {
    title: 'Install and use',
    icon: PackageCheck,
    description:
      'Install the package, import components, and keep Tailwind configured to read component classes.',
    links: [
      { href: '/custom-components', label: 'Setup guide' },
      { href: '/components', label: 'Component catalog' },
    ],
    command: 'npm i @winniekagendo/componentiq',
  },
  {
    title: 'Customize tokens',
    icon: Palette,
    description:
      'Use ComponentIqProvider to send brand colors, font families, radius, spacing, and shadows into the system.',
    links: [{ href: '/custom-components', label: 'Token workflow' }],
    command: '<ComponentIqProvider tokens={brandTokens}>',
  },
  {
    title: 'Document in Storybook',
    icon: BookOpen,
    description:
      'Use stories to show states, variants, responsive behavior, and custom-token examples before sharing.',
    links: [
      { href: '/button-demo', label: 'Button demo' },
      { href: '/form-demo', label: 'Form demo' },
    ],
    command: 'npm run storybook',
  },
  {
    title: 'Share and publish',
    icon: Share2,
    description:
      'Export components from the package entry, build the library, then publish a new npm version or open a PR.',
    links: [{ href: '/custom-components', label: 'Share checklist' }],
    command: 'npm publish --access public',
  },
];

const quickLinks = [
  {
    title: 'Component catalog',
    description: 'Browse reusable primitives before creating a new pattern.',
    href: '/components',
    icon: Boxes,
  },
  {
    title: 'Customization guide',
    description: 'Set up custom tokens and share component additions.',
    href: '/custom-components',
    icon: Route,
  },
  {
    title: 'npm package',
    description: 'Public install page for @winniekagendo/componentiq.',
    href: 'https://www.npmjs.com/package/@winniekagendo/componentiq',
    icon: PackageCheck,
    external: true,
  },
  {
    title: 'GitHub repository',
    description: 'Product docs, CI/CD workflow, and source code.',
    href: 'https://github.com/winniekagz/ai-assisted-design-system',
    icon: Github,
    external: true,
  },
];

export function DocumentationScreen() {
  return (
    <AppShell>
      <PageHeader
        eyebrow='Documentation'
        title='Everything users need after clicking Read docs.'
        description='Use this guide to install componentIq, customize the design system, document components in Storybook, and share changes through npm or GitHub.'
        actions={
          <Button asChild endIcon={<ArrowRight />}>
            <Link href='/custom-components'>Start setup guide</Link>
          </Button>
        }
      />

      <section className='grid gap-4 lg:grid-cols-4'>
        {quickLinks.map(item => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
              className='rounded-md border border-border bg-card p-4 transition-colors hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            >
              <Icon className='mb-4 size-5 text-primary' />
              <h2 className='text-sm font-semibold text-foreground'>
                {item.title}
              </h2>
              <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                {item.description}
              </p>
            </Link>
          );
        })}
      </section>

      <section className='mt-6 grid gap-4'>
        {docGroups.map(group => {
          const Icon = group.icon;

          return (
            <Card key={group.title} className='border border-border bg-card'>
              <CardHeader>
                <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
                  <div className='flex gap-3'>
                    <span className='grid size-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground'>
                      <Icon className='size-5' />
                    </span>
                    <div>
                      <CardTitle className='text-base'>{group.title}</CardTitle>
                      <p className='mt-2 max-w-3xl text-sm leading-6 text-muted-foreground'>
                        {group.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant='pastel' status='neutral'>
                    Guide
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='grid gap-4 md:grid-cols-[1fr_auto] md:items-center'>
                <code className='overflow-x-auto rounded-md border border-border bg-background-secondary px-3 py-2 text-xs text-foreground'>
                  {group.command}
                </code>
                <div className='flex flex-wrap gap-2'>
                  {group.links.map(link => (
                    <Button
                      key={link.href}
                      asChild
                      variant='outlined'
                      size='sm'
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className='mt-6 grid gap-4 lg:grid-cols-2'>
        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Code2 className='size-5 text-primary' />
              Consumer import
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className='overflow-x-auto rounded-md border border-border bg-background-secondary p-4 text-xs leading-5 text-foreground'>
              <code>{`import {
  Button,
  ComponentIqProvider,
} from '@winniekagendo/componentiq';

export function App() {
  return (
    <ComponentIqProvider tokens={brandTokens}>
      <Button>Save changes</Button>
    </ComponentIqProvider>
  );
}`}</code>
            </pre>
          </CardContent>
        </Card>

        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <FileText className='size-5 text-primary' />
              Documentation split
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 text-sm leading-6 text-muted-foreground'>
            <p>
              GitHub uses the product-focused root <code>README.md</code>. npm
              uses <code>README.npm.md</code> during the publish workflow so
              package users see Storybook and install guidance.
            </p>
            <p>
              Keep component usage examples in Storybook, and keep product
              architecture notes in the GitHub README.
            </p>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
