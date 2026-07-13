import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

import { getOrganizations } from '@/lib/api/organizations';
import { requireClerkSessionToken } from '@/lib/auth/clerk-session-token';
import { queryKeys } from '@/lib/query/query-keys';

export function useOrganizations() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.organizations,
    queryFn: async ({ signal }) => {
      const clerkSessionToken = await requireClerkSessionToken(getToken);
      return getOrganizations(clerkSessionToken, signal);
    },
    enabled: isLoaded && Boolean(isSignedIn),
    staleTime: 1000 * 60 * 2,
  });
}
