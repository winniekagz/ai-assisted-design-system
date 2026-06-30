import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

import { getMe } from '@/lib/api/users';
import { queryKeys } from '@/lib/query/query-keys';

export function useMe() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async ({ signal }) => getMe(await getToken(), signal),
    enabled: isLoaded && Boolean(isSignedIn),
    staleTime: 1000 * 60 * 2,
  });
}
