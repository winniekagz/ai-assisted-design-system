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
import { DiscoveryErrorBanner } from './discovery-error-banner';

export function ConnectSourceStep({
  source,
  isGithubSource,
  githubAvailable,
  error,
  onUseFixture,
  onSimulateError,
  onReconnect,
}: {
  source: DiscoverySource;
  isGithubSource: boolean;
  githubAvailable: boolean;
  error: DiscoveryError;
  onUseFixture(): void;
  // eslint-disable-next-line no-unused-vars
  onSimulateError(error: DiscoveryError): void;
  onReconnect(): void;
}) {
  return (
    <div className='grid gap-5'>
      <div>
        <h2 className='text-2xl font-semibold text-foreground'>Connect or select source</h2>
        <p className='mt-2 text-sm text-muted-foreground'>
          Source selected: <span className='font-medium text-foreground'>{source.title}</span>
        </p>
      </div>

      {error && <DiscoveryErrorBanner error={error} onRecover={onUseFixture} onReconnect={onReconnect} />}

      {isGithubSource ? (
        <Card className='rounded-md border border-border bg-background py-0 shadow-none'>
          <CardContent className='px-5 py-5'>
            <Github className='size-6 text-primary' aria-hidden='true' />
            <h3 className='mt-3 text-lg font-semibold text-foreground'>GitHub connection</h3>
            <p className='mt-2 text-sm text-muted-foreground'>
              No GitHub OAuth or repository picker exists in this repo yet. This screen is
              wired to a single pending hook so the real integration can replace it later.
            </p>
            <div className='mt-4 flex flex-wrap gap-2'>
              <Button type='button' disabled={!githubAvailable} onClick={onReconnect}>
                Connect GitHub
              </Button>
              <Button type='button' variant='outlined' onClick={onUseFixture}>
                Use fixture repository
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className='rounded-md border border-dashed border-border bg-background py-0 shadow-none'>
          <CardContent className='px-5 py-8'>
            <Upload className='mx-auto size-8 text-primary' aria-hidden='true' />
            <h3 className='mt-4 text-center text-lg font-semibold text-foreground'>
              Prepare source for discovery
            </h3>
            <p className='mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground'>
              This source is out of scope for real upload/analysis in this pass. Use the
              fixture discovery path to preview the remaining flow.
            </p>
            <div className='mt-5 flex justify-center gap-2'>
              <Button type='button' variant='outlined' disabled title='Upload analysis API is not available yet.'>
                Browse files
              </Button>
              <Button type='button' onClick={onUseFixture}>
                Use fixture discovery
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className='text-sm font-semibold text-foreground'>Recent sources</h3>
        <div className='mt-2 grid gap-2'>
          {recentUploadFixtures.map(item => (
            <div
              key={item}
              className='flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground'
            >
              <FileArchive className='size-4' aria-hidden='true' />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-wrap gap-2'>
        <Button type='button' variant='outlined' size='sm' onClick={() => onSimulateError('repo_unavailable')}>
          Preview repo unavailable
        </Button>
        <Button type='button' variant='outlined' size='sm' onClick={() => onSimulateError('github_expired')}>
          Preview expired auth
        </Button>
        <Button type='button' variant='outlined' size='sm' onClick={() => onSimulateError('corrupted_archive')}>
          Preview corrupted archive
        </Button>
      </div>
    </div>
  );
}
