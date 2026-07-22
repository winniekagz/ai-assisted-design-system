import type {
  ConfirmProjectConfigurationInput,
  CreateProjectInput,
  LocalProjectUploadResponse,
  ProjectConfigurationConfirmResponse,
  ProjectConfigurationSummary,
  ProjectListItem,
} from '@winniekagendo/componentiq-shared-types';

import { apiClient } from './client';

export type { CreateProjectInput, ProjectListItem };
export type {
  ConfirmProjectConfigurationInput,
  ProjectConfigurationSummary,
};
export type ApiProject = ProjectListItem;

export function getProjects(
  orgIdentifier: string,
  clerkSessionToken?: string | null,
  signal?: AbortSignal
) {
  return apiClient.get<ProjectListItem[]>(
    `/organizations/${encodeURIComponent(orgIdentifier)}/projects`,
    { clerkSessionToken, signal }
  );
}

export function createProject(
  orgIdentifier: string,
  input: CreateProjectInput,
  clerkSessionToken?: string | null
) {
  return apiClient.post<ProjectListItem>(
    `/organizations/${encodeURIComponent(orgIdentifier)}/projects`,
    input,
    { clerkSessionToken }
  );
}

export function getProjectConfiguration(
  orgIdentifier: string,
  projectId: string,
  clerkSessionToken?: string | null,
  signal?: AbortSignal
) {
  return apiClient.get<ProjectConfigurationSummary>(
    `/organizations/${encodeURIComponent(orgIdentifier)}/projects/${encodeURIComponent(projectId)}/configuration`,
    { clerkSessionToken, signal }
  );
}

export function uploadLocalProjectSource(
  orgIdentifier: string,
  projectId: string,
  formData: FormData,
  clerkSessionToken?: string | null
) {
  return apiClient.post<LocalProjectUploadResponse>(
    `/organizations/${encodeURIComponent(orgIdentifier)}/projects/${encodeURIComponent(projectId)}/local-source`,
    formData,
    { clerkSessionToken }
  );
}

export function confirmProjectConfiguration(
  orgIdentifier: string,
  projectId: string,
  input: ConfirmProjectConfigurationInput,
  clerkSessionToken?: string | null
) {
  return apiClient.post<ProjectConfigurationConfirmResponse>(
    `/organizations/${encodeURIComponent(orgIdentifier)}/projects/${encodeURIComponent(projectId)}/configuration/confirm`,
    input,
    { clerkSessionToken }
  );
}
