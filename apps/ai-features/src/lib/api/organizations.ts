import { apiClient } from './client';
import type { Organization } from '@/features/org/types';

export type CreateOrganizationInput = {
  name: string;
  slug?: string;
};

export function getOrganizations(clerkSessionToken: string | null, signal?: AbortSignal) {
  return apiClient.get<Organization[]>('/organizations', { signal, clerkSessionToken });
}

export function getOrganization(
  orgSlug: string,
  clerkSessionToken: string | null,
  signal?: AbortSignal
) {
  return apiClient.get<Organization>(
    `/organizations/slug/${encodeURIComponent(orgSlug)}`,
    { signal, clerkSessionToken }
  );
}

export function createOrganization(input: CreateOrganizationInput, clerkSessionToken: string | null) {
  return apiClient.post<Organization>('/organizations', input, { clerkSessionToken });
}
