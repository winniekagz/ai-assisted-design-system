import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { GithubRepoPickerStep } from './github-repo-picker-step';

vi.mock('componentiq', () => ({
  Badge: ({ children }: { children: React.ReactNode }) =>
    React.createElement('span', null, children),
  Button: ({
    children,
    startIcon,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    startIcon?: React.ReactNode;
  }) => {
    void startIcon;

    return React.createElement('button', props, children);
  },
  Input: ({
    label,
    startIcon,
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    startIcon?: React.ReactNode;
  }) => {
    void startIcon;

    return React.createElement(
      'label',
      null,
      label,
      React.createElement('input', props)
    );
  },
  cn: (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(' '),
}));

const repository = {
  id: '42',
  owner: 'acme',
  name: 'checkout-web',
  fullName: 'acme/checkout-web',
  defaultBranch: 'main',
  private: true,
  updatedAt: '2026-07-20T12:00:00Z',
  sizeKb: 1536,
};
const connection = {
  accountLogin: 'acme',
  accountType: 'Organization',
  status: 'ACTIVE' as const,
};

function renderPicker(
  overrides: Partial<Parameters<typeof GithubRepoPickerStep>[0]> = {}
) {
  return renderToStaticMarkup(
    <GithubRepoPickerStep
      repoSearch=''
      onRepoSearch={vi.fn()}
      repositories={[repository]}
      selectedRepoId=''
      onSelectRepo={vi.fn()}
      register={(() => ({})) as never}
      isLoading={false}
      isError={false}
      errorMessage={null}
      onRetry={vi.fn()}
      onRefresh={vi.fn()}
      onConfigureAccess={vi.fn()}
      onReconnectGithub={vi.fn()}
      onClearSearch={vi.fn()}
      nextCursor={null}
      isFetching={false}
      isRefreshing={false}
      onNextPage={vi.fn()}
      connection={connection}
      configureUrl='https://github.com/organizations/acme/settings/installations/98765'
      selectedRepository={null}
      onChangeRepository={vi.fn()}
      {...overrides}
    />
  );
}

describe('GithubRepoPickerStep', () => {
  it('renders loading state', () => {
    expect(renderPicker({ isLoading: true })).toContain('Loading repositories');
  });

  it('renders access-empty state with configure and refresh actions', () => {
    const html = renderPicker({ repositories: [] });

    expect(html).toContain('Component IQ is connected to GitHub');
    expect(html).toContain('does not currently have access');
    expect(html).toContain('Configure GitHub access');
    expect(html).toContain('Refresh repositories');
  });

  it('renders search-specific empty state', () => {
    const html = renderPicker({ repoSearch: 'billing-api' });

    expect(html).toContain('No repositories match');
    expect(html).toContain('billing-api');
    expect(html).toContain('may not have been shared');
    expect(html).toContain('Clear search');
  });

  it('keeps connection context visible for empty state', () => {
    expect(renderPicker({ repositories: [] })).toContain(
      'Connected to acme'
    );
  });

  it('renders error and retry state', () => {
    const html = renderPicker({
      isError: true,
      errorKind: 'rate-limit',
      errorMessage: 'GitHub is unavailable',
    });

    expect(html).toContain('GitHub is temporarily limiting requests');
    expect(html).toContain('Retry');
  });

  it('renders repository details and pagination', () => {
    const html = renderPicker({ nextCursor: '2' });

    expect(html).toContain('checkout-web');
    expect(html).toContain('acme');
    expect(html).toContain('Private');
    expect(html).toContain('main');
    expect(html).toContain('Jul');
    expect(html).toContain('Next page');
  });

  it('collapses to a selected repository summary after selection', () => {
    const html = renderPicker({
      selectedRepoId: '42',
      selectedRepository: repository,
    });

    expect(html).toContain('Selected repository');
    expect(html).toContain('acme/checkout-web');
    expect(html).toContain('Change');
    expect(html).not.toContain('role="listbox"');
  });

  it('shows when selected repository is no longer visible after refresh', () => {
    const html = renderPicker({
      repositories: [],
      selectedRepoId: '42',
      selectedRepository: repository,
    });

    expect(html).toContain('This repository is not currently visible');
    expect(html).toContain('acme/checkout-web');
  });

  it('shows refresh progress', () => {
    expect(renderPicker({ isRefreshing: true })).toContain('Refreshing');
  });
});
