import type { ProjectRow } from '@/features/projects/types';

export type ImportProjectFlowProps = {
  open: boolean;
  organizationId: string;
  // eslint-disable-next-line no-unused-vars
  onOpenChange(open: boolean): void;
  // eslint-disable-next-line no-unused-vars
  onImported(project: ProjectRow): void;
};

export type FlowStep = 0 | 1 | 2 | 3 | 4;
export type DiscoveryError =
  | 'repo_unavailable'
  | 'github_expired'
  | 'corrupted_archive'
  | 'failed'
  | null;

export const flowSteps = [
  { id: 'source', label: 'Choose source', description: 'Pick where we discover from.' },
  { id: 'connect', label: 'Connect', description: 'Connect or select source data.' },
  { id: 'discover', label: 'Discover', description: 'Analyse the project.' },
  { id: 'review', label: 'Review', description: 'Check suggested setup.' },
  { id: 'confirm', label: 'Import', description: 'Save when ready.' },
];
