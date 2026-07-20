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

export function DiscoveryResultsStep({
  suggestions,
  onToggleSuggestion,
}: {
  suggestions: typeof discoveryResultFixture.suggestions;
  // eslint-disable-next-line no-unused-vars
  onToggleSuggestion(id: string): void;
}) {
  return (
    <div>
      <h2 className='text-2xl font-semibold text-foreground'>Review discovery results</h2>
      <p className='mt-2 text-sm text-muted-foreground'>
        Nothing is saved yet. Review the detected setup before importing.
      </p>
      <div className='mt-5 flex flex-wrap gap-2'>
        {discoveryResultFixture.techTags.map(tag => (
          <span
            key={tag}
            className='rounded-full border border-border bg-background-secondary px-3 py-1 text-xs font-semibold text-muted-foreground'
          >
            {tag}
          </span>
        ))}
      </div>
      <Card className='mt-5 rounded-md border border-border bg-background py-0 shadow-none'>
        <CardContent className='px-5 py-5'>
          <p className='text-sm font-semibold text-foreground'>Potential design system</p>
          <p className='mt-2 text-lg font-semibold text-foreground'>
            {discoveryResultFixture.designSystem}
          </p>
          <p className='mt-1 text-sm text-muted-foreground'>
            {discoveryResultFixture.confidence}% confidence from token and component matches.
          </p>
        </CardContent>
      </Card>
      <div className='mt-5 grid gap-3'>
        {suggestions.map(suggestion => (
          <label
            key={suggestion.id}
            className='flex gap-3 rounded-md border border-border bg-background px-4 py-3'
          >
            <input
              type='checkbox'
              checked={suggestion.enabled}
              onChange={() => onToggleSuggestion(suggestion.id)}
              className='mt-1'
            />
            <span>
              <span className='block text-sm font-semibold text-foreground'>{suggestion.label}</span>
              <span className='mt-1 block text-xs text-muted-foreground'>{suggestion.detail}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
