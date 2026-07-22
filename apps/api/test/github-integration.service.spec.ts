import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { generateKeyPairSync } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';

import { GithubAppConfigService } from '../src/integrations/github-app-config.service';
import { GithubConnectionStateService } from '../src/integrations/github-connection-state.service';
import { GithubIntegrationService } from '../src/integrations/github-integration.service';
import {
  GithubDomainError,
  GithubRepositoryService,
} from '../src/integrations/github-repository.service';

const organization = {
  id: 'org_1',
  slug: 'acme',
};

const user = {
  id: 'user_1',
};

const ownerMembership = {
  id: 'member_1',
  role: 'OWNER',
};

const viewerMembership = {
  id: 'member_2',
  role: 'VIEWER',
};

function createPrismaMock() {
  return {
    gitProviderConnection: {
      findFirst: vi.fn().mockResolvedValue(createConnectionRecord()),
      findMany: vi.fn().mockResolvedValue([createConnectionRecord()]),
      upsert: vi.fn().mockResolvedValue(createConnectionRecord()),
      update: vi.fn().mockResolvedValue(
        createConnectionRecord({
          status: 'DISCONNECTED',
          disconnectedAt: new Date('2026-07-19T09:15:00.000Z'),
        })
      ),
    },
  };
}

function createConfigMock(overrides: Record<string, string | undefined> = {}) {
  const values: Record<string, string | undefined> = {
    GITHUB_APP_ID: '12345',
    GITHUB_APP_CLIENT_ID: 'Iv1.client',
    GITHUB_APP_PRIVATE_KEY: 'test-private-key',
    GITHUB_APP_INSTALLATION_URL: 'https://github.com/apps/componentiq/installations/new',
    GITHUB_APP_CALLBACK_URL: 'http://localhost:3001/integrations/github/callback',
    ...overrides,
  };

  return {
    get: vi.fn((key: string) => values[key]),
  };
}

function createAuthorizationMock(membership = ownerMembership) {
  return {
    resolveMembership: vi.fn().mockResolvedValue({
      organization,
      membership,
    }),
  };
}

function createService({
  prisma = createPrismaMock(),
  config = createConfigMock(),
  authorization = createAuthorizationMock(),
  repositoryService = createRepositoryServiceMock(),
} = {}) {
  return new GithubIntegrationService(
    prisma as never,
    authorization as never,
    new GithubAppConfigService(config as never),
    new GithubConnectionStateService(),
    repositoryService as never
  );
}

function createRepositoryServiceMock() {
  return {
    listInstallationRepositories: vi.fn().mockResolvedValue({
      repositories: [],
      pagination: { nextCursor: null },
    }),
  };
}

function createConnectionRecord(overrides: Partial<ConnectionRecord> = {}) {
  return {
    id: overrides.id ?? 'connection_1',
    provider: overrides.provider ?? 'GITHUB',
    installationId: overrides.installationId ?? '98765',
    accountLogin: overrides.accountLogin ?? 'acme',
    accountType: overrides.accountType ?? 'Organization',
    status: overrides.status ?? 'ACTIVE',
    installedAt: overrides.installedAt ?? new Date('2026-07-19T09:00:00.000Z'),
    lastVerifiedAt:
      overrides.lastVerifiedAt ?? new Date('2026-07-19T09:10:00.000Z'),
    disconnectedAt: overrides.disconnectedAt ?? null,
  };
}

type ConnectionRecord = {
  id: string;
  provider: 'GITHUB';
  installationId: string;
  accountLogin: string;
  accountType: string | null;
  status: 'ACTIVE' | 'DISCONNECTED' | 'REVOKED' | 'FAILED';
  installedAt: Date | null;
  lastVerifiedAt: Date | null;
  disconnectedAt: Date | null;
};

async function createSignedState(service: GithubIntegrationService) {
  const start = await service.startConnection({
    organization,
    membership: ownerMembership as never,
    user: user as never,
    returnPath: '/org/acme/projects',
  });
  const state = new URL(start.installationUrl).searchParams.get('state');

  if (!state) {
    throw new Error('Expected signed state');
  }

  return state;
}

describe('GithubIntegrationService', () => {
  it('allows an authorized user to initiate a GitHub connection', async () => {
    const service = createService();

    const response = await service.startConnection({
      organization,
      membership: ownerMembership as never,
      user: user as never,
      returnPath: '/org/acme/projects',
    });

    expect(response.provider).toBe('GITHUB');
    expect(response.installationUrl).toContain('https://github.com/apps/componentiq');
    expect(response.installationUrl).toContain('state=');
    expect(response).not.toHaveProperty('privateKey');
    expect(response).not.toHaveProperty('token');
  });

  it('rejects insufficient permission when starting a connection', async () => {
    const service = createService();

    await expect(
      service.startConnection({
        organization,
        membership: viewerMembership as never,
        user: user as never,
      })
    ).rejects.toThrow(ForbiddenException);
  });

  it('returns a safe setup error when GitHub App config is missing', async () => {
    const service = createService({
      config: createConfigMock({ GITHUB_APP_PRIVATE_KEY: undefined }),
    });

    await expect(
      service.startConnection({
        organization,
        membership: ownerMembership as never,
        user: user as never,
      })
    ).rejects.toThrow(ServiceUnavailableException);
  });

  it('callback rejects invalid state', async () => {
    const service = createService();

    await expect(
      service.completeConnection({
        user: user as never,
        state: 'invalid-state',
        installationId: '98765',
      })
    ).rejects.toThrow(BadRequestException);
  });

  it('callback rejects expired state', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-19T09:00:00.000Z'));
    const service = createService();
    const state = await createSignedState(service);

    vi.setSystemTime(new Date('2026-07-19T09:11:00.000Z'));

    await expect(
      service.completeConnection({
        user: user as never,
        state,
        installationId: '98765',
      })
    ).rejects.toThrow(BadRequestException);
    vi.useRealTimers();
  });

  it('callback derives organization from signed state and ignores client organizationId', async () => {
    const prisma = createPrismaMock();
    const authorization = createAuthorizationMock();
    const service = createService({ prisma, authorization });
    const state = await createSignedState(service);

    await expect(
      service.completeConnection({
        user: user as never,
        state,
        installationId: '98765',
        organizationIdFromClient: 'attacker_org',
      })
    ).rejects.toThrow(ForbiddenException);
    expect(prisma.gitProviderConnection.upsert).not.toHaveBeenCalled();
  });

  it('associates installation with the signed organization and handles duplicates safely', async () => {
    const prisma = createPrismaMock();
    const service = createService({ prisma });
    const state = await createSignedState(service);

    const result = await service.completeConnection({
      user: user as never,
      state,
      installationId: '98765',
      accountLogin: 'acme',
      accountType: 'Organization',
    });

    expect(prisma.gitProviderConnection.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          organizationId_installationId: {
            organizationId: 'org_1',
            installationId: '98765',
          },
        },
      })
    );
    expect(result.connection).toEqual(
      expect.objectContaining({
        provider: 'GITHUB',
        accountLogin: 'acme',
        status: 'ACTIVE',
      })
    );
    expect(JSON.stringify(prisma.gitProviderConnection.upsert.mock.calls)).not.toContain(
      'token'
    );
  });

  it('does not expose secrets in responses', async () => {
    const service = createService();

    const connections = await service.listConnections('org_1');

    expect(connections[0]).not.toHaveProperty('installationId');
    expect(connections[0]).not.toHaveProperty('privateKey');
    expect(connections[0]).not.toHaveProperty('token');
  });

  it('another tenant cannot disconnect a connection', async () => {
    const prisma = createPrismaMock();
    prisma.gitProviderConnection.findFirst.mockResolvedValue(null);
    const service = createService({ prisma });

    await expect(
      service.disconnectConnection({
        organizationId: 'other_org',
        membership: ownerMembership as never,
        connectionId: 'connection_1',
      })
    ).rejects.toThrow(BadRequestException);
    expect(prisma.gitProviderConnection.update).not.toHaveBeenCalled();
  });

  it('disconnected connection maps correctly', async () => {
    const service = createService();

    const connection = await service.disconnectConnection({
      organizationId: 'org_1',
      membership: ownerMembership as never,
      connectionId: 'connection_1',
    });

    expect(connection.status).toBe('DISCONNECTED');
    expect(connection.canDisconnect).toBe(false);
  });

  it('looks up repositories through a tenant-scoped connection', async () => {
    const prisma = createPrismaMock();
    const repositoryService = createRepositoryServiceMock();
    const service = createService({ prisma, repositoryService });

    const result = await service.listRepositories({
      organizationId: 'org_1',
      connectionId: 'connection_1',
      cursor: '2',
      perPage: 50,
    });

    expect(prisma.gitProviderConnection.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'connection_1', organizationId: 'org_1' },
      })
    );
    expect(repositoryService.listInstallationRepositories).toHaveBeenCalledWith({
      installationId: '98765',
      cursor: '2',
      perPage: 50,
    });
    expect(result).toEqual({
      repositories: [],
      pagination: { nextCursor: null },
      connection: {
        id: 'connection_1',
        accountLogin: 'acme',
        accountType: 'Organization',
        status: 'ACTIVE',
        repositoryAccess: 'UNKNOWN',
      },
      configureUrl:
        'https://github.com/organizations/acme/settings/installations/98765',
    });
  });

  it('returns a safe configure URL for an active organization connection', async () => {
    const service = createService();

    const result = await service.listRepositories({
      organizationId: 'org_1',
      connectionId: 'connection_1',
    });

    expect(result.configureUrl).toBe(
      'https://github.com/organizations/acme/settings/installations/98765'
    );
    expect(new URL(result.configureUrl).origin).toBe('https://github.com');
  });

  it('does not expose secrets in repository list responses', async () => {
    const service = createService();

    const result = await service.listRepositories({
      organizationId: 'org_1',
      connectionId: 'connection_1',
    });
    const serialized = JSON.stringify(result);

    expect(serialized).not.toContain('private-key');
    expect(serialized).not.toContain('installation-token');
    expect(serialized).not.toContain('GITHUB_APP_PRIVATE_KEY');
    expect(result.connection).not.toHaveProperty('installationId');
  });

  it('returns zero repositories as a valid response', async () => {
    const service = createService();

    const result = await service.listRepositories({
      organizationId: 'org_1',
      connectionId: 'connection_1',
    });

    expect(result.repositories).toEqual([]);
    expect(result.pagination).toEqual({ nextCursor: null });
  });

  it('preserves repository pagination metadata', async () => {
    const repositoryService = createRepositoryServiceMock();
    repositoryService.listInstallationRepositories.mockResolvedValue({
      repositories: [],
      pagination: { nextCursor: '3' },
    });
    const service = createService({ repositoryService });

    const result = await service.listRepositories({
      organizationId: 'org_1',
      connectionId: 'connection_1',
      cursor: '2',
    });

    expect(result.pagination).toEqual({ nextCursor: '3' });
  });

  it('does not list repositories for another tenant connection', async () => {
    const prisma = createPrismaMock();
    prisma.gitProviderConnection.findFirst.mockResolvedValue(null);
    const repositoryService = createRepositoryServiceMock();
    const service = createService({ prisma, repositoryService });

    await expect(
      service.listRepositories({
        organizationId: 'other_org',
        connectionId: 'connection_1',
      })
    ).rejects.toThrow(BadRequestException);
    expect(repositoryService.listInstallationRepositories).not.toHaveBeenCalled();
  });

  it('rejects inactive or revoked connections before contacting GitHub', async () => {
    const prisma = createPrismaMock();
    prisma.gitProviderConnection.findFirst.mockResolvedValue(
      createConnectionRecord({ status: 'REVOKED' })
    );
    const repositoryService = createRepositoryServiceMock();
    const service = createService({ prisma, repositoryService });

    await expect(
      service.listRepositories({
        organizationId: 'org_1',
        connectionId: 'connection_1',
      })
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        errorCode: 'source_installation_revoked',
      }),
    });
    expect(repositoryService.listInstallationRepositories).not.toHaveBeenCalled();
  });

  it('maps GitHub domain errors to safe HTTP errors', async () => {
    const repositoryService = createRepositoryServiceMock();
    repositoryService.listInstallationRepositories.mockRejectedValue(
      new GithubDomainError(
        'source_github_rate_limited',
        'GitHub API rate limit was reached.',
        429
      )
    );
    const service = createService({ repositoryService });

    await expect(
      service.listRepositories({
        organizationId: 'org_1',
        connectionId: 'connection_1',
      })
    ).rejects.toThrow(HttpException);
    await expect(
      service.listRepositories({
        organizationId: 'org_1',
        connectionId: 'connection_1',
      })
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        errorCode: 'source_github_rate_limited',
      }),
    });
  });

  it('maps temporary GitHub failures to stable HTTP errors', async () => {
    const repositoryService = createRepositoryServiceMock();
    repositoryService.listInstallationRepositories.mockRejectedValue(
      new GithubDomainError(
        'source_fetch_failed',
        'GitHub is currently unavailable. Try again in a moment.',
        503
      )
    );
    const service = createService({ repositoryService });

    await expect(
      service.listRepositories({
        organizationId: 'org_1',
        connectionId: 'connection_1',
      })
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        errorCode: 'source_fetch_failed',
      }),
      status: 503,
    });
  });
});

describe('GithubRepositoryService', () => {
  it('generates a signed GitHub App JWT', () => {
    const privateKey = createTestPrivateKey();
    const service = createRepositoryService(privateKey);

    const jwt = service.createAppJwt(1_800_000_000);
    const [encodedHeader, encodedPayload, signature] = jwt.split('.');
    const header = JSON.parse(
      Buffer.from(encodedHeader, 'base64url').toString('utf8')
    );
    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8')
    );

    expect(header).toEqual({ alg: 'RS256', typ: 'JWT' });
    expect(payload).toEqual({
      iat: 1_799_999_940,
      exp: 1_800_000_540,
      iss: '12345',
    });
    expect(signature).toBeTruthy();
  });

  it('rejects a GitHub private-key fingerprint with a useful domain error', () => {
    const service = createRepositoryService('SHA256:not-a-private-key');

    expect(() => service.createAppJwt()).toThrow(
      'Use the downloaded .pem private key'
    );
    expect(() => service.createAppJwt()).toThrow(GithubDomainError);
  });

  it('exchanges a GitHub App JWT for an ephemeral installation token', async () => {
    const fetchMock = mockFetch(
      responseJson({ token: 'installation-token', expires_at: '2026-07-21T10:00:00Z' })
    );
    const service = createRepositoryService(createTestPrivateKey());

    const token = await service.createInstallationToken('98765');

    expect(token).toBe('installation-token');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/app/installations/98765/access_tokens',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: expect.stringMatching(/^Bearer /),
        }),
      })
    );
    expect(JSON.stringify(fetchMock.mock.calls)).not.toContain('installation-token');
  });

  it('retrieves paginated installation repositories', async () => {
    const fetchMock = mockFetch(
      responseJson({ token: 'installation-token', expires_at: '2026-07-21T10:00:00Z' }),
      responseJson(
        {
          repositories: [
            {
              id: 42,
              name: 'checkout-web',
              full_name: 'acme/checkout-web',
              private: true,
              default_branch: 'main',
              updated_at: '2026-07-20T12:00:00Z',
              size: 1536,
              owner: { login: 'acme' },
            },
          ],
        },
        {
          link: '<https://api.github.com/installation/repositories?page=3>; rel="next"',
        }
      )
    );
    const service = createRepositoryService(createTestPrivateKey());

    const result = await service.listInstallationRepositories({
      installationId: '98765',
      cursor: '2',
      perPage: 50,
    });

    expect(fetchMock.mock.calls[1][0].toString()).toBe(
      'https://api.github.com/installation/repositories?per_page=50&page=2'
    );
    expect(result).toEqual({
      repositories: [
        {
          id: '42',
          owner: 'acme',
          name: 'checkout-web',
          fullName: 'acme/checkout-web',
          defaultBranch: 'main',
          private: true,
          updatedAt: '2026-07-20T12:00:00Z',
          sizeKb: 1536,
        },
      ],
      pagination: { nextCursor: '3' },
    });
  });

  it('resolves a repository ref to a commit sha', async () => {
    const fetchMock = mockFetch(
      responseJson({ token: 'installation-token', expires_at: '2026-07-21T10:00:00Z' }),
      responseJson({ sha: 'abc123' })
    );
    const service = createRepositoryService(createTestPrivateKey());

    const sha = await service.getCommitSha({
      installationId: '98765',
      owner: 'acme',
      repo: 'checkout-web',
      ref: 'main',
    });

    expect(sha).toBe('abc123');
    expect(fetchMock.mock.calls[1][0]).toBe(
      'https://api.github.com/repos/acme/checkout-web/commits/main'
    );
  });

  it('retrieves a repository tarball', async () => {
    const archive = Buffer.from('tarball');
    const fetchMock = mockFetch(
      responseJson({ token: 'installation-token', expires_at: '2026-07-21T10:00:00Z' }),
      new Response(archive)
    );
    const service = createRepositoryService(createTestPrivateKey());

    const result = await service.fetchRepositoryTarball({
      installationId: '98765',
      owner: 'acme',
      repo: 'checkout-web',
      ref: 'main',
    });

    expect(result.equals(archive)).toBe(true);
    expect(fetchMock.mock.calls[1][0]).toBe(
      'https://api.github.com/repos/acme/checkout-web/tarball/main'
    );
  });

  it.each([
    [401, 'source_installation_revoked'],
    [403, 'source_installation_revoked'],
    [404, 'source_installation_revoked'],
  ])(
    'maps installation-token HTTP %s to revoked installation',
    async (status, code) => {
      mockFetch(responseJson({ message: 'Bad credentials' }, undefined, status));
      const service = createRepositoryService(createTestPrivateKey());

      await expect(service.createInstallationToken('98765')).rejects.toMatchObject({
        code,
        status: 410,
      });
    }
  );

  it('maps repository-listing 401 responses', async () => {
    mockFetch(
      responseJson({ token: 'installation-token', expires_at: '2026-07-21T10:00:00Z' }),
      responseJson({ message: 'Bad credentials' }, undefined, 401)
    );
    const service = createRepositoryService(createTestPrivateKey());

    await expect(
      service.listInstallationRepositories({ installationId: '98765' })
    ).rejects.toMatchObject({
      code: 'source_github_unauthorized',
      status: 401,
    });
  });

  it('maps repository-listing 403 responses', async () => {
    mockFetch(
      responseJson({ token: 'installation-token', expires_at: '2026-07-21T10:00:00Z' }),
      responseJson({ message: 'Resource not accessible' }, undefined, 403)
    );
    const service = createRepositoryService(createTestPrivateKey());

    await expect(
      service.listInstallationRepositories({ installationId: '98765' })
    ).rejects.toMatchObject({
      code: 'source_installation_revoked',
      status: 410,
    });
  });

  it('maps repository-listing 404 responses', async () => {
    mockFetch(
      responseJson({ token: 'installation-token', expires_at: '2026-07-21T10:00:00Z' }),
      responseJson({ message: 'Not Found' }, undefined, 404)
    );
    const service = createRepositoryService(createTestPrivateKey());

    await expect(
      service.listInstallationRepositories({ installationId: '98765' })
    ).rejects.toMatchObject({
      code: 'source_repository_not_found',
      status: 404,
    });
  });

  it('maps GitHub rate-limit responses', async () => {
    mockFetch(
      responseJson({ token: 'installation-token', expires_at: '2026-07-21T10:00:00Z' }),
      responseJson(
        { message: 'API rate limit exceeded' },
        { 'x-ratelimit-remaining': '0' },
        403
      )
    );
    const service = createRepositoryService(createTestPrivateKey());

    await expect(
      service.listInstallationRepositories({ installationId: '98765' })
    ).rejects.toMatchObject({
      code: 'source_github_rate_limited',
      status: 429,
    });
  });

  it('maps GitHub network failures to unavailable', async () => {
    const fetchMock = vi.fn();
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    vi.stubGlobal('fetch', fetchMock);
    const service = createRepositoryService(createTestPrivateKey());

    await expect(service.createInstallationToken('98765')).rejects.toMatchObject({
      code: 'source_fetch_failed',
      status: 503,
    });
  });
});

function createRepositoryService(privateKey: string) {
  return new GithubRepositoryService(
    new GithubAppConfigService(
      createConfigMock({ GITHUB_APP_PRIVATE_KEY: privateKey }) as never
    )
  );
}

function createTestPrivateKey() {
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });

  return privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
}

function mockFetch(...responses: Response[]) {
  const fetchMock = vi.fn();
  for (const response of responses) {
    fetchMock.mockResolvedValueOnce(response);
  }
  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
}

function responseJson(
  payload: unknown,
  headers?: Record<string, string>,
  status = 200
) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
  });
}
