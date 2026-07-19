import { createHash, randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { Injectable } from '@nestjs/common';

import type { SourceManifest } from '../project-detection/detection.types';

const RETENTION_DAYS = 7;

export type StoredSourceSnapshot = {
  sourceSnapshotId: string;
  artifactPath: string;
  artifactChecksum: string;
  retainedUntil: Date;
};

@Injectable()
export class LocalSourceStorageService {
  private readonly storageRoot = path.resolve(process.cwd(), '.componentiq', 'source-snapshots');

  async storeManifestSnapshot(
    manifest: SourceManifest
  ): Promise<StoredSourceSnapshot> {
    const sourceSnapshotId = randomUUID();
    const snapshotDirectory = path.resolve(this.storageRoot, sourceSnapshotId);

    if (!snapshotDirectory.startsWith(this.storageRoot)) {
      throw new Error('Invalid source snapshot path');
    }

    await mkdir(snapshotDirectory, { recursive: true });

    const artifactPath = path.join(snapshotDirectory, 'manifest.json');
    const serialized = JSON.stringify(manifest);
    const artifactChecksum = createHash('sha256').update(serialized).digest('hex');

    await writeFile(artifactPath, serialized, { encoding: 'utf8', mode: 0o600 });

    return {
      sourceSnapshotId,
      artifactPath,
      artifactChecksum,
      retainedUntil: new Date(Date.now() + RETENTION_DAYS * 24 * 60 * 60 * 1000),
    };
  }
}

