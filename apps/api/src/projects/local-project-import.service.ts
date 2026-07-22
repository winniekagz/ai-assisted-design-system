import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
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
import {
  createConfigurationJobWithActiveGuard,
  DomainHttpException,
  describeProjectImportFailure,
  getPrismaErrorCode,
  getPrismaErrorMeta,
  markConfigurationJobFailed,
  type ProjectImportPrisma,
  upsertDetectedConfiguration,
} from './project-import-pipeline';

export type AnalyzeLocalProjectCommand = {
  organizationId: string;
  projectId: string;
  userId: string;
  files: UploadedSourceFile[];
};

const MAX_UPLOAD_FILES = 5000;
const MAX_UPLOAD_BYTES = 250 * 1024 * 1024;

type LocalImportPrisma = ProjectImportPrisma;

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

    let stage = 'CREATING_JOB';
    const started = Date.now();
    let job: { id: string } | null = null;

    try {
      const jobId = randomUUID();
      job = await createConfigurationJobWithActiveGuard(prisma, {
        id: jobId,
        organizationId,
        projectId,
        sourceType: 'LOCAL_UPLOAD',
        status: 'ANALYZING',
        progress: 15,
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
      if (error instanceof DomainHttpException && !job) {
        throw error;
      }

      const failure = describeProjectImportFailure(error, stage);
      if (job) {
        await markConfigurationJobFailed(prisma, job.id, failure);
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

function firstRootName(files: UploadedSourceFile[]): string | null {
  const first = files[0]?.originalname.replace(/\\/g, '/').split('/').filter(Boolean)[0];

  return first ?? null;
}
