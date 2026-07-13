'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';
import { useMemo, useRef, useState } from 'react';

import { Button, Input, Select } from 'componentiq';

import { OnboardingLayout } from '@/features/shared/onboarding-layout';
import { createInvite } from '@/lib/api/invites';
import { requireClerkSessionToken } from '@/lib/auth/clerk-session-token';
import { queryKeys } from '@/lib/query/query-keys';
import type { Role } from '@/features/org/types';

type InviteDraft = { id: string; email: string; role: Exclude<Role, 'OWNER'> };

const inviteRoles: InviteDraft['role'][] = [
  'ADMIN',
  'MAINTAINER',
  'ENGINEER',
  'VIEWER',
];

/**
 * Invite teammates — the optional step 3 (split out of create-org).
 *
 * The organization already exists, so this screen can be skipped to reach
 * the dashboard immediately and invite later from Settings → Invites.
 * Partial failures are surfaced explicitly; dynamic rows manage focus and
 * announce add/remove (WCAG 2.4.3 / 4.1.3).
 */
export function InviteTeamScreen() {
  const { getToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const orgSlug = searchParams?.get('org') ?? '';

  const [invites, setInvites] = useState<InviteDraft[]>([
    { id: crypto.randomUUID(), email: '', role: 'ENGINEER' },
  ]);
  const [error, setError] = useState('');
  const [liveMessage, setLiveMessage] = useState('');
  const emailRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const prepared = useMemo(
    () =>
      invites
        .map(i => ({ ...i, email: i.email.trim().toLowerCase() }))
        .filter(i => i.email.length > 0),
    [invites]
  );

  function updateInvite(id: string, patch: Partial<InviteDraft>) {
    setInvites(cur => cur.map(i => (i.id === id ? { ...i, ...patch } : i)));
  }

  function addInvite() {
    const draft: InviteDraft = {
      id: crypto.randomUUID(),
      email: '',
      role: 'ENGINEER',
    };
    setInvites(cur => [...cur, draft]);
    setLiveMessage('Invite row added.');
    requestAnimationFrame(() => emailRefs.current[draft.id]?.focus());
  }

  function removeInvite(id: string) {
    setInvites(cur => {
      if (cur.length === 1)
        return [{ id: crypto.randomUUID(), email: '', role: 'ENGINEER' }];
      const index = cur.findIndex(i => i.id === id);
      const next = cur.filter(i => i.id !== id);
      const focusTarget = next[Math.max(0, index - 1)];
      if (focusTarget)
        requestAnimationFrame(() => emailRefs.current[focusTarget.id]?.focus());
      return next;
    });
    setLiveMessage('Invite row removed.');
  }

  const sendMutation = useMutation({
    mutationFn: async () => {
      const clerkSessionToken = await requireClerkSessionToken(getToken);
      const results = await Promise.allSettled(
        prepared.map(i =>
          createInvite(orgSlug, { email: i.email, role: i.role }, clerkSessionToken)
        )
      );
      return {
        sent: results.filter(r => r.status === 'fulfilled').length,
        failed: results.filter(r => r.status === 'rejected').length,
      };
    },
    onSuccess: ({ failed }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invites(orgSlug) });
      if (failed === 0) goToDashboard();
    },
  });

  function goToDashboard() {
    router.replace(`/org/${orgSlug}/dashboard`);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (prepared.length === 0) {
      goToDashboard();
      return;
    }
    try {
      await sendMutation.mutateAsync();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Invites could not be sent.'
      );
    }
  }

  const failed = sendMutation.data?.failed ?? 0;
  const sent = sendMutation.data?.sent ?? 0;

  return (
    <OnboardingLayout
      current='invite'
      completed={['account', 'choose', 'workspace']}
      stepNumber='4 of 4'
      title='Invite your team'
      explanation='Add teammates now or continue to the dashboard and invite them later from workspace settings.'
      happens={[
        'Enter teammate emails only if you have them ready.',
        'Choose the right role for each person.',
        'Skip safely if you want to finish setup first.',
      ]}
      benefits={[
        'Everyone starts from the same approved rules.',
        'Workspace permissions are ready before AI workflows expand.',
      ]}
    >
      <section className='grid gap-6'>
        <p className='text-sm leading-6 text-muted-foreground'>
          Bring teammates into{' '}
          <span className='font-medium text-foreground'>{orgSlug}</span>. This
          step is optional.
        </p>

        {/* Polite live region for dynamic row changes */}
        <p className='sr-only' aria-live='polite'>
          {liveMessage}
        </p>

        <form className='grid gap-5' onSubmit={submit} noValidate>
          <div className='grid gap-3'>
            {invites.map((invite, index) => (
              <div
                key={invite.id}
                className='grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-[minmax(0,1fr)_160px_44px]'
              >
                <Input
                  ref={(el: HTMLInputElement | null) => {
                    emailRefs.current[invite.id] = el;
                  }}
                  type='email'
                  label={
                    index === 0 ? 'Email address' : `Email address ${index + 1}`
                  }
                  value={invite.email}
                  onChange={e =>
                    updateInvite(invite.id, { email: e.target.value })
                  }
                  placeholder='teammate@example.com'
                />
                <Select
                  label='Role'
                  value={invite.role}
                  onChange={e =>
                    updateInvite(invite.id, {
                      role: e.target.value as InviteDraft['role'],
                    })
                  }
                >
                  {inviteRoles.map(role => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Select>
                <Button
                  type='button'
                  variant='outlined'
                  size='icon'
                  // 44px target (WCAG 2.5.8) + email-scoped label
                  className='size-11 self-end'
                  aria-label={`Remove invite${invite.email ? ` for ${invite.email}` : ''}`}
                  onClick={() => removeInvite(invite.id)}
                >
                  <Trash2 className='size-4' aria-hidden='true' />
                </Button>
              </div>
            ))}
          </div>

          <div>
            <Button
              type='button'
              variant='outlined'
              startIcon={<Plus className='size-4' />}
              onClick={addInvite}
            >
              Add teammate
            </Button>
          </div>

          {failed > 0 && (
            <div
              role='alert'
              aria-live='assertive'
              className='flex items-start gap-3 rounded-md border border-status-warning bg-status-warning-bg p-4 text-sm text-status-warning'
            >
              <AlertTriangle
                className='mt-0.5 size-4 shrink-0'
                aria-hidden='true'
              />
              <div>
                <p className='font-medium'>
                  {sent} invite{sent === 1 ? '' : 's'} sent, {failed} couldn't
                  be delivered.
                </p>
                <p className='mt-1 text-status-warning/90'>
                  Check the addresses and try again, or continue and resend
                  later from Settings → Invites.
                </p>
              </div>
            </div>
          )}

          {error && (
            <p
              role='alert'
              aria-live='assertive'
              className='rounded-md border border-status-error bg-status-error-bg p-4 text-sm text-status-error'
            >
              {error}
            </p>
          )}

          <div className='mt-2 flex flex-col gap-3 sm:flex-row sm:items-center'>
            <Button
              type='submit'
              loading={sendMutation.isPending}
              endIcon={<ArrowRight className='size-4' />}
            >
              {prepared.length > 0 ? 'Send invites & continue' : 'Continue'}
            </Button>
            <Button type='button' variant='text' onClick={goToDashboard}>
              Skip for now
            </Button>
            {sent > 0 && failed === 0 && (
              <span className='inline-flex items-center gap-1.5 text-sm text-status-success'>
                <CheckCircle2 className='size-4' aria-hidden='true' />
                Sent
              </span>
            )}
          </div>
        </form>
      </section>
    </OnboardingLayout>
  );
}
