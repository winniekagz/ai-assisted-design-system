import type { GitProviderConnectionSummary } from '@winniekagendo/componentiq-shared-types';

import type { GitProviderConnectionRecord } from './github-integration.types';

export function mapConnectionSummary(
  connection: GitProviderConnectionRecord
): GitProviderConnectionSummary {
  return {
    id: connection.id,
    provider: 'GITHUB',
    accountLogin: connection.accountLogin,
    accountType: connection.accountType,
    status: connection.status,
    installedAt: connection.installedAt?.toISOString() ?? null,
    lastVerifiedAt: connection.lastVerifiedAt?.toISOString() ?? null,
    canDisconnect: connection.status === 'ACTIVE',
    configureUrl: buildGithubInstallationConfigureUrl(connection),
  };
}

export function safeReturnPath(returnPath: string | undefined, orgSlug: string) {
  if (!returnPath?.startsWith('/') || returnPath.startsWith('//')) {
    return `/org/${orgSlug}/projects`;
  }

  return returnPath;
}

export function normalizeInstallationId(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed || !/^\d+$/.test(trimmed)) {
    return null;
  }

  return trimmed;
}

export function buildGithubInstallationConfigureUrl(
  connection: Pick<
    GitProviderConnectionRecord,
    'installationId' | 'accountLogin' | 'accountType'
  >
) {
  const installationId = encodeURIComponent(connection.installationId);
  const url =
    connection.accountType === 'Organization'
      ? new URL(
          `/organizations/${encodeURIComponent(
            connection.accountLogin
          )}/settings/installations/${installationId}`,
          'https://github.com'
        )
      : new URL(`/settings/installations/${installationId}`, 'https://github.com');

  if (url.origin !== 'https://github.com') {
    throw new Error('Invalid GitHub installation configuration URL');
  }

  return url.toString();
}
