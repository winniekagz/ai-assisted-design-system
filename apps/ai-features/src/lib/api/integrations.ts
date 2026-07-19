import type {
  GitHubConnectionCallbackResult,
  GitHubConnectionStartResponse,
  GitProviderConnectionSummary,
} from '@winniekagendo/componentiq-shared-types';

import { apiClient } from './client';

export type {
  GitHubConnectionCallbackResult,
  GitHubConnectionStartResponse,
  GitProviderConnectionSummary,
};

export function getGithubConnections(
  orgIdentifier: string,
  clerkSessionToken?: string | null,
  signal?: AbortSignal
) {
  return apiClient.get<GitProviderConnectionSummary[]>(
    `/organizations/${encodeURIComponent(orgIdentifier)}/integrations/github`,
    { clerkSessionToken, signal }
  );
}

export function startGithubConnection(
  orgIdentifier: string,
  returnPath: string,
  clerkSessionToken?: string | null
) {
  const params = new URLSearchParams({ returnPath });

  return apiClient.post<GitHubConnectionStartResponse>(
    `/organizations/${encodeURIComponent(orgIdentifier)}/integrations/github/connect?${params.toString()}`,
    undefined,
    { clerkSessionToken }
  );
}

export function completeGithubConnection(
  queryString: string,
  clerkSessionToken?: string | null,
  signal?: AbortSignal
) {
  return apiClient.get<GitHubConnectionCallbackResult>(
    `/integrations/github/callback?${queryString}`,
    { clerkSessionToken, signal }
  );
}

export function disconnectGithubConnection(
  orgIdentifier: string,
  connectionId: string,
  clerkSessionToken?: string | null
) {
  return apiClient.delete<GitProviderConnectionSummary>(
    `/organizations/${encodeURIComponent(orgIdentifier)}/integrations/github/${encodeURIComponent(connectionId)}/disconnect`,
    { clerkSessionToken }
  );
}
