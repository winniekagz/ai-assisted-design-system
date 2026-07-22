import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { GithubReadyToAnalyzeStep } from './github-ready-to-analyze-step';
import { GithubReviewStep } from './github-review-step';

vi.mock('componentiq', () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
    React.createElement('button', props, children),
}));

vi.mock('../shared-components', () => ({
  StatusCallout: ({
    title,
    detail,
  }: {
    title: string;
    detail: string;
  }) => React.createElement('section', null, title, detail),
  SummaryRows: ({ rows }: { rows: [string, string][] }) =>
    React.createElement(
      'dl',
      null,
      rows.map(([label, value]) =>
        React.createElement(
          'div',
          { key: label },
          React.createElement('dt', null, label),
          React.createElement('dd', null, value)
        )
      )
    ),
}));

const selectedRepo = {
  connectionId: 'connection_1',
  repositoryId: '42',
  repositoryOwner: 'acme',
  repositoryName: 'checkout-web',
  repositoryFullName: 'acme/checkout-web',
  defaultBranch: 'main',
  private: true,
  updatedAt: '2026-07-20T12:00:00Z',
  sizeKb: 1536,
  installationAccountLogin: 'acme',
};

const values = {
  source: 'github' as const,
  githubAccount: 'acme',
  repository: 'acme/checkout-web',
  branch: 'main',
  projectRoot: '/',
  workspace: '',
  framework: '',
  packageManager: '',
  stylingSystem: '',
  componentDirectories: '',
  tokenPath: '',
  notes: '',
};

describe('GithubReviewStep', () => {
  it('renders selected repository summary metadata', () => {
    const html = renderToStaticMarkup(
      <GithubReviewStep
        selectedRepo={selectedRepo}
        values={values}
        onChangeRepository={vi.fn()}
      />
    );

    expect(html).toContain('Review repository');
    expect(html).toContain('Repository name');
    expect(html).toContain('checkout-web');
    expect(html).toContain('Owner');
    expect(html).toContain('acme');
    expect(html).toContain('Default branch');
    expect(html).toContain('Private');
    expect(html).toContain('Jul');
    expect(html).toContain('1.5 MB');
    expect(html).toContain('Connected GitHub installation');
    expect(html).toContain('Change repository');
  });
});

describe('GithubReadyToAnalyzeStep', () => {
  it('renders ready state without source download or job creation', () => {
    const html = renderToStaticMarkup(
      <GithubReadyToAnalyzeStep selectedRepo={selectedRepo} />
    );

    expect(html).toContain('Ready to Analyze');
    expect(html).toContain('acme/checkout-web');
    expect(html).toContain('Source code downloaded');
    expect(html).toContain('Files stored');
    expect(html).toContain('Configuration job created');
    expect(html).toContain('No');
  });
});
