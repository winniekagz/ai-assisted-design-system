import { gunzipSync } from 'node:zlib';

import type { UploadedSourceFile } from '../project-detection/source-manifest';
import { SOURCE_LIMITS } from '../project-detection/detection.types';

const TAR_BLOCK_SIZE = 512;

export function extractUploadedFilesFromGithubTarball(
  archive: Buffer
): UploadedSourceFile[] {
  const tar = gunzipSync(archive);
  const files: UploadedSourceFile[] = [];
  let offset = 0;
  let totalBytes = 0;

  while (offset + TAR_BLOCK_SIZE <= tar.length) {
    const header = tar.subarray(offset, offset + TAR_BLOCK_SIZE);
    if (isEmptyBlock(header)) {
      break;
    }

    const name = readString(header, 0, 100);
    const prefix = readString(header, 345, 155);
    const typeflag = readString(header, 156, 1);
    const size = readOctal(header, 124, 12);
    const fullName = [prefix, name].filter(Boolean).join('/');
    const dataStart = offset + TAR_BLOCK_SIZE;
    const dataEnd = dataStart + size;

    if (dataEnd > tar.length) {
      throw new Error('GitHub repository archive is truncated.');
    }

    if (typeflag === '0' || typeflag === '') {
      const relativeName = removeGithubTarRoot(fullName);
      if (relativeName) {
        totalBytes += size;
        if (
          files.length >= SOURCE_LIMITS.maxFiles ||
          totalBytes > SOURCE_LIMITS.maxTotalBytes
        ) {
          throw new Error('GitHub repository exceeds the source analysis limit.');
        }

        files.push({
          originalname: relativeName,
          buffer: Buffer.from(tar.subarray(dataStart, dataEnd)),
          size,
        });
      }
    }

    offset = dataStart + Math.ceil(size / TAR_BLOCK_SIZE) * TAR_BLOCK_SIZE;
  }

  return files;
}

function removeGithubTarRoot(path: string) {
  const parts = path.split('/').filter(Boolean);
  parts.shift();

  return parts.join('/');
}

function isEmptyBlock(block: Buffer) {
  return block.every(byte => byte === 0);
}

function readString(block: Buffer, start: number, length: number) {
  return block
    .subarray(start, start + length)
    .toString('utf8')
    .replace(/\0.*$/, '')
    .trim();
}

function readOctal(block: Buffer, start: number, length: number) {
  const raw = readString(block, start, length);
  if (!raw) return 0;

  return Number.parseInt(raw, 8);
}
