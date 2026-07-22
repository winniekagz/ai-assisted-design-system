'use client';

import { Progress } from 'componentiq';

import { StatusCallout } from '../shared-components';
import type { LocalSourceSelection } from '../types';
import { formatBytes } from '../utils';
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
