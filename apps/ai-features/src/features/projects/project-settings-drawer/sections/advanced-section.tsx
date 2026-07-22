import { settingsMetadataFixture } from '@/features/projects/fixtures/settings';
import type { ProjectRow } from '@/features/projects/types';

import { Meta, SectionHeading } from '../components';

export function AdvancedSection({ project }: { project: ProjectRow }) {
  return (
    <div>
      <SectionHeading title='Advanced' description='For tooling and support. These values are read-only.' />
      <dl className='grid gap-3 text-sm'>
        <Meta label='Project ID' value={project.id} mono />
        <Meta label='Webhook endpoint URL' value={settingsMetadataFixture.webhookEndpoint} mono />
        <Meta label='Environment' value={settingsMetadataFixture.environment} mono />
      </dl>
    </div>
  );
}
