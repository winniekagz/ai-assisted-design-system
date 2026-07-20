import {
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Select,
  Switch,
  Textarea,
  cn,
} from 'componentiq';
import { Archive, ChevronDown, Github, Trash2 } from 'lucide-react';

import type { ProjectRow } from '@/features/projects/types';
import {
  settingsIntegrationsFixture,
  settingsMetadataFixture,
  settingsRepositoriesFixture,
  settingsRulesFixture,
  settingsTeamOptions,
  statusExplanations,
  type ProjectSettingsForm,
} from '@/features/projects/fixtures/settings';

import {
  DangerRow,
  Meta,
  SectionHeading,
  Stat,
  StatusBadge,
} from '../components';
import { statusOptions, type UpdateProjectSettingsForm } from '../types';

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
