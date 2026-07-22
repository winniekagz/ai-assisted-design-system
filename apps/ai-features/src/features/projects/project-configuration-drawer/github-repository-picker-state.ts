import type { GitHubRepositorySummary } from '@winniekagendo/componentiq-shared-types';

export type GithubRepositoryPickerStatus =
  | 'loading'
  | 'failure'
  | 'access-empty'
  | 'search-empty'
  | 'success';

export function getGithubRepositoryPickerState({
  repositories,
  search,
  isLoading,
  isError,
}: {
  repositories: GitHubRepositorySummary[];
  search: string;
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return {
      status: 'loading' as const,
      repositories: [] as GitHubRepositorySummary[],
    };
  }

  if (isError) {
    return {
      status: 'failure' as const,
      repositories: [] as GitHubRepositorySummary[],
    };
  }

  const query = search.trim().toLowerCase();
  if (repositories.length === 0) {
    return {
      status: 'access-empty' as const,
      repositories: [] as GitHubRepositorySummary[],
    };
  }

  const filteredRepositories = query
    ? repositories.filter(repository =>
        repository.fullName.toLowerCase().includes(query)
      )
    : repositories;

  return {
    status: filteredRepositories.length > 0 ? 'success' as const : 'search-empty' as const,
    repositories: filteredRepositories,
  };
}
