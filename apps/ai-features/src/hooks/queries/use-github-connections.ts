import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

import { getGithubConnections } from '@/lib/api/integrations';
import { requireClerkSessionToken } from '@/lib/auth/clerk-session-token';
import { queryKeys } from '@/lib/query/query-keys';

export function useGithubConnections(orgSlug: string) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.githubConnections(orgSlug),
    queryFn: async ({ signal }) => {
      const clerkSessionToken = await requireClerkSessionToken(getToken);
      return getGithubConnections(orgSlug, clerkSessionToken, signal);
    },
    enabled: isLoaded && Boolean(isSignedIn) && Boolean(orgSlug),
    staleTime: 1000 * 30,
  });
}
