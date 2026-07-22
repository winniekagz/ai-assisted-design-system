import { gzipSync } from 'node:zlib';
import { describe, expect, it, vi } from 'vitest';

import { GithubProjectImportService } from '../src/projects/github-project-import.service';
import { DomainHttpException } from '../src/projects/project-import-pipeline';

function createPrismaMock() {
  const prisma = {
    $queryRaw: vi.fn(),
    $executeRaw: vi.fn().mockResolvedValue(1),
    $transaction: vi.fn((callback: (tx: typeof prisma) => unknown) =>
      callback(prisma)
    ),
  };

  prisma.$queryRaw
    .mockResolvedValueOnce([{ id: 'project_1' }])
    .mockResolvedValueOnce([
      {
        id: 'connection_1',
        installationId: '98765',
        provider: 'GITHUB',
        status: 'ACTIVE',
      },
    ])
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce([{ id: 'job_1' }])
    .mockResolvedValueOnce([{ id: 'source_1' }]);

  return prisma;
}

function createGithubMock() {
  return {
    getRepository: vi.fn().mockResolvedValue({
      id: '42',
      owner: 'acme',
      name: 'checkout-web',
      fullName: 'acme/checkout-web',
      defaultBranch: 'main',
      private: true,
      updatedAt: '2026-07-20T12:00:00Z',
      sizeKb: 1536,
    }),
    getCommitSha: vi.fn().mockResolvedValue('abc123'),
    fetchRepositoryTarball: vi.fn().mockResolvedValue(
      createTarGz({
        'owner-repo-sha/package.json':
          '{"dependencies":{"next":"latest","typescript":"latest"}}',
        'owner-repo-sha/src/Button.tsx': 'export function Button() { return null }',
      })
    ),
  };
}

function createService({
  prisma = createPrismaMock(),
  github = createGithubMock(),
  storage = {
    storeManifestSnapshot: vi.fn().mockResolvedValue({
      sourceSnapshotId: 'snapshot_1',
      artifactPath: '.componentiq/source-snapshots/snapshot_1/manifest.json',
      artifactChecksum: 'checksum',
      retainedUntil: new Date('2026-07-29T00:00:00.000Z'),
    }),
  },
  configuration = {
    getProjectConfigurationSummary: vi.fn().mockResolvedValue({
      projectId: 'project_1',
      projectStatus: 'REVIEW_REQUIRED',
      latestJobId: 'job_1',
      latestJobStatus: 'REVIEW_REQUIRED',
      sourceType: 'GIT_REPOSITORY',
      progress: 100,
      requiresReview: true,
      canRetry: false,
      lastError: null,
      detectedConfiguration: null,
      updatedAt: '2026-07-20T12:00:00.000Z',
    }),
  },
} = {}) {
  return {
    service: new GithubProjectImportService(
      prisma as never,
      github as never,
      storage as never,
      configuration as never
    ),
    prisma,
    github,
    storage,
    configuration,
  };
}

const command = {
  organizationId: 'org_1',
  projectId: 'project_1',
  userId: 'user_1',
  connectionId: 'connection_1',
  repositoryOwner: 'acme',
  repositoryName: 'checkout-web',
};

describe('GithubProjectImportService', () => {
  it('analyzes an organization-scoped GitHub repository at an immutable commit', async () => {
    const { service, prisma, github, storage } = createService();

    const result = await service.analyzeGithubRepository(command);

    expect(github.getRepository).toHaveBeenCalledWith({
      installationId: '98765',
      owner: 'acme',
      repo: 'checkout-web',
    });
    expect(github.getCommitSha).toHaveBeenCalledWith({
      installationId: '98765',
      owner: 'acme',
      repo: 'checkout-web',
      ref: 'main',
    });
    expect(github.fetchRepositoryTarball).toHaveBeenCalledWith({
      installationId: '98765',
      owner: 'acme',
      repo: 'checkout-web',
      ref: 'abc123',
    });
    expect(storage.storeManifestSnapshot).toHaveBeenCalledWith(
      expect.objectContaining({
        analyzedFileCount: 2,
      })
    );
    expect(JSON.stringify(prisma.$queryRaw.mock.calls)).toContain(
      'GITHUB_REPOSITORY'
    );
    expect(JSON.stringify(prisma.$queryRaw.mock.calls)).toContain('abc123');
    expect(JSON.stringify(prisma.$queryRaw.mock.calls)).not.toContain(
      'installation-token'
    );
    expect(result).toEqual(
      expect.objectContaining({
        projectId: 'project_1',
        sourceId: 'source_1',
        configurationJobId: expect.any(String),
      })
    );
  });

  it('resolves the default branch when the client does not provide one', async () => {
    const { service, github } = createService();

    await service.analyzeGithubRepository(command);

    expect(github.getCommitSha).toHaveBeenCalledWith(
      expect.objectContaining({ ref: 'main' })
    );
  });

  it('uses an explicitly selected branch when provided', async () => {
    const { service, github } = createService();

    await service.analyzeGithubRepository({ ...command, branch: 'release' });

    expect(github.getCommitSha).toHaveBeenCalledWith(
      expect.objectContaining({ ref: 'release' })
    );
  });

  it('rejects a connection from another organization before contacting GitHub', async () => {
    const prisma = createPrismaMock();
    prisma.$queryRaw.mockReset();
    prisma.$queryRaw
      .mockResolvedValueOnce([{ id: 'project_1' }])
      .mockResolvedValueOnce([]);
    const { service, github } = createService({ prisma });

    await expect(service.analyzeGithubRepository(command)).rejects.toMatchObject({
      errorCode: 'github_connection_not_found',
    });
    expect(github.getRepository).not.toHaveBeenCalled();
  });

  it('rejects inactive or revoked GitHub connections before contacting GitHub', async () => {
    const prisma = createPrismaMock();
    prisma.$queryRaw.mockReset();
    prisma.$queryRaw
      .mockResolvedValueOnce([{ id: 'project_1' }])
      .mockResolvedValueOnce([
        {
          id: 'connection_1',
          installationId: '98765',
          provider: 'GITHUB',
          status: 'REVOKED',
        },
      ]);
    const { service, github } = createService({ prisma });

    await expect(service.analyzeGithubRepository(command)).rejects.toMatchObject({
      errorCode: 'github_connection_inactive',
    });
    expect(github.getRepository).not.toHaveBeenCalled();
  });

  it('rejects an active configuration job under the transaction guard', async () => {
    const prisma = createPrismaMock();
    prisma.$queryRaw.mockReset();
    prisma.$queryRaw
      .mockResolvedValueOnce([{ id: 'project_1' }])
      .mockResolvedValueOnce([
        {
          id: 'connection_1',
          installationId: '98765',
          provider: 'GITHUB',
          status: 'ACTIVE',
        },
      ])
      .mockResolvedValueOnce([{ id: 'job_active' }]);
    const { service, github } = createService({ prisma });

    const result = service.analyzeGithubRepository(command);

    await expect(result).rejects.toBeInstanceOf(DomainHttpException);
    await expect(result).rejects.toMatchObject({
      errorCode: 'configuration_job_already_active',
    });
    expect(github.getRepository).not.toHaveBeenCalled();
  });
});

function createTarGz(files: Record<string, string>) {
  const blocks: Buffer[] = [];

  for (const [name, content] of Object.entries(files)) {
    const body = Buffer.from(content, 'utf8');
    blocks.push(createHeader(name, body.length));
    blocks.push(body);
    blocks.push(Buffer.alloc(padding(body.length)));
  }

  blocks.push(Buffer.alloc(1024));
  return gzipSync(Buffer.concat(blocks));
}

function createHeader(name: string, size: number) {
  const header = Buffer.alloc(512);
  header.write(name, 0, 100, 'utf8');
  header.write('0000644\0', 100, 8, 'ascii');
  header.write('0000000\0', 108, 8, 'ascii');
  header.write('0000000\0', 116, 8, 'ascii');
  header.write(size.toString(8).padStart(11, '0') + '\0', 124, 12, 'ascii');
  header.write('00000000000\0', 136, 12, 'ascii');
  header.fill(' ', 148, 156);
  header.write('0', 156, 1, 'ascii');
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
