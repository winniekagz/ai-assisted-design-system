import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

import { getInvites, validateInvite } from '@/lib/api/invites';
import { queryKeys } from '@/lib/query/query-keys';

export function useInvites(orgSlug: string) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.invites(orgSlug),
    queryFn: async ({ signal }) => getInvites(orgSlug, await getToken(), signal),
    enabled: isLoaded && Boolean(isSignedIn) && Boolean(orgSlug),
    staleTime: 1000 * 30,
  });
}

export function useInvitePreview(token: string) {
  return useQuery({
    queryKey: queryKeys.invitePreview(token),
    queryFn: ({ signal }) => validateInvite(token, signal),
    enabled: Boolean(token),
    staleTime: 0,
    retry: false,
  });
}
