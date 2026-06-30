'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query/query-keys';

/**
 * Thin mutation wrappers for per-invite actions on the admin table.
 *
 * TODO(api): no resend/revoke endpoints exist yet in apps/api
 * (organization-invites.controller.ts only has list/create/validate/accept).
 * Suggested shape once added:
 *   POST   /organizations/:orgSlug/invites/:id/resend
 *   DELETE /organizations/:orgSlug/invites/:id
 * Until then these mutations reject immediately so the table never lies
 * about an action that silently does nothing — callers should use
 * `inviteManagementAvailable` to disable the resend/revoke controls rather
 * than let people click into a guaranteed failure.
 */
export const inviteManagementAvailable = false;

export function useResendInvite(orgSlug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_inviteId: string): Promise<void> => {
      throw new Error('Resending invites is not available yet.');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.invites(orgSlug) }),
  });
}

export function useRevokeInvite(orgSlug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_inviteId: string): Promise<void> => {
      throw new Error('Revoking invites is not available yet.');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.invites(orgSlug) }),
  });
}
