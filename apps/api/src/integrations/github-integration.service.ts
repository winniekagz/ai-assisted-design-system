import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import type { OrganizationMember } from '@prisma/client';
import type {
  GitHubConnectionCallbackResult,
  GitHubConnectionStartResponse,
  GitHubRepositoryListResponse,
  GitProviderConnectionSummary,
} from '@winniekagendo/componentiq-shared-types';

import { PrismaService } from '../prisma/prisma.service';
import { hasPermission, PERMISSIONS } from '../authorization/permissions';
import { AuthorizationService } from '../authorization/authorization.service';
import { GithubAppConfigService } from './github-app-config.service';
import { GithubConnectionStateService } from './github-connection-state.service';
import {
  buildGithubInstallationConfigureUrl,
  mapConnectionSummary,
  normalizeInstallationId,
  safeReturnPath,
} from './github-connection.mapper';
import {
  type CompleteGithubConnectionCommand,
  connectionSelect,
  type DisconnectGithubConnectionCommand,
  type GitProviderConnectionRecord,
  type StartGithubConnectionCommand,
} from './github-integration.types';
import {
  GithubDomainError,
  GithubRepositoryService,
} from './github-repository.service';

type GithubIntegrationPrisma = {
  gitProviderConnection?: {
    findFirst(args: unknown): Promise<GitProviderConnectionRecord | null>;
    findMany(args: unknown): Promise<GitProviderConnectionRecord[]>;
    upsert(args: unknown): Promise<GitProviderConnectionRecord>;
    update(args: unknown): Promise<GitProviderConnectionRecord>;
  };
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: unknown[]): Promise<T>;
  $executeRaw(query: TemplateStringsArray | Prisma.Sql, ...values: unknown[]): Promise<number>;
};

@Injectable()
export class GithubIntegrationService {
  private readonly logger = new Logger(GithubIntegrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly authorizationService: AuthorizationService,
    private readonly githubAppConfig: GithubAppConfigService,
    private readonly githubConnectionState: GithubConnectionStateService,
    private readonly githubRepositoryService: GithubRepositoryService
  ) {}

  async listConnections(
    organizationId: string
  ): Promise<GitProviderConnectionSummary[]> {
    const prisma = this.prisma as unknown as GithubIntegrationPrisma;
    if (prisma.gitProviderConnection) {
      const connections = await prisma.gitProviderConnection.findMany({
        where: { organizationId },
        orderBy: { updatedAt: 'desc' },
        select: connectionSelect,
      });

      return connections.map(mapConnectionSummary);
    }

    this.logMissingDelegateFallback('GitProviderConnection.findMany', {
      organizationId,
    });

    const connections = await prisma.$queryRaw<GitProviderConnectionRecord[]>`
      SELECT
        id,
        provider,
        "installationId",
        "accountLogin",
        "accountType",
        status,
        "installedAt",
        "lastVerifiedAt",
        "disconnectedAt"
      FROM "GitProviderConnection"
      WHERE "organizationId" = ${organizationId}
      ORDER BY "updatedAt" DESC
    `;

    return connections.map(mapConnectionSummary);
  }

  async startConnection({
    organization,
    membership,
    user,
    returnPath,
  }: StartGithubConnectionCommand): Promise<GitHubConnectionStartResponse> {
    assertCanManageIntegrations(membership);
    const config = this.githubAppConfig.getConfig();
    const { state, expiresAt } = this.githubConnectionState.createState({
      organizationId: organization.id,
      userId: user.id,
      returnPath: safeReturnPath(returnPath, organization.slug),
      secret: config.privateKey,
    });
    const installationUrl = new URL(config.installationUrl);

    installationUrl.searchParams.set('state', state);

    return {
      provider: 'GITHUB',
      installationUrl: installationUrl.toString(),
      expiresAt: new Date(expiresAt).toISOString(),
    };
  }

  async completeConnection({
    user,
    state,
    installationId,
    setupAction,
    accountLogin,
    accountType,
    organizationIdFromClient,
  }: CompleteGithubConnectionCommand): Promise<GitHubConnectionCallbackResult> {
    const config = this.githubAppConfig.getConfig();
    const payload = this.githubConnectionState.verifyState(
      state,
      config.privateKey
    );

    if (payload.userId !== user.id) {
      throw new ForbiddenException('GitHub connection state does not match the current user');
    }

    if (organizationIdFromClient && organizationIdFromClient !== payload.organizationId) {
      throw new ForbiddenException('GitHub connection state does not match the organization');
    }

    const { membership } = await this.authorizationService.resolveMembership(
      user,
      payload.organizationId
    );
    assertCanManageIntegrations(membership);

    const normalizedInstallationId = normalizeInstallationId(installationId);

    if (!normalizedInstallationId) {
      throw new BadRequestException('GitHub installation id is required');
    }

    const now = new Date();
    const prisma = this.prisma as unknown as GithubIntegrationPrisma;
    if (prisma.gitProviderConnection) {
      const connection = await prisma.gitProviderConnection.upsert({
        where: {
          organizationId_installationId: {
            organizationId: payload.organizationId,
            installationId: normalizedInstallationId,
          },
        },
        create: {
          organizationId: payload.organizationId,
          provider: 'GITHUB',
          installationId: normalizedInstallationId,
          externalAccountId: null,
          accountLogin: accountLogin?.trim() || `installation-${normalizedInstallationId}`,
          accountType: accountType?.trim() || null,
          status: setupAction === 'remove' ? 'DISCONNECTED' : 'ACTIVE',
          connectedByUserId: user.id,
          installedAt: now,
          lastVerifiedAt: now,
          disconnectedAt: setupAction === 'remove' ? now : null,
        },
        update: {
          accountLogin: accountLogin?.trim() || undefined,
          accountType: accountType?.trim() || undefined,
          status: setupAction === 'remove' ? 'DISCONNECTED' : 'ACTIVE',
          connectedByUserId: user.id,
          installedAt: now,
          lastVerifiedAt: now,
          disconnectedAt: setupAction === 'remove' ? now : null,
        },
        select: {
          id: true,
          provider: true,
          installationId: true,
          accountLogin: true,
          accountType: true,
          status: true,
          installedAt: true,
          lastVerifiedAt: true,
          disconnectedAt: true,
        },
      });

      return {
        status: 'connected',
        connection: mapConnectionSummary(connection),
        returnPath: payload.returnPath,
      };
    }

    this.logMissingDelegateFallback('GitProviderConnection.upsert', {
      organizationId: payload.organizationId,
      installationId: normalizedInstallationId,
    });

    const login = accountLogin?.trim() || `installation-${normalizedInstallationId}`;
    const type = accountType?.trim() || null;
    const status = setupAction === 'remove' ? 'DISCONNECTED' : 'ACTIVE';
    const disconnectedAt = setupAction === 'remove' ? now : null;
    const [connection] = await prisma.$queryRaw<GitProviderConnectionRecord[]>`
      INSERT INTO "GitProviderConnection" (
        id,
        "organizationId",
        provider,
        "installationId",
        "externalAccountId",
        "accountLogin",
        "accountType",
        status,
        "connectedByUserId",
        "installedAt",
        "lastVerifiedAt",
        "disconnectedAt",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${randomUUID()},
        ${payload.organizationId},
        'GITHUB'::"SourceProvider",
        ${normalizedInstallationId},
        NULL,
        ${login},
        ${type},
        ${status}::"GitProviderConnectionStatus",
        ${user.id},
        ${now},
        ${now},
        ${disconnectedAt},
        NOW(),
        NOW()
      )
      ON CONFLICT ("organizationId", "installationId") DO UPDATE SET
        "accountLogin" = EXCLUDED."accountLogin",
        "accountType" = EXCLUDED."accountType",
        status = EXCLUDED.status,
        "connectedByUserId" = EXCLUDED."connectedByUserId",
        "installedAt" = EXCLUDED."installedAt",
        "lastVerifiedAt" = EXCLUDED."lastVerifiedAt",
        "disconnectedAt" = EXCLUDED."disconnectedAt",
        "updatedAt" = NOW()
      RETURNING
        id,
        provider,
        "installationId",
        "accountLogin",
        "accountType",
        status,
        "installedAt",
        "lastVerifiedAt",
        "disconnectedAt"
    `;

    return {
      status: 'connected',
      connection: mapConnectionSummary(connection),
      returnPath: payload.returnPath,
    };
  }

  async disconnectConnection({
    organizationId,
    membership,
    connectionId,
  }: DisconnectGithubConnectionCommand): Promise<GitProviderConnectionSummary> {
    assertCanManageIntegrations(membership);
    const prisma = this.prisma as unknown as GithubIntegrationPrisma;
    if (prisma.gitProviderConnection) {
      const existing = await prisma.gitProviderConnection.findFirst({
        where: { id: connectionId, organizationId },
        select: {
          id: true,
          provider: true,
          installationId: true,
          accountLogin: true,
          accountType: true,
          status: true,
          installedAt: true,
          lastVerifiedAt: true,
          disconnectedAt: true,
        },
      });

      if (!existing) {
        throw new BadRequestException('GitHub connection not found');
      }

      const connection = await prisma.gitProviderConnection.update({
        where: { id: connectionId },
        data: {
          status: 'DISCONNECTED',
          disconnectedAt: new Date(),
        },
        select: {
          id: true,
          provider: true,
          installationId: true,
          accountLogin: true,
          accountType: true,
          status: true,
          installedAt: true,
          lastVerifiedAt: true,
          disconnectedAt: true,
        },
      });

      return mapConnectionSummary(connection);
    }

    this.logMissingDelegateFallback('GitProviderConnection.disconnect', {
      organizationId,
      connectionId,
    });

    const [existing] = await prisma.$queryRaw<GitProviderConnectionRecord[]>`
      SELECT
        id,
        provider,
        "installationId",
        "accountLogin",
        "accountType",
        status,
        "installedAt",
        "lastVerifiedAt",
        "disconnectedAt"
      FROM "GitProviderConnection"
      WHERE id = ${connectionId} AND "organizationId" = ${organizationId}
      LIMIT 1
    `;

    if (!existing) {
      throw new BadRequestException('GitHub connection not found');
    }

    const [connection] = await prisma.$queryRaw<GitProviderConnectionRecord[]>`
      UPDATE "GitProviderConnection"
      SET
        status = 'DISCONNECTED'::"GitProviderConnectionStatus",
        "disconnectedAt" = NOW(),
        "updatedAt" = NOW()
      WHERE id = ${connectionId}
      RETURNING
        id,
        provider,
        "installationId",
        "accountLogin",
        "accountType",
        status,
        "installedAt",
        "lastVerifiedAt",
        "disconnectedAt"
    `;

    return mapConnectionSummary(connection);
  }

  async listRepositories({
    organizationId,
    connectionId,
    cursor,
    perPage,
  }: {
    organizationId: string;
    connectionId: string;
    cursor?: string;
    perPage?: number;
  }): Promise<GitHubRepositoryListResponse> {
    const connection = await this.findConnectionForOrganization(
      organizationId,
      connectionId
    );

    if (!connection) {
      throw new BadRequestException('GitHub connection not found');
    }

    if (connection.status !== 'ACTIVE') {
      throw new HttpException(
        {
          message: 'GitHub connection is not active',
          errorCode: 'source_installation_revoked',
        },
        410
      );
    }

    try {
      const result = await this.githubRepositoryService.listInstallationRepositories({
        installationId: connection.installationId,
        cursor,
        perPage,
      });

      return {
        ...result,
        connection: {
          id: connection.id,
          accountLogin: connection.accountLogin,
          accountType: connection.accountType,
          status: connection.status,
          repositoryAccess: 'UNKNOWN',
        },
        configureUrl: buildGithubInstallationConfigureUrl(connection),
      };
    } catch (error) {
      if (error instanceof GithubDomainError) {
        throw new HttpException(
          {
            message: error.message,
            errorCode: error.code,
          },
          error.status
        );
      }

      throw error;
    }
  }

  private logMissingDelegateFallback(
    operation: string,
    context: Record<string, string>
  ) {
    this.logger.warn({
      message: 'Prisma client is missing a generated delegate; using raw SQL fallback',
      operation,
      ...context,
    });
  }

  private async findConnectionForOrganization(
    organizationId: string,
    connectionId: string
  ): Promise<GitProviderConnectionRecord | null> {
    const prisma = this.prisma as unknown as GithubIntegrationPrisma;
    if (prisma.gitProviderConnection) {
      return prisma.gitProviderConnection.findFirst({
        where: { id: connectionId, organizationId },
        select: connectionSelect,
      });
    }

    this.logMissingDelegateFallback('GitProviderConnection.findFirst', {
      organizationId,
      connectionId,
    });

    const [connection] = await prisma.$queryRaw<GitProviderConnectionRecord[]>`
      SELECT
        id,
        provider,
        "installationId",
        "accountLogin",
        "accountType",
        status,
        "installedAt",
        "lastVerifiedAt",
        "disconnectedAt"
      FROM "GitProviderConnection"
      WHERE id = ${connectionId} AND "organizationId" = ${organizationId}
      LIMIT 1
    `;

    return connection ?? null;
  }
}

function assertCanManageIntegrations(membership: OrganizationMember) {
  if (!hasPermission(membership.role, PERMISSIONS.PROJECT_CREATE)) {
    throw new ForbiddenException('You do not have permission to manage integrations');
  }
}
