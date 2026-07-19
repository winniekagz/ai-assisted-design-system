import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

import { getProjectConfiguration } from '@/lib/api/projects';
import { requireClerkSessionToken } from '@/lib/auth/clerk-session-token';
import { queryKeys } from '@/lib/query/query-keys';

export function useProjectConfiguration(orgSlug: string, projectId: string) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.projectConfiguration(orgSlug, projectId),
    queryFn: async ({ signal }) => {
      const clerkSessionToken = await requireClerkSessionToken(getToken);
      return getProjectConfiguration(orgSlug, projectId, clerkSessionToken, signal);
    },
    enabled:
      isLoaded && Boolean(isSignedIn) && Boolean(orgSlug) && Boolean(projectId),
    staleTime: 1000 * 30,
  });
}
