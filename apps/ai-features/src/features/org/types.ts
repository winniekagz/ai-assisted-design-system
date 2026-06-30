export type Role = 'OWNER' | 'ADMIN' | 'MAINTAINER' | 'ENGINEER' | 'VIEWER';

export type Organization = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  currentUserRole?: Role;
  membershipId?: string;
  projects?: unknown[];
  components?: unknown[];
  guardrails?: unknown[];
};

export type Membership = {
  id: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  organization: Organization;
};

export type CurrentUserResponse = {
  user: {
    id: string;
    email: string;
    name?: string | null;
    imageUrl?: string | null;
  };
  memberships: Membership[];
};

export type OrganizationMember = {
  id: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name?: string | null;
    imageUrl?: string | null;
  };
};

export type OrganizationInvite = {
  id: string;
  email: string;
  role: Role;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  expiresAt: string;
  acceptedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
};
