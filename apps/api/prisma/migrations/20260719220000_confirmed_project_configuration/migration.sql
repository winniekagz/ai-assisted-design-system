CREATE TABLE "ConfirmedProjectConfiguration" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "configurationJobId" TEXT,
  "sourceType" "ConfigurationSourceType",
  "framework" TEXT,
  "language" TEXT,
  "packageManager" TEXT,
  "stylingSystem" TEXT,
  "projectRoot" TEXT,
  "componentPaths" JSONB,
  "tokenPaths" JSONB,
  "notes" TEXT,
  "confirmedByUserId" TEXT,
  "confirmedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ConfirmedProjectConfiguration_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ConfirmedProjectConfiguration_projectId_key"
  ON "ConfirmedProjectConfiguration"("projectId");

CREATE INDEX "ConfirmedProjectConfiguration_organizationId_idx"
  ON "ConfirmedProjectConfiguration"("organizationId");

CREATE UNIQUE INDEX "ConfirmedProjectConfiguration_configurationJobId_key"
  ON "ConfirmedProjectConfiguration"("configurationJobId");

CREATE INDEX "ConfirmedProjectConfiguration_confirmedByUserId_idx"
  ON "ConfirmedProjectConfiguration"("confirmedByUserId");

ALTER TABLE "ConfirmedProjectConfiguration"
  ADD CONSTRAINT "ConfirmedProjectConfiguration_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConfirmedProjectConfiguration"
  ADD CONSTRAINT "ConfirmedProjectConfiguration_organizationId_fkey"
  FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConfirmedProjectConfiguration"
  ADD CONSTRAINT "ConfirmedProjectConfiguration_configurationJobId_fkey"
  FOREIGN KEY ("configurationJobId") REFERENCES "ConfigurationJob"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ConfirmedProjectConfiguration"
  ADD CONSTRAINT "ConfirmedProjectConfiguration_confirmedByUserId_fkey"
  FOREIGN KEY ("confirmedByUserId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
