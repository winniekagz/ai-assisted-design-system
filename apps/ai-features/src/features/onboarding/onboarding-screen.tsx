'use client';

import { useAuth } from '@clerk/nextjs';
import { ArrowRight, Building2, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'componentiq';
import { OnboardingLayout } from '@/features/shared/onboarding-layout';
import { useMe } from '@/hooks/queries/use-me';

export function OnboardingScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const meQuery = useMe();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.replace('/sign-in');
      return;
    }

    if (meQuery.data?.memberships[0]) {
      router.replace(
        `/org/${meQuery.data.memberships[0].organization.slug}/dashboard`
      );
    }
  }, [isLoaded, isSignedIn, meQuery.data, router]);

  if (!isLoaded || meQuery.isLoading) {
    return (
      <main className='grid min-h-screen place-items-center bg-background px-4'>
        <Loader2 className='size-6 animate-spin text-primary' />
      </main>
    );
  }

  return (
    <OnboardingLayout
      current='choose'
      completed={['account']}
      stepNumber='2 of 4'
      title='Set up your workspace'
      explanation='Choose whether you are creating a new ComponentIQ organization or joining one your team already owns.'
      happens={[
        'Pick the path that matches your team.',
        'Create a workspace now or accept an invite.',
        'Keep organization access tied to the right account.',
      ]}
      benefits={[
        'Design-system rules stay scoped to one team.',
        'Members, guardrails, and AI workflows inherit the same workspace.',
      ]}
    >
      <section className='grid gap-4' aria-labelledby='choose-workspace-title'>
        <div className='sr-only'>
          <h3 id='choose-workspace-title'>Choose your workspace path</h3>
        </div>

        <Card className='border border-primary bg-card p-0 shadow-sm'>
          <CardHeader className='px-6 pt-6'>
            <CardTitle className='flex flex-wrap items-center gap-2 text-xl'>
              <span className='grid size-9 place-items-center rounded-md bg-primary text-primary-foreground'>
                <Building2 className='size-4' aria-hidden='true' />
              </span>
              Create workspace
              <Badge variant='pastel' status='active' size='sm'>
                Recommended
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className='grid gap-5 px-6 pb-6'>
            <p className='max-w-xl text-sm leading-6 text-muted-foreground'>
              Start fresh as the owner for projects, guardrails, invites, and AI
              workflows.
            </p>
            <Button
              asChild
              className='min-h-11 px-5 py-2.5'
              endIcon={<ArrowRight />}
            >
              <Link href='/onboarding/create-organization'>
                Create workspace
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className='rounded-lg border border-border bg-background-secondary p-5'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex gap-3'>
              <span className='grid size-9 shrink-0 place-items-center rounded-md border border-border bg-card text-primary'>
                <Mail className='size-4' aria-hidden='true' />
              </span>
              <div>
                <h3 className='text-base font-semibold text-foreground'>
                  Join existing workspace
                </h3>
                <p className='mt-1 text-sm leading-6 text-muted-foreground'>
                  {token
                    ? 'You have an invite link ready to accept.'
                    : 'Use the invite link sent by an owner or admin.'}
                </p>
              </div>
            </div>
            <Button
              asChild
              variant='text'
              className='justify-start sm:justify-center'
              endIcon={<ArrowRight />}
            >
              <Link
                href={
                  token
                    ? `/accept-invite?token=${token}`
                    : '/onboarding/join-organization'
                }
              >
                Accept invite
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </OnboardingLayout>
  );
}
