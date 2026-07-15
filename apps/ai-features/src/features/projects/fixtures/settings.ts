// FIXTURE: Project settings drawer data.
// Replace with real project settings, repositories, rule summary, integrations,
// and ownership APIs once those backend endpoints exist.

import type { ProjectRow } from './projects';

export type ProjectSettingsStatus = 'active' | 'archived' | 'read_only' | 'pending_setup';
export type ProjectSettingsSection =
  | 'general'
  | 'repositories'
  | 'team'
  | 'audit'
  | 'rules'
  | 'integrations'
  | 'advanced'
  | 'danger';

export type ProjectSettingsForm = {
  name: string;
  description: string;
  team: string;
  tags: string[];
  status: ProjectSettingsStatus;
  audit: {
    cliAudits: boolean;
    githubChecks: boolean;
    prePushHook: boolean;
    ciPipeline: boolean;
    defaultSeverity: 'Blocking' | 'Warning' | 'Advisory';
  };
};

export const settingsSections: Array<{ id: ProjectSettingsSection; label: string }> = [
  { id: 'general', label: 'General' },
  { id: 'repositories', label: 'Repositories' },
  { id: 'team', label: 'Team' },
  { id: 'audit', label: 'Audit' },
  { id: 'rules', label: 'Rules' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'danger', label: 'Danger zone' },
];

export const statusExplanations: Record<ProjectSettingsStatus, string> = {
  active: 'Project appears in normal workflows and can run audits.',
  archived: 'Project is hidden from active work but history remains available.',
  read_only: 'Project can be viewed, but settings and audit configuration are locked.',
  pending_setup: 'Project is reserved and still needs repository/design-system setup.',
};

export const settingsTeamOptions = [
  'Commerce',
  'Finance Platform',
  'Internal Tools',
  'Growth',
  'Design Systems',
  'Mobile',
  'Unassigned',
];

export const settingsMetadataFixture = {
  createdBy: 'Winnie Kagendo',
  createdAt: 'Jul 14, 2026',
  updatedAt: 'Jul 15, 2026',
  auditCount: 18,
  environment: 'Production',
  webhookEndpoint: 'https://api.componentiq.local/webhooks/projects/checkout-web',
};

export const settingsRepositoriesFixture = [
  {
    id: 'checkout-web',
    name: 'acme/checkout-web',
    provider: 'GitHub',
    defaultBranch: 'main',
    latestAudit: '12 minutes ago',
    status: 'Needs reconnect',
  },
  {
    id: 'checkout-api',
    name: 'acme/checkout-api',
    provider: 'GitHub',
    defaultBranch: 'main',
    latestAudit: '1 hour ago',
    status: 'Connected',
  },
  {
    id: 'checkout-mobile',
    name: 'acme/checkout-mobile',
    provider: 'GitHub',
    defaultBranch: 'release/3.4',
    latestAudit: 'Yesterday',
    status: 'Connected',
  },
];

export const settingsRulesFixture = {
  inherited: 42,
  overrides: 6,
  custom: 3,
  exceptions: 2,
};

export const settingsIntegrationsFixture = [
  { id: 'github', name: 'GitHub', status: 'Needs attention', future: false },
  { id: 'cli', name: 'Local CLI', status: 'Connected', future: false },
  { id: 'storybook', name: 'Storybook', status: 'Coming soon', future: true },
  { id: 'figma', name: 'Figma', status: 'Coming soon', future: true },
  { id: 'slack', name: 'Slack', status: 'Coming soon', future: true },
];

export function initialSettingsFromProject(project: ProjectRow): ProjectSettingsForm {
  return {
    name: project.name,
    description: project.description,
    team: project.team,
    tags: project.tags,
    status:
      project.status === 'archived'
        ? 'archived'
        : project.status === 'not_configured'
          ? 'pending_setup'
          : 'active',
    audit: {
      cliAudits: true,
      githubChecks: true,
      prePushHook: false,
      ciPipeline: true,
      defaultSeverity: 'Blocking',
    },
  };
}
