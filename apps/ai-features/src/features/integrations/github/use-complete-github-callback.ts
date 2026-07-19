import { useAuth } from '@clerk/nextjs';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { completeGithubConnection } from '@/lib/api/integrations';
import { requireClerkSessionToken } from '@/lib/auth/clerk-session-token';
import { queryKeys } from '@/lib/query/query-keys';

export type GithubCallbackState =
  | { status: 'loading' }
  | { status: 'success'; returnPath: string }
  | { status: 'error'; message: string };

export function useCompleteGithubCallback() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<GithubCallbackState>({ status: 'loading' });

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setState({
        status: 'error',
        message: 'Sign in before completing the GitHub connection.',
      });
      return;
    }

    async function completeConnection() {
      try {
        const clerkSessionToken = await requireClerkSessionToken(getToken);
        const result = await completeGithubConnection(
          searchParams?.toString() ?? '',
          clerkSessionToken
        );
        const orgSlug = orgSlugFromReturnPath(result.returnPath);

        if (orgSlug) {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.githubConnections(orgSlug),
          });
        }

        setState({ status: 'success', returnPath: result.returnPath });
        window.setTimeout(() => router.replace(result.returnPath), 900);
      } catch (error) {
        setState({
          status: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'GitHub connection could not be completed.',
        });
      }
    }

    void completeConnection();
  }, [getToken, isLoaded, isSignedIn, queryClient, router, searchParams]);

  return {
    state,
    returnToPreviousPage: () => router.back(),
  };
}

function orgSlugFromReturnPath(returnPath: string) {
  const match = returnPath.match(/^\/org\/([^/]+)/);

  return match?.[1] ?? null;
}
