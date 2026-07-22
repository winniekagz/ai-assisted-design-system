'use client';

import { CreateProjectDrawer } from '@/features/projects/create-project-drawer';
import {
  ProjectConfigurationDrawer,
  type ProjectConfigurationProject,
} from '@/features/projects/project-configuration-drawer';
import { projectRowFromApiProject } from '@/features/projects/project-row-mapper';
import type { ProjectRow } from '@/features/projects/types';

export function ProjectFlowMounts({
  orgSlug,
  createDrawerOpen,
  teamOptions,
  existingProjects,
  configurationProject,
  configurationDrawerOpen,
  onCreateDrawerOpenChange,
  onConfigurationDrawerOpenChange,
  onConfigureProject,
  onCreated,
}: {
  orgSlug: string;
  createDrawerOpen: boolean;
  teamOptions: string[];
  existingProjects: ProjectRow[];
  configurationProject: ProjectConfigurationProject | null;
  configurationDrawerOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onCreateDrawerOpenChange(open: boolean): void;
  // eslint-disable-next-line no-unused-vars
  onConfigurationDrawerOpenChange(open: boolean): void;
  // eslint-disable-next-line no-unused-vars
  onConfigureProject(project: ProjectConfigurationProject): void;
  onCreated(): void;
}) {
  return (
    <>
      <CreateProjectDrawer
        open={createDrawerOpen}
        orgSlug={orgSlug}
        existingProjectNames={existingProjects.map(project => project.name)}
        teamOptions={teamOptions.length > 0 ? teamOptions : ['Unassigned']}
        onOpenChange={onCreateDrawerOpenChange}
        onCreated={onCreated}
        onConfigureProject={project => onConfigureProject(projectRowFromApiProject(project))}
      />
      <ProjectConfigurationDrawer
        open={configurationDrawerOpen}
        orgSlug={orgSlug}
        project={configurationProject}
        onOpenChange={onConfigurationDrawerOpenChange}
      />
    </>
  );
}
