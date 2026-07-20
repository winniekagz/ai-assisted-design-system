import type { ProjectListItem } from '@winniekagendo/componentiq-shared-types';

export type CreatedProjectDraft = {
  apiProject: ProjectListItem;
};

export type CreateProjectDrawerProps = {
  open: boolean;
  orgSlug: string;
  existingProjectNames: string[];
  teamOptions: string[];
  // eslint-disable-next-line no-unused-vars
  onOpenChange(open: boolean): void;
  // eslint-disable-next-line no-unused-vars
  onCreated(project: CreatedProjectDraft): void;
  // eslint-disable-next-line no-unused-vars
  onConfigureProject?(project: ProjectListItem): void;
};

export type FieldErrors = {
  name?: string;
  description?: string;
};
