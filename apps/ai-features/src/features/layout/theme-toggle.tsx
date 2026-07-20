'use client';

import { Monitor, Sun } from 'lucide-react';

import { cn } from 'componentiq';
import { useWorkspaceStore } from '@/stores/workspace-store';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const themeMode = useWorkspaceStore(state => state.themeMode);
  const setThemeMode = useWorkspaceStore(state => state.setThemeMode);
  const isSystem = themeMode === 'system';

  function toggleTheme() {
    setThemeMode(isSystem ? 'light' : 'system');
  }

  return (
    <button
      type='button'
      onClick={toggleTheme}
      aria-label={isSystem ? 'Use light theme' : 'Use system theme'}
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-border bg-background-secondary text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        compact ? 'size-10 shrink-0' : 'h-10 gap-2 px-3 text-sm font-medium'
      )}
    >
      {isSystem ? <Monitor className='size-4' /> : <Sun className='size-4' />}
      {!compact && <span>{isSystem ? 'System theme' : 'Light theme'}</span>}
    </button>
  );
}
