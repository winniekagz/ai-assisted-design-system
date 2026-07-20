import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import type {
  LocalProjectUploadResponse,
} from '@winniekagendo/componentiq-shared-types';

import { detectProjectSetup } from '../project-detection/detector-orchestrator';
import { PROJECT_DETECTOR_VERSION } from '../project-detection/detection.types';
import {
  buildManifestFromUpload,
  type UploadedSourceFile,
} from '../project-detection/source-manifest';
import { PrismaService } from '../prisma/prisma.service';
import { LocalSourceStorageService } from './local-source-storage.service';
import { ProjectConfigurationService } from './project-configuration.service';
import { failStaleConfigurationJobs } from './configuration-job-maintenance';

export type AnalyzeLocalProjectCommand = {
  organizationId: string;
  projectId: string;
  userId: string;
  files: UploadedSourceFile[];
};

const MAX_UPLOAD_FILES = 5000;
const MAX_UPLOAD_BYTES = 250 * 1024 * 1024;

type LocalImportPrisma = {
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: unknown[]): Promise<T>;
  $executeRaw(query: TemplateStringsArray | Prisma.Sql, ...values: unknown[]): Promise<number>;
  $transaction<T>(
    callback: (tx: LocalImportPrisma) => Promise<T>
  ): Promise<T>;
};

@Injectable()
export class LocalProjectImportService {
  private readonly logger = new Logger(LocalProjectImportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly localSourceStorage: LocalSourceStorageService,
    private readonly projectConfiguration: ProjectConfigurationService
  ) {}

  async analyzeLocalUpload({
    organizationId,
    projectId,
    userId,
    files,
  }: AnalyzeLocalProjectCommand): Promise<LocalProjectUploadResponse> {
    if (files.length === 0) {
      throw new BadRequestException('At least one source file is required.');
    }

    if (files.length > MAX_UPLOAD_FILES) {
      throw new BadRequestException('Source snapshot contains too many files.');
    }

    const totalBytes = files.reduce((total, file) => total + file.size, 0);
    if (totalBytes > MAX_UPLOAD_BYTES) {
      throw new BadRequestException('Source snapshot exceeds the upload size limit.');
    }

    const prisma = this.prisma as unknown as LocalImportPrisma;
    const [project] = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "Project"
      WHERE id = ${projectId} AND "organizationId" = ${organizationId}
      LIMIT 1
    `;

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await failStaleConfigurationJobs(prisma);
    const [activeJob] = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "ConfigurationJob"
      WHERE
        "projectId" = ${projectId}
        AND "organizationId" = ${organizationId}
        AND status IN (
          'PENDING'::"ConfigurationJobStatus",
          'UPLOADING'::"ConfigurationJobStatus",
          'ANALYZING'::"ConfigurationJobStatus"
        )
      ORDER BY "createdAt" DESC
      LIMIT 1
    `;

    if (activeJob) {
      throw new ConflictException('Project configuration is already in progress.');
    }

    let stage = 'CREATING_JOB';
    const started = Date.now();
    let job: { id: string } | null = null;

    try {
      const jobId = randomUUID();
      job = await prisma.$transaction(async tx => {
        const [createdJob] = await tx.$queryRaw<Array<{ id: string }>>`
          INSERT INTO "ConfigurationJob" (
            id,
            "projectId",
            "organizationId",
            "sourceType",
            status,
            progress,
            "startedAt",
            "createdAt",
            "updatedAt"
          )
          VALUES (
            ${jobId},
            ${projectId},
            ${organizationId},
            'LOCAL_UPLOAD'::"ConfigurationSourceType",
            'ANALYZING'::"ConfigurationJobStatus",
            15,
            NOW(),
            NOW(),
            NOW()
          )
          RETURNING id
        `;

        await tx.$executeRaw`
          UPDATE "Project"
          SET
            "configurationStatus" = 'CONFIGURING'::"ProjectConfigurationStatus",
            "updatedAt" = NOW()
          WHERE id = ${projectId} AND "organizationId" = ${organizationId}
        `;

        return createdJob ?? null;
      });

      if (!job) {
        throw new Error('Configuration job was not created.');
      }

      const configurationJobId = job.id;
      stage = 'BUILDING_MANIFEST';
      this.logStage(stage, organizationId, projectId, configurationJobId);
      const manifest = buildManifestFromUpload(files);
      stage = 'STORING_SOURCE_SNAPSHOT';
      const snapshot = await this.localSourceStorage.storeManifestSnapshot(manifest);
      stage = 'DETECTING_PROJECT_ROOT';
      this.logStage(stage, organizationId, projectId, configurationJobId);
      const setup = detectProjectSetup(manifest, snapshot.sourceSnapshotId);

      stage = 'SAVING_RESULTS';
      this.logStage(stage, organizationId, projectId, configurationJobId, {
        analyzedFileCount: setup.analyzedFileCount,
        ignoredFileCount: setup.ignoredFileCount,
        sourceSnapshotId: snapshot.sourceSnapshotId,
      });

      const source = await prisma.$transaction(async tx => {
        const sourceId = randomUUID();
        const [createdSource] = await tx.$queryRaw<Array<{ id: string }>>`
          INSERT INTO "ProjectSource" (
            id,
            "organizationId",
            "projectId",
            type,
            provider,
            status,
            "projectRoot",
            "sourceSnapshotId",
            "artifactPath",
            "artifactChecksum",
            "originalName",
            "fileCount",
            "totalBytes",
            "retainedUntil",
            "createdByUserId",
            "createdAt",
            "updatedAt"
          )
          VALUES (
            ${sourceId},
            ${organizationId},
            ${projectId},
            'LOCAL_UPLOAD'::"ProjectSourceType",
            'LOCAL'::"SourceProvider",
            'ACTIVE'::"SourceConnectionStatus",
            ${setup.projectRoot.value},
            ${snapshot.sourceSnapshotId},
            ${snapshot.artifactPath},
            ${snapshot.artifactChecksum},
            ${firstRootName(files)},
            ${manifest.analyzedFileCount},
            ${totalBytes},
            ${snapshot.retainedUntil},
            (SELECT id FROM "User" WHERE id = ${userId} LIMIT 1),
            NOW(),
            NOW()
          )
          RETURNING id
        `;

        await tx.$executeRaw`
          UPDATE "ConfigurationJob"
          SET
            "projectSourceId" = ${createdSource.id},
            status = 'REVIEW_REQUIRED'::"ConfigurationJobStatus",
            progress = 100,
            "completedAt" = NOW(),
            "updatedAt" = NOW()
          WHERE id = ${configurationJobId}
        `;

        await upsertDetectedConfiguration(tx, configurationJobId, setup);

        await tx.$executeRaw`
          UPDATE "Project"
          SET
            "configurationStatus" = 'REVIEW_REQUIRED'::"ProjectConfigurationStatus",
            "updatedAt" = NOW()
          WHERE id = ${projectId}
        `;

        return createdSource;
      });

      this.logger.log({
        message: 'Project detection completed',
        configurationJobId,
        projectId,
        organizationId,
        detectorVersion: PROJECT_DETECTOR_VERSION,
        sourceSnapshotId: snapshot.sourceSnapshotId,
        durationMs: Date.now() - started,
        analyzedFileCount: setup.analyzedFileCount,
        ignoredFileCount: setup.ignoredFileCount,
        resultStatus: 'REVIEW_REQUIRED',
      });

      const configuration = await this.projectConfiguration.getProjectConfigurationSummary({
        organizationId,
        projectId,
      });

      return {
        projectId,
        sourceId: source.id,
        configurationJobId,
        configuration,
      };
    } catch (error) {
      const failure = describeLocalImportFailure(error, stage);
      if (job) {
        await this.markJobFailed(job.id, failure);
      }
      this.logger.error({
        message: 'Project detection failed',
        configurationJobId: job?.id ?? null,
        projectId,
        organizationId,
        detectorVersion: PROJECT_DETECTOR_VERSION,
        stage,
        durationMs: Date.now() - started,
        errorCode: failure.code,
        errorMessage: failure.message,
        error: error instanceof Error ? error.message : 'unknown_error',
        prismaCode: getPrismaErrorCode(error),
        prismaMeta: getPrismaErrorMeta(error),
      });
      throw new BadRequestException(failure.message);
    }
  }

  private async markJobFailed(
    jobId: string,
    failure: { code: string; message: string }
  ) {
    const prisma = this.prisma as unknown as LocalImportPrisma;
    await prisma.$executeRaw`
      UPDATE "ConfigurationJob"
      SET
        status = 'FAILED'::"ConfigurationJobStatus",
        progress = 100,
        "errorCode" = ${failure.code},
        "errorMessage" = ${failure.message},
        "completedAt" = NOW(),
        "updatedAt" = NOW()
      WHERE id = ${jobId}
    `;

    await prisma.$executeRaw`
      UPDATE "Project" project
      SET
        "configurationStatus" = 'CONFIGURATION_FAILED'::"ProjectConfigurationStatus",
        "updatedAt" = NOW()
      FROM "ConfigurationJob" job
      WHERE
        job.id = ${jobId}
        AND project.id = job."projectId"
        AND project."organizationId" = job."organizationId"
    `;
  }

  private logStage(
    stage: string,
    organizationId: string,
    projectId: string,
    configurationJobId: string,
    extra: Record<string, unknown> = {}
  ) {
    this.logger.log({
      message: 'Project detection stage',
      stage,
      configurationJobId,
      projectId,
      organizationId,
      detectorVersion: PROJECT_DETECTOR_VERSION,
      ...extra,
    });
  }
}

async function upsertDetectedConfiguration(
  tx: LocalImportPrisma,
  configurationJobId: string,
  setup: ReturnType<typeof detectProjectSetup>
) {
  const setupJson = JSON.stringify(setup);
  const componentPathsJson = JSON.stringify(setup.componentPaths.value ?? []);
  const tokenPathsJson = JSON.stringify(setup.tokenPaths.value ?? []);

  await tx.$executeRaw`
    INSERT INTO "DetectedConfiguration" (
      id,
      "configurationJobId",
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
      "createdAt",
      "updatedAt"
    )
    VALUES (
      ${randomUUID()},
      ${configurationJobId},
      ${setup.framework.value},
      ${setup.language.value},
      ${setup.packageManager.value},
      ${setup.stylingSystem.value?.join(',') ?? null},
      ${setup.projectRoot.value},
      CAST(${componentPathsJson} AS jsonb),
      CAST(${tokenPathsJson} AS jsonb),
      ${setup.monorepo.value?.detected ?? false},
      ${setup.storybook.value ?? false},
      ${setup.framework.confidence},
      CAST(${setupJson} AS jsonb),
      CAST(${setupJson} AS jsonb),
      NOW(),
      NOW()
    )
    ON CONFLICT ("configurationJobId") DO UPDATE SET
      framework = EXCLUDED.framework,
      language = EXCLUDED.language,
      "packageManager" = EXCLUDED."packageManager",
      "stylingSystem" = EXCLUDED."stylingSystem",
      "projectRoot" = EXCLUDED."projectRoot",
      "componentPaths" = EXCLUDED."componentPaths",
      "tokenPaths" = EXCLUDED."tokenPaths",
      "monorepoDetected" = EXCLUDED."monorepoDetected",
      "storybookDetected" = EXCLUDED."storybookDetected",
      confidence = EXCLUDED.confidence,
      evidence = EXCLUDED.evidence,
      "rawDetectionResult" = EXCLUDED."rawDetectionResult",
      "updatedAt" = NOW()
  `;
}

function firstRootName(files: UploadedSourceFile[]): string | null {
  const first = files[0]?.originalname.replace(/\\/g, '/').split('/').filter(Boolean)[0];

  return first ?? null;
}

function describeLocalImportFailure(error: unknown, stage: string) {
  const prismaCode = getPrismaErrorCode(error);

  if (prismaCode === 'P2003') {
    return {
      code: 'source_analysis_fk_failed',
      message: `Project source could not be saved during ${stage}. A referenced record was missing.`,
    };
  }

  if (prismaCode === 'P2021') {
    return {
      code: 'source_analysis_schema_missing',
      message: 'Project source could not be analyzed because the database schema is missing required project-configuration tables.',
    };
  }

  if (prismaCode === 'P2022') {
    return {
      code: 'source_analysis_column_missing',
      message: 'Project source could not be analyzed because the database schema is missing a required project-configuration column.',
    };
  }

  if (error instanceof Error && error.message.includes('permission denied')) {
    return {
      code: 'source_snapshot_store_unavailable',
      message: 'Project source could not be analyzed because the source snapshot could not be stored.',
    };
  }

  return {
    code: 'source_analysis_failed',
    message: `Project source could not be analyzed safely during ${stage}.`,
  };
}

function getPrismaErrorCode(error: unknown) {
  if (typeof error === 'object' && error && 'code' in error) {
    const code = (error as { code?: unknown }).code;

    return typeof code === 'string' ? code : null;
  }

  return null;
}

function getPrismaErrorMeta(error: unknown) {
  if (typeof error === 'object' && error && 'meta' in error) {
    return (error as { meta?: unknown }).meta ?? null;
  }

  return null;
}
