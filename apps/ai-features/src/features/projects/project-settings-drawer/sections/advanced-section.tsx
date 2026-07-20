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
