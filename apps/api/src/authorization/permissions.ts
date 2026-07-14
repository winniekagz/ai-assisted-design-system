import type { Role } from '@winniekagendo/componentiq-shared-types';

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

export function hasPermission(role: Role, permission: Permission) {
  return rolePermissions[role].includes(permission);
}
