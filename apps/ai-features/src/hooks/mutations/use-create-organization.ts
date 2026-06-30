import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createOrganization, type CreateOrganizationInput } from '@/lib/api/organizations';
import { queryKeys } from '@/lib/query/query-keys';

export function useCreateOrganization() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateOrganizationInput) =>
      createOrganization(input, await getToken()),
    onSuccess: organization => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations });
      queryClient.setQueryData(queryKeys.organization(organization.slug), organization);
    },
  });
}
