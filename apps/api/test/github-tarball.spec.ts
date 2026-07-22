import { gzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';

import { SOURCE_LIMITS } from '../src/project-detection/detection.types';
import { buildManifestFromUpload } from '../src/project-detection/source-manifest';
import { extractUploadedFilesFromGithubTarball } from '../src/projects/github-tarball';

describe('GitHub tarball source acquisition', () => {
  it('extracts repository files and removes the GitHub tar root folder', () => {
    const archive = createTarGz({
      'owner-repo-sha/package.json': '{"dependencies":{"next":"latest"}}',
      'owner-repo-sha/src/Button.tsx': 'export function Button() { return null }',
    });

    const files = extractUploadedFilesFromGithubTarball(archive);

    expect(files.map(file => file.originalname)).toEqual([
      'package.json',
      'src/Button.tsx',
    ]);
    expect(files[0].buffer.toString('utf8')).toContain('next');
  });

  it('feeds existing manifest filtering for secrets and ignored folders', () => {
    const archive = createTarGz({
      'owner-repo-sha/package.json': '{"dependencies":{"react":"latest"}}',
      'owner-repo-sha/.env': 'SECRET=value',
      'owner-repo-sha/node_modules/pkg/index.js': 'ignored',
    });

    const manifest = buildManifestFromUpload(
      extractUploadedFilesFromGithubTarball(archive)
    );

    expect(manifest.entries.map(entry => entry.relativePath)).toEqual([
      'package.json',
    ]);
    expect(JSON.stringify(manifest)).not.toContain('SECRET');
    expect(manifest.ignoredFileCount).toBe(2);
  });

  it('rejects path traversal entries', () => {
    const archive = createTarGz({
      'owner-repo-sha/../escape.ts': 'escape',
    });

    expect(() => extractUploadedFilesFromGithubTarball(archive)).toThrow(
      'unsafe path'
    );
  });

  it('rejects absolute paths after the GitHub tar root', () => {
    const archive = createTarGz({
      '/etc/passwd': 'root',
    });

    expect(() => extractUploadedFilesFromGithubTarball(archive)).toThrow(
      'unsafe path'
    );
  });

  it('rejects symlink entries', () => {
    const archive = createTarGz(
      {
        'owner-repo-sha/src/link.ts': '',
      },
      { 'owner-repo-sha/src/link.ts': '2' }
    );

    expect(() => extractUploadedFilesFromGithubTarball(archive)).toThrow(
      'unsafe entry'
    );
  });

  it('rejects unsafe hard-link entries', () => {
    const archive = createTarGz(
      {
        'owner-repo-sha/src/link.ts': '',
      },
      { 'owner-repo-sha/src/link.ts': '1' }
    );

    expect(() => extractUploadedFilesFromGithubTarball(archive)).toThrow(
      'unsafe entry'
    );
  });

  it('keeps oversized individual files as metadata-only manifest entries', () => {
    const archive = createTarGz({
      'owner-repo-sha/src/large.ts': 'x'.repeat(
        SOURCE_LIMITS.maxInspectedFileBytes + 1
      ),
    });

    const manifest = buildManifestFromUpload(
      extractUploadedFilesFromGithubTarball(archive)
    );

    expect(manifest.entries).toEqual([
      expect.objectContaining({
        relativePath: 'src/large.ts',
        size: SOURCE_LIMITS.maxInspectedFileBytes + 1,
      }),
    ]);
    expect(manifest.entries[0]).not.toHaveProperty('content');
  });
});

function createTarGz(
  files: Record<string, string>,
  typeflags: Record<string, string> = {}
) {
  const blocks: Buffer[] = [];

  for (const [name, content] of Object.entries(files)) {
    const body = Buffer.from(content, 'utf8');
    blocks.push(createHeader(name, body.length, typeflags[name] ?? '0'));
    blocks.push(body);
    blocks.push(Buffer.alloc(padding(body.length)));
  }

  blocks.push(Buffer.alloc(1024));
  return gzipSync(Buffer.concat(blocks));
}

function createHeader(name: string, size: number, typeflag: string) {
  const header = Buffer.alloc(512);
  header.write(name, 0, 100, 'utf8');
  header.write('0000644\0', 100, 8, 'ascii');
  header.write('0000000\0', 108, 8, 'ascii');
  header.write('0000000\0', 116, 8, 'ascii');
  header.write(size.toString(8).padStart(11, '0') + '\0', 124, 12, 'ascii');
  header.write('00000000000\0', 136, 12, 'ascii');
  header.fill(' ', 148, 156);
  header.write(typeflag, 156, 1, 'ascii');
  header.write('ustar\0', 257, 6, 'ascii');
  header.write('00', 263, 2, 'ascii');

  const checksum = header.reduce((total, byte) => total + byte, 0);
  header.write(checksum.toString(8).padStart(6, '0') + '\0 ', 148, 8, 'ascii');

  return header;
}

function padding(size: number) {
  const remainder = size % 512;
  return remainder === 0 ? 0 : 512 - remainder;
}
