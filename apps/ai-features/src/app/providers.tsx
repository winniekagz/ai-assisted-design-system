'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider, ToastViewport } from 'componentiq';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { createQueryClient } from '@/lib/query/query-client';
import { OfflineBoundary } from '@/features/error-pages';
import { AppThemeProvider } from './theme-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <AppThemeProvider>
          <ToastProvider>
            <OfflineBoundary>{children}</OfflineBoundary>
            <ToastViewport />
          </ToastProvider>
        </AppThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
