'use client';

import { ComponentIqProvider, componentIqThemes } from 'componentiq';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { useWorkspaceStore } from '@/stores/workspace-store';

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const themeMode = useWorkspaceStore(state => state.themeMode);

  useEffect(() => {
    document.documentElement.dataset.themeMode = themeMode;
    document.documentElement.style.colorScheme =
      themeMode === 'system' ? 'light dark' : 'light';
  }, [themeMode]);

  return (
    <ComponentIqProvider tokens={componentIqThemes.default}>
      {children}
    </ComponentIqProvider>
  );
}
