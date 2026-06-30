import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { acceptInvite } from '@/lib/api/invites';
import { queryKeys } from '@/lib/query/query-keys';

export function useAcceptInvite() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string) => acceptInvite(token, await getToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations });
    },
  });
}
