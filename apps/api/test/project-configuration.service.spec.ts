import { NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';

import { ProjectConfigurationService } from '../src/projects/project-configuration.service';

const projectUpdatedAt = new Date('2026-07-17T09:30:00.000Z');
const olderJobUpdatedAt = new Date('2026-07-17T10:00:00.000Z');
const latestJobUpdatedAt = new Date('2026-07-17T11:00:00.000Z');
const detectedAnalyzedAt = new Date('2026-07-17T11:00:00.123Z');

function createPrismaMock() {
  const transactionClient = {
    $queryRaw: vi.fn().mockResolvedValue([createConfirmedConfigurationRecord()]),
    $executeRaw: vi.fn().mockResolvedValue(1),
  };

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
    confirmedProjectConfiguration: {
      findUnique: vi.fn().mockResolvedValue(null),
    },
    $transaction: vi.fn((callback: (tx: typeof transactionClient) => unknown) =>
      callback(transactionClient)
    ),
    $executeRaw: vi.fn().mockResolvedValue(0),
    __tx: transactionClient,
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
    projectSourceId: overrides.projectSourceId ?? null,
    projectSource: overrides.projectSource ?? null,
    updatedAt: overrides.updatedAt ?? latestJobUpdatedAt,
  };
}

function createDetectedConfigurationRecord() {
  return {
    framework: 'MOBILE_WEB',
    language: 'TYPESCRIPT',
    packageManager: 'NPM',
    stylingSystem: 'TAILWIND',
    projectRoot: '.',
    componentPaths: ['src/components'],
    tokenPaths: ['src/styles/tokens.css'],
    monorepoDetected: false,
    storybookDetected: false,
    confidence: 'high',
    evidence: { packageJson: true },
    rawDetectionResult: {
      globalWarnings: [],
      candidateProjectRoots: [{ path: '.', score: 20, evidence: [] }],
      detectorVersion: '1',
      analyzedAt: detectedAnalyzedAt.toISOString(),
      sourceSnapshotId: 'snapshot_1',
    },
    createdAt: latestJobUpdatedAt,
  };
}

function createConfirmedConfigurationRecord() {
  return {
    id: 'confirmed_1',
    projectId: 'project_1',
    organizationId: 'org_1',
    configurationJobId: 'job_latest',
    sourceType: 'LOCAL_UPLOAD',
    framework: 'MOBILE_WEB',
    language: 'TYPESCRIPT',
    packageManager: 'NPM',
    stylingSystem: 'TAILWIND',
    projectRoot: '.',
    componentPaths: ['src/components', 'src/features'],
    tokenPaths: ['src/styles/tokens.css'],
    notes: 'Looks right.',
    confirmedByUserId: 'user_1',
    confirmedAt: latestJobUpdatedAt,
    createdAt: latestJobUpdatedAt,
    updatedAt: latestJobUpdatedAt,
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
  projectSourceId: string | null;
  projectSource: {
    sourceSnapshotId: string | null;
  } | null;
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
      confirmedConfiguration: null,
      projectSource: null,
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

  it('fails stale active jobs before deriving configuration status', async () => {
    const prisma = createPrismaMock();
    const service = new ProjectConfigurationService(prisma as never);

    await service.getProjectConfigurationSummary({
      organizationId: 'org_1',
      projectId: 'project_1',
    });

    expect(prisma.$executeRaw).toHaveBeenCalledTimes(1);
    expect(prisma.configurationJob.findFirst).toHaveBeenCalled();
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
      rawDetectionResult: {
        framework: {
          value: 'NEXTJS',
          confidence: 'HIGH',
          evidence: [
            {
              type: 'dependency',
              path: 'package.json',
              detail: 'next dependency found.',
            },
          ],
          warnings: [],
        },
        globalWarnings: [],
        candidateProjectRoots: [{ path: '.', score: 20, evidence: [] }],
        detectorVersion: '1',
        analyzedAt: '2026-07-17T11:00:00.000Z',
        sourceSnapshotId: 'snapshot_1',
      },
      createdAt: latestJobUpdatedAt,
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
        configurationJobId: 'job_latest',
        componentPaths: ['src/components'],
        tokenPaths: ['src/styles/tokens.css'],
        setup: expect.objectContaining({
          detectorVersion: '1',
          sourceSnapshotId: 'snapshot_1',
        }),
        detectorVersion: '1',
        sourceSnapshotId: 'snapshot_1',
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

  it('persists reviewed configuration and returns a READY summary', async () => {
    const prisma = createPrismaMock();
    prisma.project.findFirst
      .mockResolvedValueOnce(
        createProjectRecord({ configurationStatus: 'REVIEW_REQUIRED' })
      )
      .mockResolvedValueOnce(
        createProjectRecord({ configurationStatus: 'READY' })
      );
    prisma.configurationJob.findFirst
      .mockResolvedValueOnce(
        createConfigurationJobRecord({ status: 'REVIEW_REQUIRED' })
      )
      .mockResolvedValueOnce(
        createConfigurationJobRecord({ status: 'COMPLETED', progress: 100 })
      );
    prisma.detectedConfiguration.findUnique.mockResolvedValue(
      createDetectedConfigurationRecord()
    );
    const service = new ProjectConfigurationService(prisma as never);

    const response = await service.confirmProjectConfiguration({
      organizationId: 'org_1',
      projectId: 'project_1',
      userId: 'user_1',
      input: {
        expectedConfigurationJobId: 'job_latest',
        expectedDetectedAt: detectedAnalyzedAt.toISOString(),
        componentPaths: ['src/components', 'src/features'],
        notes: 'Looks right.',
      },
    });

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.__tx.$queryRaw).toHaveBeenCalledTimes(1);
    expect(prisma.__tx.$executeRaw).toHaveBeenCalledTimes(2);
    expect(response.configuration.projectStatus).toBe('READY');
    expect(response.configuration.latestJobStatus).toBe('COMPLETED');
    expect(response.confirmedConfiguration).toEqual(
      expect.objectContaining({
        projectId: 'project_1',
        framework: 'MOBILE_WEB',
        componentPaths: ['src/components', 'src/features'],
        notes: 'Looks right.',
      })
    );
  });

  it('rejects stale detected-configuration confirmation', async () => {
    const prisma = createPrismaMock();
    prisma.project.findFirst.mockResolvedValue(
      createProjectRecord({ configurationStatus: 'REVIEW_REQUIRED' })
    );
    prisma.configurationJob.findFirst.mockResolvedValue(
      createConfigurationJobRecord({ status: 'REVIEW_REQUIRED' })
    );
    prisma.detectedConfiguration.findUnique.mockResolvedValue(
      createDetectedConfigurationRecord()
    );
    const service = new ProjectConfigurationService(prisma as never);

    await expect(
      service.confirmProjectConfiguration({
        organizationId: 'org_1',
        projectId: 'project_1',
        userId: 'user_1',
        input: {
          expectedConfigurationJobId: 'older_job',
        },
      })
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        errorCode: 'configuration_review_conflict',
      }),
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('rejects path traversal in confirmed configuration input', async () => {
    const service = new ProjectConfigurationService(createPrismaMock() as never);

    await expect(
      service.confirmProjectConfiguration({
        organizationId: 'org_1',
        projectId: 'project_1',
        userId: 'user_1',
        input: {
          expectedConfigurationJobId: 'job_latest',
          projectRoot: '../secret',
        },
      })
    ).rejects.toThrow('Project configuration input is invalid');
  });
});
