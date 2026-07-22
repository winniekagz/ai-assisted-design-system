'use client';

import { Github, Upload } from 'lucide-react';
import type { ReactNode } from 'react';

export function SourceChoiceStep({
  onGithub,
  onLocal,
}: {
  onGithub(): void;
  onLocal(): void;
}) {
  return (
    <div className='grid gap-3 sm:grid-cols-2'>
      <SourceCard
        icon={<Github className='size-5' />}
        title='Connect Git repository'
        description='Best for team projects and continuous checks. Requires repository read access.'
        action='Choose GitHub'
        onClick={onGithub}
      />
      <SourceCard
        icon={<Upload className='size-5' />}
        title='Upload local project'
        description='Best for a point-in-time snapshot. Uploads can be deleted after analysis.'
        action='Choose upload'
        onClick={onLocal}
      />
    </div>
  );
}

export function SourceCard({
  icon,
  title,
  description,
  action,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action: string;
  onClick(): void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='grid gap-3 rounded-md border border-border bg-background px-4 py-4 text-left transition-colors hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
    >
      <span className='text-primary' aria-hidden='true'>{icon}</span>
      <span>
        <span className='block font-semibold text-foreground'>{title}</span>
        <span className='mt-1 block text-sm leading-6 text-muted-foreground'>{description}</span>
      </span>
      <span className='text-sm font-semibold text-primary'>{action}</span>
    </button>
  );
}
