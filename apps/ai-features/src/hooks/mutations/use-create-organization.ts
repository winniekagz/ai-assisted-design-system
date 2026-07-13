import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createOrganization, type CreateOrganizationInput } from '@/lib/api/organizations';
import { requireClerkSessionToken } from '@/lib/auth/clerk-session-token';
import { queryKeys } from '@/lib/query/query-keys';

export function useCreateOrganization() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateOrganizationInput) => {
      const clerkSessionToken = await requireClerkSessionToken(getToken);
      return createOrganization(input, clerkSessionToken);
    },
    onSuccess: organization => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations });
      queryClient.setQueryData(queryKeys.organization(organization.slug), organization);
    },
  });
}
