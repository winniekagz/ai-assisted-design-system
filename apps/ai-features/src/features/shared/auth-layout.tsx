import { Check, ShieldCheck } from 'lucide-react';
import * as React from 'react';

import { ComponentIqLogo } from '@/features/brand';

/**
 * AuthLayout — the two-pane shell used by every auth surface
 * (welcome, sign-in, sign-up, accept-invite).
 *
 * Left  = brand / trust rail (marketing context, never asks for anything)
 * Right = the single action for this screen (form, Clerk widget, etc.)
 *
 * The gradient is built from CSS custom property tokens
 * (--primary-800/--primary-500, --secondary-900/--secondary-500) rather than
 * a made-up color, so it renders identically regardless of theme config and
 * updates automatically if the palette changes.
 */

type RailTone = 'primary' | 'secondary';

const RAIL_GRADIENT: Record<RailTone, string> = {
  primary: 'bg-[linear-gradient(160deg,var(--primary-800),var(--primary-500))]',
  secondary: 'bg-[linear-gradient(160deg,var(--secondary-900),var(--secondary-500))]',
};

export interface AuthLayoutProps {
  children: React.ReactNode;
  /** Optional custom rail content. Falls back to <AuthRail/> default. */
  rail?: React.ReactNode;
  tone?: RailTone;
}

export function AuthLayout({ children, rail, tone = 'primary' }: AuthLayoutProps) {
  return (
    <main className='min-h-screen bg-background'>
      <div className='grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_1fr]'>
        <aside
          className={`hidden flex-col p-9 text-primary-foreground lg:flex ${RAIL_GRADIENT[tone]}`}
        >
          {rail ?? <AuthRail />}
        </aside>

        <section className='flex flex-col justify-center px-6 py-12 sm:px-10'>
          <div className='mb-8 flex items-center gap-2.5 lg:hidden'>
            <ComponentIqLogo size={32} className='size-8' />
            <span className='text-[15px] font-semibold text-foreground'>ComponentIQ</span>
          </div>
          <div className='mx-auto w-full max-w-sm'>{children}</div>
        </section>
      </div>
    </main>
  );
}

export interface AuthRailProps {
  title?: string;
  points?: string[];
  security?: string;
  tone?: RailTone;
  /** Optional slot rendered between the title block and the security strip. */
  children?: React.ReactNode;
}

export function AuthRail({
  title = 'The governance layer for your design system.',
  points = [
    'Discover and reuse every approved component',
    'Enforce accessibility & design standards in CI',
    'Onboard engineers in minutes, not weeks',
  ],
  security = 'SOC 2 Type II · SSO & SAML · encrypted in transit',
  children,
}: AuthRailProps) {
  return (
    <div className='flex h-full flex-col'>
      <div className='flex items-center gap-2.5'>
        <ComponentIqLogo surface='dark' size={30} className='size-[30px]' />
        <span className='text-[15px] font-semibold'>ComponentIQ</span>
      </div>

      <div className='mt-auto'>
        <p className='max-w-[18ch] text-[22px] font-semibold leading-snug tracking-tight'>
          {title}
        </p>
        <ul className='mt-4 flex flex-col gap-3'>
          {points.map(point => (
            <li key={point} className='flex items-center gap-2.5 text-[13px] text-primary-foreground/85'>
              <Check className='size-4 shrink-0 text-status-success' aria-hidden='true' />
              {point}
            </li>
          ))}
        </ul>
        {children ? <div className='mt-6'>{children}</div> : null}
      </div>

      <div className='mt-7 flex items-center gap-2 border-t border-primary-foreground/20 pt-4 text-[11.5px] text-primary-foreground/75'>
        <ShieldCheck className='size-3.5 shrink-0' aria-hidden='true' />
        {security}
      </div>
    </div>
  );
}
