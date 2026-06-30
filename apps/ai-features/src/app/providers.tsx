'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { createQueryClient } from '@/lib/query/query-client';
import { AppThemeProvider } from './theme-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <AppThemeProvider>{children}</AppThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
