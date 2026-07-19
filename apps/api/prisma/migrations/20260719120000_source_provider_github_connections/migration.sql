-- CreateEnum
CREATE TYPE "SourceProvider" AS ENUM ('LOCAL', 'GITHUB');

-- CreateEnum
CREATE TYPE "ProjectSourceType" AS ENUM ('LOCAL_UPLOAD', 'GITHUB_REPOSITORY');

-- CreateEnum
CREATE TYPE "SourceConnectionStatus" AS ENUM ('ACTIVE', 'DISCONNECTED', 'REVOKED', 'FAILED');

-- CreateEnum
CREATE TYPE "GitProviderConnectionStatus" AS ENUM ('ACTIVE', 'DISCONNECTED', 'REVOKED', 'FAILED');

-- AlterTable
ALTER TABLE "ConfigurationJob" ADD COLUMN "projectSourceId" TEXT;

-- CreateTable
CREATE TABLE "ProjectSource" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "ProjectSourceType" NOT NULL,
    "status" "SourceConnectionStatus" NOT NULL DEFAULT 'ACTIVE',
    "provider" "SourceProvider" NOT NULL,
    "providerConnectionId" TEXT,
    "repositoryId" TEXT,
    "repositoryOwner" TEXT,
    "repositoryName" TEXT,
    "repositoryFullName" TEXT,
    "defaultBranch" TEXT,
    "selectedBranch" TEXT,
    "projectRoot" TEXT,
    "latestCommitSha" TEXT,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GitProviderConnection" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "provider" "SourceProvider" NOT NULL DEFAULT 'GITHUB',
    "installationId" TEXT NOT NULL,
    "externalAccountId" TEXT,
    "accountLogin" TEXT NOT NULL,
    "accountType" TEXT,
    "status" "GitProviderConnectionStatus" NOT NULL DEFAULT 'ACTIVE',
    "connectedByUserId" TEXT,
    "installedAt" TIMESTAMP(3),
    "lastVerifiedAt" TIMESTAMP(3),
    "disconnectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitProviderConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConfigurationJob_projectSourceId_idx" ON "ConfigurationJob"("projectSourceId");

-- CreateIndex
CREATE INDEX "ProjectSource_projectId_idx" ON "ProjectSource"("projectId");

-- CreateIndex
CREATE INDEX "ProjectSource_organizationId_idx" ON "ProjectSource"("organizationId");

-- CreateIndex
CREATE INDEX "ProjectSource_organizationId_status_idx" ON "ProjectSource"("organizationId", "status");

-- CreateIndex
CREATE INDEX "ProjectSource_providerConnectionId_idx" ON "ProjectSource"("providerConnectionId");

-- CreateIndex
CREATE UNIQUE INDEX "GitProviderConnection_organizationId_installationId_key" ON "GitProviderConnection"("organizationId", "installationId");

-- CreateIndex
CREATE INDEX "GitProviderConnection_organizationId_idx" ON "GitProviderConnection"("organizationId");

-- CreateIndex
CREATE INDEX "GitProviderConnection_installationId_idx" ON "GitProviderConnection"("installationId");

-- CreateIndex
CREATE INDEX "GitProviderConnection_status_idx" ON "GitProviderConnection"("status");

-- AddForeignKey
ALTER TABLE "ConfigurationJob" ADD CONSTRAINT "ConfigurationJob_projectSourceId_fkey" FOREIGN KEY ("projectSourceId") REFERENCES "ProjectSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSource" ADD CONSTRAINT "ProjectSource_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSource" ADD CONSTRAINT "ProjectSource_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSource" ADD CONSTRAINT "ProjectSource_providerConnectionId_fkey" FOREIGN KEY ("providerConnectionId") REFERENCES "GitProviderConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSource" ADD CONSTRAINT "ProjectSource_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitProviderConnection" ADD CONSTRAINT "GitProviderConnection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitProviderConnection" ADD CONSTRAINT "GitProviderConnection_connectedByUserId_fkey" FOREIGN KEY ("connectedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
