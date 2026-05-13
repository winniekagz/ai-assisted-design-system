'use client';

import {
  ArrowRight,
  BookOpen,
  Boxes,
  CheckCircle2,
  Code2,
  Copy,
  GitBranch,
  PackageCheck,
  Palette,
  Share2,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell, PageHeader } from '@/features/dashboard/app-shell';

const setupSteps = [
  {
    title: 'Install the package',
    description:
      'Add ComponentIQ to a React app, then import the components you need from the package entry.',
    command: 'npm i componentiq',
    icon: PackageCheck,
  },
  {
    title: 'Wrap your app with tokens',
    description:
      'Use ComponentIqProvider to pass brand colors, font families, radius, spacing, and shadow tokens.',
    command:
      '<ComponentIqProvider tokens={brandTokens}>...</ComponentIqProvider>',
    icon: Palette,
  },
  {
    title: 'Create custom components',
    description:
      'Compose existing primitives first. Add a new component only when the pattern is reusable across screens.',
    command: 'src/components/custom/your-component.tsx',
    icon: Boxes,
  },
  {
    title: 'Document in Storybook',
    description:
      'Add stories for states, variants, responsive behavior, and token examples before sharing.',
    command: 'src/stories/YourComponent.stories.tsx',
    icon: BookOpen,
  },
];

const shareChecklist = [
  'Export the component from src/index.ts',
  'Add prop types and sensible defaults',
  'Use semantic tokens instead of raw colors',
  'Add Storybook examples for primary states',
  'Run npm run build:lib and npm run build-storybook',
  'Publish a new package version or open a PR',
];

const tokenExample = `const brandTokens = {
  colors: {
    primary: '#0F766E',
    primaryForeground: '#FFFFFF',
    background: '#F8FAFC',
    foreground: '#0F172A',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    headingFontFamily: 'Inter, sans-serif',
  },
  radius: {
    md: '10px',
    lg: '16px',
  },
};`;

export function CustomComponentsGuideScreen() {
  return (
    <AppShell>
      <PageHeader
        eyebrow='Customization Guide'
        title='Set up, theme, and share custom ComponentIQ components.'
        description='A practical workflow for designers and engineers to customize tokens, compose reusable components, document them in Storybook, and share them through the package.'
        actions={
          <div className='flex flex-wrap gap-2'>
            <Button asChild endIcon={<ArrowRight />}>
              <Link href='/components'>Browse components</Link>
            </Button>
            <Button asChild variant='outlined' startIcon={<BookOpen />}>
              <Link href='/docs'>Read docs</Link>
            </Button>
          </div>
        }
      />

      <section className='grid gap-4 lg:grid-cols-[1.35fr_0.65fr]'>
        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Sparkles className='size-5 text-primary' />
              Recommended flow
            </CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4'>
            {setupSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className='grid gap-3 rounded-md border border-border bg-background p-4 md:grid-cols-[auto_1fr]'
                >
                  <div className='flex items-start gap-3'>
                    <span className='grid size-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground'>
                      <Icon className='size-4' />
                    </span>
                    <Badge variant='pastel' status='neutral'>
                      Step {index + 1}
                    </Badge>
                  </div>
                  <div className='grid gap-2'>
                    <h2 className='text-base font-semibold text-foreground'>
                      {step.title}
                    </h2>
                    <p className='text-sm leading-6 text-muted-foreground'>
                      {step.description}
                    </p>
                    <code className='block overflow-x-auto rounded-md border border-border bg-background-secondary px-3 py-2 text-xs text-foreground'>
                      {step.command}
                    </code>
                  </div>
                </article>
              );
            })}
          </CardContent>
        </Card>

        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <CheckCircle2 className='size-5 text-primary' />
              Share checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='grid gap-3'>
              {shareChecklist.map(item => (
                <li key={item} className='flex gap-3 text-sm leading-6'>
                  <CheckCircle2 className='mt-0.5 size-4 shrink-0 text-primary' />
                  <span className='text-muted-foreground'>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className='mt-6 grid gap-6 lg:grid-cols-2'>
        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Code2 className='size-5 text-primary' />
              Token example
            </CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <p className='text-sm leading-6 text-muted-foreground'>
              Designers can hand off brand decisions as typed tokens. Engineers
              pass them to <code>ComponentIqProvider</code>, and components read
              the generated CSS variables.
            </p>
            <pre className='overflow-x-auto rounded-md border border-border bg-background-secondary p-4 text-xs leading-5 text-foreground'>
              <code>{tokenExample}</code>
            </pre>
          </CardContent>
        </Card>

        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Share2 className='size-5 text-primary' />
              Sharing paths
            </CardTitle>
          </CardHeader>
          <CardContent className='grid gap-3'>
            <SharePath
              icon={<PackageCheck className='size-4' />}
              title='Publish package'
              description='Bump the package version and publish to npm so consumers can install with npm i.'
              command='npm publish --access public'
            />
            <SharePath
              icon={<GitBranch className='size-4' />}
              title='Open a pull request'
              description='Use PR review for new primitives, token changes, and Storybook docs before release.'
              command='git push origin feature/custom-component'
            />
            <SharePath
              icon={<Copy className='size-4' />}
              title='Share a preview'
              description='Build Storybook and share the static output when designers need a reviewable preview.'
              command='npm run build-storybook'
            />
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}

function SharePath({
  icon,
  title,
  description,
  command,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  command: string;
}) {
  return (
    <article className='grid gap-2 rounded-md border border-border bg-background p-4'>
      <div className='flex items-center gap-2'>
        <span className='grid size-8 place-items-center rounded-md bg-primary-50 text-primary'>
          {icon}
        </span>
        <h2 className='text-sm font-semibold text-foreground'>{title}</h2>
      </div>
      <p className='text-sm leading-6 text-muted-foreground'>{description}</p>
      <code className='overflow-x-auto rounded-md bg-background-secondary px-3 py-2 text-xs text-foreground'>
        {command}
      </code>
    </article>
  );
}
