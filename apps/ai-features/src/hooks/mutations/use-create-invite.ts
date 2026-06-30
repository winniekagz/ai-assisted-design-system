import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createInvite, type CreateInviteInput } from '@/lib/api/invites';
import { queryKeys } from '@/lib/query/query-keys';

export function useCreateInvite(orgSlug: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateInviteInput) =>
      createInvite(orgSlug, input, await getToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invites(orgSlug) });
    },
  });
}
