import type {
  CreateProjectInput,
  ProjectListItem,
} from '@winniekagendo/componentiq-shared-types';

import { apiClient } from './client';

export type { CreateProjectInput, ProjectListItem };
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
