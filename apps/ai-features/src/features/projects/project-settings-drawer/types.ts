import type {
  ProjectSettingsForm,
  ProjectSettingsStatus,
} from '@/features/projects/fixtures/settings';
import type { ProjectRow } from '@/features/projects/types';

export type ProjectSettingsDrawerProps = {
  open: boolean;
  project: ProjectRow;
  orgSlug: string;
  existingProjectNames: string[];
  // eslint-disable-next-line no-unused-vars
  onOpenChange(open: boolean): void;
};

export type UpdateProjectSettingsForm = (
  // eslint-disable-next-line no-unused-vars
  updater: (current: ProjectSettingsForm) => ProjectSettingsForm
) => void;

export const statusOptions: Array<{
  value: ProjectSettingsStatus;
  label: string;
}> = [
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
  { value: 'read_only', label: 'Read Only' },
  { value: 'pending_setup', label: 'Pending Setup' },
];
