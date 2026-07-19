ALTER TABLE "ProjectSource"
  ADD COLUMN "sourceSnapshotId" TEXT,
  ADD COLUMN "artifactPath" TEXT,
  ADD COLUMN "artifactChecksum" TEXT,
  ADD COLUMN "originalName" TEXT,
  ADD COLUMN "fileCount" INTEGER,
  ADD COLUMN "totalBytes" INTEGER,
  ADD COLUMN "retainedUntil" TIMESTAMP(3);

CREATE INDEX "ProjectSource_sourceSnapshotId_idx" ON "ProjectSource"("sourceSnapshotId");
