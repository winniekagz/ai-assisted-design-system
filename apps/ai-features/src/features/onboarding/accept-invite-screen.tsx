'use client';

import { SignInButton, SignUpButton, useAuth } from '@clerk/nextjs';
import { Check, Loader2, MailWarning } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from 'componentiq';

import { AuthLayout, AuthRail } from '@/features/shared/auth-layout';
import { useAcceptInvite } from '@/hooks/mutations/use-accept-invite';
import { useInvitePreview } from '@/hooks/queries/use-invites';
import { useWorkspaceStore } from '@/stores/workspace-store';
import type { Role } from '@/features/org/types';

// Loosely-typed view of the preview so we can show optional context fields
// (inviter, member count) when the API provides them, without requiring a
// schema change to light them up.
type InvitePreviewView = {
  organization: { name: string; slug?: string; memberCount?: number; projectCount?: number };
  role: Role;
  invitedByName?: string;
  email?: string;
};

const ROLE_BENEFITS: Partial<Record<Role, string[]>> = {
  ENGINEER: [
    'Browse and reuse approved components',
    'Run accessibility & standards checks',
    'Contribute to AI review workflows',
  ],
  MAINTAINER: [
    'Curate the approved component set',
    'Author and tune guardrails',
    'Review AI-flagged inconsistencies',
  ],
  ADMIN: [
    'Manage members and invites',
    'Configure org-wide guardrails',
    'Oversee projects and AI workflows',
  ],
  VIEWER: ['Browse the component catalog', 'View design-system rules', 'Follow AI review activity'],
};

/**
 * Accept invite — the organization becomes the hero (logo, who invited you,
 * team size) on a teal rail (`tone="secondary"`) that distinguishes
 * "joining" from the terracotta "creating" path. Error states are
 * recoverable instead of a dead "could not be validated" line. All
 * data/auth logic is unchanged — still useInvitePreview / useAcceptInvite /
 * Clerk.
 */
export function AcceptInviteScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') ?? '';
  const [error, setError] = useState('');
  const previewQuery = useInvitePreview(token);
  const acceptInviteMutation = useAcceptInvite();
  const setSelectedOrgSlug = useWorkspaceStore(state => state.setSelectedOrgSlug);

  const preview = previewQuery.data as InvitePreviewView | undefined;
  const orgName = preview?.organization.name ?? 'this workspace';
  const benefits = (preview && ROLE_BENEFITS[preview.role]) ?? ROLE_BENEFITS.ENGINEER!;

  async function handleAcceptInvite() {
    setError('');
    try {
      const result = await acceptInviteMutation.mutateAsync(token);
      setSelectedOrgSlug(result.organization.slug);
      router.replace(`/org/${result.organization.slug}/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invite could not be accepted.');
    }
  }

  // ---- Recovery state: missing / invalid / expired token --------------------
  const isBroken = !token || (!previewQuery.isLoading && (previewQuery.error || !preview));
  if (isBroken) {
    return (
      <AuthLayout tone='secondary' rail={<AuthRail tone='secondary' />}>
        <div className='grid gap-4'>
          <span className='grid size-11 place-items-center rounded-md bg-status-warning-bg text-status-warning'>
            <MailWarning className='size-5' aria-hidden='true' />
          </span>
          <div>
            <h1 className='text-[20px] font-bold tracking-tight text-foreground'>
              This invite isn't valid anymore
            </h1>
            <p className='mt-2 text-sm leading-6 text-muted-foreground'>
              {!token
                ? 'The invite link is missing its token. Open the most recent link from your email.'
                : 'It may have expired or already been used. Ask the person who invited you to send a fresh link — invites expire for your security.'}
            </p>
          </div>
          <div className='flex flex-wrap gap-3'>
            <Button asChild>
              <a href='mailto:?subject=Could%20you%20resend%20my%20ComponentIQ%20invite%3F'>
                Request a new invite
              </a>
            </Button>
            <Button variant='text' asChild>
              <a href='/sign-in'>Sign in instead</a>
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // ---- Loading --------------------------------------------------------------
  if (previewQuery.isLoading || !preview) {
    return (
      <AuthLayout tone='secondary' rail={<AuthRail tone='secondary' />}>
        <div className='flex items-center gap-3 text-sm text-muted-foreground' role='status' aria-live='polite'>
          <Loader2 className='size-5 animate-spin text-secondary' aria-hidden='true' />
          Validating your invite…
        </div>
      </AuthLayout>
    );
  }

  // ---- Org-as-hero rail -----------------------------------------------------
  const rail = (
    <AuthRail tone='secondary'>
      <div className='flex items-center gap-3'>
        <span className='grid size-12 place-items-center rounded-xl bg-primary-foreground text-xl font-bold text-secondary'>
          {orgName.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className='text-lg font-semibold text-primary-foreground'>{orgName}</p>
          {(preview.organization.memberCount || preview.organization.projectCount) && (
            <p className='mt-0.5 text-xs text-primary-foreground/80'>
              {[
                preview.organization.memberCount && `${preview.organization.memberCount} members`,
                preview.organization.projectCount && `${preview.organization.projectCount} projects`,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
        </div>
      </div>
      <p className='mt-4 text-[13px] leading-relaxed text-primary-foreground/85'>
        {preview.invitedByName ? (
          <>
            <span className='font-semibold text-primary-foreground'>{preview.invitedByName}</span>{' '}
            invited you to collaborate on {orgName}'s design-system rules and AI review workflows.
          </>
        ) : (
          <>You've been invited to collaborate on {orgName}'s design system.</>
        )}
      </p>
      {preview.email && (
        <p className='mt-4 inline-flex items-center gap-2 rounded-md bg-primary-foreground/10 px-3 py-2 text-[11.5px] text-primary-foreground/85'>
          Only {preview.email} can accept this invite
        </p>
      )}
    </AuthRail>
  );

  return (
    <AuthLayout tone='secondary' rail={rail}>
      <p className='text-[11px] font-semibold uppercase tracking-[0.08em] text-secondary'>
        You're invited
      </p>
      <h1 className='mt-1.5 text-[22px] font-bold tracking-tight text-foreground'>
        Join as {titleCase(preview.role)}
      </h1>

      <ul className='mt-4 grid gap-2.5'>
        {benefits.map(b => (
          <li key={b} className='flex items-center gap-2.5 text-sm text-foreground'>
            <Check className='size-4 shrink-0 text-status-success' aria-hidden='true' />
            {b}
          </li>
        ))}
      </ul>

      {error && (
        <p
          role='alert'
          aria-live='assertive'
          className='mt-4 rounded-md border border-status-error bg-status-error-bg p-3 text-sm text-status-error'
        >
          {error}
        </p>
      )}

      <div className='mt-6 grid gap-3'>
        {!isLoaded && <Loader2 className='size-5 animate-spin text-secondary' aria-hidden='true' />}

        {isLoaded && !isSignedIn && (
          <>
            <SignInButton mode='redirect' forceRedirectUrl={`/accept-invite?token=${token}`}>
              <Button type='button' variant='secondary' fullWidth endIcon={<span aria-hidden>→</span>}>
                Sign in &amp; accept invite
              </Button>
            </SignInButton>
            <SignUpButton mode='redirect' forceRedirectUrl={`/accept-invite?token=${token}`}>
              <Button type='button' variant='outlined' fullWidth>
                Create account
              </Button>
            </SignUpButton>
          </>
        )}

        {isSignedIn && (
          <Button
            type='button'
            variant='secondary'
            fullWidth
            loading={acceptInviteMutation.isPending}
            onClick={handleAcceptInvite}
            endIcon={<span aria-hidden>→</span>}
          >
            Accept &amp; open {orgName}
          </Button>
        )}

        <p className='text-center text-xs text-muted-foreground'>
          Wrong account?{' '}
          <a href='/sign-in' className='font-medium text-secondary hover:underline'>
            Sign in as someone else
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}

function titleCase(role: string) {
  return role.charAt(0) + role.slice(1).toLowerCase();
}
