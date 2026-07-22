import { describe, expect, it } from 'vitest';

import { getGithubRepositoryPickerState } from './github-repository-picker-state';

const repositories = [
  {
    id: '42',
    owner: 'acme',
    name: 'checkout-web',
    fullName: 'acme/checkout-web',
    defaultBranch: 'main',
    private: true,
    updatedAt: '2026-07-20T12:00:00Z',
    sizeKb: 1536,
  },
];

describe('getGithubRepositoryPickerState', () => {
  it('represents loading state', () => {
    expect(
      getGithubRepositoryPickerState({
        repositories,
        search: '',
        isLoading: true,
        isError: false,
      })
    ).toEqual({ status: 'loading', repositories: [] });
  });

  it('represents failure state', () => {
    expect(
      getGithubRepositoryPickerState({
        repositories,
        search: '',
        isLoading: false,
        isError: true,
      })
    ).toEqual({ status: 'failure', repositories: [] });
  });

  it('represents no accessible repositories state', () => {
    expect(
      getGithubRepositoryPickerState({
        repositories: [],
        search: '',
        isLoading: false,
        isError: false,
      })
    ).toEqual({ status: 'access-empty', repositories: [] });
  });

  it('represents search-specific empty state', () => {
    expect(
      getGithubRepositoryPickerState({
        repositories,
        search: 'missing',
        isLoading: false,
        isError: false,
      })
    ).toEqual({ status: 'search-empty', repositories: [] });
  });

  it('represents success state and filters repositories', () => {
    expect(
      getGithubRepositoryPickerState({
        repositories,
        search: 'checkout',
        isLoading: false,
        isError: false,
      })
    ).toEqual({ status: 'success', repositories });
  });
});
