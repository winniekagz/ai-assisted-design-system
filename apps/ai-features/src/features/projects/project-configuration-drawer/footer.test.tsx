import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { ProjectConfigurationFooter } from './footer';

vi.mock('componentiq', () => ({
  Button: ({
    children,
    startIcon: _startIcon,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    startIcon?: React.ReactNode;
  }) => React.createElement('button', props, children),
  SheetFooter: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) =>
    React.createElement('footer', props, children),
}));

function renderFooter(
  overrides: Partial<Parameters<typeof ProjectConfigurationFooter>[0]> = {}
) {
  return renderToStaticMarkup(
    <ProjectConfigurationFooter
      state='githubReadyToAnalyze'
      isConfirming={false}
      isAnalyzingGithub={false}
      canReviewGithub
      onStateChange={vi.fn()}
      onClose={vi.fn()}
      onConfirm={vi.fn()}
      onConfirmGithubRepository={vi.fn()}
      onAnalyzeGithubRepository={vi.fn()}
      {...overrides}
    />
  );
}

describe('ProjectConfigurationFooter', () => {
  it('shows Analyze repository as the explicit GitHub analysis action', () => {
    const html = renderFooter();

    expect(html).toContain('Change repository');
    expect(html).toContain('Analyze repository');
    expect(html).not.toContain('Ready to analyze');
  });

  it('disables duplicate GitHub analysis submissions while pending', () => {
    const html = renderFooter({ isAnalyzingGithub: true });

    expect(html).toContain('Analyzing');
    expect(html).toContain('disabled=""');
  });
});
