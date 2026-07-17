import { describe, expect, it } from 'vitest';

import {
  PERMISSIONS,
  createProjectSchema,
  hasPermission,
  rolePermissions,
} from './index';

describe('permissions', () => {
  it('grants expected project permissions to owner and admin roles', () => {
    expect(rolePermissions.OWNER).toContain(PERMISSIONS.PROJECT_CREATE);
    expect(rolePermissions.ADMIN).toContain(PERMISSIONS.PROJECT_CREATE);
    expect(hasPermission('OWNER', PERMISSIONS.PROJECT_VIEW)).toBe(true);
    expect(hasPermission('ADMIN', PERMISSIONS.PROJECT_CREATE)).toBe(true);
  });

  it('does not grant project creation to unauthorized roles', () => {
    expect(hasPermission('MAINTAINER', PERMISSIONS.PROJECT_CREATE)).toBe(false);
    expect(hasPermission('ENGINEER', PERMISSIONS.PROJECT_CREATE)).toBe(false);
    expect(hasPermission('VIEWER', PERMISSIONS.PROJECT_CREATE)).toBe(false);
  });

  it('handles unknown and empty permissions safely', () => {
    expect(hasPermission('OWNER', '')).toBe(false);
    expect(hasPermission('OWNER', 'projects.deleteEverything')).toBe(false);
    expect(hasPermission(undefined, PERMISSIONS.PROJECT_VIEW)).toBe(false);
  });

  it('maps semantic project create to the current projects.manage permission', () => {
    expect(PERMISSIONS.PROJECT_CREATE).toBe('projects.manage');
  });
});

describe('createProjectSchema', () => {
  it('normalizes valid project input', () => {
    expect(
      createProjectSchema.parse({
        name: '  Checkout Platform  ',
        description: '  Customer checkout product  ',
      })
    ).toEqual({
      name: 'Checkout Platform',
      description: 'Customer checkout product',
    });
  });

  it('rejects invalid project names', () => {
    expect(() => createProjectSchema.parse({ name: ' ' })).toThrow();
    expect(() => createProjectSchema.parse({ name: 'A' })).toThrow();
    expect(() => createProjectSchema.parse({ name: 'A'.repeat(101) })).toThrow();
  });

  it('normalizes optional and blank descriptions', () => {
    expect(createProjectSchema.parse({ name: 'Checkout Platform' })).toEqual({
      name: 'Checkout Platform',
    });
    expect(
      createProjectSchema.parse({
        name: 'Checkout Platform',
        description: '   ',
      })
    ).toEqual({
      name: 'Checkout Platform',
      description: undefined,
    });
  });

  it('rejects oversized descriptions and privileged extra fields', () => {
    expect(() =>
      createProjectSchema.parse({
        name: 'Checkout Platform',
        description: 'A'.repeat(501),
      })
    ).toThrow();
    expect(() =>
      createProjectSchema.parse({
        name: 'Checkout Platform',
        organizationId: 'other-org',
      })
    ).toThrow();
  });
});
