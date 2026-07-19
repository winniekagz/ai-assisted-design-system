import { Injectable, NotFoundException } from '@nestjs/common';
import {
  type ConfigurationJobStatus,
  type DetectedProjectConfiguration,
  type ProjectConfigurationStatus,
  type ProjectConfigurationSummary,
} from '@winniekagendo/componentiq-shared-types';

import { PrismaService } from '../prisma/prisma.service';

export type GetProjectConfigurationSummaryQuery = {
  organizationId: string;
  projectId: string;
};

type ProjectRecord = {
  id: string;
  configurationStatus: ProjectConfigurationStatus;
  updatedAt: Date;
};

type ConfigurationJobRecord = {
  id: string;
  projectId: string;
  organizationId: string;
  sourceType: 'LOCAL_UPLOAD' | 'GIT_REPOSITORY';
  status: ConfigurationJobStatus;
  progress: number | null;
  errorCode: string | null;
  errorMessage: string | null;
  updatedAt: Date;
};

type DetectedConfigurationRecord = {
  framework: string | null;
  language: string | null;
  packageManager: string | null;
  stylingSystem: string | null;
  projectRoot: string | null;
  componentPaths: unknown;
  tokenPaths: unknown;
  monorepoDetected: boolean;
  storybookDetected: boolean;
  confidence: string | null;
  evidence: unknown;
};

type ProjectConfigurationPrisma = {
  project: {
    findFirst(args: unknown): Promise<ProjectRecord | null>;
  };
  configurationJob: {
    findFirst(args: unknown): Promise<ConfigurationJobRecord | null>;
  };
  detectedConfiguration: {
    findUnique(args: unknown): Promise<DetectedConfigurationRecord | null>;
  };
};

@Injectable()
export class ProjectConfigurationService {
  constructor(private readonly prisma: PrismaService) {}

  async getProjectConfigurationSummary({
    organizationId,
    projectId,
  }: GetProjectConfigurationSummaryQuery): Promise<ProjectConfigurationSummary> {
    const prisma = this.prisma as unknown as ProjectConfigurationPrisma;
    const project = await prisma.project.findFirst({
      where: { id: projectId, organizationId },
      select: {
        id: true,
        configurationStatus: true,
        updatedAt: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const latestJob = await prisma.configurationJob.findFirst({
      where: { projectId: project.id, organizationId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        projectId: true,
        organizationId: true,
        sourceType: true,
        status: true,
        progress: true,
        errorCode: true,
        errorMessage: true,
        updatedAt: true,
      },
    });

    const projectStatus = getProjectStatus(project.configurationStatus, latestJob?.status);
    const detectedConfiguration = await this.getDetectedConfigurationIfNeeded(
      latestJob?.id,
      projectStatus
    );
    const lastError =
      latestJob?.status === 'FAILED' || projectStatus === 'CONFIGURATION_FAILED'
        ? {
            code: latestJob?.errorCode ?? null,
            message: latestJob?.errorMessage ?? null,
          }
        : null;

    return {
      projectId: project.id,
      projectStatus,
      latestJobId: latestJob?.id ?? null,
      latestJobStatus: latestJob?.status ?? null,
      sourceType: latestJob?.sourceType ?? null,
      progress: latestJob?.progress ?? null,
      requiresReview: projectStatus === 'REVIEW_REQUIRED',
      canRetry: projectStatus === 'CONFIGURATION_FAILED',
      lastError,
      detectedConfiguration,
      updatedAt: (latestJob?.updatedAt ?? project.updatedAt).toISOString(),
    };
  }

  private async getDetectedConfigurationIfNeeded(
    latestJobId: string | undefined,
    projectStatus: ProjectConfigurationStatus
  ): Promise<DetectedProjectConfiguration | null> {
    if (!latestJobId || !['REVIEW_REQUIRED', 'READY'].includes(projectStatus)) {
      return null;
    }

    const prisma = this.prisma as unknown as ProjectConfigurationPrisma;
    const detected = await prisma.detectedConfiguration.findUnique({
      where: { configurationJobId: latestJobId },
      select: {
        framework: true,
        language: true,
        packageManager: true,
        stylingSystem: true,
        projectRoot: true,
        componentPaths: true,
        tokenPaths: true,
        monorepoDetected: true,
        storybookDetected: true,
        confidence: true,
        evidence: true,
      },
    });

    if (!detected) {
      return null;
    }

    return {
      framework: detected.framework,
      language: detected.language,
      packageManager: detected.packageManager,
      stylingSystem: detected.stylingSystem,
      projectRoot: detected.projectRoot,
      componentPaths: stringArrayFromJson(detected.componentPaths),
      tokenPaths: stringArrayFromJson(detected.tokenPaths),
      monorepoDetected: detected.monorepoDetected,
      storybookDetected: detected.storybookDetected,
      confidence: detected.confidence,
      evidence: detected.evidence ?? null,
    };
  }
}

function getProjectStatus(
  currentStatus: ProjectConfigurationStatus,
  latestJobStatus: ConfigurationJobStatus | undefined
): ProjectConfigurationStatus {
  if (currentStatus === 'ARCHIVED') {
    return 'ARCHIVED';
  }

  if (!latestJobStatus) {
    return currentStatus;
  }

  if (['PENDING', 'UPLOADING', 'ANALYZING'].includes(latestJobStatus)) {
    return 'CONFIGURING';
  }

  if (latestJobStatus === 'REVIEW_REQUIRED') {
    return 'REVIEW_REQUIRED';
  }

  if (latestJobStatus === 'COMPLETED') {
    return 'READY';
  }

  if (latestJobStatus === 'FAILED') {
    return 'CONFIGURATION_FAILED';
  }

  return currentStatus;
}

function stringArrayFromJson(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}
