import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createProject, type CreateProjectInput } from '@/lib/api/projects';
import { requireClerkSessionToken } from '@/lib/auth/clerk-session-token';
import { queryKeys } from '@/lib/query/query-keys';

export function useCreateProject(orgSlug: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const clerkSessionToken = await requireClerkSessionToken(getToken);
      return createProject(orgSlug, input, clerkSessionToken);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.projects(orgSlug) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.organization(orgSlug) });
    },
  });
}
