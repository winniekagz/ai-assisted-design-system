'use client';

import type { ProjectsListState } from '@/features/projects/types';

export function isProjectsListState(value: string | null): value is ProjectsListState {
  return value === 'populated' || value === 'empty' || value === 'loading';
}

export function uniqueProjectOptions(values: string[]) {
  return Array.from(new Set(values)).sort((first, second) =>
    first.localeCompare(second)
  );
}
