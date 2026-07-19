-- CreateEnum
CREATE TYPE "ProjectConfigurationStatus" AS ENUM ('NOT_CONFIGURED', 'CONFIGURING', 'REVIEW_REQUIRED', 'READY', 'CONFIGURATION_FAILED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ConfigurationSourceType" AS ENUM ('LOCAL_UPLOAD', 'GIT_REPOSITORY');

-- CreateEnum
CREATE TYPE "ConfigurationJobStatus" AS ENUM ('PENDING', 'UPLOADING', 'ANALYZING', 'REVIEW_REQUIRED', 'COMPLETED', 'FAILED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "configurationStatus" "ProjectConfigurationStatus" NOT NULL DEFAULT 'NOT_CONFIGURED';

-- CreateTable
CREATE TABLE "ConfigurationJob" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "sourceType" "ConfigurationSourceType" NOT NULL,
    "status" "ConfigurationJobStatus" NOT NULL DEFAULT 'PENDING',
    "progress" INTEGER,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfigurationJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetectedConfiguration" (
    "id" TEXT NOT NULL,
    "configurationJobId" TEXT NOT NULL,
    "framework" TEXT,
    "language" TEXT,
    "packageManager" TEXT,
    "stylingSystem" TEXT,
    "projectRoot" TEXT,
    "componentPaths" JSONB,
    "tokenPaths" JSONB,
    "monorepoDetected" BOOLEAN NOT NULL DEFAULT false,
    "storybookDetected" BOOLEAN NOT NULL DEFAULT false,
    "confidence" TEXT,
    "evidence" JSONB,
    "rawDetectionResult" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetectedConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Project_organizationId_configurationStatus_idx" ON "Project"("organizationId", "configurationStatus");

-- CreateIndex
CREATE INDEX "ConfigurationJob_projectId_idx" ON "ConfigurationJob"("projectId");

-- CreateIndex
CREATE INDEX "ConfigurationJob_projectId_createdAt_idx" ON "ConfigurationJob"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "ConfigurationJob_organizationId_idx" ON "ConfigurationJob"("organizationId");

-- CreateIndex
CREATE INDEX "ConfigurationJob_status_idx" ON "ConfigurationJob"("status");

-- CreateIndex
CREATE UNIQUE INDEX "DetectedConfiguration_configurationJobId_key" ON "DetectedConfiguration"("configurationJobId");

-- AddForeignKey
ALTER TABLE "ConfigurationJob" ADD CONSTRAINT "ConfigurationJob_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigurationJob" ADD CONSTRAINT "ConfigurationJob_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetectedConfiguration" ADD CONSTRAINT "DetectedConfiguration_configurationJobId_fkey" FOREIGN KEY ("configurationJobId") REFERENCES "ConfigurationJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
