import type { ApiProject } from '@/lib/api/projects';
import type { ProjectRow } from '@/features/projects/types';
import { discoveryResultFixture } from '@/features/projects/fixtures/import-flow';

export function projectRowFromImport(apiProject: ApiProject): ProjectRow {
  return {
    id: apiProject.id,
    name: apiProject.name,
    slug: apiProject.slug,
    repository: discoveryResultFixture.repositories[0],
    team: 'Commerce',
    framework: discoveryResultFixture.framework,
    tags: ['imported', 'checkout'],
    description: 'Imported from discovery results.',
    status: 'needs_attention',
    blockingCount: 0,
    latestAudit: { state: 'warning', label: 'Needs review', relativeTime: 'Just now' },
    designSystem: {
      state: 'current',
      label: 'Current',
      version: discoveryResultFixture.designSystem,
    },
    latestActivity: 'Project imported from discovery',
    repoCount: discoveryResultFixture.repositories.length,
    lastAudited: 'Never',
  };
}
