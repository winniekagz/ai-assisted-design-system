import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AuditInputType } from '@winniekagendo/componentiq-shared-types';

import { runAudit } from '@/lib/api/audits';
import { requireClerkSessionToken } from '@/lib/auth/clerk-session-token';
import { queryKeys } from '@/lib/query/query-keys';

export type RunAuditInput = {
  inputType: AuditInputType;
  content: string;
};

export function useRunAudit(
  orgSlug: string,
  organizationId: string,
  projectId: string
) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RunAuditInput) => {
      const clerkSessionToken = await requireClerkSessionToken(getToken);

      return runAudit(
        {
          organizationId,
          projectId,
          auditType: 'manual',
          inputType: input.inputType,
          content: input.content,
        },
        clerkSessionToken
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.projectAudits(orgSlug, projectId),
      });
    },
  });
}
