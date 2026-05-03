import { ArrowLeft, BookOpen, Component, FileText } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const docSections = [
  {
    id: 'design-tokens',
    icon: Component,
    title: 'Design Tokens',
    description:
      'Use semantic color, spacing, typography, motion, border, and state tokens from the existing token system.',
    links: [
      { href: '/button-demo', label: 'Button demo' },
      { href: '/badge-demo', label: 'Badge demo' },
    ],
  },
  {
    id: 'form-fields',
    icon: FileText,
    title: 'Form Fields',
    description:
      'Use the existing input, select, textarea, checkbox, radio, date picker, and RHF field wrappers before adding new field patterns.',
    links: [
      { href: '/form-demo', label: 'Form demo' },
      { href: '/datepicker-demo', label: 'Date picker demo' },
    ],
  },
  {
    id: 'tabs',
    icon: BookOpen,
    title: 'Tabs',
    description:
      'Use the reusable tabs component for switching related views inside a bounded workflow.',
    links: [{ href: '/tab-demo', label: 'Tabs demo' }],
  },
];

export default function DocsPage() {
  return (
    <main className='min-h-screen bg-background'>
      <section className='mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10 lg:px-8 lg:py-12'>
        <header className='flex flex-col gap-5'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          >
            <ArrowLeft className='size-4' />
            Back to landing
          </Link>
          <div className='flex max-w-3xl flex-col gap-4'>
            <Badge variant='pastel' status='active' size='md'>
              Developer docs
            </Badge>
            <h1 className='text-4xl font-semibold leading-tight text-foreground'>
              Use the system before extending it.
            </h1>
            <p className='text-base leading-7 text-muted-foreground'>
              This route gives the product work a stable documentation surface
              while the deeper markdown docs and Storybook remain the source of
              detailed component examples.
            </p>
          </div>
        </header>

        <Separator />

        <div className='grid gap-4'>
          {docSections.map(section => {
            const Icon = section.icon;

            return (
              <Card
                key={section.id}
                id={section.id}
                className='border border-border bg-card'
              >
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-base'>
                    <Icon className='size-4 text-primary' />
                    {section.title}
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-wrap gap-3'>
                  {section.links.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className='rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                    >
                      {link.label}
                    </Link>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
