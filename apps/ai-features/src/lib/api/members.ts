import { apiClient } from './client';
import type { OrganizationMember } from '@/features/org/types';

export function getMembers(
  orgSlug: string,
  clerkSessionToken: string | null,
  signal?: AbortSignal
) {
  return apiClient.get<OrganizationMember[]>(
    `/organizations/${encodeURIComponent(orgSlug)}/members`,
    { signal, clerkSessionToken }
  );
}
