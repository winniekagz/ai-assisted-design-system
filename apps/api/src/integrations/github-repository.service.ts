import { Injectable } from '@nestjs/common';
import { createPrivateKey, createSign } from 'node:crypto';
import type {
  GitHubRepositorySummary,
} from '@winniekagendo/componentiq-shared-types';

import { GithubAppConfigService } from './github-app-config.service';

export type GithubDomainErrorCode =
  | 'source_github_unauthorized'
  | 'source_github_forbidden'
  | 'source_github_rate_limited'
  | 'source_installation_revoked'
  | 'source_repository_not_found'
  | 'source_fetch_failed';

export class GithubDomainError extends Error {
  constructor(
    readonly code: GithubDomainErrorCode,
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = 'GithubDomainError';
  }
}

type InstallationTokenResponse = {
  token: string;
  expires_at: string;
};

type GithubRepositoryPayload = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string | null;
  updated_at: string | null;
  size?: number | null;
  owner: {
    login: string;
  };
};

type GithubRepositoryListPayload = {
  repositories: GithubRepositoryPayload[];
};

export type GithubInstallationRepositoryPage = {
  repositories: GitHubRepositorySummary[];
  pagination: {
    nextCursor: string | null;
  };
};

type GithubCommitPayload = {
  sha: string;
};

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_API_VERSION = '2022-11-28';
const MAX_PER_PAGE = 100;

@Injectable()
export class GithubRepositoryService {
  constructor(private readonly githubAppConfig: GithubAppConfigService) {}

  createAppJwt(now = Math.floor(Date.now() / 1000)): string {
    const config = this.githubAppConfig.getConfig();
    const header = base64UrlJson({ alg: 'RS256', typ: 'JWT' });
    const payload = base64UrlJson({
      iat: now - 60,
      exp: now + 9 * 60,
      iss: config.appId,
    });
    const signingInput = `${header}.${payload}`;
    const privateKey = getPrivateKeyForSigning(config.privateKey);
    const signature = createSign('RSA-SHA256')
      .update(signingInput)
      .end()
      .sign(privateKey, 'base64url');

    return `${signingInput}.${signature}`;
  }

  async listInstallationRepositories({
    installationId,
    cursor,
    perPage = 30,
  }: {
    installationId: string;
    cursor?: string | null;
    perPage?: number;
  }): Promise<GithubInstallationRepositoryPage> {
    const token = await this.createInstallationToken(installationId);
    const page = parseCursor(cursor);
    const boundedPerPage = Math.min(Math.max(perPage, 1), MAX_PER_PAGE);
    const url = new URL('/installation/repositories', GITHUB_API_URL);
    url.searchParams.set('per_page', String(boundedPerPage));
    url.searchParams.set('page', String(page));

    const response = await safeGithubFetch(url, {
      headers: githubHeaders(token),
    });

    if (!response.ok) {
      throw await mapGithubResponseError(response, 'list_repositories');
    }

    const payload = (await response.json()) as GithubRepositoryListPayload;

    return {
      repositories: payload.repositories.map(mapRepository),
      pagination: {
        nextCursor: parseNextCursor(response.headers.get('link')),
      },
    };
  }

  async createInstallationToken(installationId: string): Promise<string> {
    const response = await safeGithubFetch(
      `${GITHUB_API_URL}/app/installations/${encodeURIComponent(
        installationId
      )}/access_tokens`,
      {
        method: 'POST',
        headers: githubHeaders(this.createAppJwt()),
      }
    );

    if (!response.ok) {
      throw await mapGithubResponseError(response, 'installation_token');
    }

    const payload = (await response.json()) as InstallationTokenResponse;

    if (!payload.token) {
      throw new GithubDomainError(
        'source_fetch_failed',
        'GitHub did not return an installation token.',
        502
      );
    }

    return payload.token;
  }

  async getCommitSha({
    installationId,
    owner,
    repo,
    ref,
  }: {
    installationId: string;
    owner: string;
    repo: string;
    ref: string;
  }): Promise<string> {
    const token = await this.createInstallationToken(installationId);
    const response = await safeGithubFetch(
      `${GITHUB_API_URL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits/${encodeURIComponent(ref)}`,
      { headers: githubHeaders(token) }
    );

    if (!response.ok) {
      throw await mapGithubResponseError(response, 'repository_fetch');
    }

    const payload = (await response.json()) as GithubCommitPayload;
    return payload.sha;
  }

  async fetchRepositoryTarball({
    installationId,
    owner,
    repo,
    ref,
  }: {
    installationId: string;
    owner: string;
    repo: string;
    ref: string;
  }): Promise<Buffer> {
    const token = await this.createInstallationToken(installationId);
    const response = await safeGithubFetch(
      `${GITHUB_API_URL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/tarball/${encodeURIComponent(ref)}`,
      { headers: githubHeaders(token) }
    );

    if (!response.ok) {
      throw await mapGithubResponseError(response, 'repository_fetch');
    }

    return Buffer.from(await response.arrayBuffer());
  }
}

function githubHeaders(token: string): Record<string, string> {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'User-Agent': 'componentiq-github-app',
    'X-GitHub-Api-Version': GITHUB_API_VERSION,
  };
}

async function mapGithubResponseError(
  response: Response,
  operation: 'installation_token' | 'list_repositories' | 'repository_fetch'
) {
  const message = await readGithubErrorMessage(response);

  if (isRateLimited(response, message)) {
    return new GithubDomainError(
      'source_github_rate_limited',
      'GitHub API rate limit was reached. Try again after the limit resets.',
      429
    );
  }

  if (
    operation === 'installation_token' &&
    [401, 403, 404].includes(response.status)
  ) {
    return new GithubDomainError(
      'source_installation_revoked',
      'The GitHub App installation is no longer available for this organization.',
      410
    );
  }

  if (response.status === 401) {
    return new GithubDomainError(
      'source_github_unauthorized',
      'GitHub rejected the installation token.',
      401
    );
  }

  if (response.status === 403) {
    return new GithubDomainError(
      'source_installation_revoked',
      'The GitHub App installation is no longer authorized to list repositories.',
      410
    );
  }

  if (response.status === 404) {
    return new GithubDomainError(
      operation === 'list_repositories' || operation === 'repository_fetch'
        ? 'source_repository_not_found'
        : 'source_installation_revoked',
      'GitHub could not find the requested installation or repository.',
      404
    );
  }

  return new GithubDomainError(
    'source_fetch_failed',
    message || 'GitHub repository listing failed.',
    response.status >= 500 ? 502 : response.status
  );
}

async function safeGithubFetch(
  input: string | URL,
  init: RequestInit
): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch {
    throw new GithubDomainError(
      'source_fetch_failed',
      'GitHub is currently unavailable. Try again in a moment.',
      503
    );
  }
}

async function readGithubErrorMessage(response: Response) {
  try {
    const payload = (await response.clone().json()) as { message?: unknown };
    return typeof payload.message === 'string' ? payload.message : '';
  } catch {
    return '';
  }
}

function isRateLimited(response: Response, message: string) {
  return (
    response.status === 403 &&
    (response.headers.get('x-ratelimit-remaining') === '0' ||
      message.toLowerCase().includes('rate limit'))
  );
}

function mapRepository(
  repository: GithubRepositoryPayload
): GitHubRepositorySummary {
  return {
    id: String(repository.id),
    owner: repository.owner.login,
    name: repository.name,
    fullName: repository.full_name,
    defaultBranch: repository.default_branch ?? 'main',
    private: repository.private,
    updatedAt: repository.updated_at,
    sizeKb: typeof repository.size === 'number' ? repository.size : null,
  };
}

function parseCursor(cursor: string | null | undefined) {
  if (!cursor) return 1;
  const page = Number(cursor);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

function parseNextCursor(link: string | null) {
  if (!link) return null;
  const next = link
    .split(',')
    .map(part => part.trim())
    .find(part => part.includes('rel="next"'));
  const match = next?.match(/[?&]page=(\d+)/);

  return match?.[1] ?? null;
}

function normalizePrivateKey(privateKey: string) {
  const trimmed = privateKey.trim();
  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed;

  return unquoted.replace(/\\n/g, '\n');
}

function getPrivateKeyForSigning(privateKey: string) {
  const normalized = normalizePrivateKey(privateKey);

  if (normalized.startsWith('SHA256:')) {
    throw invalidPrivateKeyError();
  }

  try {
    return createPrivateKey(normalized);
  } catch {
    throw invalidPrivateKeyError();
  }
}

function invalidPrivateKeyError() {
  return new GithubDomainError(
    'source_fetch_failed',
    'GitHub App private key is invalid. Use the downloaded .pem private key, not the webhook secret or SHA256 fingerprint.',
    503
  );
}

function base64UrlJson(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}
