import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

import { getGithubRepositories } from '@/lib/api/integrations';
import { requireClerkSessionToken } from '@/lib/auth/clerk-session-token';
import { queryKeys } from '@/lib/query/query-keys';

export function useGithubRepositories(
  orgSlug: string,
  connectionId: string | null | undefined,
  cursor?: string | null
) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.githubRepositories(orgSlug, connectionId ?? '', cursor),
    queryFn: async ({ signal }) => {
      if (!connectionId) {
        throw new Error('GitHub connection is required');
      }

      const clerkSessionToken = await requireClerkSessionToken(getToken);
      return getGithubRepositories(
        orgSlug,
        connectionId,
        clerkSessionToken,
        signal,
        cursor
      );
    },
    enabled:
      isLoaded && Boolean(isSignedIn) && Boolean(orgSlug) && Boolean(connectionId),
    placeholderData: previousData => previousData,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30,
  });
}
