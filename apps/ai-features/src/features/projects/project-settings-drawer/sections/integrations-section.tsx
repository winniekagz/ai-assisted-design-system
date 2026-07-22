import { settingsIntegrationsFixture } from '@/features/projects/fixtures/settings';

import { SectionHeading, StatusBadge } from '../components';

export function IntegrationsSection() {
  return (
    <div>
      <SectionHeading title='Integrations' description='See which tools currently send signals to this project.' />
      <div className='grid gap-3'>
        {settingsIntegrationsFixture.map(item => (
          <div key={item.id} className='flex items-center justify-between rounded-md border border-border bg-background px-4 py-3'>
            <div>
              <p className='text-sm font-semibold text-foreground'>{item.name}</p>
              {item.future && <p className='mt-1 text-xs text-muted-foreground'>Coming soon</p>}
            </div>
            <StatusBadge label={item.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
