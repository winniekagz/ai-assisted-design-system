'use client';

import { EmptyState } from 'componentiq';
import { Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { OrgFrame } from '@/features/org/org-frame';
import {
  useProjectConfiguration,
  useProjects,
} from '@/features/projects/hooks';
import {
  ProjectConfigurationDrawer,
  getConfigurationStatus,
} from '@/features/projects/project-configuration-drawer';
import { projectRowFromApiProject } from '@/features/projects/project-row-mapper';
import { ProjectSettingsDrawer } from '@/features/projects/project-settings-drawer';
import { useWorkspaceStore } from '@/stores/workspace-store';

import {
  ProjectDetailHeader,
  ProjectDetailsSkeleton,
  ProjectSetupCard,
  ReadyProjectOverview,
  SetupRequiredPanel,
} from './components';

export function ProjectDetailsScreen({
  orgSlug,
  projectSlug,
}: {
  orgSlug: string;
  projectSlug: string;
}) {
  return (
    <OrgFrame orgSlug={orgSlug}>
      {({ membership }) => (
        <ProjectDetailsContent
          projectSlug={projectSlug}
          orgSlug={orgSlug}
          role={membership.role}
        />
      )}
    </OrgFrame>
  );
}

function ProjectDetailsContent({
  projectSlug,
  orgSlug,
  role,
}: {
  projectSlug: string;
  orgSlug: string;
  role: string;
}) {
  const router = useRouter();
  const setActiveProjectSection = useWorkspaceStore(
    state => state.setActiveProjectSection
  );
  const projectsQuery = useProjects(orgSlug);
  const project = useMemo(() => {
    const apiProject = projectsQuery.data?.find(item => item.slug === projectSlug);
    return apiProject ? projectRowFromApiProject(apiProject) : null;
  }, [projectsQuery.data, projectSlug]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configurationOpen, setConfigurationOpen] = useState(false);
  const configurationQuery = useProjectConfiguration(orgSlug, project?.id ?? '');
  const configurationStatus =
    configurationQuery.data?.projectStatus ?? getConfigurationStatus(project);
  const configurationComplete = configurationStatus === 'READY';
  const showSetupCard =
    configurationStatus !== 'READY' && configurationStatus !== 'ARCHIVED';

  useEffect(() => {
    setActiveProjectSection('overview');
  }, [projectSlug, setActiveProjectSection]);

  if (projectsQuery.isLoading) {
    return <ProjectDetailsSkeleton />;
  }

  if (!project) {
    return (
      <EmptyState
        icon={<Package className='size-5' />}
        title='Project not found'
        description="This project doesn't exist in this organization, or you don't have access to it."
        actionLabel='Back to projects'
        onAction={() => router.push(`/org/${orgSlug}/projects`)}
      />
    );
  }

  return (
    <main className='grid min-w-0 gap-4'>
      <ProjectDetailHeader
        project={project}
        role={role}
        configurationStatus={configurationStatus}
        configurationComplete={configurationComplete}
        lastAudited='No audits yet'
        onConfigureProject={() => setConfigurationOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onRunAudit={() => undefined}
      />
      {showSetupCard ? (
        <ProjectSetupCard
          project={project}
          status={configurationStatus}
          onConfigureProject={() => setConfigurationOpen(true)}
        />
      ) : configurationQuery.data ? (
        <ReadyProjectOverview
          configuration={configurationQuery.data}
          onReviewConfiguration={() => setConfigurationOpen(true)}
        />
      ) : (
        <ProjectDetailsSkeleton />
      )}
      {!configurationComplete && <SetupRequiredPanel status={configurationStatus} />}
      <ProjectConfigurationDrawer
        open={configurationOpen}
        orgSlug={orgSlug}
        project={project}
        onOpenChange={setConfigurationOpen}
      />
      <ProjectSettingsDrawer
        open={settingsOpen}
        project={project}
        orgSlug={orgSlug}
        existingProjectNames={projectsQuery.data?.map(item => item.name) ?? []}
        onOpenChange={setSettingsOpen}
      />
    </main>
  );
}
