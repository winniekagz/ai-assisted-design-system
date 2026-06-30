import { apiClient } from './client';
import type { OrganizationMember } from '@/features/org/types';

export function getMembers(orgSlug: string, token: string | null, signal?: AbortSignal) {
  return apiClient.get<OrganizationMember[]>(
    `/organizations/${encodeURIComponent(orgSlug)}/members`,
    { signal, token }
  );
}
