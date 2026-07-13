import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { ApiError } from '../api/client';
import { redirectToSignIn } from '../auth/redirects';

export function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: error => {
        if (isUnauthenticated(error)) {
          redirectToSignIn();
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: error => {
        if (isUnauthenticated(error)) {
          redirectToSignIn();
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && [401, 403].includes(error.status)) {
            return false;
          }

          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function isUnauthenticated(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}
