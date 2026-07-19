'use client';

import {
  AlertCircle,
  ArrowRight,
  Check,
  Circle,
  ClipboardCheck,
  RefreshCw,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, type ComponentProps, type ReactNode } from 'react';

import {
  Button,
  Card,
  CardContent,
  EmptyState,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  cn,
} from 'componentiq';

import type { Role } from './types';
import { OrgFrame } from './org-frame';
import {
  dashboardCounts,
  dashboardRoleViews,
  dashboardStates,
  projectDashboardFixture,
  type ActivityItem,
  type BlockingFinding,
  type DashboardCounts,
  type DashboardRoleView,
  type DashboardState,
  type PendingOverride,
  type SuggestedAction,
  type ViolatedRule,
} from './fixtures/dashboard';

type ActionTab = 'blocking' | 'overrides' | 'unassigned' | 'mine';

type StatusTone = 'error' | 'warning' | 'success' | 'info' | 'muted';

type StatusMeta = {
  headline: string;
  body: string;
  context: string;
  primaryAction: string;
  tone: StatusTone;
  auditState: 'Passed' | 'Failed';
  lastAuditedLabel: string;
};

const unsupportedActionMessage = 'This action needs the audit workflow API before it can be enabled.';

const statusMeta: Record<DashboardState, StatusMeta> = {
  blocked: {
    headline: 'Deployment blocked',
    body: '3 blocking findings must be resolved before this project can be deployed.',
    context: 'Latest audit failed on PR #128, 12 minutes ago.',
    primaryAction: 'Review blocking findings',
    tone: 'error',
    auditState: 'Failed',
    lastAuditedLabel: '12 minutes ago',
  },
  'at-risk': {
    headline: 'At risk',
    body: 'No blocking findings, but adoption has declined and 2 overrides expire this week.',
    context: 'Latest audit passed on PR #124, 18 minutes ago.',
    primaryAction: 'Review overrides',
    tone: 'warning',
    auditState: 'Passed',
    lastAuditedLabel: '18 minutes ago',
  },
  healthy: {
    headline: 'No issues detected',
    body: 'The latest audit passed and no active findings were found.',
    context: 'Last audited: PR #124, 18 minutes ago.',
    primaryAction: 'View audit details',
    tone: 'success',
    auditState: 'Passed',
    lastAuditedLabel: '18 minutes ago',
  },
  'no-audit': {
    headline: 'No audit data yet',
    body: 'Run the first audit to identify design-system, styling, accessibility, and architectural issues.',
    context: '',
    primaryAction: 'Configure audit',
    tone: 'muted',
    auditState: 'Passed',
    lastAuditedLabel: 'never',
  },
  disconnected: {
    headline: 'Repository connection lost',
    body: 'Pull-request audits cannot run until the GitHub connection is restored.',
    context: '',
    primaryAction: 'Reconnect repository',
    tone: 'error',
    auditState: 'Failed',
    lastAuditedLabel: '12 minutes ago',
  },
  stale: {
    headline: 'Results may be outdated',
    body: 'The latest audit ran seven days ago. New changes may not be reflected.',
    context: '',
    primaryAction: 'Run audit',
    tone: 'warning',
    auditState: 'Passed',
    lastAuditedLabel: '7 days ago',
  },
  'refresh-error': {
    headline: 'Deployment blocked',
    body: '3 blocking findings must be resolved before this project can be deployed.',
    context: 'Latest audit failed on PR #128, 12 minutes ago.',
    primaryAction: 'Review blocking findings',
    tone: 'error',
    auditState: 'Failed',
    lastAuditedLabel: '12 minutes ago',
  },
  'audit-running': {
    headline: 'Audit running',
    body: 'A new audit is analysing this project. Deployment status will update when it completes.',
    context: '',
    primaryAction: 'View progress',
    tone: 'info',
    auditState: 'Passed',
    lastAuditedLabel: '12 minutes ago',
  },
};

export function OrganizationDashboardScreen({ orgSlug }: { orgSlug: string }) {
  return (
    <OrgFrame orgSlug={orgSlug}>
      {({ organization, membership, me }) => (
        <OrganizationDashboardContent
          organizationSlug={organization.slug}
          membershipRole={membership.role}
          userName={me.user.name ?? me.user.email}
        />
      )}
    </OrgFrame>
  );
}

function OrganizationDashboardContent({
  organizationSlug,
  membershipRole,
  userName,
}: {
  organizationSlug: string;
  membershipRole: Role;
  userName: string;
}) {
  const searchParams = useSearchParams();
  const requestedState = searchParams?.get('dashboard_state') ?? null;
  const requestedRole = searchParams?.get('dashboard_role') ?? null;
  const dashboardState = isDashboardState(requestedState) ? requestedState : 'blocked';
  const roleView = isDashboardRoleView(requestedRole)
    ? requestedRole
    : getRoleView(membershipRole);
  const meta = statusMeta[dashboardState];
  const counts = dashboardCounts[dashboardState];
  const fullEmptyState = dashboardState === 'no-audit' || dashboardState === 'disconnected';
  const disconnected = dashboardState === 'disconnected';

  return (
    <div className='grid gap-5'>
      {dashboardState === 'refresh-error' && <DashboardErrorBanner />}

      <ProjectHeader
        orgSlug={organizationSlug}
        state={dashboardState}
        lastAuditedLabel={meta.lastAuditedLabel}
      />

      {fullEmptyState ? (
        <DashboardEmptyState state={dashboardState} />
      ) : (
        <>
          <DeploymentStatusPanel meta={meta} counts={counts} state={dashboardState} />
          {dashboardState === 'audit-running' ? (
            <AuditRunningCard />
          ) : (
            <LatestAuditSummary meta={meta} counts={counts} />
          )}
          <ActionCentre
            counts={counts}
            roleView={roleView}
            state={dashboardState}
            userName={userName}
          />
          <LowerDashboardSection roleView={roleView} />
        </>
      )}

      {disconnected && (
        <p className='sr-only' role='status'>
          Repository connection is disconnected. Run audit actions are hidden.
        </p>
      )}
    </div>
  );
}

function ProjectHeader({
  orgSlug,
  state,
  lastAuditedLabel,
}: {
  orgSlug: string;
  state: DashboardState;
  lastAuditedLabel: string;
}) {
  const project = projectDashboardFixture.project;
  const disconnected = state === 'disconnected';

  return (
    <header className='border-b border-border pb-5'>
      <nav
        aria-label='Project breadcrumb'
        className='mb-3 flex items-center gap-2 font-mono text-[13px] text-muted-foreground'
      >
        <span>{orgSlug}</span>
        <span className='text-border' aria-hidden='true'>
          /
        </span>
        <span className='font-medium text-foreground'>{project.slug}</span>
        <span className='ml-3 rounded-md bg-background-secondary px-2 py-0.5 text-[11px] text-muted-foreground'>
          {project.branch}
        </span>
      </nav>

      <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
        <div>
          <div className='flex flex-wrap items-center gap-2.5'>
            <h1 className='text-[28px] font-bold leading-tight tracking-normal text-foreground'>
              {project.name}
            </h1>
            <ConnectionPill disconnected={disconnected} />
          </div>
          <p className='mt-1.5 font-mono text-[13px] text-muted-foreground'>
            {project.repository} · {project.branch} branch
          </p>
          <p className='mt-1 text-[13px] text-muted-foreground'>
            Design system:{' '}
            <span className='font-medium text-foreground'>{project.designSystem}</span> · Last
            audited {lastAuditedLabel}
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <UnsupportedButton variant='outlined' icon={<Settings className='size-4' />}>
            Project settings
          </UnsupportedButton>
          {!disconnected && (
            <UnsupportedButton icon={<ClipboardCheck className='size-4' />}>
              Run audit
            </UnsupportedButton>
          )}
        </div>
      </div>
    </header>
  );
}

function ConnectionPill({ disconnected }: { disconnected: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold',
        disconnected
          ? 'bg-status-error-bg text-status-error'
          : 'bg-status-success-bg text-status-success'
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          disconnected ? 'bg-status-error' : 'bg-status-success'
        )}
        aria-hidden='true'
      />
      {disconnected ? 'Disconnected' : 'Connected'}
    </span>
  );
}

function DeploymentStatusPanel({
  meta,
  counts,
  state,
}: {
  meta: StatusMeta;
  counts: DashboardCounts;
  state: DashboardState;
}) {
  const tone = toneClasses(meta.tone);
  const showActions = state !== 'healthy';

  return (
    <section
      aria-labelledby='deployment-status-title'
      className={cn(
        'rounded-md border border-l-[3px] p-5 shadow-sm',
        tone.border,
        tone.leftBorder,
        tone.bg
      )}
    >
      <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
        <div className='max-w-xl'>
          <h2 id='deployment-status-title' className={cn('text-base font-bold', tone.text)}>
            {meta.headline}
          </h2>
          <p className='mt-1.5 text-sm leading-6 text-foreground'>{meta.body}</p>
          {meta.context && <p className='mt-2 text-[13px] text-muted-foreground'>{meta.context}</p>}
        </div>
        <div className='grid grid-cols-3 gap-x-7'>
          <StatusMetric label='Blocking' value={counts.blocking} />
          <StatusMetric label='Warnings' value={counts.warnings} />
          <StatusMetric label='Overrides' value={counts.overrides} />
        </div>
      </div>
      {showActions && (
        <div className='mt-4 flex flex-wrap items-center gap-2.5'>
          <UnsupportedButton className='bg-neutral-950 text-white hover:bg-neutral-950/90'>
            {meta.primaryAction}
          </UnsupportedButton>
          <UnsupportedButton variant='outlined' icon={<Users className='size-4' />}>
            Assign owners
          </UnsupportedButton>
          <UnsupportedButton variant='outlined'>Review overrides</UnsupportedButton>
          <UnsupportedButton variant='outlined'>Open latest audit</UnsupportedButton>
        </div>
      )}
    </section>
  );
}

function StatusMetric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className='text-[11px] font-semibold uppercase tracking-[0.04em] text-text-disabled'>
        {label}
      </p>
      <p className='mt-0.5 text-[22px] font-bold leading-tight text-foreground'>{value}</p>
    </div>
  );
}

function LatestAuditSummary({ meta, counts }: { meta: StatusMeta; counts: DashboardCounts }) {
  const failed = meta.auditState === 'Failed';
  const project = projectDashboardFixture.project;

  return (
    <Card className='border border-border-subtle bg-card py-0 shadow-sm'>
      <CardContent className='p-5'>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-wrap items-center gap-2.5'>
            <h2 className='text-[15px] font-bold text-foreground'>Latest audit</h2>
            <span
              className={cn(
                'rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold',
                failed
                  ? 'bg-status-error-bg text-status-error'
                  : 'bg-status-success-bg text-status-success'
              )}
            >
              {meta.auditState}
            </span>
            <span className='text-[13px] text-muted-foreground'>
              on <InlineLink>{project.latestPullRequest}</InlineLink> ·{' '}
              <span className='font-mono'>{project.latestSha}</span>
            </span>
          </div>
          <span className='text-[12.5px] text-text-disabled'>{meta.lastAuditedLabel}</span>
        </div>
        <div className='mt-4 flex flex-wrap gap-7'>
          <AuditStat value={counts.blocking} label='blocking findings' tone='error' />
          <AuditStat value={counts.warnings} label='warnings' tone='warning' />
          <AuditStat value={2} label='resolved' tone='success' />
          <div className='border-l border-border-subtle pl-5'>
            <p className='text-xs text-muted-foreground'>vs. previous audit</p>
            <p className='mt-0.5 text-[13px] font-semibold'>
              <span className='text-status-error'>+2 blocking</span>{' '}
              <span className='text-status-success'>-2 warnings</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AuditStat({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: 'error' | 'warning' | 'success';
}) {
  const text = {
    error: 'text-status-error',
    warning: 'text-status-warning',
    success: 'text-status-success',
  }[tone];
  return (
    <div>
      <p className={cn('text-xl font-bold leading-tight', text)}>{value}</p>
      <p className='mt-0.5 text-[12.5px] text-muted-foreground'>{label}</p>
    </div>
  );
}

function AuditRunningCard() {
  return (
    <Card className='border border-border-subtle bg-card py-0 shadow-sm'>
      <CardContent className='p-5'>
        <div className='flex items-center gap-2'>
          <span className='size-2 rounded-full bg-status-info' aria-hidden='true' />
          <h2 className='text-[15px] font-bold text-foreground'>Audit in progress</h2>
        </div>
        <p className='mt-1.5 text-[13.5px] text-muted-foreground'>Analysing 42 changed files</p>
        <div className='mt-3 grid gap-2'>
          <AuditProgressRow icon={<Check className='size-4' />} tone='success'>
            Component usage complete
          </AuditProgressRow>
          <AuditProgressRow icon={<RefreshCw className='size-4' />} tone='info'>
            Design token checks running
          </AuditProgressRow>
          <AuditProgressRow icon={<Circle className='size-3' />} tone='muted'>
            Accessibility queued
          </AuditProgressRow>
        </div>
      </CardContent>
    </Card>
  );
}

function AuditProgressRow({
  icon,
  tone,
  children,
}: {
  icon: ReactNode;
  tone: 'success' | 'info' | 'muted';
  children: ReactNode;
}) {
  const text = {
    success: 'text-status-success',
    info: 'text-status-info',
    muted: 'text-text-disabled',
  }[tone];
  return (
    <div className='flex items-center gap-2 text-[13px] text-foreground'>
      <span className={text} aria-hidden='true'>
        {icon}
      </span>
      {children}
    </div>
  );
}

function ActionCentre({
  counts,
  roleView,
  state,
  userName,
}: {
  counts: DashboardCounts;
  roleView: DashboardRoleView;
  state: DashboardState;
  userName: string;
}) {
  const [tab, setTab] = useState<ActionTab>('blocking');
  const visibleFindings = counts.blocking > 0 ? projectDashboardFixture.findings : [];
  const visibleOverrides = counts.overrides > 0 ? projectDashboardFixture.overrides : [];

  return (
    <section aria-labelledby='action-centre-title' className='mt-2'>
      <h2
        id='action-centre-title'
        className='mb-2.5 text-[13px] font-bold uppercase tracking-[0.04em] text-muted-foreground'
      >
        Action centre
      </h2>

      <Tabs value={tab} onValueChange={value => setTab(value as ActionTab)}>
        <TabsList
          aria-label='Project dashboard actions'
          className='flex flex-wrap items-center gap-5 border-b border-border bg-transparent'
        >
          <ActionTabTrigger value='blocking'>Blocking findings ({counts.blocking})</ActionTabTrigger>
          <ActionTabTrigger value='overrides'>Pending overrides ({counts.overrides})</ActionTabTrigger>
          <ActionTabTrigger value='unassigned'>Unassigned</ActionTabTrigger>
          <ActionTabTrigger value='mine'>Assigned to me</ActionTabTrigger>
        </TabsList>

        <TabsContent value='blocking' className='mt-3.5'>
          {visibleFindings.length > 0 ? (
            <BlockingFindingsTable findings={visibleFindings} />
          ) : (
            <DashboardSmallEmpty
              title='No blocking findings'
              description='Deployment is not currently blocked. Warnings may still require attention.'
            />
          )}
        </TabsContent>
        <TabsContent value='overrides' className='mt-3.5'>
          {visibleOverrides.length > 0 ? (
            <PendingOverridesList overrides={visibleOverrides} roleView={roleView} />
          ) : (
            <DashboardSmallEmpty
              title='No overrides awaiting review'
              description='Override requests will appear here when a user requests an exception to a blocking rule.'
            />
          )}
        </TabsContent>
        <TabsContent value='unassigned' className='mt-3.5'>
          <UnassignedCard count={unassignedCount(visibleFindings)} />
        </TabsContent>
        <TabsContent value='mine' className='mt-3.5'>
          <AssignedToMeCard userName={userName} finding={projectDashboardFixture.findings[1]} />
        </TabsContent>
      </Tabs>

      <SuggestedActions suggestions={projectDashboardFixture.suggestions} state={state} />
    </section>
  );
}

function ActionTabTrigger({
  value,
  children,
}: {
  value: ActionTab;
  children: ReactNode;
}) {
  return (
    <TabsTrigger
      value={value}
      className='border-b-2 border-transparent px-0.5 py-2 text-[13.5px] font-semibold text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:border-primary data-[state=active]:text-foreground'
    >
      {children}
    </TabsTrigger>
  );
}

function BlockingFindingsTable({ findings }: { findings: BlockingFinding[] }) {
  return (
    <div className='overflow-x-auto rounded-md border border-border-subtle bg-card shadow-sm'>
      <table className='w-full min-w-[880px] border-collapse text-left text-[13px]'>
        <caption className='sr-only'>Blocking project findings from the latest audit</caption>
        <thead>
          <tr className='bg-background-secondary'>
            {['Severity', 'Finding', 'Rule', 'PR', 'Assignee', 'Age', ''].map(label => (
              <th
                key={label || 'action'}
                scope='col'
                className='px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.03em] text-muted-foreground'
              >
                {label || <span className='sr-only'>Action</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {findings.map(finding => (
            <tr key={finding.id} className='border-t border-background-hover align-middle'>
              <td className='px-3.5 py-3'>
                <span className='rounded-full bg-status-error-bg px-2 py-0.5 text-[11px] font-semibold text-status-error'>
                  Blocking
                </span>
              </td>
              <td className='px-3.5 py-3'>
                <p className='font-medium text-foreground'>{finding.title}</p>
                <p className='mt-0.5 font-mono text-xs text-text-disabled'>{finding.location}</p>
              </td>
              <td className='px-3.5 py-3 text-text-secondary'>{finding.rule}</td>
              <td className='px-3.5 py-3'>
                <InlineLink>{finding.pr}</InlineLink>
              </td>
              <td
                className={cn(
                  'px-3.5 py-3',
                  finding.assignee === 'Unassigned'
                    ? 'text-text-disabled'
                    : 'text-text-secondary'
                )}
              >
                {finding.assignee}
              </td>
              <td className='px-3.5 py-3 text-text-disabled'>{finding.age}</td>
              <td className='px-3.5 py-3 text-right'>
                <UnsupportedTextButton>View fix <ArrowRight className='size-3.5' /></UnsupportedTextButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PendingOverridesList({
  overrides,
  roleView,
}: {
  overrides: PendingOverride[];
  roleView: DashboardRoleView;
}) {
  const canApprove = roleView === 'manager' || roleView === 'maintainer';

  return (
    <div className='grid gap-2.5'>
      {overrides.map(override => (
        <Card key={override.id} className='border border-border-subtle bg-card py-0 shadow-sm'>
          <CardContent className='p-4'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <h3 className='text-sm font-semibold text-foreground'>{override.title}</h3>
                <p className='mt-1 text-[12.5px] text-muted-foreground'>
                  Requested by {override.requester} · <InlineLink>{override.pr}</InlineLink> ·
                  expires in {override.expiry}
                </p>
              </div>
              <span className='shrink-0 rounded-full bg-status-warning-bg px-2.5 py-0.5 text-[11px] font-semibold text-status-warning'>
                Pending
              </span>
            </div>
            <p className='mt-2.5 text-[13px] leading-6 text-foreground'>{override.reason}</p>
            <p className='mt-2 text-[12.5px] text-muted-foreground'>
              Affected rules: {override.rules}
            </p>
            <div className='mt-3 flex flex-wrap items-center gap-2'>
              <UnsupportedButton variant='outlined' size='sm'>Review</UnsupportedButton>
              {canApprove && (
                <>
                  <UnsupportedButton size='sm' className='bg-status-success text-white hover:bg-status-success/90'>
                    Approve
                  </UnsupportedButton>
                  <UnsupportedButton
                    variant='outlined'
                    size='sm'
                    className='border-status-error text-status-error hover:bg-status-error-bg'
                  >
                    Reject
                  </UnsupportedButton>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      {!canApprove && (
        <p className='text-[12.5px] text-muted-foreground'>
          You can review the requests, but only managers, maintainers, and owners can approve them.
        </p>
      )}
    </div>
  );
}

function UnassignedCard({ count }: { count: number }) {
  return (
    <Card className='border border-border-subtle bg-card py-0 shadow-sm'>
      <CardContent className='p-5'>
        <h3 className='text-sm font-semibold text-foreground'>Needs assignment</h3>
        <p className='mt-1.5 text-[13px] text-muted-foreground'>
          {count} blocking findings have no owner.
        </p>
        <div className='mt-3'>
          <UnsupportedButton className='bg-neutral-950 text-white hover:bg-neutral-950/90'>
            Assign owners
          </UnsupportedButton>
        </div>
      </CardContent>
    </Card>
  );
}

function AssignedToMeCard({
  userName,
  finding,
}: {
  userName: string;
  finding?: BlockingFinding;
}) {
  if (!finding) {
    return (
      <DashboardSmallEmpty
        title='Nothing assigned to you'
        description='Assigned audit findings will appear here.'
      />
    );
  }

  return (
    <Card className='border border-border-subtle bg-card py-0 shadow-sm'>
      <CardContent className='p-5'>
        <h3 className='text-sm font-semibold text-foreground'>{finding.title}</h3>
        <p className='mt-1 font-mono text-[12.5px] text-text-disabled'>{finding.location}</p>
        <p className='mt-2 text-[13px] text-muted-foreground'>
          Assigned to {userName} · <InlineLink>{finding.pr}</InlineLink> · {finding.age}
        </p>
      </CardContent>
    </Card>
  );
}

function SuggestedActions({
  suggestions,
  state,
}: {
  suggestions: SuggestedAction[];
  state: DashboardState;
}) {
  const visibleSuggestions =
    state === 'healthy'
      ? suggestions.filter(suggestion => suggestion.tag !== 'Detected')
      : suggestions;

  return (
    <section aria-labelledby='suggested-actions-title' className='mt-5'>
      <h3
        id='suggested-actions-title'
        className='mb-2 text-xs font-bold uppercase tracking-[0.03em] text-text-disabled'
      >
        Suggested next actions
      </h3>
      <div className='grid gap-2'>
        {visibleSuggestions.map(suggestion => (
          <div
            key={suggestion.id}
            className='flex items-center gap-2.5 rounded-md border border-border-subtle bg-card px-3.5 py-2.5 text-[13px] shadow-sm'
          >
            <SourceTag tag={suggestion.tag} />
            <span className='text-foreground'>{suggestion.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SourceTag({ tag }: { tag: SuggestedAction['tag'] }) {
  const classes = {
    Detected: 'bg-status-info-bg text-status-info',
    Recommended: 'bg-primary-50 text-primary',
    'AI suggestion': 'bg-secondary-50 text-secondary',
  }[tag];
  return (
    <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold', classes)}>
      {tag}
    </span>
  );
}

function LowerDashboardSection({ roleView }: { roleView: DashboardRoleView }) {
  const isDeveloper = roleView === 'developer';

  return (
    <section
      aria-label='Dashboard context'
      className={cn('mt-3 grid gap-5 items-start', isDeveloper ? 'lg:grid-cols-1' : 'lg:grid-cols-[1.4fr_1fr]')}
    >
      {!isDeveloper && (
        <div className='grid gap-5'>
          <AdoptionSummary />
          <MostViolatedRules rules={projectDashboardFixture.topRules} />
        </div>
      )}
      {isDeveloper && (
        <Card className='border border-border-subtle bg-background-secondary py-0 shadow-sm'>
          <CardContent className='p-4 text-sm text-muted-foreground'>
            Adoption and organization-wide rule trend analytics are visible to managers and
            maintainers. Your view focuses on findings and review activity assigned to you.
          </CardContent>
        </Card>
      )}
      <RecentActivityFeed activity={projectDashboardFixture.activity} />
    </section>
  );
}

function AdoptionSummary() {
  return (
    <Card className='border border-border-subtle bg-card py-0 shadow-sm'>
      <CardContent className='p-5'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h2 className='text-[13px] font-bold uppercase tracking-[0.03em] text-muted-foreground'>
              Design-system adoption
            </h2>
            <div className='mt-2.5 flex flex-wrap items-baseline gap-2.5'>
              <span className='text-[32px] font-bold leading-none text-foreground'>78%</span>
              <span className='text-[13px] font-semibold text-status-error'>Down 4% over 30 days</span>
            </div>
          </div>
          <svg
            width='90'
            height='28'
            viewBox='0 0 90 28'
            role='img'
            aria-label='Adoption declined over the last 30 days'
            className='mt-3 shrink-0'
          >
            <polyline
              points='0,8 15,10 30,7 45,14 60,17 75,20 90,22'
              fill='none'
              stroke='var(--status-error)'
              strokeWidth='2'
            />
          </svg>
        </div>
        <p className='mt-3 text-[13px] leading-6 text-foreground'>
          12 custom components were introduced in the checkout repository. Eight approved
          components replaced legacy implementations.
        </p>
        <p className='mt-2.5 text-xs text-text-disabled'>
          Measured as: approved component usages / eligible component usages. ·{' '}
          <InlineLink>View detailed analytics</InlineLink>
        </p>
      </CardContent>
    </Card>
  );
}

function MostViolatedRules({ rules }: { rules: ViolatedRule[] }) {
  return (
    <Card className='border border-border-subtle bg-card py-0 shadow-sm'>
      <CardContent className='p-5'>
        <h2 className='mb-2 text-[13px] font-bold uppercase tracking-[0.03em] text-muted-foreground'>
          Most violated rules
        </h2>
        <div>
          {rules.map(rule => (
            <div
              key={rule.id}
              className='flex items-center justify-between gap-3 border-t border-background-hover py-2.5 first:border-t'
            >
              <div>
                <h3 className='text-[13.5px] font-medium text-foreground'>{rule.rule}</h3>
                <p className='mt-0.5 text-xs text-text-disabled'>
                  Most affected: <span className='font-mono'>{rule.area}</span> ·{' '}
                  <InlineLink>docs</InlineLink>
                </p>
              </div>
              <div className='shrink-0 text-right'>
                <p className='text-[13px] text-foreground'>{rule.open} open</p>
                <p
                  className={cn(
                    'mt-0.5 text-xs font-semibold',
                    rule.trendTone === 'error' ? 'text-status-error' : 'text-status-success'
                  )}
                >
                  {rule.trend}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentActivityFeed({ activity }: { activity: ActivityItem[] }) {
  return (
    <Card className='border border-border-subtle bg-card py-0 shadow-sm'>
      <CardContent className='p-5'>
        <h2 className='mb-3 text-[13px] font-bold uppercase tracking-[0.03em] text-muted-foreground'>
          Recent activity
        </h2>
        <div>
          {activity.map(item => (
            <div key={item.id} className='flex gap-2.5 border-t border-background-hover py-2.5'>
              <span
                className={cn('mt-1.5 size-[7px] shrink-0 rounded-full', activityDot(item.tone))}
                aria-hidden='true'
              />
              <div>
                <h3 className='text-[13px] font-medium text-foreground'>{item.title}</h3>
                {item.detail && (
                  <p className='mt-0.5 text-[12.5px] text-muted-foreground'>{item.detail}</p>
                )}
                <p className='mt-0.5 text-xs text-text-disabled'>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardEmptyState({ state }: { state: Extract<DashboardState, 'no-audit' | 'disconnected'> }) {
  const meta = statusMeta[state];
  const icon =
    state === 'no-audit' ? (
      <ShieldCheck className='size-5' aria-hidden='true' />
    ) : (
      <AlertCircle className='size-5' aria-hidden='true' />
    );

  return (
    <EmptyState
      icon={icon}
      title={meta.headline}
      description={meta.body}
      className='min-h-80 border-solid bg-card px-8 py-12'
    >
      <div className='mt-2 flex flex-wrap justify-center gap-2.5'>
        <UnsupportedButton>{meta.primaryAction}</UnsupportedButton>
        {state === 'no-audit' && <UnsupportedButton variant='outlined'>View setup guide</UnsupportedButton>}
      </div>
    </EmptyState>
  );
}

function DashboardErrorBanner() {
  return (
    <div
      role='alert'
      className='flex flex-col gap-3 rounded-md border border-status-error bg-status-error-bg p-4 sm:flex-row sm:items-center sm:justify-between'
    >
      <div>
        <p className='text-[13.5px] font-semibold text-status-error'>
          Audit data could not be refreshed
        </p>
        <p className='mt-1 text-[12.5px] text-status-error'>
          Showing results from the last successful audit, completed yesterday at 14:32.
        </p>
      </div>
      <div className='flex flex-wrap gap-2'>
        <UnsupportedButton size='sm' className='bg-status-error text-white hover:bg-status-error/90'>
          Retry
        </UnsupportedButton>
        <UnsupportedButton
          size='sm'
          variant='outlined'
          className='border-status-error text-status-error hover:bg-status-error-bg'
        >
          View audit logs
        </UnsupportedButton>
      </div>
    </div>
  );
}

function DashboardSmallEmpty({ title, description }: { title: string; description: string }) {
  return (
    <Card className='border border-border-subtle bg-card py-0 shadow-sm'>
      <CardContent className='p-5'>
        <h3 className='text-sm font-semibold text-foreground'>{title}</h3>
        <p className='mt-1.5 text-[13px] text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className='grid gap-5' role='status' aria-label='Loading dashboard'>
      <Skeleton className='h-16' />
      <Skeleton className='h-36' />
      <Skeleton className='h-28' />
      <div className='grid gap-5 lg:grid-cols-[1.4fr_1fr]'>
        <Skeleton className='h-56' />
        <Skeleton className='h-56' />
      </div>
    </div>
  );
}

function UnsupportedButton({
  children,
  variant,
  size,
  icon,
  className,
}: {
  children: ReactNode;
  variant?: ComponentProps<typeof Button>['variant'];
  size?: ComponentProps<typeof Button>['size'];
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span className='inline-flex' title={unsupportedActionMessage}>
      <Button
        type='button'
        variant={variant}
        size={size}
        disabled
        aria-disabled='true'
        className={cn('disabled:cursor-not-allowed', className)}
        startIcon={icon}
      >
        {children}
      </Button>
    </span>
  );
}

function UnsupportedTextButton({ children }: { children: ReactNode }) {
  return (
    <span title={unsupportedActionMessage}>
      <button
        type='button'
        disabled
        className='inline-flex items-center gap-1 text-[12.5px] font-medium text-muted-foreground disabled:cursor-not-allowed'
      >
        {children}
      </button>
    </span>
  );
}

function InlineLink({ children }: { children: ReactNode }) {
  return (
    <span className='font-medium text-status-info underline-offset-4 hover:underline'>
      {children}
    </span>
  );
}

function getRoleView(role: Role): DashboardRoleView {
  switch (role) {
    case 'OWNER':
    case 'ADMIN':
      return 'manager';
    case 'MAINTAINER':
      return 'maintainer';
    case 'ENGINEER':
    case 'VIEWER':
      return 'developer';
    default:
      return exhaustiveRole(role);
  }
}

function exhaustiveRole(role: never): DashboardRoleView {
  return role;
}

function isDashboardState(value: string | null): value is DashboardState {
  return dashboardStates.some(state => state === value);
}

function isDashboardRoleView(value: string | null): value is DashboardRoleView {
  return dashboardRoleViews.some(role => role === value);
}

function toneClasses(tone: StatusTone) {
  switch (tone) {
    case 'error':
      return {
        bg: 'bg-status-error-bg',
        border: 'border-status-error',
        leftBorder: 'border-l-status-error',
        text: 'text-status-error',
      };
    case 'warning':
      return {
        bg: 'bg-status-warning-bg',
        border: 'border-status-warning',
        leftBorder: 'border-l-status-warning',
        text: 'text-status-warning',
      };
    case 'success':
      return {
        bg: 'bg-status-success-bg',
        border: 'border-status-success',
        leftBorder: 'border-l-status-success',
        text: 'text-status-success',
      };
    case 'info':
      return {
        bg: 'bg-status-info-bg',
        border: 'border-status-info',
        leftBorder: 'border-l-status-info',
        text: 'text-status-info',
      };
    case 'muted':
      return {
        bg: 'bg-background-secondary',
        border: 'border-border-subtle',
        leftBorder: 'border-l-muted-foreground',
        text: 'text-muted-foreground',
      };
    default:
      return exhaustiveTone(tone);
  }
}

function exhaustiveTone(tone: never) {
  return tone;
}

function activityDot(tone: ActivityItem['tone']) {
  switch (tone) {
    case 'error':
      return 'bg-status-error';
    case 'warning':
      return 'bg-status-warning';
    case 'success':
      return 'bg-status-success';
    case 'muted':
      return 'bg-muted-foreground';
    default:
      return exhaustiveActivityTone(tone);
  }
}

function exhaustiveActivityTone(tone: never) {
  return tone;
}

function unassignedCount(findings: BlockingFinding[]) {
  return findings.filter(finding => finding.assignee === 'Unassigned').length;
}

export { DashboardSkeleton };
