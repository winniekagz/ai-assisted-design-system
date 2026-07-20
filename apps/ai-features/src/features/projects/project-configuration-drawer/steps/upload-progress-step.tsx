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
  formatBytes,
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
export function UploadProgressStep({
  source,
  isPending,
}: {
  source: LocalSourceSelection | null;
  isPending: boolean;
}) {
  return (
    <div className='grid gap-4' aria-live='polite'>
      <Progress value={isPending ? 72 : 100} label='Uploading project snapshot' showValue />
      <StatusCallout
        tone='info'
        title={isPending ? 'Uploading source' : 'Finishing analysis'}
        detail={
          source
            ? `${source.fileCount.toLocaleString()} filtered files (${formatBytes(source.totalSize)}) are being uploaded for backend detection.`
            : 'ComponentIQ is uploading the snapshot and running bounded backend detection.'
        }
      />
    </div>
  );
}
