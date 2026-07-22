import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
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
  createConfigurationJobWithActiveGuard,
  DomainHttpException,
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
  repositoryOwner: string;
  repositoryName: string;
  branch?: string;
};

type GithubConnectionRecord = {
  id: string;
  installationId: string;
  provider: 'GITHUB' | 'LOCAL';
  status: 'ACTIVE' | 'DISCONNECTED' | 'REVOKED' | 'FAILED';
};

const TEMP_WORKSPACE_PREFIX = 'componentiq-github-';

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
    repositoryOwner,
    repositoryName,
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
      SELECT id, "installationId", provider, status
      FROM "GitProviderConnection"
      WHERE id = ${connectionId} AND "organizationId" = ${organizationId}
      LIMIT 1
    `;

    if (!connection) {
      throw new DomainHttpException(
        'github_connection_not_found',
        'GitHub connection not found.',
        400
      );
    }

    if (connection.provider !== 'GITHUB') {
      throw new DomainHttpException(
        'github_connection_not_found',
        'GitHub connection not found.',
        400
      );
    }

    if (connection.status !== 'ACTIVE') {
      throw new DomainHttpException(
        'github_connection_inactive',
        'GitHub access needs attention. Configure or reconnect GitHub access, then try again.',
        410
      );
    }

    let stage = 'CREATING_JOB';
    const started = Date.now();
    let job: { id: string } | null = null;
    let tempWorkspace: string | null = null;

    try {
      const configurationJobId = randomUUID();
      job = await createConfigurationJobWithActiveGuard(prisma, {
        id: configurationJobId,
        organizationId,
        projectId,
        sourceType: 'GIT_REPOSITORY',
        status: 'UPLOADING',
        progress: 10,
      });

      if (!job) {
        throw new Error('Configuration job was not created.');
      }

      stage = 'FETCHING_REPOSITORY';
      this.logStage(stage, organizationId, projectId, configurationJobId, {
        repositoryOwner,
        repositoryName,
      });
      const repository = await this.githubRepository.getRepository({
        installationId: connection.installationId,
        owner: repositoryOwner,
        repo: repositoryName,
      });
      const selectedBranch = branch?.trim() || repository.defaultBranch;
      const latestCommitSha = await this.githubRepository.getCommitSha({
        installationId: connection.installationId,
        owner: repository.owner,
        repo: repository.name,
        ref: selectedBranch,
      });
      const tarball = await this.githubRepository.fetchRepositoryTarball({
        installationId: connection.installationId,
        owner: repository.owner,
        repo: repository.name,
        ref: latestCommitSha,
      });
      tempWorkspace = await mkdtemp(path.join(tmpdir(), TEMP_WORKSPACE_PREFIX));
      await writeFile(path.join(tempWorkspace, 'repository.tar.gz'), tarball, {
        mode: 0o600,
      });

      stage = 'EXTRACTING_REPOSITORY';
      const files = extractUploadedFilesFromGithubTarball(tarball);
      if (files.length === 0) {
        throw new Error('GitHub repository archive did not contain analyzable files.');
      }

      const updatedToAnalyzing = await prisma.$executeRaw`
        UPDATE "ConfigurationJob"
        SET
          status = 'ANALYZING'::"ConfigurationJobStatus",
          progress = 35,
          "updatedAt" = NOW()
        WHERE id = ${configurationJobId}
          AND status = 'UPLOADING'::"ConfigurationJobStatus"
      `;
      if (updatedToAnalyzing !== 1) {
        throw new Error('Configuration job state changed before analysis could begin.');
      }

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
            ${repository.id},
            ${repository.owner},
            ${repository.name},
            ${repository.fullName},
            ${repository.defaultBranch},
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

        const updatedJob = await tx.$executeRaw`
          UPDATE "ConfigurationJob"
          SET
            "projectSourceId" = ${createdSource.id},
            status = 'REVIEW_REQUIRED'::"ConfigurationJobStatus",
            progress = 100,
            "completedAt" = NOW(),
            "updatedAt" = NOW()
          WHERE id = ${configurationJobId}
            AND "organizationId" = ${organizationId}
            AND "projectId" = ${projectId}
            AND status = 'ANALYZING'::"ConfigurationJobStatus"
        `;
        if (updatedJob !== 1) {
          throw new Error('Configuration job state changed before results could be saved.');
        }

        await upsertDetectedConfiguration(tx, configurationJobId, setup);

        await tx.$executeRaw`
          UPDATE "Project"
          SET
            "configurationStatus" = 'REVIEW_REQUIRED'::"ProjectConfigurationStatus",
            "updatedAt" = NOW()
          WHERE id = ${projectId} AND "organizationId" = ${organizationId}
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
      throw new DomainHttpException(
        failure.code,
        failure.message,
        statusForFailureCode(failure.code)
      );
    } finally {
      if (tempWorkspace) {
        try {
          await rm(tempWorkspace, { recursive: true, force: true });
        } catch {
          this.logger.error({
            message: 'GitHub temporary workspace cleanup failed',
            configurationJobId: job?.id ?? null,
            projectId,
            organizationId,
            repositoryOwner,
            repositoryName,
          });
        }
      }
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
  if (error instanceof DomainHttpException) {
    return {
      code: error.errorCode,
      message: String(error.getResponseMessage()),
    };
  }

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
      code: 'source_too_large',
      message: 'GitHub repository exceeds the source analysis limit.',
    };
  }

  if (
    error instanceof Error &&
    error.message.includes('too many files')
  ) {
    return {
      code: 'source_file_limit_exceeded',
      message: 'GitHub repository contains too many files for source analysis.',
    };
  }

  if (
    error instanceof Error &&
    error.message.includes('file that exceeds')
  ) {
    return {
      code: 'source_file_too_large',
      message: 'GitHub repository contains a file that exceeds the source analysis limit.',
    };
  }

  if (
    error instanceof Error &&
    error.message.includes('unsafe')
  ) {
    return {
      code: 'source_archive_unsafe',
      message: 'GitHub repository archive could not be read safely.',
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

function statusForFailureCode(code: string) {
  if (code === 'configuration_job_already_active') return 409;
  if (code === 'source_repository_not_found' || code === 'source_branch_not_found') {
    return 404;
  }
  if (code === 'github_connection_inactive' || code === 'source_installation_revoked') {
    return 410;
  }
  if (code === 'source_github_rate_limited') return 429;
  if (code === 'source_fetch_timeout') return 504;
  if (
    code === 'source_too_large' ||
    code === 'source_file_limit_exceeded' ||
    code === 'source_file_too_large'
  ) {
    return 413;
  }
  if (code === 'github_app_not_configured') return 503;

  return 400;
}
