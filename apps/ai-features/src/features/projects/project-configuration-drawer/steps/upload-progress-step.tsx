'use client';

import { Button, Progress } from 'componentiq';
import { Loader2 } from 'lucide-react';

import { StatusCallout } from '../shared-components';
import type { LocalSourceSelection } from '../types';
import { formatBytes } from '../utils';

export function UploadProgressFooterActions() {
  return (
    <Button type='button' disabled startIcon={<Loader2 className='size-4 animate-spin' />}>
      Uploading
    </Button>
  );
}

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
