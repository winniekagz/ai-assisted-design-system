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
export function ReviewSetupStep({
  detectedConfiguration,
  register,
  values,
}: {
  detectedConfiguration: DetectedProjectConfiguration | null;
  register: ReturnType<typeof useForm<ConfigurationFormValues>>['register'];
  values: ConfigurationFormValues;
}) {
  const setup = detectedConfiguration?.setup;
  const framework = setup?.framework.value ?? detectedConfiguration?.framework ?? 'UNKNOWN';
  const packageManager = setup?.packageManager.value ?? detectedConfiguration?.packageManager ?? 'UNKNOWN';
  const styling = setup?.stylingSystem.value?.join(', ') ?? detectedConfiguration?.stylingSystem ?? 'UNKNOWN';
  const warnings = setup?.globalWarnings ?? detectedConfiguration?.warnings ?? [];
  const evidence = setup?.framework.evidence ?? [];

  return (
    <div className='grid gap-4'>
      <StatusCallout tone='info' title='Review detected setup' detail='Only uncertain fields are editable before saving this configuration.' />
      <SummaryRows rows={[
        ['Framework', `${framework} · ${setup?.framework.confidence ?? detectedConfiguration?.confidence ?? 'LOW'} confidence`],
        ['Package manager', `${packageManager} · ${setup?.packageManager.confidence ?? 'LOW'} confidence`],
        ['Styling system', `${styling} · ${setup?.stylingSystem.confidence ?? 'LOW'} confidence`],
        ['Language', setup?.language.value ?? detectedConfiguration?.language ?? 'UNKNOWN'],
        ['Project root', setup?.projectRoot.value ?? detectedConfiguration?.projectRoot ?? values.projectRoot],
      ]} />
      {evidence.length > 0 && (
        <div className='rounded-md border border-border bg-background px-4 py-3'>
          <h3 className='text-sm font-semibold text-foreground'>Evidence</h3>
          <ul className='mt-2 grid gap-1 text-xs text-muted-foreground'>
            {evidence.slice(0, 5).map(item => (
              <li key={`${item.type}-${item.path}`}>{item.path}: {item.detail}</li>
            ))}
          </ul>
        </div>
      )}
      {warnings.length > 0 && (
        <StatusCallout tone='warning' title='Review warnings' detail={warnings.slice(0, 2).join(' ')} />
      )}
      {setup && setup.candidateProjectRoots.length > 1 && (
        <div className='rounded-md border border-border bg-background px-4 py-3'>
          <h3 className='text-sm font-semibold text-foreground'>Candidate roots</h3>
          <ul className='mt-2 grid gap-1 text-xs text-muted-foreground'>
            {setup.candidateProjectRoots.map(candidate => (
              <li key={candidate.path}>{candidate.path} · score {candidate.score}</li>
            ))}
          </ul>
        </div>
      )}
      <div className='grid gap-3'>
        <Input label='Project root' {...register('projectRoot')} placeholder={setup?.projectRoot.value ?? detectedConfiguration?.projectRoot ?? '/'} />
        <Input label='Component directories' {...register('componentDirectories')} placeholder={(setup?.componentPaths.value ?? detectedConfiguration?.componentPaths ?? []).join(', ')} />
        <Input label='Design-token path' {...register('tokenPath')} placeholder={(setup?.tokenPaths.value ?? detectedConfiguration?.tokenPaths ?? []).join(', ')} />
        <div className='grid gap-2'>
          <label className='text-sm font-medium text-muted-foreground' htmlFor='configuration-reviewer-notes'>
            Reviewer notes
          </label>
          <Textarea id='configuration-reviewer-notes' {...register('notes')} />
        </div>
      </div>
    </div>
  );
}
