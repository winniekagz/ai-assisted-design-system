'use client';

// TODO: Wire this hook to the real GitHub App/OAuth installation flow when the
// backend exposes repository installation and picker endpoints. There is no
// existing GitHub integration in this repo today, so callers must not pretend a
// connection succeeded.

export type GithubConnectionTarget = 'repository' | 'organization';

export function useConnectGithubRepo() {
  return {
    isAvailable: false,
    connect(target: GithubConnectionTarget) {
      void target;
      return Promise.reject(
        new Error('GitHub repository connection is pending OAuth wiring.')
      );
    },
  };
}
