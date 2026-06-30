import type { Organization, OrganizationMember, User } from '@prisma/client';
import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  currentUser?: User;
  clerkUserId?: string;
  organization?: Organization;
  membership?: OrganizationMember;
}
