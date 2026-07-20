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
