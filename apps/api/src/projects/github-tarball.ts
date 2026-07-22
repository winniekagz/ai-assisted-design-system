import path from 'node:path';
import { gunzipSync } from 'node:zlib';

import type { UploadedSourceFile } from '../project-detection/source-manifest';
import { SOURCE_LIMITS } from '../project-detection/detection.types';

const TAR_BLOCK_SIZE = 512;
const MAX_ENTRY_DEPTH = 40;

export function extractUploadedFilesFromGithubTarball(
  archive: Buffer
): UploadedSourceFile[] {
  const tar = gunzipSync(archive, {
    maxOutputLength: SOURCE_LIMITS.maxTotalBytes + TAR_BLOCK_SIZE * SOURCE_LIMITS.maxFiles,
  });
  const files: UploadedSourceFile[] = [];
  let offset = 0;
  let totalBytes = 0;
  const seenPaths = new Set<string>();

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
    if (!isSafeArchivePath(fullName)) {
      throw new Error('GitHub repository archive contains an unsafe path.');
    }

    const relativeName = removeGithubTarRoot(fullName);
    const dataStart = offset + TAR_BLOCK_SIZE;
    const dataEnd = dataStart + size;

    if (dataEnd > tar.length) {
      throw new Error('GitHub repository archive is truncated.');
    }

    if (relativeName && !isSafeArchivePath(relativeName)) {
      throw new Error('GitHub repository archive contains an unsafe path.');
    }

    if (relativeName && isUnsafeEntryType(typeflag)) {
      throw new Error('GitHub repository archive contains an unsafe entry.');
    }

    if (typeflag === '0' || typeflag === '') {
      if (relativeName) {
        if (seenPaths.has(relativeName)) {
          throw new Error('GitHub repository archive contains duplicate paths.');
        }

        seenPaths.add(relativeName);
        totalBytes += size;

        if (files.length >= SOURCE_LIMITS.maxFiles) {
          throw new Error('GitHub repository contains too many files for source analysis.');
        }

        if (totalBytes > SOURCE_LIMITS.maxTotalBytes) {
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

function isSafeArchivePath(relativePath: string) {
  const normalized = relativePath.replace(/\\/g, '/');
  const parts = normalized.split('/').filter(Boolean);

  if (
    normalized.startsWith('/') ||
    /^[a-zA-Z]:/.test(normalized) ||
    parts.length > MAX_ENTRY_DEPTH ||
    parts.some(part => part === '..' || part === '.')
  ) {
    return false;
  }

  const resolved = path.posix.resolve('/', normalized);
  return resolved.startsWith('/') && !resolved.includes('/../');
}

function isUnsafeEntryType(typeflag: string) {
  return ['1', '2', '3', '4', '6'].includes(typeflag);
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
