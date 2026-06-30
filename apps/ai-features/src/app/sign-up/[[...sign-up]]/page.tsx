import { SignUp } from '@clerk/nextjs';

import { AuthLayout, AuthRail } from '@/features/shared/auth-layout';
import { clerkAuthAppearance } from '@/features/shared/clerk-appearance';

/**
 * A lightweight, presentational version of the "3 steps to your workspace"
 * rail. It sets expectations before the form asks for anything.
 */
function SignUpSteps() {
  const steps = [
    { n: '1', title: 'Create your account', note: "You're here — about 30 seconds", active: true },
    { n: '2', title: 'Name your organization', note: 'Workspace + URL', active: false },
    { n: '3', title: 'Invite your team', note: 'Optional — do it later', active: false },
  ];
  return (
    <div className='flex flex-col gap-4'>
      <p className='text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-foreground/80'>
        3 steps to your workspace
      </p>
      {steps.map(s => (
        <div key={s.n} className={`flex items-start gap-3 ${s.active ? '' : 'opacity-60'}`}>
          <span
            className={
              'grid size-[26px] shrink-0 place-items-center rounded-full text-xs font-bold ' +
              (s.active
                ? 'bg-primary-foreground text-primary'
                : 'border-[1.5px] border-primary-foreground/50 text-primary-foreground')
            }
          >
            {s.n}
          </span>
          <div>
            <p className='text-[13.5px] font-semibold'>{s.title}</p>
            <p className='mt-0.5 text-[11.5px] text-primary-foreground/80'>{s.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SignUpPage() {
  return (
    <AuthLayout
      rail={
        <AuthRail title="Set up your team's workspace." security='No credit card · free to start'>
          <SignUpSteps />
        </AuthRail>
      }
    >
      <div className='mb-6'>
        <h1 className='text-[20px] font-bold tracking-tight text-foreground'>Create your account</h1>
        <p className='mt-1 text-[13px] text-muted-foreground'>
          You're on step 1 of 3. Takes about two minutes.
        </p>
      </div>
      <SignUp routing='path' path='/sign-up' signInUrl='/sign-in' appearance={clerkAuthAppearance} />
    </AuthLayout>
  );
}
