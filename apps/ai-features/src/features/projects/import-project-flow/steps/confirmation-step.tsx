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

export function ConfirmationStep({ selectedSource }: { selectedSource: DiscoverySource }) {
  const rows = [
    ['Project name', discoveryResultFixture.projectName],
    ['Source', selectedSource.title],
    ['Repositories', discoveryResultFixture.repositories.join(', ')],
    ['Framework', discoveryResultFixture.framework],
    ['Design system', discoveryResultFixture.designSystem],
    ['Components found', `${discoveryResultFixture.componentsFound}`],
    ['Configuration', '3 suggestions selected'],
  ];

  return (
    <div>
      <h2 className='text-2xl font-semibold text-foreground'>Confirm and import</h2>
      <p className='mt-2 text-sm text-muted-foreground'>
        Import saves this project and its reviewed setup into ComponentIQ.
      </p>
      <div className='mt-6 overflow-hidden rounded-md border border-border bg-background'>
        <table className='w-full text-left text-sm'>
          <tbody className='divide-y divide-border'>
            {rows.map(([label, value]) => (
              <tr key={label}>
                <th scope='row' className='w-48 px-4 py-3 font-semibold text-muted-foreground'>
                  {label}
                </th>
                <td className='px-4 py-3 text-foreground'>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
