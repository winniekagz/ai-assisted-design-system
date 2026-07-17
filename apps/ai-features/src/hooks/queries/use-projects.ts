import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

import { getProjects } from '@/lib/api/projects';
import { requireClerkSessionToken } from '@/lib/auth/clerk-session-token';
import { queryKeys } from '@/lib/query/query-keys';

export function useProjects(orgSlug: string) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.projects(orgSlug),
    queryFn: async ({ signal }) => {
      const clerkSessionToken = await requireClerkSessionToken(getToken);
      return getProjects(orgSlug, clerkSessionToken, signal);
    },
    enabled: isLoaded && Boolean(isSignedIn) && Boolean(orgSlug),
    staleTime: 1000 * 30,
  });
}
