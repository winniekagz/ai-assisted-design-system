// FIXTURE: Projects experience data mirrors the design handoff prototype.
// Replace this file with real project, finding, repository, design-system, and
// activity API data once backend endpoints exist.

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

export const projectStatuses = [
  'healthy',
  'needs_attention',
  'blocked',
  'not_configured',
  'archived',
] as const satisfies ProjectStatus[];

export const sidebarSections = [
  'overview',
  'findings',
  'repositories',
  'design_systems',
  'rules',
  'audit_history',
  'settings',
] as const satisfies SidebarSection[];

export const sidebarSectionLabels: Record<SidebarSection, string> = {
  overview: 'Overview',
  findings: 'Findings',
  repositories: 'Repositories',
  design_systems: 'Design systems',
  rules: 'Rules',
  audit_history: 'Audit history',
  settings: 'Settings',
};

export const projectRows: ProjectRow[] = [
  {
    id: 'checkout-web',
    name: 'Checkout Web',
    slug: 'checkout-web',
    repository: 'acme/checkout-web',
    team: 'Commerce',
    framework: 'Next.js',
    tags: ['checkout', 'revenue'],
    description: 'Primary customer checkout surface for web purchases.',
    status: 'blocked',
    blockingCount: 3,
    latestAudit: { state: 'failed', label: 'Failed', relativeTime: '12 minutes ago' },
    designSystem: {
      state: 'outdated',
      label: 'Outdated',
      version: 'Acme Design System v3.2, latest v3.4',
    },
    latestActivity: 'Audit failed on PR #128',
    repoCount: 3,
    lastAudited: '12 minutes ago',
  },
  {
    id: 'billing-portal',
    name: 'Billing Portal',
    slug: 'billing-portal',
    repository: 'acme/billing-portal',
    team: 'Finance Platform',
    framework: 'React',
    tags: ['billing', 'admin'],
    description: 'Self-service invoices, billing details, and payment settings.',
    status: 'needs_attention',
    blockingCount: 0,
    latestAudit: { state: 'warning', label: 'Needs review', relativeTime: '38 minutes ago' },
    designSystem: {
      state: 'current',
      label: 'Current',
      version: 'Acme Design System v3.4',
    },
    latestActivity: 'Override expires in 5 days',
    repoCount: 1,
    lastAudited: '38 minutes ago',
  },
  {
    id: 'admin-console',
    name: 'Admin Console',
    slug: 'admin-console',
    repository: 'acme/admin-console',
    team: 'Internal Tools',
    framework: 'Next.js',
    tags: ['admin', 'ops'],
    description: 'Operational console for support and success workflows.',
    status: 'healthy',
    blockingCount: 0,
    latestAudit: { state: 'passed', label: 'Passed', relativeTime: '1 hour ago' },
    designSystem: {
      state: 'current',
      label: 'Current',
      version: 'Acme Design System v3.4',
    },
    latestActivity: 'Four deprecated components resolved',
    repoCount: 1,
    lastAudited: '1 hour ago',
  },
  {
    id: 'marketing-site',
    name: 'Marketing Site',
    slug: 'marketing-site',
    repository: 'acme/marketing-site',
    team: 'Growth',
    framework: 'Astro',
    tags: ['marketing', 'public'],
    description: 'Public website and campaign pages.',
    status: 'not_configured',
    blockingCount: 0,
    latestAudit: { state: 'not_run', label: 'Not run', relativeTime: 'Never' },
    designSystem: {
      state: 'base',
      label: 'Base Design System',
      version: 'Base Design System v1.0',
    },
    latestActivity: 'Repository imported',
    repoCount: 1,
    lastAudited: 'Never',
  },
  {
    id: 'design-system-docs',
    name: 'Design System Docs',
    slug: 'design-system-docs',
    repository: 'acme/design-system-docs',
    team: 'Design Systems',
    framework: 'Storybook',
    tags: ['docs', 'tokens'],
    description: 'Documentation and examples for consuming teams.',
    status: 'healthy',
    blockingCount: 0,
    latestAudit: { state: 'passed', label: 'Passed', relativeTime: 'Yesterday' },
    designSystem: {
      state: 'none',
      label: 'None',
    },
    latestActivity: 'Token guidance updated',
    repoCount: 1,
    lastAudited: 'Yesterday',
  },
  {
    id: 'legacy-mobile-web',
    name: 'Legacy Mobile Web',
    slug: 'legacy-mobile-web',
    repository: 'acme/legacy-mobile-web',
    team: 'Mobile',
    framework: 'Vue',
    tags: ['legacy', 'mobile'],
    description: 'Legacy mobile purchasing flow kept for long-tail clients.',
    status: 'archived',
    blockingCount: 0,
    latestAudit: { state: 'not_run', label: 'Archived', relativeTime: '90 days ago' },
    designSystem: {
      state: 'outdated',
      label: 'Outdated',
      version: 'Acme Design System v2.8, latest v3.4',
    },
    latestActivity: 'Project archived',
    repoCount: 1,
    lastAudited: '90 days ago',
  },
];

export const projectDetailsFixture: ProjectDetailsFixture = {
  findings: [
    {
      id: 'raw-hex-checkout-button',
      severity: 'Critical',
      title: 'Raw hex colour bypasses approved token',
      location: 'src/components/CheckoutButton.tsx:42',
      rule: 'Use approved colour tokens',
      assignee: 'Unassigned',
      age: '12 minutes ago',
    },
    {
      id: 'modal-accessible-title',
      severity: 'High',
      title: 'Modal is missing an accessible title',
      location: 'src/features/projects/DeleteProjectModal.tsx:18',
      rule: 'Dialogs require an accessible name',
      assignee: 'Winnie Kagendo',
      age: '12 minutes ago',
    },
    {
      id: 'deprecated-button-primary',
      severity: 'Medium',
      title: 'Deprecated ButtonPrimary introduced',
      location: 'src/features/checkout/CheckoutSummary.tsx:64',
      rule: 'Deprecated component usage',
      assignee: 'Unassigned',
      age: '12 minutes ago',
    },
  ],
  repositories: [
    {
      id: 'checkout-web',
      name: 'acme/checkout-web',
      branch: 'main',
      lastCommit: 'a8d7f21 · 12 minutes ago',
      status: 'Needs review',
    },
    {
      id: 'checkout-api',
      name: 'acme/checkout-api',
      branch: 'main',
      lastCommit: 'b94e2c4 · 1 hour ago',
      status: 'Connected',
    },
    {
      id: 'checkout-mobile',
      name: 'acme/checkout-mobile',
      branch: 'release/3.4',
      lastCommit: 'f17a9dd · Yesterday',
      status: 'Connected',
    },
  ],
  designSystemStats: {
    name: 'Acme Design System v3.4',
    coverage: 88,
    deprecated: 4,
    outdated: 12,
  },
  activity: [
    {
      id: 'audit-failed-pr-128',
      title: 'Audit failed on PR #128',
      detail: '3 blocking findings were introduced',
      time: '12 minutes ago',
      tone: 'error',
    },
    {
      id: 'override-requested',
      title: 'Winnie requested an override',
      detail: 'Checkout migration exception',
      time: '18 minutes ago',
      tone: 'warning',
    },
    {
      id: 'deprecated-resolved',
      title: 'Four deprecated component usages were resolved',
      detail: 'PR #126',
      time: 'Yesterday',
      tone: 'success',
    },
  ],
};
