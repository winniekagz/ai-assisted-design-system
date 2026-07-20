'use client';

import {
  Button,
  Card,
  CardContent,
  EmptyState,
  Skeleton,
  cn,
} from 'componentiq';
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  Clock,
  GitBranch,
  Palette,
  Package,
  Settings,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import type { AuditFindingResponse, AuditSessionSummary } from '@winniekagendo/componentiq-shared-types';

import { OrgFrame } from '@/features/org/org-frame';
import {
  useProjectAudits,
  useProjectConfiguration,
  useProjects,
} from '@/features/projects/hooks';
import type {
  ProjectActivity,
  ProjectRepository,
  ProjectRow,
  SidebarSection,
} from '@/features/projects/types';
import { formatDate } from '@/shared/format-date';
import { useWorkspaceStore } from '@/stores/workspace-store';

import {
  projectDetailsFixture,
  sidebarSectionLabels,
} from '@/features/projects/fixtures/projects';
import {
  ConfigurationStatusBadge,
  ProjectConfigurationDrawer,
  type ProjectConfigurationStatus,
  getConfigurationStatus,
} from '@/features/projects/project-configuration-drawer';
import { projectRowFromApiProject } from '@/features/projects/project-row-mapper';
import { ProjectSettingsDrawer } from '@/features/projects/project-settings-drawer';
import { RunAuditDrawer } from '@/features/projects/run-audit-drawer';

export function ProjectDetailsScreen({
  orgSlug,
  projectSlug,
}: {
  orgSlug: string;
  projectSlug: string;
}) {
  return (
    <OrgFrame orgSlug={orgSlug}>
      {({ organization, membership }) => (
        <ProjectDetailsContent
          projectSlug={projectSlug}
          orgSlug={orgSlug}
          organizationId={organization.id}
          role={membership.role}
        />
      )}
    </OrgFrame>
  );
}

function ProjectDetailsContent({
  projectSlug,
  orgSlug,
  organizationId,
  role,
}: {
  projectSlug: string;
  orgSlug: string;
  organizationId: string;
  role: string;
}) {
  const router = useRouter();
  const activeSection = useWorkspaceStore(state => state.activeProjectSection);
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
  const [auditDrawerOpen, setAuditDrawerOpen] = useState(false);
  const configurationQuery = useProjectConfiguration(orgSlug, project?.id ?? '');
  const auditsQuery = useProjectAudits(orgSlug, project?.id ?? '');
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
        lastAudited={auditsQuery.data?.[0] ? formatDate(auditsQuery.data[0].createdAt) : 'Never'}
        onConfigureProject={() => setConfigurationOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onRunAudit={() => setAuditDrawerOpen(true)}
      />
      {showSetupCard ? (
        <ProjectSetupCard
          project={project}
          status={configurationStatus}
          onConfigureProject={() => setConfigurationOpen(true)}
        />
      ) : (
        <>
          <DeploymentStatusPanel
            audits={auditsQuery.data ?? []}
            onRunAudit={() => setAuditDrawerOpen(true)}
          />
          <LatestAuditSummary project={project} audits={auditsQuery.data ?? []} />
        </>
      )}
      {configurationComplete ? (
        <SectionPanel activeSection={activeSection} audits={auditsQuery.data ?? []} />
      ) : (
        <SetupRequiredPanel status={configurationStatus} />
      )}
      <RecentActivityCard activity={projectDetailsFixture.activity} />
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
      <RunAuditDrawer
        open={auditDrawerOpen}
        orgSlug={orgSlug}
        organizationId={organizationId}
        projectId={project.id}
        projectName={project.name}
        onOpenChange={setAuditDrawerOpen}
      />
    </main>
  );
}

import {
  DeploymentStatusPanel,
  DesignSystemsPanel,
  FindingsTable,
  LatestAuditSummary,
  ProjectDetailHeader,
  ProjectDetailsSkeleton,
  ProjectSetupCard,
  RecentActivityCard,
  RepositoriesPanel,
  SectionPanel,
  SetupRequiredPanel,
} from './components';
