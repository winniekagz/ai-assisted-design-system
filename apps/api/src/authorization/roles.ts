import { Role } from '@prisma/client';

export const assignableRoles = [
  Role.ADMIN,
  Role.MAINTAINER,
  Role.ENGINEER,
  Role.VIEWER,
] as const;

export type AssignableRole = (typeof assignableRoles)[number];
