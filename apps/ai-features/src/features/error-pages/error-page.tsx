'use client';

import { Copy, Home, Mail, RefreshCw, Radio, ShieldQuestion } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export type ErrorPageKind =
  | 'boundary'
  | 'forbidden'
  | 'not-found'
  | 'offline'
  | 'server';

type ErrorPageProps = {
  kind: ErrorPageKind;
  title?: string;
  description?: string;
  digest?: string;
  orgName?: string;
  projectName?: string;
  dashboardHref?: string;
  retryStatus?: string;
  actions?: ReactNode;
  compact?: boolean;
};

const errorPageConfig = {
  boundary: {
    label: 'ERROR 500',
    title: 'Something went wrong on our end',
    description:
      "This wasn't caused by anything you did. Our team has already been notified. Retrying usually resolves it within a minute.",
    motif: 'warning',
  },
  forbidden: {
    label: 'ERROR 403',
    title: "You don't have access to this project",
    description:
      'Your role does not include access to this workspace area. Ask an admin to add you, or request access below.',
    motif: 'lock',
  },
  'not-found': {
    label: 'ERROR 404',
    title: "This page doesn't exist",
    description:
      "The project or page you're looking for may have been moved, renamed, or never existed. Double-check the link, or head back to your projects.",
    motif: 'ring',
  },
  offline: {
    label: 'NO CONNECTION',
    title: "You're offline",
    description:
      "ComponentIQ can't reach the server right now. Check your connection. We'll keep trying in the background.",
    motif: 'offline',
  },
  server: {
    label: 'ERROR 500',
    title: 'Something went wrong on our end',
    description:
      "This wasn't caused by anything you did. Our team has already been notified. Retrying usually resolves it within a minute.",
    motif: 'warning',
  },
} satisfies Record<
  ErrorPageKind,
  {
    label: string;
    title: string;
    description: string;
    motif: 'lock' | 'offline' | 'ring' | 'warning';
  }
>;

export function ErrorPage({
  kind,
  title,
  description,
  digest,
  orgName,
  projectName,
  dashboardHref = '/',
  retryStatus,
  actions,
  compact = false,
}: ErrorPageProps) {
  const config = errorPageConfig[kind];
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reference = kind === 'server' || kind === 'boundary' ? formatReference(digest) : null;

  useEffect(() => {
    headingRef.current?.focus();
  }, [kind]);

  return (
    <main
      className={joinClassNames(
        'grid bg-background px-4 py-10',
        compact ? 'min-h-96 place-items-center' : 'min-h-screen place-items-center'
      )}
    >
      <section
        aria-labelledby={`${kind}-error-title`}
        className='w-full max-w-[460px] text-center'
      >
        <ErrorMotif kind={config.motif} />

        <p className='mt-5 font-mono text-[15px] font-medium uppercase tracking-[0.04em] text-muted-foreground'>
          {config.label}
        </p>
        <h1
          ref={headingRef}
          id={`${kind}-error-title`}
          tabIndex={-1}
          className='mt-2 text-[26px] font-bold leading-tight text-foreground focus-visible:outline-none'
        >
          {title ?? config.title}
        </h1>
        <p className='mt-2 text-sm leading-6 text-muted-foreground'>
          {description ?? getDescription({ configDescription: config.description, kind, orgName, projectName })}
        </p>
        <div className='mt-6 flex flex-col justify-center gap-2.5 sm:flex-row'>
          {actions ?? <DefaultErrorActions dashboardHref={dashboardHref} kind={kind} />}
        </div>
        {retryStatus ? (
          <p role='status' aria-live='polite' className='mt-3.5 text-xs text-muted-foreground'>
            {retryStatus}
          </p>
        ) : null}
        {reference ? <ReferenceId value={reference} /> : null}
      </section>
    </main>
  );
}

export function DefaultErrorActions({
  dashboardHref = '/',
  kind,
}: {
  dashboardHref?: string;
  kind: ErrorPageKind;
}) {
  if (kind === 'forbidden') {
    return (
      <>
        <ErrorLink href='mailto:?subject=ComponentIQ%20access%20request' icon={<ShieldQuestion className='size-4' />}>
          Request access
        </ErrorLink>
        <ErrorLink href={dashboardHref} variant='outlined' icon={<Home className='size-4' />}>
          Back to dashboard
        </ErrorLink>
      </>
    );
  }

  if (kind === 'server' || kind === 'boundary') {
    return (
      <>
        <ErrorLink href={dashboardHref} icon={<RefreshCw className='size-4' />}>
          Retry
        </ErrorLink>
        <ErrorLink href='https://www.vercel-status.com/' variant='outlined' icon={<Radio className='size-4' />}>
          View status page
        </ErrorLink>
      </>
    );
  }

  if (kind === 'offline') {
    return (
      <ErrorLink href={dashboardHref} icon={<RefreshCw className='size-4' />}>
        Retry now
      </ErrorLink>
    );
  }

  return (
    <>
      <ErrorLink href={dashboardHref} icon={<Home className='size-4' />}>
        Back to dashboard
      </ErrorLink>
      <ErrorLink href='mailto:support@componentiq.dev' variant='outlined' icon={<Mail className='size-4' />}>
        Contact support
      </ErrorLink>
    </>
  );
}

export function RetryAction({ onRetry }: { onRetry(): void }) {
  return (
    <button
      type='button'
      onClick={onRetry}
      className={buttonClassName}
    >
      <RefreshCw className='size-4' aria-hidden='true' />
      Try again
    </button>
  );
}

function ErrorMotif({ kind }: { kind: 'lock' | 'offline' | 'ring' | 'warning' }) {
  if (kind === 'lock') {
    return (
      <svg className='mx-auto size-[72px]' viewBox='0 0 88 88' aria-hidden='true'>
        <rect x='24' y='38' width='40' height='32' rx='6' fill='none' className='stroke-primary' strokeWidth='6' />
        <path d='M32 38 V28 A12 12 0 0 1 56 28 V38' fill='none' className='stroke-primary' strokeWidth='6' strokeLinecap='round' />
        <circle cx='44' cy='54' r='5' className='fill-secondary' />
      </svg>
    );
  }

  if (kind === 'offline') {
    return (
      <svg className='mx-auto size-[72px]' viewBox='0 0 88 88' aria-hidden='true'>
        <path d='M16 34 A40 40 0 0 1 72 34' fill='none' className='stroke-border' strokeWidth='6' strokeLinecap='round' />
        <path d='M26 46 A24 24 0 0 1 62 46' fill='none' className='stroke-border' strokeWidth='6' strokeLinecap='round' />
        <circle cx='44' cy='62' r='6' className='fill-secondary' />
        <line x1='16' y1='20' x2='72' y2='68' className='stroke-primary' strokeWidth='6' strokeLinecap='round' />
      </svg>
    );
  }

  if (kind === 'warning') {
    return (
      <svg className='mx-auto size-[72px]' viewBox='0 0 88 88' aria-hidden='true'>
        <path d='M44 14 L74 66 H14 Z' fill='none' className='stroke-status-error' strokeWidth='6' strokeLinejoin='round' />
        <line x1='44' y1='36' x2='44' y2='50' className='stroke-status-error' strokeWidth='6' strokeLinecap='round' />
        <circle cx='44' cy='60' r='3.5' className='fill-status-error' />
      </svg>
    );
  }

  return (
    <svg className='mx-auto size-[72px]' viewBox='0 0 88 88' aria-hidden='true'>
      <path d='M58 20 A28 28 0 1 0 58 68' fill='none' className='stroke-border' strokeWidth='10' strokeLinecap='round' />
      <path d='M58 20 A28 28 0 0 1 79 44' fill='none' className='stroke-primary' strokeWidth='10' strokeLinecap='round' />
      <circle cx='58' cy='44' r='7' className='fill-secondary' />
    </svg>
  );
}

function ReferenceId({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copyReference() {
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type='button'
      onClick={copyReference}
      className='mx-auto mt-4 inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-background-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
    >
      Reference: {value}
      <Copy className='size-3' aria-hidden='true' />
      <span className='sr-only'>{copied ? 'Copied' : 'Copy reference id'}</span>
    </button>
  );
}

function ErrorLink({
  href,
  children,
  icon,
  variant = 'primary',
}: {
  href: string;
  children: ReactNode;
  icon: ReactNode;
  variant?: 'primary' | 'outlined';
}) {
  return (
    <Link
      href={href}
      className={variant === 'outlined' ? outlinedButtonClassName : buttonClassName}
    >
      {icon}
      {children}
    </Link>
  );
}

const buttonClassName =
  'inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-[18px] text-[13.5px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

const outlinedButtonClassName =
  'inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-[18px] text-[13.5px] font-medium text-foreground transition-colors hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

function getDescription({
  configDescription,
  kind,
  orgName,
  projectName,
}: {
  configDescription: string;
  kind: ErrorPageKind;
  orgName?: string;
  projectName?: string;
}) {
  if (kind === 'forbidden' && (orgName || projectName)) {
    const org = orgName ?? 'this organization';
    const project = projectName ?? 'this area';
    return `Your role in ${org} does not include access to ${project}. Ask a project admin to add you, or request access below.`;
  }

  return configDescription;
}

function formatReference(digest: string | undefined) {
  if (!digest) {
    return 'req_unavailable';
  }

  return digest.startsWith('req_') ? digest : `req_${digest.slice(0, 12)}`;
}

function joinClassNames(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}
