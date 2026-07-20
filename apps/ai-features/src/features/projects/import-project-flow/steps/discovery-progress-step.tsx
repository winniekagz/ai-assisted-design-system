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

export function DiscoveryProgressStep({
  completed,
  progressValue,
}: {
  completed: number;
  progressValue: number;
}) {
  return (
    <div aria-live='polite'>
      <h2 className='text-2xl font-semibold text-foreground'>Automatic discovery</h2>
      <p className='mt-2 text-sm text-muted-foreground'>
        ComponentIQ is inspecting the project and preparing review-only results.
      </p>
      <Progress className='mt-6' value={progressValue} label='Discovery progress' showValue />
      <ol className='mt-6 grid gap-3'>
        {discoverySteps.map((item, index) => {
          const done = index < completed;
          const active = index === completed;
          return (
            <li
              key={item.id}
              className='flex gap-3 rounded-md border border-border bg-background px-4 py-3'
            >
              {done ? (
                <CheckCircle2 className='mt-0.5 size-5 text-status-success' aria-hidden='true' />
              ) : active ? (
                <Loader2 className='mt-0.5 size-5 animate-spin text-primary' aria-hidden='true' />
              ) : (
                <span className='mt-1 size-3 rounded-full border border-border' aria-hidden='true' />
              )}
              <span>
                <span className='block text-sm font-semibold text-foreground'>{item.label}</span>
                <span className='mt-1 block text-xs text-muted-foreground'>{item.detail}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
