import { settingsRulesFixture } from '@/features/projects/fixtures/settings';

import { SectionHeading, Stat } from '../components';

export function RulesSection({ orgSlug }: { orgSlug: string }) {
  return (
    <div>
      <SectionHeading title='Rules' description='Review the rule footprint for this project. Editing belongs in rule management.' />
      <div className='grid gap-3 sm:grid-cols-2'>
        <Stat label='Inherited rules' value={settingsRulesFixture.inherited} />
        <Stat label='Project overrides' value={settingsRulesFixture.overrides} />
        <Stat label='Custom rules' value={settingsRulesFixture.custom} />
        <Stat label='Active exceptions' value={settingsRulesFixture.exceptions} />
      </div>
      <a href={`/org/${orgSlug}/guardrails`} className='mt-5 inline-flex text-sm font-semibold text-primary hover:underline'>
        Open rule management
      </a>
    </div>
  );
}
