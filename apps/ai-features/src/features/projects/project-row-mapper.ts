import type { ProjectListItem } from '@winniekagendo/componentiq-shared-types';

import type { ProjectRow } from '@/features/projects/types';
import { formatDate } from '@/shared/format-date';

export function projectRowFromApiProject(apiProject: ProjectListItem): ProjectRow {
  return {
    id: apiProject.id,
    name: apiProject.name,
    slug: apiProject.slug,
    repository: apiProject.repositoryUrl ?? 'Repository not connected',
    team: 'Unassigned',
    framework: apiProject.framework,
    tags: ['saved'],
    description: apiProject.description || 'Project reserved in ComponentIQ.',
    status: projectStatusFromConfigurationStatus(apiProject.configurationStatus),
    configurationStatus: apiProject.configurationStatus,
    blockingCount: 0,
    latestAudit: { state: 'not_run', label: 'Not run', relativeTime: 'Never' },
    designSystem: { state: 'none', label: 'None' },
    latestActivity: `Updated ${formatDate(apiProject.updatedAt)}`,
    repoCount: apiProject.repositoryUrl ? 1 : 0,
    lastAudited: 'Never',
  };
}

function projectStatusFromConfigurationStatus(
  status: ProjectListItem['configurationStatus']
): ProjectRow['status'] {
  if (status === 'ARCHIVED') return 'archived';
  if (status === 'READY') return 'healthy';
  if (status === 'REVIEW_REQUIRED') return 'needs_attention';
  if (status === 'CONFIGURATION_FAILED') return 'blocked';

  return 'not_configured';
}
