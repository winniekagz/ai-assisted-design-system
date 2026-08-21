import type { DetectedProjectConfiguration } from '@winniekagendo/componentiq-shared-types';
import { describe, expect, it } from 'vitest';

import type { ConfigurationFormValues } from './types';
import {
  buildConfirmConfigurationInput,
  validateConfigurationPath,
} from './utils';

const baseValues: ConfigurationFormValues = {
  source: 'github',
  githubAccount: 'acme',
  repository: 'acme/app',
  branch: 'main',
  workspace: '',
  framework: '',
  packageManager: '',
  stylingSystem: '',
  projectRoot: '.',
  componentDirectories: 'src/components',
  tokenPath: 'src/tokens.ts',
  notes: '',
};

const detectedConfiguration: DetectedProjectConfiguration = {
  configurationJobId: 'job_1',
  framework: 'REACT',
  language: 'TYPESCRIPT',
  packageManager: 'PNPM',
  stylingSystem: 'PLAIN_CSS',
  projectRoot: '.',
  componentPaths: ['src/components'],
  tokenPaths: ['src/tokens.ts'],
  monorepoDetected: false,
  storybookDetected: false,
  confidence: 'HIGH',
  evidence: null,
  setup: null,
  warnings: [],
  candidateProjectRoots: [],
  detectorVersion: 'test',
  analyzedAt: '2026-07-22T10:00:00.000Z',
  sourceSnapshotId: 'snapshot_1',
};

describe('buildConfirmConfigurationInput', () => {
  it('canonicalizes free-text review edits before validation', () => {
    const input = buildConfirmConfigurationInput(
      {
        ...baseValues,
        framework: 'Next.js',
        packageManager: 'npm',
        stylingSystem: 'Tailwind CSS',
      },
      detectedConfiguration
    );

    expect(input.framework).toBe('NEXTJS');
    expect(input.packageManager).toBe('NPM');
    expect(input.stylingSystem).toBe('TAILWIND');
  });

  it('falls back to detected values when edits are not recognized', () => {
    const input = buildConfirmConfigurationInput(
      {
        ...baseValues,
        framework: 'Not a framework',
        packageManager: 'mystery',
        stylingSystem: 'custom styles',
      },
      detectedConfiguration
    );

    expect(input.framework).toBe('REACT');
    expect(input.packageManager).toBe('PNPM');
    expect(input.stylingSystem).toBe('PLAIN_CSS');
  });
});

describe('validateConfigurationPath', () => {
  it('allows the repository root marker', () => {
    expect(validateConfigurationPath('.')).toBeNull();
  });

  it('rejects absolute roots', () => {
    expect(validateConfigurationPath('/')).toBe('Use a relative path inside the project.');
  });
});
