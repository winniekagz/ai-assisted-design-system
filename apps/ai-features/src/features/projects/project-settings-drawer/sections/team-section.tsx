import type { ProjectSettingsForm } from '@/features/projects/fixtures/settings';

import { Meta, SectionHeading } from '../components';

export function TeamSection({ form }: { form: ProjectSettingsForm }) {
  return (
    <div>
      <SectionHeading
        title='Team'
        description='Projects belong to teams rather than individuals. This makes ownership more resilient over time.'
      />
      <dl className='grid gap-4 text-sm'>
        <Meta label='Owning team' value={form.team} />
        <Meta label='Managers' value='Winnie Kagendo, Commerce Leads' />
        <Meta label='Members' value='14 members' />
      </dl>
      <p className='mt-5 rounded-md border border-border bg-background-secondary p-4 text-sm text-muted-foreground'>
        To change ownership, use Transfer project in Danger Zone so repository connections and audit history are preserved intentionally.
      </p>
    </div>
  );
}
