import { SignIn } from '@clerk/nextjs';

import { AuthLayout, AuthRail } from '@/features/shared/auth-layout';
import { clerkAuthAppearance } from '@/features/shared/clerk-appearance';

export default function SignInPage() {
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
      <SignIn routing='path' path='/sign-in' signUpUrl='/sign-up' appearance={clerkAuthAppearance} />
    </AuthLayout>
  );
}
