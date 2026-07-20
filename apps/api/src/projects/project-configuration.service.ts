import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import {
  confirmProjectConfigurationSchema,
  type ConfigurationJobStatus,
  type ConfirmedProjectConfiguration,
  type ConfirmProjectConfigurationInput,
  type DetectedProjectSetup,
  type DetectedProjectConfiguration,
  type NormalizedConfirmProjectConfigurationInput,
  type ProjectConfigurationStatus,
  type ProjectConfigurationConfirmResponse,
  type ProjectConfigurationSummary,
} from '@winniekagendo/componentiq-shared-types';

import { PrismaService } from '../prisma/prisma.service';
import { failStaleConfigurationJobs } from './configuration-job-maintenance';

export type GetProjectConfigurationSummaryQuery = {
  organizationId: string;
  projectId: string;
};

export type ConfirmProjectConfigurationCommand = {
  organizationId: string;
  projectId: string;
  userId: string;
  input: ConfirmProjectConfigurationInput;
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
  projectSourceId: string | null;
  projectSource: {
    sourceSnapshotId: string | null;
  } | null;
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
  rawDetectionResult: unknown;
  createdAt: Date;
};

type ConfirmedConfigurationRecord = {
  id: string;
  projectId: string;
  organizationId: string;
  configurationJobId: string | null;
  sourceType: 'LOCAL_UPLOAD' | 'GIT_REPOSITORY' | null;
  framework: string | null;
  language: string | null;
  packageManager: string | null;
  stylingSystem: string | null;
  projectRoot: string | null;
  componentPaths: unknown;
  tokenPaths: unknown;
  notes: string | null;
  confirmedByUserId: string | null;
  confirmedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

type ProjectConfigurationPrisma = {
  project?: {
    findFirst(args: unknown): Promise<ProjectRecord | null>;
  };
  configurationJob?: {
    findFirst(args: unknown): Promise<ConfigurationJobRecord | null>;
  };
  detectedConfiguration?: {
    findUnique(args: unknown): Promise<DetectedConfigurationRecord | null>;
  };
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: unknown[]): Promise<T>;
  $executeRaw(query: TemplateStringsArray | Prisma.Sql, ...values: unknown[]): Promise<number>;
  $transaction<T>(
    callback: (tx: ProjectConfigurationPrisma) => Promise<T>
  ): Promise<T>;
};

@Injectable()
export class ProjectConfigurationService {
  private readonly logger = new Logger(ProjectConfigurationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getProjectConfigurationSummary({
    organizationId,
    projectId,
  }: GetProjectConfigurationSummaryQuery): Promise<ProjectConfigurationSummary> {
    const prisma = this.prisma as unknown as ProjectConfigurationPrisma;
    const project = await this.findProject(prisma, organizationId, projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await failStaleConfigurationJobs(prisma);
    const latestJob = await this.findLatestJob(prisma, organizationId, project.id);

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

  async confirmProjectConfiguration({
    organizationId,
    projectId,
    userId,
    input,
  }: ConfirmProjectConfigurationCommand): Promise<ProjectConfigurationConfirmResponse> {
    const parsed = confirmProjectConfigurationSchema.safeParse(input);

    if (!parsed.success) {
      throw new BadRequestException('Project configuration input is invalid.');
    }

    const prisma = this.prisma as unknown as ProjectConfigurationPrisma;
    const project = await this.findProject(prisma, organizationId, projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const latestJob = await this.findLatestJob(prisma, organizationId, project.id);

    if (!latestJob || latestJob.status !== 'REVIEW_REQUIRED') {
      throw new BadRequestException(
        'Project configuration is not ready for confirmation.'
      );
    }

    const detected = await this.findDetectedConfiguration(prisma, latestJob.id);

    if (!detected) {
      throw new BadRequestException(
        'Detected project configuration is missing. Re-run source analysis.'
      );
    }

    const confirmedValues = mergeConfirmedConfiguration(parsed.data, detected);
    const confirmedConfiguration = await prisma.$transaction(async tx => {
      const [confirmed] = await tx.$queryRaw<ConfirmedConfigurationRecord[]>`
        INSERT INTO "ConfirmedProjectConfiguration" (
          id,
          "projectId",
          "organizationId",
          "configurationJobId",
          "sourceType",
          framework,
          language,
          "packageManager",
          "stylingSystem",
          "projectRoot",
          "componentPaths",
          "tokenPaths",
          notes,
          "confirmedByUserId",
          "confirmedAt",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          ${randomUUID()},
          ${projectId},
          ${organizationId},
          ${latestJob.id},
          CAST(${latestJob.sourceType} AS "ConfigurationSourceType"),
          ${confirmedValues.framework},
          ${confirmedValues.language},
          ${confirmedValues.packageManager},
          ${confirmedValues.stylingSystem},
          ${confirmedValues.projectRoot},
          CAST(${JSON.stringify(confirmedValues.componentPaths)} AS jsonb),
          CAST(${JSON.stringify(confirmedValues.tokenPaths)} AS jsonb),
          ${confirmedValues.notes},
          (SELECT id FROM "User" WHERE id = ${userId} LIMIT 1),
          NOW(),
          NOW(),
          NOW()
        )
        ON CONFLICT ("projectId") DO UPDATE SET
          "organizationId" = EXCLUDED."organizationId",
          "configurationJobId" = EXCLUDED."configurationJobId",
          "sourceType" = EXCLUDED."sourceType",
          framework = EXCLUDED.framework,
          language = EXCLUDED.language,
          "packageManager" = EXCLUDED."packageManager",
          "stylingSystem" = EXCLUDED."stylingSystem",
          "projectRoot" = EXCLUDED."projectRoot",
          "componentPaths" = EXCLUDED."componentPaths",
          "tokenPaths" = EXCLUDED."tokenPaths",
          notes = EXCLUDED.notes,
          "confirmedByUserId" = EXCLUDED."confirmedByUserId",
          "confirmedAt" = NOW(),
          "updatedAt" = NOW()
        RETURNING
          id,
          "projectId",
          "organizationId",
          "configurationJobId",
          "sourceType",
          framework,
          language,
          "packageManager",
          "stylingSystem",
          "projectRoot",
          "componentPaths",
          "tokenPaths",
          notes,
          "confirmedByUserId",
          "confirmedAt",
          "createdAt",
          "updatedAt"
      `;

      if (!confirmed) {
        throw new Error('Confirmed project configuration was not saved.');
      }

      await tx.$executeRaw`
        UPDATE "ConfigurationJob"
        SET
          status = 'COMPLETED'::"ConfigurationJobStatus",
          progress = 100,
          "completedAt" = NOW(),
          "updatedAt" = NOW()
        WHERE
          id = ${latestJob.id}
          AND "projectId" = ${projectId}
          AND "organizationId" = ${organizationId}
      `;

      await tx.$executeRaw`
        UPDATE "Project"
        SET
          framework = ${confirmedValues.framework ?? 'Not configured'},
          "packageManager" = ${confirmedValues.packageManager ?? 'Not configured'},
          "stylingSystem" = ${confirmedValues.stylingSystem ?? 'Not configured'},
          "configurationStatus" = 'READY'::"ProjectConfigurationStatus",
          "updatedAt" = NOW()
        WHERE id = ${projectId} AND "organizationId" = ${organizationId}
      `;

      return mapConfirmedConfiguration(confirmed);
    });

    const configuration = await this.getProjectConfigurationSummary({
      organizationId,
      projectId,
    });

    return {
      configuration,
      confirmedConfiguration,
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
    const detected = await this.findDetectedConfiguration(prisma, latestJobId);

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
      setup: detectedProjectSetupFromJson(detected.rawDetectionResult),
      warnings: detectedProjectSetupFromJson(detected.rawDetectionResult)?.globalWarnings ?? [],
      candidateProjectRoots:
        detectedProjectSetupFromJson(detected.rawDetectionResult)
          ?.candidateProjectRoots ?? [],
      detectorVersion:
        detectedProjectSetupFromJson(detected.rawDetectionResult)?.detectorVersion ??
        null,
      analyzedAt:
        detectedProjectSetupFromJson(detected.rawDetectionResult)?.analyzedAt ??
        detected.createdAt.toISOString(),
      sourceSnapshotId:
        detectedProjectSetupFromJson(detected.rawDetectionResult)
          ?.sourceSnapshotId ?? null,
    };
  }

  private async findProject(
    prisma: ProjectConfigurationPrisma,
    organizationId: string,
    projectId: string
  ) {
    if (prisma.project) {
      try {
        return await prisma.project.findFirst({
          where: { id: projectId, organizationId },
          select: {
            id: true,
            configurationStatus: true,
            updatedAt: true,
          },
        });
      } catch (error) {
        if (!isStalePrismaClientError(error)) throw error;
        this.logStalePrismaFallback('Project.findFirst', {
          organizationId,
          projectId,
        });
      }
    }

    return (
      await prisma.$queryRaw<ProjectRecord[]>`
        SELECT id, "configurationStatus", "updatedAt"
        FROM "Project"
        WHERE id = ${projectId} AND "organizationId" = ${organizationId}
        LIMIT 1
      `
    )[0] ?? null;
  }

  private async findLatestJob(
    prisma: ProjectConfigurationPrisma,
    organizationId: string,
    projectId: string
  ) {
    if (prisma.configurationJob) {
      try {
        return await prisma.configurationJob.findFirst({
          where: { projectId, organizationId },
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
            projectSourceId: true,
            projectSource: {
              select: {
                sourceSnapshotId: true,
              },
            },
            updatedAt: true,
          },
        });
      } catch (error) {
        if (!isStalePrismaClientError(error)) throw error;
        this.logStalePrismaFallback('ConfigurationJob.findFirst', {
          organizationId,
          projectId,
        });
      }
    }

    return (
      await prisma.$queryRaw<ConfigurationJobRecord[]>`
        SELECT
          job.id,
          job."projectId",
          job."organizationId",
          job."sourceType",
          job.status,
          job.progress,
          job."errorCode",
          job."errorMessage",
          job."projectSourceId",
          job."updatedAt",
          source."sourceSnapshotId"
        FROM "ConfigurationJob" job
        LEFT JOIN "ProjectSource" source ON source.id = job."projectSourceId"
        WHERE job."projectId" = ${projectId} AND job."organizationId" = ${organizationId}
        ORDER BY job."createdAt" DESC
        LIMIT 1
      `
    )[0] ?? null;
  }

  private async findDetectedConfiguration(
    prisma: ProjectConfigurationPrisma,
    latestJobId: string
  ) {
    if (prisma.detectedConfiguration) {
      try {
        return await prisma.detectedConfiguration.findUnique({
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
            rawDetectionResult: true,
            createdAt: true,
          },
        });
      } catch (error) {
        if (!isStalePrismaClientError(error)) throw error;
        this.logStalePrismaFallback('DetectedConfiguration.findUnique', {
          configurationJobId: latestJobId,
        });
      }
    }

    return (
      await prisma.$queryRaw<DetectedConfigurationRecord[]>`
        SELECT
          framework,
          language,
          "packageManager",
          "stylingSystem",
          "projectRoot",
          "componentPaths",
          "tokenPaths",
          "monorepoDetected",
          "storybookDetected",
          confidence,
          evidence,
          "rawDetectionResult",
          "createdAt"
        FROM "DetectedConfiguration"
        WHERE "configurationJobId" = ${latestJobId}
        LIMIT 1
      `
    )[0] ?? null;
  }

  private logStalePrismaFallback(
    operation: string,
    context: Record<string, string>
  ) {
    this.logger.warn({
      message: 'Prisma client is stale; using raw SQL fallback',
      operation,
      ...context,
    });
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

function detectedProjectSetupFromJson(value: unknown): DetectedProjectSetup | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  return value as DetectedProjectSetup;
}

function mergeConfirmedConfiguration(
  input: NormalizedConfirmProjectConfigurationInput,
  detected: DetectedConfigurationRecord
) {
  return {
    framework: input.framework ?? detected.framework,
    language: input.language ?? detected.language,
    packageManager: input.packageManager ?? detected.packageManager,
    stylingSystem: input.stylingSystem ?? detected.stylingSystem,
    projectRoot: input.projectRoot ?? detected.projectRoot,
    componentPaths:
      input.componentPaths ?? stringArrayFromJson(detected.componentPaths),
    tokenPaths: input.tokenPaths ?? stringArrayFromJson(detected.tokenPaths),
    notes: input.notes ?? null,
  };
}

function mapConfirmedConfiguration(
  configuration: ConfirmedConfigurationRecord
): ConfirmedProjectConfiguration {
  return {
    id: configuration.id,
    projectId: configuration.projectId,
    organizationId: configuration.organizationId,
    configurationJobId: configuration.configurationJobId,
    sourceType: configuration.sourceType,
    framework: configuration.framework,
    language: configuration.language,
    packageManager: configuration.packageManager,
    stylingSystem: configuration.stylingSystem,
    projectRoot: configuration.projectRoot,
    componentPaths: stringArrayFromJson(configuration.componentPaths),
    tokenPaths: stringArrayFromJson(configuration.tokenPaths),
    notes: configuration.notes,
    confirmedByUserId: configuration.confirmedByUserId,
    confirmedAt: configuration.confirmedAt.toISOString(),
    createdAt: configuration.createdAt.toISOString(),
    updatedAt: configuration.updatedAt.toISOString(),
  };
}

function isStalePrismaClientError(error: unknown) {
  return (
    error instanceof Error &&
    (error.message.includes('Unknown field') ||
      error.message.includes('Cannot read properties of undefined'))
  );
}
