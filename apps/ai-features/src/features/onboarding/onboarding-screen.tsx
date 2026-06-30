'use client';

import { useAuth } from '@clerk/nextjs';
import { ArrowRight, Building2, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from 'componentiq';
import { OnboardingStepper } from '@/features/shared/onboarding-stepper';
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
      router.replace(`/org/${meQuery.data.memberships[0].organization.slug}/dashboard`);
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
    <main className='mx-auto grid min-h-screen w-full max-w-5xl place-items-center bg-background px-4 py-10'>
      <section className='grid w-full gap-6'>
        <OnboardingStepper current='choose' completed={['account']} />
        <div className='max-w-2xl'>
          <p className='text-sm font-medium uppercase text-primary'>Onboarding</p>
          <h1 className='mt-2 text-3xl font-semibold text-foreground'>
            Set up your ComponentIQ organization
          </h1>
          <p className='mt-3 text-sm leading-6 text-muted-foreground'>
            Create a workspace for your design-system rules, components, guardrails,
            and AI-assisted workflows.
          </p>
        </div>
        <div className='grid gap-4 md:grid-cols-2'>
          <Card className='border border-primary/40 bg-card p-0'>
            <CardHeader className='px-5 pt-5 sm:px-6 sm:pt-6'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Building2 className='size-5 text-primary' />
                Create organization
                <Badge variant='pastel' status='active' size='sm'>
                  Recommended
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4 px-5 pb-5 sm:px-6 sm:pb-6'>
              <p className='text-sm leading-6 text-muted-foreground'>
                Start a new organization and become the owner for projects,
                guardrails, invites, and AI workflows. Takes about two minutes.
              </p>
              <Button asChild className='min-h-10 px-5 py-2.5' endIcon={<ArrowRight />}>
                <Link href='/onboarding/create-organization'>Create workspace</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className='border border-border bg-card p-0'>
            <CardHeader className='px-5 pt-5 sm:px-6 sm:pt-6'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Mail className='size-5 text-primary' />
                Join an existing organization
              </CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4 px-5 pb-5 sm:px-6 sm:pb-6'>
              <p className='text-sm leading-6 text-muted-foreground'>
                {token
                  ? 'You have an invite link open — accept it to join your team’s workspace.'
                  : 'Already have a teammate using ComponentIQ? Ask them to send you an invite link from Settings → Invites, then open it here.'}
              </p>
              <Button asChild variant='outlined' className='min-h-10 px-5 py-2.5' endIcon={<ArrowRight />}>
                <Link href={token ? `/accept-invite?token=${token}` : '/onboarding/join-organization'}>
                  Accept invite
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
