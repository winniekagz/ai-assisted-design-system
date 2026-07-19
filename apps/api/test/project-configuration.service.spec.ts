import { NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';

import { ProjectConfigurationService } from '../src/projects/project-configuration.service';

const projectUpdatedAt = new Date('2026-07-17T09:30:00.000Z');
const olderJobUpdatedAt = new Date('2026-07-17T10:00:00.000Z');
const latestJobUpdatedAt = new Date('2026-07-17T11:00:00.000Z');

function createPrismaMock() {
  return {
    project: {
      findFirst: vi.fn().mockResolvedValue(createProjectRecord()),
    },
    configurationJob: {
      findFirst: vi.fn().mockResolvedValue(null),
    },
    detectedConfiguration: {
      findUnique: vi.fn().mockResolvedValue(null),
    },
  };
}

function createProjectRecord(overrides: Partial<ProjectRecord> = {}) {
  return {
    id: overrides.id ?? 'project_1',
    configurationStatus: overrides.configurationStatus ?? 'NOT_CONFIGURED',
    updatedAt: overrides.updatedAt ?? projectUpdatedAt,
  };
}

function createConfigurationJobRecord(
  overrides: Partial<ConfigurationJobRecord> = {}
) {
  return {
    id: overrides.id ?? 'job_latest',
    projectId: overrides.projectId ?? 'project_1',
    organizationId: overrides.organizationId ?? 'org_1',
    sourceType: overrides.sourceType ?? 'LOCAL_UPLOAD',
    status: overrides.status ?? 'PENDING',
    progress: overrides.progress ?? null,
    errorCode: overrides.errorCode ?? null,
    errorMessage: overrides.errorMessage ?? null,
    updatedAt: overrides.updatedAt ?? latestJobUpdatedAt,
  };
}

type ProjectRecord = {
  id: string;
  configurationStatus:
    | 'NOT_CONFIGURED'
    | 'CONFIGURING'
    | 'REVIEW_REQUIRED'
    | 'READY'
    | 'CONFIGURATION_FAILED'
    | 'ARCHIVED';
  updatedAt: Date;
};

type ConfigurationJobRecord = {
  id: string;
  projectId: string;
  organizationId: string;
  sourceType: 'LOCAL_UPLOAD' | 'GIT_REPOSITORY';
  status:
    | 'PENDING'
    | 'UPLOADING'
    | 'ANALYZING'
    | 'REVIEW_REQUIRED'
    | 'COMPLETED'
    | 'FAILED'
    | 'CANCELLED';
  progress: number | null;
  errorCode: string | null;
  errorMessage: string | null;
  updatedAt: Date;
};

describe('ProjectConfigurationService', () => {
  it('returns NOT_CONFIGURED summary for a project without jobs', async () => {
    const prisma = createPrismaMock();
    const service = new ProjectConfigurationService(prisma as never);

    const summary = await service.getProjectConfigurationSummary({
      organizationId: 'org_1',
      projectId: 'project_1',
    });

    expect(summary).toEqual({
      projectId: 'project_1',
      projectStatus: 'NOT_CONFIGURED',
      latestJobId: null,
      latestJobStatus: null,
      sourceType: null,
      progress: null,
      requiresReview: false,
      canRetry: false,
      lastError: null,
      detectedConfiguration: null,
      updatedAt: projectUpdatedAt.toISOString(),
    });
  });

  it('requests the latest job by project and created date', async () => {
    const prisma = createPrismaMock();
    prisma.configurationJob.findFirst.mockResolvedValue(
      createConfigurationJobRecord({
        id: 'job_newer',
        status: 'ANALYZING',
        progress: 40,
      })
    );
    const service = new ProjectConfigurationService(prisma as never);

    const summary = await service.getProjectConfigurationSummary({
      organizationId: 'org_1',
      projectId: 'project_1',
    });

    expect(prisma.configurationJob.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { projectId: 'project_1', organizationId: 'org_1' },
        orderBy: { createdAt: 'desc' },
      })
    );
    expect(summary).toEqual(
      expect.objectContaining({
        projectStatus: 'CONFIGURING',
        latestJobId: 'job_newer',
        latestJobStatus: 'ANALYZING',
        progress: 40,
      })
    );
    expect(summary.updatedAt).toBe(latestJobUpdatedAt.toISOString());
    expect(olderJobUpdatedAt.getTime()).toBeLessThan(latestJobUpdatedAt.getTime());
  });

  it('returns REVIEW_REQUIRED state with detected configuration', async () => {
    const prisma = createPrismaMock();
    prisma.configurationJob.findFirst.mockResolvedValue(
      createConfigurationJobRecord({
        status: 'REVIEW_REQUIRED',
        sourceType: 'GIT_REPOSITORY',
      })
    );
    prisma.detectedConfiguration.findUnique.mockResolvedValue({
      framework: 'Next.js',
      language: 'TypeScript',
      packageManager: 'npm',
      stylingSystem: 'Tailwind CSS',
      projectRoot: 'apps/web',
      componentPaths: ['src/components'],
      tokenPaths: ['src/styles/tokens.css'],
      monorepoDetected: true,
      storybookDetected: false,
      confidence: 'medium',
      evidence: { packageJson: true },
    });
    const service = new ProjectConfigurationService(prisma as never);

    const summary = await service.getProjectConfigurationSummary({
      organizationId: 'org_1',
      projectId: 'project_1',
    });

    expect(summary.projectStatus).toBe('REVIEW_REQUIRED');
    expect(summary.requiresReview).toBe(true);
    expect(summary.sourceType).toBe('GIT_REPOSITORY');
    expect(summary.detectedConfiguration).toEqual(
      expect.objectContaining({
        framework: 'Next.js',
        componentPaths: ['src/components'],
        tokenPaths: ['src/styles/tokens.css'],
      })
    );
  });

  it('returns FAILED state and retry metadata', async () => {
    const prisma = createPrismaMock();
    prisma.configurationJob.findFirst.mockResolvedValue(
      createConfigurationJobRecord({
        status: 'FAILED',
        errorCode: 'analysis_failed',
        errorMessage: 'Analyzer exited early',
      })
    );
    const service = new ProjectConfigurationService(prisma as never);

    const summary = await service.getProjectConfigurationSummary({
      organizationId: 'org_1',
      projectId: 'project_1',
    });

    expect(summary.projectStatus).toBe('CONFIGURATION_FAILED');
    expect(summary.canRetry).toBe(true);
    expect(summary.lastError).toEqual({
      code: 'analysis_failed',
      message: 'Analyzer exited early',
    });
  });

  it('scopes project and job lookup by organization', async () => {
    const prisma = createPrismaMock();
    const service = new ProjectConfigurationService(prisma as never);

    await service.getProjectConfigurationSummary({
      organizationId: 'org_a',
      projectId: 'project_1',
    });

    expect(prisma.project.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'project_1', organizationId: 'org_a' },
      })
    );
    expect(prisma.configurationJob.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { projectId: 'project_1', organizationId: 'org_a' },
      })
    );
  });

  it('does not expose another tenant configuration', async () => {
    const prisma = createPrismaMock();
    prisma.project.findFirst.mockResolvedValue(null);
    const service = new ProjectConfigurationService(prisma as never);

    await expect(
      service.getProjectConfigurationSummary({
        organizationId: 'org_attacker',
        projectId: 'project_1',
      })
    ).rejects.toThrow(NotFoundException);
    expect(prisma.configurationJob.findFirst).not.toHaveBeenCalled();
  });

  it('does not return raw Prisma entities', async () => {
    const prisma = createPrismaMock();
    prisma.configurationJob.findFirst.mockResolvedValue(
      createConfigurationJobRecord({
        status: 'COMPLETED',
      })
    );
    const service = new ProjectConfigurationService(prisma as never);

    const summary = await service.getProjectConfigurationSummary({
      organizationId: 'org_1',
      projectId: 'project_1',
    });

    expect(summary.projectStatus).toBe('READY');
    expect(summary).not.toHaveProperty('organizationId');
    expect(summary).not.toHaveProperty('createdAt');
    expect(summary).not.toHaveProperty('errorCode');
    expect(summary).not.toHaveProperty('errorMessage');
  });

  it('maps archived project status correctly', async () => {
    const prisma = createPrismaMock();
    prisma.project.findFirst.mockResolvedValue(
      createProjectRecord({ configurationStatus: 'ARCHIVED' })
    );
    prisma.configurationJob.findFirst.mockResolvedValue(
      createConfigurationJobRecord({ status: 'COMPLETED' })
    );
    const service = new ProjectConfigurationService(prisma as never);

    const summary = await service.getProjectConfigurationSummary({
      organizationId: 'org_1',
      projectId: 'project_1',
    });

    expect(summary.projectStatus).toBe('ARCHIVED');
    expect(summary.canRetry).toBe(false);
    expect(summary.requiresReview).toBe(false);
  });
});
