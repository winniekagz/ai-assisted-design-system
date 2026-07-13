import { apiClient } from './client';
import type { Organization, OrganizationInvite, Role } from '@/features/org/types';

export type CreateInviteInput = {
  email: string;
  role: Role;
};

export type CreateInviteResponse = {
  invite: OrganizationInvite;
  emailDelivery: {
    status: 'sent' | 'not_configured';
    provider: 'resend' | 'development';
  };
  developmentInviteLink?: string;
};

export type InvitePreview = {
  role: Role;
  status: OrganizationInvite['status'];
  expiresAt: string;
  organization: Organization;
};

export function getInvites(
  orgSlug: string,
  clerkSessionToken: string | null,
  signal?: AbortSignal
) {
  return apiClient.get<OrganizationInvite[]>(
    `/organizations/${encodeURIComponent(orgSlug)}/invites`,
    { signal, clerkSessionToken }
  );
}

export function createInvite(
  orgSlug: string,
  input: CreateInviteInput,
  clerkSessionToken: string | null
) {
  return apiClient.post<CreateInviteResponse>(
    `/organizations/${encodeURIComponent(orgSlug)}/invites`,
    input,
    { clerkSessionToken }
  );
}

export function validateInvite(token: string, signal?: AbortSignal) {
  return apiClient.get<InvitePreview>(
    `/invites/validate?token=${encodeURIComponent(token)}`,
    { signal }
  );
}

export function acceptInvite(token: string, clerkSessionToken: string | null) {
  return apiClient.post<{ organization: Organization }>(
    '/invites/accept',
    { token },
    { clerkSessionToken }
  );
}
