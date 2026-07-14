import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Role } from '@winniekagendo/componentiq-shared-types';

import type { SidebarSection } from '@/features/projects/fixtures/projects';

export const permissions = [
  'org.manage',
  'members.invite',
  'members.remove',
  'projects.view',
  'projects.manage',
  'components.view',
  'components.manage',
  'guardrails.view',
  'guardrails.manage',
  'ai.run',
  'audits.view',
  'audits.viewOwn',
  'recommendations.view',
  'recommendations.viewOwn',
] as const;

export type Permission = (typeof permissions)[number];

export const rolePermissions: Record<Role, Permission[]> = {
  OWNER: [
    'org.manage',
    'members.invite',
    'members.remove',
    'projects.view',
    'projects.manage',
    'components.view',
    'components.manage',
    'guardrails.view',
    'guardrails.manage',
    'ai.run',
    'audits.view',
    'recommendations.view',
  ],
  ADMIN: [
    'members.invite',
    'members.remove',
    'projects.view',
    'projects.manage',
    'components.view',
    'components.manage',
    'guardrails.view',
    'guardrails.manage',
    'ai.run',
    'audits.view',
    'recommendations.view',
  ],
  MAINTAINER: [
    'projects.view',
    'components.view',
    'components.manage',
    'guardrails.view',
    'guardrails.manage',
    'ai.run',
    'audits.view',
    'recommendations.view',
  ],
  ENGINEER: [
    'projects.view',
    'components.view',
    'guardrails.view',
    'ai.run',
    'audits.viewOwn',
    'recommendations.viewOwn',
  ],
  VIEWER: [
    'projects.view',
    'components.view',
    'guardrails.view',
    'audits.viewOwn',
    'recommendations.viewOwn',
  ],
};

type WorkspaceState = {
  selectedOrgSlug?: string;
  activeOrgSlug?: string;
  activeMembershipId?: string;
  activeRole?: Role;
  activePermissions: Permission[];
  activeProjectSection: SidebarSection;
  themeMode: 'light' | 'system';
  setSelectedOrgSlug(orgSlug?: string): void;
  setActiveMembership(membership?: {
    orgSlug: string;
    membershipId?: string;
    role: Role;
  }): void;
  hasPermission(permission: Permission): boolean;
  // eslint-disable-next-line no-unused-vars
  setActiveProjectSection(section: SidebarSection): void;
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
          activePermissions: rolePermissions[membership.role],
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
