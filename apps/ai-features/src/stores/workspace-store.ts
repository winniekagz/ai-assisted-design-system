import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type WorkspaceState = {
  selectedOrgSlug?: string;
  themeMode: 'light' | 'system';
  setSelectedOrgSlug: (orgSlug?: string) => void;
  setThemeMode: (themeMode: 'light' | 'system') => void;
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    set => ({
      selectedOrgSlug: undefined,
      themeMode: 'light',
      setSelectedOrgSlug: selectedOrgSlug => set({ selectedOrgSlug }),
      setThemeMode: themeMode => set({ themeMode }),
    }),
    {
      name: 'componentiq-workspace',
      partialize: state => ({
        selectedOrgSlug: state.selectedOrgSlug,
        themeMode: state.themeMode,
      }),
    }
  )
);
