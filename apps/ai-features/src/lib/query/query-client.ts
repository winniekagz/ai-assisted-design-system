import { QueryClient } from '@tanstack/react-query';

import { ApiError } from '../api/client';

export function createQueryClient() {
  return new QueryClient({
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
