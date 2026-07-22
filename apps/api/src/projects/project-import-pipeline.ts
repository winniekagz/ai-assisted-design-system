import { randomUUID } from 'node:crypto';
import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { detectProjectSetup } from '../project-detection/detector-orchestrator';
import { failStaleConfigurationJobs } from './configuration-job-maintenance';

export type ProjectImportPrisma = {
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: unknown[]
  ): Promise<T>;
  $executeRaw(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: unknown[]
  ): Promise<number>;
  $transaction<T>(callback: (tx: ProjectImportPrisma) => Promise<T>): Promise<T>;
};

export async function assertNoActiveConfigurationJob(
  prisma: ProjectImportPrisma,
  organizationId: string,
  projectId: string
) {
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
}

export async function markConfigurationJobFailed(
  prisma: ProjectImportPrisma,
  jobId: string,
  failure: { code: string; message: string }
) {
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

export async function upsertDetectedConfiguration(
  tx: ProjectImportPrisma,
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

export function describeProjectImportFailure(error: unknown, stage: string) {
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
      message:
        'Project source could not be analyzed because the database schema is missing required project-configuration tables.',
    };
  }

  if (prismaCode === 'P2022') {
    return {
      code: 'source_analysis_column_missing',
      message:
        'Project source could not be analyzed because the database schema is missing a required project-configuration column.',
    };
  }

  if (error instanceof Error && error.message.includes('permission denied')) {
    return {
      code: 'source_snapshot_store_unavailable',
      message:
        'Project source could not be analyzed because the source snapshot could not be stored.',
    };
  }

  return {
    code: 'source_analysis_failed',
    message: `Project source could not be analyzed safely during ${stage}.`,
  };
}

export function getPrismaErrorCode(error: unknown) {
  if (typeof error === 'object' && error && 'code' in error) {
    const code = (error as { code?: unknown }).code;

    return typeof code === 'string' ? code : null;
  }

  return null;
}

export function getPrismaErrorMeta(error: unknown) {
  if (typeof error === 'object' && error && 'meta' in error) {
    return (error as { meta?: unknown }).meta ?? null;
  }

  return null;
}
