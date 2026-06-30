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
  { id: 'workspace', label: 'Name workspace' },
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
    <nav aria-label='Onboarding progress'>
      <ol className='flex flex-wrap items-center gap-x-2 gap-y-2'>
        {STEPS.map((step, i) => {
          const isComplete = i < currentIndex || completed.includes(step.id);
          const isCurrent = step.id === current;
          return (
            <li key={step.id} className='flex items-center gap-2'>
              <span
                className={
                  'flex items-center gap-2 text-[11.5px] ' +
                  (isComplete
                    ? 'font-medium text-status-success'
                    : isCurrent
                      ? 'font-semibold text-primary'
                      : 'text-muted-foreground')
                }
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span
                  className={
                    'grid size-[18px] place-items-center rounded-full text-[10px] ' +
                    (isComplete
                      ? 'bg-status-success text-white'
                      : isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : 'border-[1.5px] border-border text-muted-foreground')
                  }
                >
                  {isComplete ? <Check className='size-3' aria-hidden='true' /> : i + 1}
                </span>
                {step.label}
                {step.optional && !isComplete ? (
                  <span className='text-muted-foreground/70'>(optional)</span>
                ) : null}
              </span>
              {i < STEPS.length - 1 ? (
                <span
                  className={'h-px w-6 ' + (isComplete ? 'bg-status-success' : 'bg-border')}
                  aria-hidden='true'
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
