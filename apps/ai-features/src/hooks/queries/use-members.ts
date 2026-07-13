import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

import { getMembers } from '@/lib/api/members';
import { requireClerkSessionToken } from '@/lib/auth/clerk-session-token';
import { queryKeys } from '@/lib/query/query-keys';

export function useMembers(orgSlug: string) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.members(orgSlug),
    queryFn: async ({ signal }) => {
      const clerkSessionToken = await requireClerkSessionToken(getToken);
      return getMembers(orgSlug, clerkSessionToken, signal);
    },
    enabled: isLoaded && Boolean(isSignedIn) && Boolean(orgSlug),
    staleTime: 1000 * 60,
  });
}
