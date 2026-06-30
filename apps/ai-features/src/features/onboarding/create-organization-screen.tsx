'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Check, ClipboardCheck, Loader2, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import { Button, Input } from 'componentiq';

import { OnboardingStepper } from '@/features/shared/onboarding-stepper';
import { useSlugAvailability } from '@/features/org/use-slug-availability';
import { slugifyOrganization } from '@/features/org/utils';
import { createOrganization } from '@/lib/api/organizations';
import { queryKeys } from '@/lib/query/query-keys';
import { useWorkspaceStore } from '@/stores/workspace-store';

/**
 * Create organization — collects only name + slug. Inviting teammates is
 * its own optional step (/onboarding/invite), so time-to-value drops
 * sharply. The live preview is kept; the slug shows live availability;
 * errors are announced and focus-managed.
 */
export function CreateOrganizationScreen() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const setSelectedOrgSlug = useWorkspaceStore(state => state.setSelectedOrgSlug);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState('');
  const errorRef = useRef<HTMLParagraphElement>(null);

  const availability = useSlugAvailability(slug);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  // Move focus to the error so it's announced and reachable (WCAG 3.3.1).
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  const createMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return createOrganization({ name: name.trim(), slug }, token);
    },
    onSuccess: organization => {
      setSelectedOrgSlug(organization.slug);
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations });
      queryClient.setQueryData(queryKeys.organization(organization.slug), organization);
      // Optional invite step — the org already exists, so this is skippable.
      router.push(`/onboarding/invite?org=${organization.slug}`);
    },
  });

  function updateName(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugifyOrganization(value));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      await createMutation.mutateAsync();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Workspace could not be created.');
    }
  }

  const slugBlocks = availability.status === 'taken' || availability.status === 'invalid';
  const canSubmit = name.trim().length >= 2 && slug.length >= 2 && !slugBlocks;

  return (
    <main className='min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8 lg:py-12'>
      <div className='mx-auto grid w-full max-w-5xl gap-8'>
        <header className='grid gap-6'>
          <Link
            href='/onboarding'
            className='inline-flex w-fit items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          >
            <ArrowLeft className='size-4' aria-hidden='true' />
            Back
          </Link>
          <OnboardingStepper current='workspace' completed={['account', 'choose']} />
        </header>

        <form
          className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-start'
          onSubmit={submit}
          noValidate
        >
          <div className='grid gap-5'>
            <div>
              <h1 className='text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
                Name your workspace
              </h1>
              <p className='mt-2 max-w-xl text-sm leading-6 text-muted-foreground'>
                Just two fields to get started. You can invite your team on the next step — or skip it.
              </p>
            </div>

            <Input
              label='Organization name'
              value={name}
              onChange={e => updateName(e.target.value)}
              required
              minLength={2}
              maxLength={120}
              placeholder='Acme Design System'
              autoFocus
            />

            <Input
              label='Workspace URL'
              value={slug}
              onChange={e => {
                setSlugTouched(true);
                setSlug(slugifyOrganization(e.target.value));
              }}
              required
              minLength={2}
              maxLength={80}
              placeholder='acme-design-system'
              startIcon={<span className='whitespace-nowrap text-xs text-muted-foreground'>/org/</span>}
              endIcon={
                availability.status === 'checking' ? (
                  <Loader2 className='size-4 animate-spin text-muted-foreground' aria-hidden='true' />
                ) : availability.status === 'available' ? (
                  <Check className='size-4 text-status-success' aria-hidden='true' />
                ) : null
              }
              error={slugBlocks}
              success={availability.status === 'available'}
              // Visible helper + screen-reader description (WCAG 1.3.1 / 3.3.2).
              helperText={availability.message || 'Used in your workspace URL.'}
            />

            {error && (
              <p
                ref={errorRef}
                tabIndex={-1}
                role='alert'
                aria-live='assertive'
                className='rounded-md border border-status-error bg-status-error-bg p-4 text-sm text-status-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              >
                {error}
              </p>
            )}

            <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
              <Button
                type='submit'
                disabled={!canSubmit}
                loading={createMutation.isPending}
                endIcon={<ArrowRight className='size-4' />}
              >
                Create workspace
              </Button>
              <Button type='button' variant='text' asChild>
                <Link href='/onboarding'>Cancel</Link>
              </Button>
            </div>
          </div>

          <LivePreview name={name} slug={slug} />
        </form>
      </div>
    </main>
  );
}

function LivePreview({ name, slug }: { name: string; slug: string }) {
  const workspaceName = name.trim() || 'Your workspace';
  const workspaceSlug = slug || 'workspace-url';
  const initial = workspaceName.charAt(0).toUpperCase();

  return (
    <aside className='lg:sticky lg:top-8' aria-label='Live workspace preview'>
      <div className='grid gap-4 rounded-lg border border-border bg-card p-5'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.06em] text-primary'>
            Live preview
          </p>
          <p className='mt-1 text-sm text-muted-foreground'>
            This is how your workspace appears to your team.
          </p>
        </div>
        <div className='rounded-lg border border-border bg-background p-4'>
          <div className='flex items-center gap-3'>
            <span className='grid size-9 shrink-0 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground'>
              {initial}
            </span>
            <div className='min-w-0'>
              <p className='truncate text-sm font-semibold text-foreground'>{workspaceName}</p>
              <p className='truncate text-xs text-muted-foreground'>/org/{workspaceSlug}</p>
            </div>
          </div>
          <div className='mt-4 grid grid-cols-2 gap-3'>
            <PreviewTile icon={<ClipboardCheck className='size-4' />} label='Guardrails' value='Ready' />
            <PreviewTile icon={<Users className='size-4' />} label='Members' value='You (Owner)' />
          </div>
        </div>
      </div>
    </aside>
  );
}

function PreviewTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className='rounded-md border border-border bg-card p-3'>
      <div className='flex items-center gap-1.5 text-primary'>
        {icon}
        <p className='text-[10px] font-semibold uppercase tracking-wide'>{label}</p>
      </div>
      <p className='mt-1 text-xs font-medium text-foreground'>{value}</p>
    </div>
  );
}
