'use client';

import Link from 'next/link';

import { Button, Card, CardContent, CardHeader, CardTitle } from 'componentiq';

export default function JoinOrganizationPage() {
  return (
    <main className='grid min-h-screen place-items-center bg-background px-4 py-10'>
      <Card className='w-full max-w-xl border border-border bg-card p-0'>
        <CardHeader className='px-5 pt-5 sm:px-6 sm:pt-6'>
          <CardTitle className='text-xl'>Join organization</CardTitle>
        </CardHeader>
        <CardContent className='grid gap-4 px-5 pb-5 sm:px-6 sm:pb-6'>
          <p className='text-sm leading-6 text-muted-foreground'>
            Open the invite link shared by an organization owner or admin. Invite links
            include a secure token and can only be accepted by the invited email address.
          </p>
          <Button asChild variant='outlined' className='min-h-10 px-5 py-2.5'>
            <Link href='/onboarding'>Back to onboarding</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
