import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

import { getOrganizations } from '@/lib/api/organizations';
import { queryKeys } from '@/lib/query/query-keys';

export function useOrganizations() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.organizations,
    queryFn: async ({ signal }) => getOrganizations(await getToken(), signal),
    enabled: isLoaded && Boolean(isSignedIn),
    staleTime: 1000 * 60 * 2,
  });
}
