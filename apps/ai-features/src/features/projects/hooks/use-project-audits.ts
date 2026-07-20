import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

import { getProjectAudits } from '@/lib/api/audits';
import { requireClerkSessionToken } from '@/lib/auth/clerk-session-token';
import { queryKeys } from '@/lib/query/query-keys';

export function useProjectAudits(orgSlug: string, projectId: string) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.projectAudits(orgSlug, projectId),
    queryFn: async ({ signal }) => {
      const clerkSessionToken = await requireClerkSessionToken(getToken);
      return getProjectAudits(orgSlug, projectId, clerkSessionToken, signal);
    },
    enabled:
      isLoaded && Boolean(isSignedIn) && Boolean(orgSlug) && Boolean(projectId),
    staleTime: 1000 * 30,
  });
}
