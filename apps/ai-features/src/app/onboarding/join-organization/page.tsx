'use client';

import Link from 'next/link';

import { Button } from 'componentiq';
import { OnboardingLayout } from '@/features/onboarding/ui';

export default function JoinOrganizationPage() {
  return (
    <OnboardingLayout
      current='choose'
      completed={['account']}
      stepNumber='2 of 4'
      title='Join a workspace'
      explanation='Use an invite link from an organization owner or admin to connect your account to an existing ComponentIQ workspace.'
      happens={[
        'Open the secure invite link your teammate sent.',
        'Sign in with the invited email address.',
        'Accept the role assigned by your organization.',
      ]}
      benefits={[
        'You join the right workspace without creating duplicates.',
        'Access is controlled by your organization membership.',
      ]}
      backHref='/onboarding'
    >
      <section className='rounded-lg border border-border bg-card p-6 shadow-sm'>
        <div className='grid gap-4'>
          <p className='text-sm leading-6 text-muted-foreground'>
            Open the invite link shared by an organization owner or admin.
            Invite links include a secure token and can only be accepted by the
            invited email address.
          </p>
          <Button asChild variant='outlined' className='min-h-10 px-5 py-2.5'>
            <Link href='/onboarding'>Back to onboarding</Link>
          </Button>
        </div>
      </section>
    </OnboardingLayout>
  );
}
