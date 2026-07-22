'use client';

import type { AuditSessionSummary } from '@winniekagendo/componentiq-shared-types';
import { EmptyState } from 'componentiq';
import { Package } from 'lucide-react';

import {
  projectDetailsFixture,
  sidebarSectionLabels,
} from '@/features/projects/fixtures/projects';
import type { SidebarSection } from '@/features/projects/types';

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
