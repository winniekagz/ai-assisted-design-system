'use client';

import type { GitProviderConnectionSummary } from '@winniekagendo/componentiq-shared-types';
import { Button, Card, CardContent } from 'componentiq';
import { Loader2, ShieldCheck } from 'lucide-react';

import { StatusCallout } from '../shared-components';

export function GithubPermissionStep({
  connection,
  isLoading,
  isStarting,
  isDisconnecting,
  errorMessage,
  onAuthorize,
  onContinue,
  onDisconnect,
}: {
  connection: GitProviderConnectionSummary | null;
  isLoading: boolean;
  isStarting: boolean;
  isDisconnecting: boolean;
  errorMessage: string | null;
  onAuthorize(): void;
  onContinue(): void;
  // eslint-disable-next-line no-unused-vars
  onDisconnect(connectionId: string): void;
}) {
  const active = connection?.status === 'ACTIVE';

  return (
    <div className='grid gap-4'>
      <StatusCallout
        tone='info'
        title='Connect GitHub App'
        detail='GitHub repository selection happens after the app installation is connected.'
      />
      {errorMessage && (
        <StatusCallout
          tone='warning'
          title='GitHub connection needs attention'
          detail={errorMessage}
        />
      )}
      {active && (
        <StatusCallout
          tone='info'
          title={`Connected to ${connection.accountLogin}`}
          detail='Continue to choose from repositories visible to this GitHub App installation.'
        />
      )}
      {connection?.status === 'DISCONNECTED' && (
        <StatusCallout
          tone='warning'
          title='GitHub disconnected'
          detail='Reconnect GitHub before selecting repositories for this project.'
        />
      )}
      {(connection?.status === 'REVOKED' || connection?.status === 'FAILED') && (
        <StatusCallout
          tone='warning'
          title='Repair GitHub connection'
          detail='GitHub access is not currently valid. Reconnect the GitHub App before selecting repositories.'
        />
      )}
      <PermissionList
        title='ComponentIQ requests permission to'
        items={[
          'Use the permissions configured on your GitHub App installation',
          'Read installation and repository metadata',
          'Store the installation association for this Component IQ organization',
        ]}
      />
      <PermissionList
        title='ComponentIQ cannot'
        items={[
          'Store GitHub installation access tokens in the database',
          'Fetch repository source in this slice',
          'Run audits or pull-request checks from GitHub yet',
        ]}
      />
      <div className='rounded-md border border-border bg-background px-4 py-3 text-sm text-muted-foreground'>
        Access can be revoked from GitHub installation settings. Disconnecting
        here only removes the Component IQ association; it does not uninstall the
        GitHub App or delete projects, configuration jobs, audits, or findings.
      </div>
      {active ? (
        <div className='flex flex-wrap gap-2'>
          <Button type='button' onClick={onContinue}>
            Continue to repositories
          </Button>
          <Button
            type='button'
            variant='outlined'
            disabled={isDisconnecting}
            onClick={() => onDisconnect(connection.id)}
          >
            Disconnect association
          </Button>
        </div>
      ) : (
        <Button
          type='button'
          disabled={isLoading || isStarting}
          onClick={onAuthorize}
          startIcon={
            isStarting ? <Loader2 className='size-4 animate-spin' /> : undefined
          }
        >
          {connection ? 'Repair GitHub connection' : 'Connect GitHub'}
        </Button>
      )}
    </div>
  );
}

export function PermissionList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <Card className='rounded-md border border-border bg-background py-0 shadow-none'>
      <CardContent className='px-4 py-4'>
        <h3 className='font-semibold text-foreground'>{title}</h3>
        <ul className='mt-3 grid gap-2 text-sm text-muted-foreground'>
          {items.map(item => (
            <li key={item} className='flex gap-2'>
              <ShieldCheck
                className='mt-0.5 size-4 shrink-0 text-primary'
                aria-hidden='true'
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
