import path from 'node:path';

import type { SourceManifest, SourceManifestEntry } from './detection.types';
import { SOURCE_LIMITS } from './detection.types';

export type UploadedSourceFile = {
  originalname: string;
  buffer: Buffer;
  size: number;
};

const excludedSegments = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'coverage',
  '.cache',
  '.turbo',
  '.vercel',
  '.output',
]);

const excludedBasenames = new Set([
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  'id_rsa',
  'id_dsa',
  'id_ecdsa',
  'id_ed25519',
]);

const textExtensions = new Set([
  '.json',
  '.yaml',
  '.yml',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.mjs',
  '.cjs',
  '.vue',
  '.svelte',
  '.css',
  '.scss',
  '.sass',
  '.md',
]);

export function buildManifestFromUpload(files: UploadedSourceFile[]): SourceManifest {
  const entries: SourceManifestEntry[] = [];
  const warnings: string[] = [];
  let ignoredFileCount = 0;
  let totalBytes = 0;

  for (const file of files) {
    totalBytes += file.size;
    const normalized = normalizeRelativePath(file.originalname);

    if (!normalized || shouldIgnorePath(normalized)) {
      ignoredFileCount += 1;
      continue;
    }

    if (entries.length >= SOURCE_LIMITS.maxFiles) {
      ignoredFileCount += 1;
      continue;
    }

    if (totalBytes > SOURCE_LIMITS.maxTotalBytes) {
      warnings.push('Source snapshot exceeded the configured upload-size analysis limit.');
      ignoredFileCount += 1;
      continue;
    }

    const basename = path.posix.basename(normalized);
    const extension = path.posix.extname(normalized).toLowerCase();
    const entry: SourceManifestEntry = {
      relativePath: normalized,
      basename,
      extension,
      size: file.size,
      sourceRoot: '',
    };

    if (isSafeSmallTextFile(extension, file.size, basename)) {
      entry.content = file.buffer.toString('utf8');
    }

    entries.push(entry);
  }

  return {
    entries,
    analyzedFileCount: entries.length,
    ignoredFileCount,
    warnings,
  };
}

export function normalizeRelativePath(input: string): string | null {
  const normalized = input.replace(/\\/g, '/').replace(/^\/+/, '');
  const parts = normalized.split('/').filter(Boolean);

  if (
    normalized.startsWith('/') ||
    /^[a-zA-Z]:/.test(input) ||
    parts.some(part => part === '..')
  ) {
    return null;
  }

  return parts.join('/');
}

export function shouldIgnorePath(relativePath: string): boolean {
  const parts = relativePath.split('/');
  const basename = parts.at(-1)?.toLowerCase() ?? '';

  if (parts.some(part => excludedSegments.has(part))) {
    return true;
  }

  if (excludedBasenames.has(basename) || basename.endsWith('.pem') || basename.endsWith('.key')) {
    return true;
  }

  if (basename.endsWith('.log') || basename.endsWith('.map')) {
    return true;
  }

  return false;
}

function isSafeSmallTextFile(extension: string, size: number, basename: string): boolean {
  if (size > SOURCE_LIMITS.maxInspectedFileBytes) {
    return false;
  }

  return textExtensions.has(extension) || basename === 'package.json';
}

