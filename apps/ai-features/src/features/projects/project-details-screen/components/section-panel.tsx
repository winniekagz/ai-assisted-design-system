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

import { DesignSystemsPanel } from './design-systems-panel';
import { FindingsTable } from './findings-table';
import { RepositoriesPanel } from './repositories-panel';

export function SectionPanel({
  activeSection,
  audits,
}: {
  activeSection: SidebarSection;
  audits: AuditSessionSummary[];
}) {
  if (activeSection === 'overview' || activeSection === 'findings') {
    return <FindingsTable audits={audits} />;
  }

  if (activeSection === 'repositories') {
    return <RepositoriesPanel repositories={projectDetailsFixture.repositories} />;
  }

  if (activeSection === 'design_systems') {
    return <DesignSystemsPanel />;
  }

  return (
    <EmptyState
      icon={<Package className='size-5' />}
      title={`${sidebarSectionLabels[activeSection]} coming soon`}
      description='This project section is wired in the sidebar and will be populated when the backend endpoint is available.'
    />
  );
}
