import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

import { getMembers } from '@/lib/api/members';
import { queryKeys } from '@/lib/query/query-keys';

export function useMembers(orgSlug: string) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.members(orgSlug),
    queryFn: async ({ signal }) => getMembers(orgSlug, await getToken(), signal),
    enabled: isLoaded && Boolean(isSignedIn) && Boolean(orgSlug),
    staleTime: 1000 * 60,
  });
}
