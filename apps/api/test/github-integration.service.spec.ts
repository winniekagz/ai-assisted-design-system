import {
  BadRequestException,
  ForbiddenException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';

import { GithubAppConfigService } from '../src/integrations/github-app-config.service';
import { GithubConnectionStateService } from '../src/integrations/github-connection-state.service';
import { GithubIntegrationService } from '../src/integrations/github-integration.service';

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
} = {}) {
  return new GithubIntegrationService(
    prisma as never,
    authorization as never,
    new GithubAppConfigService(config as never),
    new GithubConnectionStateService()
  );
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
});
