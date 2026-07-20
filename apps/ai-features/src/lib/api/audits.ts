import type {
  AuditRequest,
  AuditResponse,
  AuditSessionSummary,
} from '@winniekagendo/componentiq-shared-types';

import { apiClient } from './client';

export type { AuditRequest, AuditResponse, AuditSessionSummary };

export function getProjectAudits(
  orgIdentifier: string,
  projectId: string,
  clerkSessionToken?: string | null,
  signal?: AbortSignal
) {
  return apiClient.get<AuditSessionSummary[]>(
    `/organizations/${encodeURIComponent(orgIdentifier)}/audits?projectId=${encodeURIComponent(projectId)}`,
    { clerkSessionToken, signal }
  );
}

export function runAudit(
  input: AuditRequest,
  clerkSessionToken?: string | null
) {
  return apiClient.post<AuditResponse>('/ai/audit', input, { clerkSessionToken });
}
