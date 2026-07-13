'use client';

import { useAuth } from '@clerk/nextjs';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from 'componentiq';

import { AuthLayout, AuthRail } from '@/features/shared/auth-layout';
import { useMe } from '@/hooks/queries/use-me';

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const meQuery = useMe();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (meQuery.isLoading) return;
    const firstMembership = meQuery.data?.memberships[0];
    router.replace(
      firstMembership ? `/org/${firstMembership.organization.slug}/dashboard` : '/onboarding'
    );
  }, [isLoaded, isSignedIn, meQuery.data, meQuery.isLoading, router]);

  if (!isLoaded || isSignedIn) {
    return (
      <main className='grid min-h-screen place-items-center bg-background px-4' role='status' aria-live='polite'>
        <Loader2 className='size-6 animate-spin text-primary' aria-hidden='true' />
      </main>
    );
  }

  return (
    <AuthLayout rail={<AuthRail />}>
      <p className='text-[12px] font-semibold uppercase tracking-[0.1em] text-primary'>Welcome</p>
      <h1 className='mt-1.5 text-[23px] font-bold tracking-tight text-foreground'>
        Set up your team's workspace
      </h1>
      <p className='mt-2 text-[13.5px] leading-relaxed text-muted-foreground'>
        Create an organization to hold your rules, components, and AI workflows. Takes about two
        minutes.
      </p>

      {meQuery.error && (
        <p role='alert' aria-live='assertive' className='mt-4 text-sm text-status-error'>
          We could not load your workspace. Please try again.
        </p>
      )}

      <div className='mt-6 flex flex-col gap-3'>
        <Button asChild fullWidth endIcon={<ArrowRight />}>
          <Link href='/sign-up'>Create your workspace</Link>
        </Button>

        <div className='flex items-center gap-3'>
          <span className='h-px flex-1 bg-border' />
          <span className='text-[11.5px] text-muted-foreground'>already have one?</span>
          <span className='h-px flex-1 bg-border' />
        </div>

        <Button asChild variant='outlined' fullWidth>
          <Link href='/sign-in'>Sign in</Link>
        </Button>
      </div>

      <p className='mt-5 text-center text-[11.5px] text-muted-foreground'>
        Have an invite? Open the link from your email to join directly.
      </p>
    </AuthLayout>
  );
}
