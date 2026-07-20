import type { AuditInputType } from '@winniekagendo/componentiq-shared-types';

export type RunAuditDrawerProps = {
  open: boolean;
  orgSlug: string;
  organizationId: string;
  projectId: string;
  projectName: string;
  // eslint-disable-next-line no-unused-vars
  onOpenChange(open: boolean): void;
};

export const inputTypeOptions: Array<{ value: AuditInputType; label: string }> = [
  { value: 'jsx', label: 'JSX' },
  { value: 'plan', label: 'Implementation plan' },
  { value: 'diff', label: 'Diff' },
];
