import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  disconnectGithubConnection,
  startGithubConnection,
} from '@/lib/api/integrations';
import { requireClerkSessionToken } from '@/lib/auth/clerk-session-token';
import { queryKeys } from '@/lib/query/query-keys';

export function useStartGithubConnection(orgSlug: string) {
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (returnPath: string) => {
      const clerkSessionToken = await requireClerkSessionToken(getToken);
      return startGithubConnection(orgSlug, returnPath, clerkSessionToken);
    },
  });
}

export function useDisconnectGithubConnection(orgSlug: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (connectionId: string) => {
      const clerkSessionToken = await requireClerkSessionToken(getToken);
      return disconnectGithubConnection(orgSlug, connectionId, clerkSessionToken);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.githubConnections(orgSlug),
      });
    },
  });
}
