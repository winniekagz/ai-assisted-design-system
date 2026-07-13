import { Check } from 'lucide-react';

/**
 * OnboardingStepper — the persistent progress model across the founder
 * journey (sign-up -> choose path -> name workspace -> invite). Render it at
 * the top of every onboarding screen with the matching `current` step.
 */

export type OnboardingStep = 'account' | 'choose' | 'workspace' | 'invite';

const STEPS: { id: OnboardingStep; label: string; optional?: boolean }[] = [
  { id: 'account', label: 'Account' },
  { id: 'choose', label: 'Choose path' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'invite', label: 'Invite', optional: true },
];

export function OnboardingStepper({
  current,
  /** Steps before `current` are complete; pass extras to force-complete. */
  completed = [],
}: {
  current: OnboardingStep;
  completed?: OnboardingStep[];
}) {
  const currentIndex = STEPS.findIndex(step => step.id === current);

  return (
    <nav aria-label='Onboarding progress' className='w-full'>
      <ol className='grid grid-cols-4 items-start gap-0'>
        {STEPS.map((step, i) => {
          const isComplete = i < currentIndex || completed.includes(step.id);
          const isCurrent = step.id === current;
          const lineIsActive =
            i < currentIndex || completed.includes(STEPS[i + 1]?.id);

          return (
            <li
              key={step.id}
              className='relative grid min-w-0 justify-items-center gap-2'
            >
              {i < STEPS.length - 1 ? (
                <span
                  className={
                    'absolute left-1/2 top-[13px] h-px w-full transition-colors duration-300 ' +
                    (lineIsActive ? 'bg-primary' : 'bg-border')
                  }
                  aria-hidden='true'
                />
              ) : null}

              <span
                className={
                  'relative z-10 grid size-7 place-items-center rounded-full border text-[11px] font-semibold transition-all duration-300 ' +
                  (isComplete
                    ? 'border-primary bg-primary text-primary-foreground'
                    : isCurrent
                      ? 'border-2 border-primary bg-background text-primary shadow-[0_0_0_4px_var(--primary-100)]'
                      : 'border-border bg-card text-muted-foreground')
                }
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isComplete ? (
                  <Check className='size-3.5' aria-hidden='true' />
                ) : (
                  i + 1
                )}
              </span>

              <span className='grid min-w-0 justify-items-center gap-0.5 text-center'>
                <span
                  className={
                    'truncate text-[11.5px] font-medium leading-4 transition-colors duration-300 ' +
                    (isComplete || isCurrent
                      ? 'text-foreground'
                      : 'text-muted-foreground')
                  }
                >
                  {step.label}
                </span>
                {step.optional ? (
                  <span className='text-[10.5px] leading-3 text-muted-foreground'>
                    optional
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
