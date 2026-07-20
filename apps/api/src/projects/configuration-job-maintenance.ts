import { Prisma } from '@prisma/client';

export const ACTIVE_CONFIGURATION_JOB_STATUSES = [
  'PENDING',
  'UPLOADING',
  'ANALYZING',
] as const;

export const STALE_CONFIGURATION_JOB_TIMEOUT_MS = 30 * 60 * 1000;

type ConfigurationJobMaintenancePrisma = {
  $executeRaw(query: TemplateStringsArray | Prisma.Sql, ...values: unknown[]): Promise<number>;
};

export async function failStaleConfigurationJobs(
  prisma: ConfigurationJobMaintenancePrisma,
  timeoutMs = STALE_CONFIGURATION_JOB_TIMEOUT_MS
) {
  return prisma.$executeRaw`
    WITH failed_jobs AS (
      UPDATE "ConfigurationJob"
      SET
        status = 'FAILED'::"ConfigurationJobStatus",
        progress = 100,
        "errorCode" = COALESCE("errorCode", 'configuration_job_timed_out'),
        "errorMessage" = COALESCE("errorMessage", 'Configuration analysis timed out. Please retry the project setup.'),
        "completedAt" = NOW(),
        "updatedAt" = NOW()
      WHERE status IN (
        'PENDING'::"ConfigurationJobStatus",
        'UPLOADING'::"ConfigurationJobStatus",
        'ANALYZING'::"ConfigurationJobStatus"
      )
        AND "updatedAt" < NOW() - (${timeoutMs} * INTERVAL '1 millisecond')
      RETURNING id, "projectId", "organizationId"
    ),
    latest_failed_projects AS (
      SELECT DISTINCT failed_jobs."projectId", failed_jobs."organizationId"
      FROM failed_jobs
      JOIN LATERAL (
        SELECT job.id
        FROM "ConfigurationJob" job
        WHERE
          job."projectId" = failed_jobs."projectId"
          AND job."organizationId" = failed_jobs."organizationId"
        ORDER BY job."createdAt" DESC
        LIMIT 1
      ) latest_job ON latest_job.id = failed_jobs.id
    )
    UPDATE "Project" project
    SET
      "configurationStatus" = 'CONFIGURATION_FAILED'::"ProjectConfigurationStatus",
      "updatedAt" = NOW()
    WHERE EXISTS (
      SELECT 1
      FROM latest_failed_projects
      WHERE
        latest_failed_projects."projectId" = project.id
        AND latest_failed_projects."organizationId" = project."organizationId"
    )
  `;
}
