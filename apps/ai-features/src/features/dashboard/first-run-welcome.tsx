'use client';

import { ArrowRight, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from 'componentiq';

import type { Role } from '@/features/org/types';

/**
 * FirstRunWelcome — role-aware "start here" banner shown on the dashboard
 * the first time someone lands after onboarding. Turns a successful *login*
 * into a successful *onboarding*: a welcome by name, confirmation of role,
 * and a checklist scoped to what the role can actually do. Dismissal
 * persists per org+user in localStorage.
 */

type ChecklistItem = { label: string; href: string };

const ROLE_CHECKLIST: Partial<Record<Role, ChecklistItem[]>> = {
  OWNER: [
    { label: 'Set your first guardrail', href: 'guardrails' },
    { label: 'Invite your team', href: 'settings/invites' },
    { label: 'Connect a project repository', href: 'projects' },
  ],
  ADMIN: [
    { label: 'Invite your team', href: 'settings/invites' },
    { label: 'Review org guardrails', href: 'guardrails' },
    { label: 'Connect a project repository', href: 'projects' },
  ],
  MAINTAINER: [
    { label: 'Curate the approved component set', href: 'components' },
    { label: 'Author a guardrail', href: 'guardrails' },
  ],
  ENGINEER: [
    { label: 'Browse the component whitelist', href: 'components' },
    { label: 'Run your first accessibility check', href: 'guardrails' },
  ],
  VIEWER: [
    { label: 'Browse the component catalog', href: 'components' },
    { label: 'Read the design-system rules', href: 'guardrails' },
  ],
};

export function FirstRunWelcome({
  orgSlug,
  userId,
  name,
  role,
}: {
  orgSlug: string;
  userId: string;
  name?: string | null;
  role: Role;
}) {
  const storageKey = `ciq:first-run:${orgSlug}:${userId}`;
  const [dismissed, setDismissed] = useState(true); // default hidden until we read storage

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(storageKey) === 'done');
    } catch {
      setDismissed(false);
    }
  }, [storageKey]);

  if (dismissed) return null;

  const items = ROLE_CHECKLIST[role] ?? ROLE_CHECKLIST.ENGINEER!;
  const firstName = name?.trim().split(/\s+/)[0];

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(storageKey, 'done');
    } catch {
      /* ignore */
    }
  }

  return (
    <section
      aria-labelledby='first-run-title'
      className='relative mb-6 overflow-hidden rounded-lg border border-border bg-primary-50 p-6'
    >
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='absolute right-2 top-2 size-9'
        aria-label='Dismiss welcome'
        onClick={dismiss}
      >
        <X className='size-4' aria-hidden='true' />
      </Button>

      <p className='text-[11px] font-semibold uppercase tracking-[0.1em] text-primary'>
        You're in as {titleCase(role)}
      </p>
      <h2 id='first-run-title' className='mt-1.5 text-xl font-bold tracking-tight text-foreground'>
        Welcome{firstName ? `, ${firstName}` : ''}
      </h2>
      <p className='mt-1.5 max-w-prose text-sm text-muted-foreground'>
        Here's where to start. Knock these out and you'll be reviewing components with your team in
        minutes.
      </p>

      <ul className='mt-4 grid max-w-md gap-2'>
        {items.map(item => (
          <li key={item.href}>
            <Link
              href={`/org/${orgSlug}/${item.href}`}
              className='group flex items-center gap-3 rounded-md border border-border bg-card px-3.5 py-2.5 text-sm text-foreground transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            >
              <span className='grid size-5 shrink-0 place-items-center rounded-full border border-border text-transparent group-hover:border-primary'>
                <Check className='size-3' aria-hidden='true' />
              </span>
              <span className='flex-1'>{item.label}</span>
              <ArrowRight
                className='size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary'
                aria-hidden='true'
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function titleCase(role: string) {
  return role.charAt(0) + role.slice(1).toLowerCase();
}
