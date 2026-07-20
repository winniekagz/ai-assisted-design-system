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

export function ChooseSourceStep({
  selectedSourceId,
  onSelect,
}: {
  selectedSourceId: DiscoverySourceId;
  // eslint-disable-next-line no-unused-vars
  onSelect(source: DiscoverySourceId): void;
}) {
  return (
    <div>
      <h2 className='text-2xl font-semibold text-foreground'>Choose discovery source</h2>
      <p className='mt-2 text-sm text-muted-foreground'>
        Pick where ComponentIQ should look. Nothing is saved until the final import step.
      </p>
      <div className='mt-6 grid gap-3 md:grid-cols-2'>
        {discoverySources.map(source => {
          const active = selectedSourceId === source.id;
          return (
            <button
              key={source.id}
              type='button'
              onClick={() => onSelect(source.id)}
              className={`rounded-md border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active
                  ? 'border-primary bg-primary-50'
                  : 'border-border bg-background hover:bg-background-secondary'
              }`}
            >
              <span className='text-sm font-semibold text-foreground'>{source.title}</span>
              <span className='mt-2 block text-sm text-muted-foreground'>{source.description}</span>
              <span className='mt-3 block text-xs text-muted-foreground'>
                Discovers: {source.discovers}
              </span>
              <span className='mt-1 block text-xs text-muted-foreground'>
                Permissions: {source.permissions}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
