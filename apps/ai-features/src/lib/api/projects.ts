import { apiClient } from './client';

export type CreateProjectInput = {
  name: string;
  slug?: string;
  framework?: string;
  packageManager?: string;
  stylingSystem?: string;
  repositoryUrl?: string;
};

export type ApiProject = {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  framework: string;
  packageManager: string;
  stylingSystem: string;
  repositoryUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export function createProject(
  organizationId: string,
  input: CreateProjectInput,
  clerkSessionToken?: string | null
) {
  return apiClient.post<ApiProject>(
    `/organizations/${organizationId}/projects`,
    {
      name: input.name,
      slug: input.slug,
      framework: input.framework ?? 'Not configured',
      packageManager: input.packageManager ?? 'Not configured',
      stylingSystem: input.stylingSystem ?? 'Not configured',
      repositoryUrl: input.repositoryUrl,
    },
    { clerkSessionToken }
  );
}
