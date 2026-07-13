import { ArrowLeft, CheckCircle2, Layers3, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { OnboardingStepper, type OnboardingStep } from './onboarding-stepper';

interface OnboardingLayoutProps {
  current: OnboardingStep;
  completed?: OnboardingStep[];
  stepNumber: string;
  title: string;
  eyebrow?: string;
  explanation: string;
  happens: string[];
  benefits: string[];
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function OnboardingLayout({
  current,
  completed,
  stepNumber,
  title,
  eyebrow = 'Onboarding',
  explanation,
  happens,
  benefits,
  children,
  backHref,
  backLabel = 'Back',
}: OnboardingLayoutProps) {
  return (
    <main className='min-h-screen bg-background lg:h-screen lg:overflow-hidden'>
      <div className='grid min-h-screen grid-cols-1 lg:h-screen lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]'>
        <aside className='relative isolate overflow-hidden bg-primary-900 px-6 py-8 text-primary-foreground sm:px-10 lg:flex lg:min-h-screen lg:flex-col lg:px-12 lg:py-12'>
          <div
            className='absolute inset-0 -z-20 bg-[linear-gradient(145deg,var(--primary-950),var(--primary-800)_48%,var(--color-primary))]'
            aria-hidden='true'
          />
          <div
            className='absolute right-[-18%] top-[-12%] -z-10 size-52 rounded-full bg-primary-300/20 blur-3xl'
            aria-hidden='true'
          />
          <div
            className='absolute bottom-[-18%] left-[-16%] -z-10 size-64 rounded-full bg-secondary-400/20 blur-3xl'
            aria-hidden='true'
          />

          <div className='flex items-center gap-2.5'>
            <span className='grid size-9 place-items-center rounded-md bg-primary-foreground text-sm font-bold text-primary'>
              IQ
            </span>
            <span className='text-sm font-semibold'>ComponentIQ</span>
          </div>

          <div className='mt-10 max-w-md lg:mt-auto'>
            <p className='text-xs font-semibold uppercase tracking-normal text-primary-foreground/75'>
              Step {stepNumber}
            </p>
            <h1 className='mt-3 text-3xl font-bold leading-tight tracking-normal text-primary-foreground lg:text-4xl'>
              {title}
            </h1>
            <p className='mt-4 text-sm leading-6 text-primary-foreground/80'>
              {explanation}
            </p>

            <div className='mt-8 grid gap-5'>
              <section aria-labelledby='onboarding-happens'>
                <div className='flex items-center gap-2 text-sm font-semibold text-primary-foreground'>
                  <Sparkles className='size-4' aria-hidden='true' />
                  <h2 id='onboarding-happens' className='text-sm font-semibold'>
                    What happens here
                  </h2>
                </div>
                <ul className='mt-3 grid gap-2.5'>
                  {happens.map(item => (
                    <li
                      key={item}
                      className='flex gap-2 text-sm leading-5 text-primary-foreground/80'
                    >
                      <CheckCircle2
                        className='mt-0.5 size-4 shrink-0 text-status-success'
                        aria-hidden='true'
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby='onboarding-benefits'>
                <div className='flex items-center gap-2 text-sm font-semibold text-primary-foreground'>
                  <Layers3 className='size-4' aria-hidden='true' />
                  <h2
                    id='onboarding-benefits'
                    className='text-sm font-semibold'
                  >
                    Why it matters
                  </h2>
                </div>
                <ul className='mt-3 grid gap-2.5'>
                  {benefits.map(item => (
                    <li
                      key={item}
                      className='flex gap-2 text-sm leading-5 text-primary-foreground/80'
                    >
                      <span
                        className='mt-2 size-1.5 shrink-0 rounded-full bg-primary-foreground/70'
                        aria-hidden='true'
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </aside>

        <section className='flex min-h-screen bg-background px-5 py-8 sm:px-8 lg:min-h-0 lg:h-screen lg:items-center lg:justify-center lg:px-12 lg:py-10'>
          <div className='mx-auto grid w-full max-w-[640px] gap-8'>
            <header className='grid gap-6'>
              {backHref ? (
                <Link
                  href={backHref}
                  className='inline-flex w-fit items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                >
                  <ArrowLeft className='size-4' aria-hidden='true' />
                  {backLabel}
                </Link>
              ) : null}
              <OnboardingStepper current={current} completed={completed} />
              <div>
                <p className='text-xs font-semibold uppercase tracking-normal text-primary'>
                  {eyebrow}
                </p>
                <h2 className='mt-2 text-2xl font-bold tracking-normal text-foreground md:text-3xl'>
                  {title}
                </h2>
              </div>
            </header>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
