import type { ProjectConfigurationStatus } from '@winniekagendo/componentiq-shared-types';

export type ProjectStatus =
  | 'healthy'
  | 'needs_attention'
  | 'blocked'
  | 'not_configured'
  | 'archived';

export type AuditState = 'passed' | 'failed' | 'warning' | 'not_run' | 'running';

export type DesignSystemState = 'current' | 'outdated' | 'base' | 'none';

export type SidebarSection =
  | 'overview'
  | 'findings'
  | 'repositories'
  | 'design_systems'
  | 'rules'
  | 'audit_history'
  | 'settings';

export type ProjectsListState = 'populated' | 'empty' | 'loading';

export type ProjectRow = {
  id: string;
  name: string;
  slug: string;
  repository: string;
  team: string;
  framework: string;
  tags: string[];
  description: string;
  status: ProjectStatus;
  configurationStatus?: ProjectConfigurationStatus;
  blockingCount: number;
  latestAudit: {
    state: AuditState;
    label: string;
    relativeTime: string;
  };
  designSystem: {
    state: DesignSystemState;
    label: string;
    version?: string;
  };
  latestActivity: string;
  repoCount: number;
  lastAudited: string;
};

export type ProjectFinding = {
  id: string;
  severity: 'Critical' | 'High' | 'Medium';
  title: string;
  location: string;
  rule: string;
  assignee: string;
  age: string;
};

export type ProjectRepository = {
  id: string;
  name: string;
  branch: string;
  lastCommit: string;
  status: 'Connected' | 'Needs review' | 'Disconnected';
};

export type ProjectActivity = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: 'error' | 'warning' | 'success' | 'muted';
};

export type ProjectDetailsFixture = {
  findings: ProjectFinding[];
  repositories: ProjectRepository[];
  designSystemStats: {
    name: string;
    coverage: number;
    deprecated: number;
    outdated: number;
  };
  activity: ProjectActivity[];
};
