import { SignIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { AuthLayout, AuthRail } from '@/features/shared/auth-layout';
import { clerkAuthAppearance } from '@/features/shared/clerk-appearance';

type SignInPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const redirectTo = getSafeRedirectPath(params?.redirect_url, '/');
  const session = await auth();

  if (session.userId) {
    redirect(redirectTo);
  }

  return (
    <AuthLayout
      rail={
        <AuthRail
          title='Welcome back to ComponentIQ.'
          points={[
            'Pick up your design-system rules and components',
            'Review AI-flagged inconsistencies',
            'Keep your team shipping consistent UI',
          ]}
          security='SOC 2 Type II · MFA available · sign-in secured by Clerk'
        />
      }
    >
      <div className='mb-6'>
        <h1 className='text-[20px] font-bold tracking-tight text-foreground'>Sign in to continue</h1>
        <p className='mt-1 text-[13px] text-muted-foreground'>Use your work account to continue.</p>
      </div>
      <SignIn
        routing='path'
        path='/sign-in'
        signUpUrl='/sign-up'
        forceRedirectUrl={redirectTo}
        fallbackRedirectUrl={redirectTo}
        appearance={clerkAuthAppearance}
      />
    </AuthLayout>
  );
}

function getSafeRedirectPath(value: string | string[] | undefined, fallback: string) {
  const raw = Array.isArray(value) ? value[0] : value;

  if (!raw) return fallback;

  try {
    const decoded = decodeURIComponent(raw);

    if (!decoded.startsWith('/') || decoded.startsWith('//')) return fallback;
    if (decoded.startsWith('/sign-in') || decoded.startsWith('/sign-up')) return fallback;

    return decoded;
  } catch {
    return fallback;
  }
}
