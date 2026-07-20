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
export function AnalysisProgressStep({
  onWarning,
  onFailure,
  onReview,
}: {
  onWarning(): void;
  onFailure(): void;
  onReview(): void;
}) {
  return (
    <div className='grid gap-4'>
      <div className='rounded-md border border-border bg-background px-4 py-4'>
        <h3 className='font-semibold text-foreground'>Analyzing source</h3>
        <ol className='mt-4 grid gap-3'>
          {analysisSteps.map((step, index) => (
            <li key={step} className='flex items-center gap-3 text-sm'>
              {index < 2 ? (
                <CheckCircle2 className='size-4 text-status-success' aria-hidden='true' />
              ) : index === 2 ? (
                <Loader2 className='size-4 animate-spin text-primary' aria-hidden='true' />
              ) : (
                <Clock className='size-4 text-muted-foreground' aria-hidden='true' />
              )}
              <span className={index <= 2 ? 'text-foreground' : 'text-muted-foreground'}>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <StatusCallout tone='info' title='You can leave this page' detail='Analysis continues in the background and can be resumed from the project.' />
      <div className='flex flex-wrap gap-2'>
        <Button type='button' onClick={onReview}>Continue to review</Button>
        <Button type='button' variant='outlined' onClick={onWarning}>Preview warning</Button>
        <Button type='button' variant='outlined' onClick={onFailure}>Preview failure</Button>
      </div>
    </div>
  );
}
