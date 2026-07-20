import {
  permissions,
  rolePermissions,
  type Permission,
  type Role,
} from '@winniekagendo/componentiq-shared-types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { SidebarSection } from '@/features/projects/types';

export { permissions, rolePermissions, type Permission };

type WorkspaceState = {
  selectedOrgSlug?: string;
  activeOrgSlug?: string;
  activeMembershipId?: string;
  activeRole?: Role;
  activePermissions: Permission[];
  activeProjectSection: SidebarSection;
  themeMode: 'light' | 'system';
  // eslint-disable-next-line no-unused-vars
  setSelectedOrgSlug(orgSlug?: string): void;
  // eslint-disable-next-line no-unused-vars
  setActiveMembership(membership?: {
    orgSlug: string;
    membershipId?: string;
    role: Role;
  }): void;
  // eslint-disable-next-line no-unused-vars
  hasPermission(permission: Permission): boolean;
  // eslint-disable-next-line no-unused-vars
  setActiveProjectSection(section: SidebarSection): void;
  // eslint-disable-next-line no-unused-vars
  setThemeMode(themeMode: 'light' | 'system'): void;
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      selectedOrgSlug: undefined,
      activeOrgSlug: undefined,
      activeMembershipId: undefined,
      activeRole: undefined,
      activePermissions: [],
      activeProjectSection: 'overview',
      themeMode: 'light',
      setSelectedOrgSlug: selectedOrgSlug => set({ selectedOrgSlug }),
      setActiveMembership: membership => {
        if (!membership) {
          set({
            activeOrgSlug: undefined,
            activeMembershipId: undefined,
            activeRole: undefined,
            activePermissions: [],
          });
          return;
        }

        set({
          selectedOrgSlug: membership.orgSlug,
          activeOrgSlug: membership.orgSlug,
          activeMembershipId: membership.membershipId,
          activeRole: membership.role,
          activePermissions: [...rolePermissions[membership.role]],
        });
      },
      hasPermission: permission => get().activePermissions.includes(permission),
      setActiveProjectSection: activeProjectSection => set({ activeProjectSection }),
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
