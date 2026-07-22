import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { ReadyProjectOverview } from './ready-project-overview';

vi.mock('componentiq', () => ({
  Button: ({
    children,
    startIcon: _startIcon,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    startIcon?: React.ReactNode;
  }) => React.createElement('button', props, children),
  Card: ({ children }: { children: React.ReactNode }) =>
    React.createElement('section', null, children),
  CardContent: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', null, children),
  EmptyState: ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => React.createElement('section', null, title, description),
}));

vi.mock('@/shared/format-date', () => ({
  formatDate: (value: string) => value,
}));

const configuration = {
  projectId: 'project_1',
  projectStatus: 'READY' as const,
  latestJobId: 'job_1',
  latestJobStatus: 'COMPLETED' as const,
  sourceType: 'GIT_REPOSITORY' as const,
  progress: 100,
  requiresReview: false,
  canRetry: false,
  lastError: null,
  detectedConfiguration: null,
  updatedAt: '2026-07-22T09:00:00.000Z',
  confirmedConfiguration: {
    id: 'confirmed_1',
    projectId: 'project_1',
    organizationId: 'org_1',
    configurationJobId: 'job_1',
    sourceType: 'GIT_REPOSITORY' as const,
    framework: 'REACT',
    language: 'TYPESCRIPT',
    packageManager: 'NPM',
    stylingSystem: 'PLAIN_CSS',
    projectRoot: '.',
    componentPaths: ['src/components'],
    tokenPaths: ['src/theme/tokens.ts'],
    notes: null,
    confirmedByUserId: 'user_1',
    confirmedAt: '2026-07-22T09:00:00.000Z',
    createdAt: '2026-07-22T09:00:00.000Z',
    updatedAt: '2026-07-22T09:00:00.000Z',
  },
  projectSource: {
    id: 'source_1',
    type: 'GITHUB_REPOSITORY' as const,
    provider: 'GITHUB' as const,
    repositoryFullName: 'acme/mobile',
    repositoryOwner: 'acme',
    repositoryName: 'mobile',
    defaultBranch: 'main',
    selectedBranch: 'main',
    latestCommitSha: 'abcdef1234567890',
    projectRoot: '.',
    sourceSnapshotId: 'snapshot_1',
    originalName: null,
    fileCount: 42,
    totalBytes: 1024,
    updatedAt: '2026-07-22T09:00:00.000Z',
  },
};

describe('ReadyProjectOverview', () => {
  it('renders real confirmed configuration and no fake audit metrics', () => {
    const html = renderToStaticMarkup(
      <ReadyProjectOverview
        configuration={configuration}
        onReviewConfiguration={vi.fn()}
      />
    );

    expect(html).toContain('Project setup complete');
    expect(html).toContain('REACT');
    expect(html).toContain('src/components');
    expect(html).toContain('acme/mobile');
    expect(html).toContain('abcdef123456');
    expect(html).toContain('Run first audit');
    expect(html).not.toContain('Findings');
    expect(html).not.toContain('Deployment blocked');
  });
});
