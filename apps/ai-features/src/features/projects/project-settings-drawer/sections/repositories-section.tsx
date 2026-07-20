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

export function RepositoriesSection({
  githubAvailable,
  onConnect,
}: {
  githubAvailable: boolean;
  onConnect(): void;
}) {
  return (
    <div>
      <SectionHeading
        title='Repositories'
        description='Review connected repositories and connection health. Repository removal is never accidental.'
      />
      <div className='grid gap-3'>
        {settingsRepositoriesFixture.map(repo => (
          <Card key={repo.id} className='rounded-md border border-border bg-background py-0 shadow-none'>
            <CardContent className='flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='font-mono text-sm font-semibold text-foreground'>{repo.name}</p>
                <p className='mt-1 text-xs text-muted-foreground'>
                  {repo.provider} · {repo.defaultBranch} · latest audit {repo.latestAudit}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <StatusBadge label={repo.status} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type='button' variant='outlined' size='sm' endIcon={<ChevronDown className='size-4' />}>
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem disabled>Disconnect requires repository API</DropdownMenuItem>
                    <DropdownMenuItem disabled>Reconnect requires GitHub OAuth</DropdownMenuItem>
                    <DropdownMenuItem disabled>Set as default requires repository API</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button
        type='button'
        className='mt-4'
        variant='outlined'
        disabled={!githubAvailable}
        title='GitHub OAuth/repository picker is not wired yet.'
        startIcon={<Github className='size-4' />}
        onClick={onConnect}
      >
        Connect repository
      </Button>
    </div>
  );
}
