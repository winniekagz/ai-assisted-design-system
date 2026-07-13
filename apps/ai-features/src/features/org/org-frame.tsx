'use client';

import { useAuth } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';

import { AppShell } from '@/features/dashboard/app-shell';
import { ApiError } from '@/lib/api/client';
import { useMe } from '@/hooks/queries/use-me';
import { useOrganization } from '@/hooks/queries/use-organization';
import { useOrganizations } from '@/hooks/queries/use-organizations';
import { useWorkspaceStore } from '@/stores/workspace-store';
import { redirectToSignIn } from '../../lib/auth/redirects';
import type { CurrentUserResponse, Membership, Organization } from './types';

export function OrgFrame({
  orgSlug,
  children,
}: {
  orgSlug: string;
  children: (context: {
    organization: Organization;
    membership: Membership;
    me: CurrentUserResponse;
  }) => ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const meQuery = useMe();
  const organizationQuery = useOrganization(orgSlug);
  const organizationsQuery = useOrganizations();
  const setSelectedOrgSlug = useWorkspaceStore(state => state.setSelectedOrgSlug);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      redirectToSignIn();
      return;
    }
    setSelectedOrgSlug(orgSlug);
  }, [isLoaded, isSignedIn, setSelectedOrgSlug, orgSlug]);

  const me = meQuery.data ?? null;
  const organization = organizationQuery.data ?? null;
  const error = meQuery.error ?? organizationQuery.error;

  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      redirectToSignIn();
    }
  }, [error]);

  const membership = useMemo(
    () => me?.memberships.find(item => item.organization.slug === orgSlug) ?? null,
    [me, orgSlug]
  );

  if (!me || !organization || !membership) {
    return (
      <AppShell orgSlug={orgSlug}>
        <div className='grid min-h-96 place-items-center rounded-md border border-border bg-card p-8 text-center'>
          {error ? (
            <div>
              <h1 className='text-xl font-semibold'>Unable to open organization</h1>
              <p className='mt-2 text-sm text-muted-foreground'>
                {getOrganizationErrorMessage(error)}
              </p>
            </div>
          ) : (
            <Loader2 className='size-6 animate-spin text-primary' />
          )}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      orgSlug={orgSlug}
      orgName={organization.name}
      organizations={organizationsQuery.data ?? me.memberships.map(item => item.organization)}
    >
      {children({ organization, membership, me })}
    </AppShell>
  );
}

function getOrganizationErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.status === 404) {
    return 'Organization not found.';
  }

  if (error instanceof ApiError && error.status === 401) {
    return 'Please sign in to continue.';
  }

  return 'You do not have permission to access this area. Contact an organization admin if you need access.';
}
