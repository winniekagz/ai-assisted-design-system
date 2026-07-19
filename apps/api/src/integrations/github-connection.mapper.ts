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
