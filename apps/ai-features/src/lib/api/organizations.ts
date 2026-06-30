import { apiClient } from './client';
import type { Organization } from '@/features/org/types';

export type CreateOrganizationInput = {
  name: string;
  slug?: string;
};

export function getOrganizations(token: string | null, signal?: AbortSignal) {
  return apiClient.get<Organization[]>('/organizations', { signal, token });
}

export function getOrganization(orgSlug: string, token: string | null, signal?: AbortSignal) {
  return apiClient.get<Organization>(
    `/organizations/slug/${encodeURIComponent(orgSlug)}`,
    { signal, token }
  );
}

export function createOrganization(input: CreateOrganizationInput, token: string | null) {
  return apiClient.post<Organization>('/organizations', input, { token });
}
