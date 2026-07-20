'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  DetectedProjectConfiguration,
  ProjectConfigurationStatus,
} from '@winniekagendo/componentiq-shared-types';
import type { GitProviderConnectionSummary } from '@winniekagendo/componentiq-shared-types';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Progress,
  Select,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Stepper,
  Textarea,
  cn,
  toast,
} from 'componentiq';
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileArchive,
  FolderOpen,
  Github,
  Info,
  Loader2,
  RefreshCcw,
  Search,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import { useForm } from 'react-hook-form';

import {
  useDisconnectGithubConnection,
  useStartGithubConnection,
} from '@/hooks/mutations/use-connect-github';
import { useGithubConnections } from '@/hooks/queries/use-github-connections';
import { useProjectConfiguration } from '@/features/projects/hooks';
import {
  confirmProjectConfiguration as confirmProjectConfigurationRequest,
  uploadLocalProjectSource,
} from '@/lib/api/projects';
import { requireClerkSessionToken } from '@/lib/auth/clerk-session-token';
import { queryKeys } from '@/lib/query/query-keys';

import {
  analysisSteps,
  localExclusions,
  localUploadLimits,
  repoRows,
  stageSteps,
  statusLabels,
} from '../constants';
import type {
  ConfigurationFormValues,
  ConfigurationStateId,
  DirectoryPickerAttributes,
  LocalSourceSelection,
  ProjectConfigurationDrawerProps,
  ProjectConfigurationProject,
} from '../types';
import {
  buildConfirmConfigurationInput,
  configurationStateForStatus,
  getConfigurationStatus,
  previousState,
  stageIndexForState,
  titleForState,
} from '../utils';

export type {
  ConfigurationStateId,
  ProjectConfigurationProject,
  ProjectConfigurationStatus,
};
export { getConfigurationStatus };

import { StatusCallout, SummaryRows } from '../shared-components';
export function GithubRepoPickerStep({
  repoSearch,
  onRepoSearch,
  repos,
  selectedRepoId,
  onSelectRepo,
  register,
}: {
  repoSearch: string;
  // eslint-disable-next-line no-unused-vars
  onRepoSearch(value: string): void;
  repos: typeof repoRows;
  selectedRepoId: string;
  // eslint-disable-next-line no-unused-vars
  onSelectRepo(repoId: string): void;
  register: ReturnType<typeof useForm<ConfigurationFormValues>>['register'];
}) {
  return (
    <div className='grid gap-4'>
      <Select label='GitHub account' {...register('githubAccount')}>
        <option>Acme</option>
        <option>Personal repositories</option>
      </Select>
      <Input
        label='Search repositories'
        value={repoSearch}
        onChange={event => onRepoSearch(event.target.value)}
        startIcon={<Search className='size-4 text-muted-foreground' />}
      />
      <div className='grid gap-2'>
        {repos.map(repo => {
          const disabled = repo.status !== 'Available';
          const selected = selectedRepoId === repo.id;
          return (
            <button
              key={repo.id}
              type='button'
              disabled={disabled}
              onClick={() => onSelectRepo(repo.id)}
              className={cn(
                'flex flex-col gap-2 rounded-md border px-3 py-3 text-left transition-colors sm:flex-row sm:items-center sm:justify-between',
                selected ? 'border-primary bg-primary-50' : 'border-border bg-background',
                disabled && 'cursor-not-allowed opacity-60'
              )}
            >
              <span>
                <span className='block font-mono text-sm font-semibold text-foreground'>{repo.name}</span>
                <span className='mt-1 block text-xs text-muted-foreground'>{repo.visibility} · default {repo.branch}</span>
              </span>
              <Badge status={repo.status === 'Available' ? 'success' : 'warning'}>{repo.status}</Badge>
            </button>
          );
        })}
      </div>
      <div className='grid gap-3 sm:grid-cols-2'>
        <Input label='Branch' {...register('branch')} />
        <Input label='Project path' placeholder='/' {...register('projectRoot')} />
      </div>
    </div>
  );
}
