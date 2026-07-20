'use client';

import { useAuth } from '@clerk/nextjs';
import {
  Button,
  Card,
  CardContent,
  Progress,
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Stepper,
  toast,
} from 'componentiq';
import {
  AlertCircle,
  CheckCircle2,
  FileArchive,
  Github,
  Loader2,
  RefreshCcw,
  Upload,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { createProject } from '@/lib/api/projects';

import {
  discoveryResultFixture,
  discoverySources,
  discoverySteps,
  recentUploadFixtures,
  type DiscoverySource,
  type DiscoverySourceId,
} from '@/features/projects/fixtures/import-flow';
import { useConnectGithubRepo } from '@/features/projects/use-connect-github-repo';
import { projectRowFromImport } from '../mapper';
import { flowSteps, type DiscoveryError, type FlowStep, type ImportProjectFlowProps } from '../types';

export function DiscoveryErrorBanner({
  error,
  onRecover,
  onReconnect,
}: {
  error: Exclude<DiscoveryError, null>;
  onRecover(): void;
  onReconnect(): void;
}) {
  const meta = {
    repo_unavailable: {
      title: 'Repository unavailable',
      detail: 'We could not read this repository. Choose a different source or retry.',
      action: 'Retry with fixture',
      recover: onRecover,
    },
    github_expired: {
      title: "We couldn't analyse this repository because GitHub access has expired.",
      detail: 'Reconnect GitHub to continue.',
      action: 'Reconnect GitHub',
      recover: onReconnect,
    },
    corrupted_archive: {
      title: 'Archive could not be read',
      detail: 'Choose a different source or use fixture discovery for now.',
      action: 'Choose fixture source',
      recover: onRecover,
    },
    failed: {
      title: 'Discovery failed',
      detail: 'The discovery job did not complete. Retry when the backend job is available.',
      action: 'Retry with fixture',
      recover: onRecover,
    },
  }[error];

  return (
    <div
      role='alert'
      className='rounded-md border border-status-error bg-status-error-bg p-4'
    >
      <div className='flex gap-3'>
        <AlertCircle className='mt-0.5 size-5 text-status-error' aria-hidden='true' />
        <div>
          <h3 className='text-sm font-semibold text-foreground'>{meta.title}</h3>
          <p className='mt-1 text-sm text-muted-foreground'>{meta.detail}</p>
          <Button type='button' size='sm' className='mt-3' onClick={meta.recover}>
            <RefreshCcw className='size-4' aria-hidden='true' />
            {meta.action}
          </Button>
        </div>
      </div>
    </div>
  );
}
