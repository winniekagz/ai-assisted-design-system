import { Button, Card, CardContent } from 'componentiq';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

import type { GithubCallbackState } from './use-complete-github-callback';

type GithubCallbackStatusProps = {
  state: GithubCallbackState;
  onBack?: () => void;
};

export function GithubCallbackStatus({
  state,
  onBack,
}: GithubCallbackStatusProps) {
  return (
    <main className='grid min-h-screen place-items-center bg-background px-4'>
      <Card className='w-full max-w-md rounded-md border-border bg-background py-0 shadow-none'>
        <CardContent className='px-5 py-5'>
          {state.status === 'loading' && <LoadingState />}
          {state.status === 'success' && <SuccessState />}
          {state.status === 'error' && (
            <ErrorState message={state.message} onBack={onBack} />
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function LoadingState() {
  return (
    <div className='grid gap-3 text-center'>
      <Loader2 className='mx-auto size-7 animate-spin text-primary' />
      <h1 className='text-lg font-semibold text-foreground'>
        Connecting GitHub
      </h1>
      <p className='text-sm leading-6 text-muted-foreground'>
        Component IQ is verifying the GitHub App installation.
      </p>
    </div>
  );
}

function SuccessState() {
  return (
    <div className='grid gap-3 text-center'>
      <CheckCircle2 className='mx-auto size-7 text-status-success' />
      <h1 className='text-lg font-semibold text-foreground'>GitHub connected</h1>
      <p className='text-sm leading-6 text-muted-foreground'>
        Returning you to project setup.
      </p>
    </div>
  );
}

function ErrorState({
  message,
  onBack,
}: {
  message: string;
  onBack?: () => void;
}) {
  return (
    <div className='grid gap-4 text-center'>
      <AlertCircle className='mx-auto size-7 text-status-error' />
      <div>
        <h1 className='text-lg font-semibold text-foreground'>
          GitHub connection failed
        </h1>
        <p className='mt-2 text-sm leading-6 text-muted-foreground'>{message}</p>
      </div>
      <Button type='button' onClick={onBack}>
        Return to setup
      </Button>
    </div>
  );
}
