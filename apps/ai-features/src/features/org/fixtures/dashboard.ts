// FIXTURE: Project dashboard data mirrors the design handoff prototype.
// Replace this file with real audit/findings/overrides/adoption/activity API data
// once the backend exposes project-dashboard endpoints.

export type DashboardState =
  | 'blocked'
  | 'at-risk'
  | 'healthy'
  | 'no-audit'
  | 'disconnected'
  | 'stale'
  | 'refresh-error'
  | 'audit-running';

export type DashboardRoleView = 'manager' | 'maintainer' | 'developer';

export type DashboardCounts = {
  blocking: number;
  warnings: number;
  overrides: number;
};

export type ProjectDashboardFixture = {
  project: {
    name: string;
    slug: string;
    repository: string;
    branch: string;
    designSystem: string;
    latestPullRequest: string;
    latestSha: string;
  };
  findings: BlockingFinding[];
  overrides: PendingOverride[];
  suggestions: SuggestedAction[];
  topRules: ViolatedRule[];
  activity: ActivityItem[];
};

export type BlockingFinding = {
  id: string;
  title: string;
  location: string;
  rule: string;
  pr: string;
  assignee: string;
  age: string;
};

export type PendingOverride = {
  id: string;
  title: string;
  requester: string;
  pr: string;
  expiry: string;
  reason: string;
  rules: string;
};

export type SuggestedAction = {
  id: string;
  tag: 'Detected' | 'Recommended' | 'AI suggestion';
  text: string;
};

export type ViolatedRule = {
  id: string;
  rule: string;
  open: number;
  trend: string;
  trendTone: 'error' | 'success';
  area: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  detail?: string;
  time: string;
  tone: 'error' | 'warning' | 'success' | 'muted';
};

export const dashboardStates = [
  'blocked',
  'at-risk',
  'healthy',
  'no-audit',
  'disconnected',
  'stale',
  'refresh-error',
  'audit-running',
] as const satisfies DashboardState[];

export const dashboardRoleViews = [
  'manager',
  'maintainer',
  'developer',
] as const satisfies DashboardRoleView[];

export const projectDashboardFixture: ProjectDashboardFixture = {
  project: {
    name: 'Checkout Web',
    slug: 'checkout-web',
    repository: 'acme/checkout-web',
    branch: 'main',
    designSystem: 'Acme Design System v3.4',
    latestPullRequest: 'PR #128',
    latestSha: 'a8d7f21',
  },
  findings: [
    {
      id: 'raw-hex-checkout-button',
      title: 'Raw hex colour bypasses approved token',
      location: 'src/components/CheckoutButton.tsx:42',
      rule: 'Use approved colour tokens',
      pr: 'PR #128',
      assignee: 'Unassigned',
      age: '12 minutes ago',
    },
    {
      id: 'modal-accessible-title',
      title: 'Modal is missing an accessible title',
      location: 'src/features/projects/DeleteProjectModal.tsx:18',
      rule: 'Dialogs require an accessible name',
      pr: 'PR #128',
      assignee: 'Winnie Kagendo',
      age: '12 minutes ago',
    },
    {
      id: 'deprecated-button-primary',
      title: 'Deprecated ButtonPrimary introduced',
      location: 'src/features/checkout/CheckoutSummary.tsx:64',
      rule: 'Deprecated component usage',
      pr: 'PR #128',
      assignee: 'Unassigned',
      age: '12 minutes ago',
    },
  ],
  overrides: [
    {
      id: 'checkout-migration-exception',
      title: 'Temporary checkout migration exception',
      requester: 'Winnie Kagendo',
      pr: 'PR #128',
      expiry: '5 days',
      reason:
        'The checkout migration is tracked under ENG-241. This exception prevents the release from being blocked while the token migration is completed.',
      rules: 'Raw colour values, Deprecated ButtonPrimary usage',
    },
    {
      id: 'legacy-modal-exemption',
      title: 'Legacy modal exemption',
      requester: 'Alex Chen',
      pr: 'PR #121',
      expiry: '2 days',
      reason:
        'Modal accessibility fix is scheduled for next sprint; exception avoids blocking an unrelated hotfix.',
      rules: 'Dialogs require an accessible name',
    },
  ],
  suggestions: [
    {
      id: 'assign-unowned-findings',
      tag: 'Detected',
      text: 'Assign three unowned blocking findings',
    },
    {
      id: 'review-overrides',
      tag: 'Recommended',
      text: 'Review two overrides before deployment',
    },
    {
      id: 'replace-button-primary',
      tag: 'AI suggestion',
      text: 'Replace ButtonPrimary in four files',
    },
  ],
  topRules: [
    {
      id: 'approved-colour-tokens',
      rule: 'Use approved colour tokens',
      open: 12,
      trend: '+4 this week · Increasing',
      trendTone: 'error',
      area: 'checkout/',
    },
    {
      id: 'dialog-accessible-name',
      rule: 'Dialogs require an accessible name',
      open: 6,
      trend: '-2 this week · Improving',
      trendTone: 'success',
      area: 'projects/',
    },
  ],
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
    {
      id: 'rule-activated',
      title: 'Accessible dialog name rule activated',
      detail: 'By Design System Maintainer',
      time: '2 days ago',
      tone: 'muted',
    },
  ],
};

export const dashboardCounts: Record<DashboardState, DashboardCounts> = {
  blocked: { blocking: 3, warnings: 4, overrides: 2 },
  'at-risk': { blocking: 0, warnings: 5, overrides: 2 },
  healthy: { blocking: 0, warnings: 0, overrides: 0 },
  'no-audit': { blocking: 0, warnings: 0, overrides: 0 },
  disconnected: { blocking: 0, warnings: 0, overrides: 0 },
  stale: { blocking: 0, warnings: 5, overrides: 2 },
  'refresh-error': { blocking: 3, warnings: 4, overrides: 2 },
  'audit-running': { blocking: 0, warnings: 0, overrides: 0 },
};
