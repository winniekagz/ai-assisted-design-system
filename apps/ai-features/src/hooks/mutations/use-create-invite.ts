import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createInvite, type CreateInviteInput } from '@/lib/api/invites';
import { requireClerkSessionToken } from '@/lib/auth/clerk-session-token';
import { queryKeys } from '@/lib/query/query-keys';

export function useCreateInvite(orgSlug: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateInviteInput) => {
      const clerkSessionToken = await requireClerkSessionToken(getToken);
      return createInvite(orgSlug, input, clerkSessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invites(orgSlug) });
    },
  });
}
