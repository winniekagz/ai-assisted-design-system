import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { ProjectSourceAnalysisResponse } from '@winniekagendo/componentiq-shared-types';

import { GithubDomainError, GithubRepositoryService } from '../integrations/github-repository.service';
import { detectProjectSetup } from '../project-detection/detector-orchestrator';
import { PROJECT_DETECTOR_VERSION } from '../project-detection/detection.types';
import { buildManifestFromUpload } from '../project-detection/source-manifest';
import { PrismaService } from '../prisma/prisma.service';
import { extractUploadedFilesFromGithubTarball } from './github-tarball';
import { LocalSourceStorageService } from './local-source-storage.service';
import { ProjectConfigurationService } from './project-configuration.service';
import {
  assertNoActiveConfigurationJob,
  describeProjectImportFailure,
  getPrismaErrorCode,
  getPrismaErrorMeta,
  markConfigurationJobFailed,
  type ProjectImportPrisma,
  upsertDetectedConfiguration,
} from './project-import-pipeline';

export type AnalyzeGithubRepositoryCommand = {
  organizationId: string;
  projectId: string;
  userId: string;
  connectionId: string;
  repositoryId: string;
  repositoryOwner: string;
  repositoryName: string;
  defaultBranch: string;
  branch?: string;
};

type GithubConnectionRecord = {
  id: string;
  installationId: string;
  status: 'ACTIVE' | 'DISCONNECTED' | 'REVOKED' | 'FAILED';
};

@Injectable()
export class GithubProjectImportService {
  private readonly logger = new Logger(GithubProjectImportService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly githubRepository: GithubRepositoryService,
    private readonly localSourceStorage: LocalSourceStorageService,
    private readonly projectConfiguration: ProjectConfigurationService
  ) {}

  async analyzeGithubRepository({
    organizationId,
    projectId,
    userId,
    connectionId,
    repositoryId,
    repositoryOwner,
    repositoryName,
    defaultBranch,
    branch,
  }: AnalyzeGithubRepositoryCommand): Promise<ProjectSourceAnalysisResponse> {
    const prisma = this.prisma as unknown as ProjectImportPrisma;
    const [project] = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id
      FROM "Project"
      WHERE id = ${projectId} AND "organizationId" = ${organizationId}
      LIMIT 1
    `;

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const [connection] = await prisma.$queryRaw<GithubConnectionRecord[]>`
      SELECT id, "installationId", status
      FROM "GitProviderConnection"
      WHERE id = ${connectionId} AND "organizationId" = ${organizationId}
      LIMIT 1
    `;

    if (!connection) {
      throw new BadRequestException('GitHub connection not found');
    }

    if (connection.status !== 'ACTIVE') {
      throw new BadRequestException('GitHub connection is not active');
    }

    await assertNoActiveConfigurationJob(prisma, organizationId, projectId);

    let stage = 'CREATING_JOB';
    const started = Date.now();
    let job: { id: string } | null = null;

    try {
      const configurationJobId = randomUUID();
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
            ${configurationJobId},
            ${projectId},
            ${organizationId},
            'GIT_REPOSITORY'::"ConfigurationSourceType",
            'UPLOADING'::"ConfigurationJobStatus",
            10,
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

      stage = 'FETCHING_REPOSITORY';
      this.logStage(stage, organizationId, projectId, configurationJobId, {
        repositoryOwner,
        repositoryName,
      });
      const selectedBranch = branch?.trim() || defaultBranch;
      const [latestCommitSha, tarball] = await Promise.all([
        this.githubRepository.getCommitSha({
          installationId: connection.installationId,
          owner: repositoryOwner,
          repo: repositoryName,
          ref: selectedBranch,
        }),
        this.githubRepository.fetchRepositoryTarball({
          installationId: connection.installationId,
          owner: repositoryOwner,
          repo: repositoryName,
          ref: selectedBranch,
        }),
      ]);

      stage = 'EXTRACTING_REPOSITORY';
      const files = extractUploadedFilesFromGithubTarball(tarball);
      if (files.length === 0) {
        throw new Error('GitHub repository archive did not contain analyzable files.');
      }

      await prisma.$executeRaw`
        UPDATE "ConfigurationJob"
        SET
          status = 'ANALYZING'::"ConfigurationJobStatus",
          progress = 35,
          "updatedAt" = NOW()
        WHERE id = ${configurationJobId}
      `;

      stage = 'BUILDING_MANIFEST';
      const manifest = buildManifestFromUpload(files);
      stage = 'STORING_SOURCE_SNAPSHOT';
      const snapshot = await this.localSourceStorage.storeManifestSnapshot(manifest);
      stage = 'DETECTING_PROJECT_ROOT';
      const setup = detectProjectSetup(manifest, snapshot.sourceSnapshotId);
      const totalBytes = files.reduce((total, file) => total + file.size, 0);

      stage = 'SAVING_RESULTS';
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
            "providerConnectionId",
            "repositoryId",
            "repositoryOwner",
            "repositoryName",
            "repositoryFullName",
            "defaultBranch",
            "selectedBranch",
            "latestCommitSha",
            "projectRoot",
            "sourceSnapshotId",
            "artifactPath",
            "artifactChecksum",
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
            'GITHUB_REPOSITORY'::"ProjectSourceType",
            'GITHUB'::"SourceProvider",
            'ACTIVE'::"SourceConnectionStatus",
            ${connectionId},
            ${repositoryId},
            ${repositoryOwner},
            ${repositoryName},
            ${`${repositoryOwner}/${repositoryName}`},
            ${defaultBranch},
            ${selectedBranch},
            ${latestCommitSha},
            ${setup.projectRoot.value},
            ${snapshot.sourceSnapshotId},
            ${snapshot.artifactPath},
            ${snapshot.artifactChecksum},
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
        message: 'GitHub project detection completed',
        configurationJobId,
        projectId,
        organizationId,
        repositoryOwner,
        repositoryName,
        selectedBranch,
        latestCommitSha,
        detectorVersion: PROJECT_DETECTOR_VERSION,
        sourceSnapshotId: snapshot.sourceSnapshotId,
        durationMs: Date.now() - started,
        analyzedFileCount: setup.analyzedFileCount,
        ignoredFileCount: setup.ignoredFileCount,
        resultStatus: 'REVIEW_REQUIRED',
      });

      const configuration =
        await this.projectConfiguration.getProjectConfigurationSummary({
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
      const failure = describeGithubImportFailure(error, stage);
      if (job) {
        await markConfigurationJobFailed(prisma, job.id, failure);
      }
      this.logger.error({
        message: 'GitHub project detection failed',
        configurationJobId: job?.id ?? null,
        projectId,
        organizationId,
        repositoryOwner,
        repositoryName,
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
      message: 'GitHub project detection stage',
      stage,
      configurationJobId,
      projectId,
      organizationId,
      detectorVersion: PROJECT_DETECTOR_VERSION,
      ...extra,
    });
  }
}

function describeGithubImportFailure(error: unknown, stage: string) {
  if (error instanceof GithubDomainError) {
    return {
      code: error.code,
      message: error.message,
    };
  }

  if (
    error instanceof Error &&
    error.message.includes('exceeds the source analysis limit')
  ) {
    return {
      code: 'source_repository_too_large',
      message: 'GitHub repository exceeds the source analysis limit.',
    };
  }

  if (error instanceof Error && error.message.includes('archive')) {
    return {
      code: 'source_fetch_failed',
      message: 'GitHub repository archive could not be read safely.',
    };
  }

  return describeProjectImportFailure(error, stage);
}
