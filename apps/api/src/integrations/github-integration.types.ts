import type { Organization, OrganizationMember, User } from '@prisma/client';
import type { GitProviderConnectionStatus } from '@winniekagendo/componentiq-shared-types';

export type StartGithubConnectionCommand = {
  organization: Pick<Organization, 'id' | 'slug'>;
  membership: OrganizationMember;
  user: User;
  returnPath?: string;
};

export type CompleteGithubConnectionCommand = {
  user: User;
  state: string;
  installationId?: string;
  setupAction?: string;
  accountLogin?: string;
  accountType?: string;
  organizationIdFromClient?: string;
};

export type DisconnectGithubConnectionCommand = {
  organizationId: string;
  membership: OrganizationMember;
  connectionId: string;
};

export type GithubStatePayload = {
  organizationId: string;
  userId: string;
  returnPath: string;
  expiresAt: number;
};

export type GitProviderConnectionRecord = {
  id: string;
  provider: 'GITHUB';
  installationId: string;
  accountLogin: string;
  accountType: string | null;
  status: GitProviderConnectionStatus;
  installedAt: Date | null;
  lastVerifiedAt: Date | null;
  disconnectedAt?: Date | null;
};

export type GithubIntegrationPrisma = {
  gitProviderConnection: {
    findFirst(args: unknown): Promise<GitProviderConnectionRecord | null>;
    findMany(args: unknown): Promise<GitProviderConnectionRecord[]>;
    upsert(args: unknown): Promise<GitProviderConnectionRecord>;
    update(args: unknown): Promise<GitProviderConnectionRecord>;
  };
};

export const connectionSelect = {
  id: true,
  provider: true,
  installationId: true,
  accountLogin: true,
  accountType: true,
  status: true,
  installedAt: true,
  lastVerifiedAt: true,
  disconnectedAt: true,
};
