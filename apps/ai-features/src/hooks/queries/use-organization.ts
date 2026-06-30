import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

import { getOrganization } from '@/lib/api/organizations';
import { queryKeys } from '@/lib/query/query-keys';

export function useOrganization(orgSlug: string) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.organization(orgSlug),
    queryFn: async ({ signal }) => getOrganization(orgSlug, await getToken(), signal),
    enabled: isLoaded && Boolean(isSignedIn) && Boolean(orgSlug),
    staleTime: 1000 * 60 * 2,
  });
}
