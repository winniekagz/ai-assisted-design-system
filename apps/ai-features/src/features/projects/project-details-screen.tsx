'use client';

import {
  Button,
  Card,
  CardContent,
  EmptyState,
  cn,
} from 'componentiq';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  GitBranch,
  Palette,
  Package,
  Settings,
  ShieldAlert,
} from 'lucide-react';
import { useEffect, useMemo } from 'react';

import { OrgFrame } from '@/features/org/org-frame';
import { useWorkspaceStore } from '@/stores/workspace-store';

import {
  projectDetailsFixture,
  projectRows,
  sidebarSectionLabels,
  type ProjectActivity,
  type ProjectFinding,
  type ProjectRepository,
  type ProjectRow,
  type SidebarSection,
} from './fixtures/projects';
import { ProjectStatusPill } from './projects-screen';

const unsupportedAuditMessage = 'Run audit needs the audit workflow API before it can be enabled.';

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
          role={membership.role}
        />
      )}
    </OrgFrame>
  );
}

function ProjectDetailsContent({
  projectSlug,
  role,
}: {
  projectSlug: string;
  role: string;
}) {
  const activeSection = useWorkspaceStore(state => state.activeProjectSection);
  const setActiveProjectSection = useWorkspaceStore(
    state => state.setActiveProjectSection
  );
  const project = useMemo(
    () => projectRows.find(row => row.slug === projectSlug) ?? projectRows[0],
    [projectSlug]
  );

  useEffect(() => {
    setActiveProjectSection('overview');
  }, [projectSlug, setActiveProjectSection]);

  return (
    <main className='grid min-w-0 gap-4'>
      <ProjectDetailHeader project={project} role={role} />
      <DeploymentStatusPanel project={project} />
      <LatestAuditSummary project={project} />
      <SectionPanel activeSection={activeSection} />
      <RecentActivityCard activity={projectDetailsFixture.activity} />
    </main>
  );
}

function ProjectDetailHeader({ project, role }: { project: ProjectRow; role: string }) {
  return (
    <header className='border-b border-border bg-transparent pb-5'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <h1 className='text-3xl font-semibold leading-tight text-foreground'>
              {project.name}
            </h1>
            <ProjectStatusPill status={project.status} />
          </div>
          <p className='mt-3 max-w-3xl text-sm leading-6 text-muted-foreground'>
            {project.description}
          </p>
          <dl className='mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground'>
            <MetaItem label='Team' value={role === 'ENGINEER' ? 'Your project access' : project.team} />
            <MetaItem label='Repositories' value={`${project.repoCount}`} />
            <MetaItem label='Design system' value={project.designSystem.label} />
            <MetaItem label='Last audited' value={project.lastAudited} />
          </dl>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button type='button' variant='outlined' disabled title='Project settings need a project settings API before they can be enabled.' startIcon={<Settings className='size-4' />}>
            Project settings
          </Button>
          <Button type='button' disabled title={unsupportedAuditMessage} startIcon={<Clock className='size-4' />}>
            Run audit
          </Button>
        </div>
      </div>
    </header>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex gap-1.5'>
      <dt className='font-medium text-foreground'>{label}:</dt>
      <dd>{value}</dd>
    </div>
  );
}

function DeploymentStatusPanel({ project }: { project: ProjectRow }) {
  const blocked = project.status === 'blocked';
  const warning = project.status === 'needs_attention' || project.status === 'not_configured';
  const tone = blocked ? 'error' : warning ? 'warning' : 'success';
  const classes = {
    error: 'border-l-status-error bg-status-error-bg',
    warning: 'border-l-status-warning bg-status-warning-bg',
    success: 'border-l-status-success bg-status-success-bg',
  }[tone];
  const Icon = blocked ? ShieldAlert : warning ? AlertCircle : CheckCircle2;

  return (
    <Card className={cn('rounded-none border-y border-l-[3px] border-r-0 py-0 shadow-none', classes)}>
      <CardContent className='flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex gap-3'>
          <Icon className='mt-0.5 size-5 shrink-0' aria-hidden='true' />
          <div>
            <h2 className='text-lg font-semibold text-foreground'>
              {blocked ? 'Deployment blocked' : warning ? 'Needs attention' : 'Ready to deploy'}
            </h2>
            <p className='mt-1 text-sm leading-6 text-muted-foreground'>
              {blocked
                ? `${project.blockingCount} blocking findings must be resolved before this project can deploy.`
                : warning
                  ? 'Review configuration and audit warnings before the next release.'
                  : 'Latest audit passed and no active blocking findings were found.'}
            </p>
          </div>
        </div>
        <Button type='button' disabled title={unsupportedAuditMessage}>
          {blocked ? 'Review findings' : 'Run audit'}
        </Button>
      </CardContent>
    </Card>
  );
}

function LatestAuditSummary({ project }: { project: ProjectRow }) {
  return (
    <Card className='rounded-none border-y border-border bg-transparent py-0 shadow-none'>
      <CardContent className='grid gap-4 px-5 py-5 md:grid-cols-3'>
        <SummaryMetric label='Latest audit' value={project.latestAudit.label} detail={project.latestAudit.relativeTime} />
        <SummaryMetric label='Blocking findings' value={`${project.blockingCount}`} detail='Open release blockers' />
        <SummaryMetric label='Repository' value={project.repository} detail={project.framework} mono />
      </CardContent>
    </Card>
  );
}

function SummaryMetric({
  label,
  value,
  detail,
  mono = false,
}: {
  label: string;
  value: string;
  detail: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className='text-xs font-semibold uppercase tracking-normal text-muted-foreground'>{label}</p>
      <p className={cn('mt-1 text-base font-semibold text-foreground', mono && 'font-mono text-sm')}>
        {value}
      </p>
      <p className='mt-1 text-xs text-muted-foreground'>{detail}</p>
    </div>
  );
}

function SectionPanel({ activeSection }: { activeSection: SidebarSection }) {
  if (activeSection === 'overview' || activeSection === 'findings') {
    return <FindingsTable findings={projectDetailsFixture.findings} />;
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

function FindingsTable({ findings }: { findings: ProjectFinding[] }) {
  return (
    <Card className='gap-0 rounded-none border-y border-border bg-transparent py-0 shadow-none'>
      <CardContent className='px-0'>
        <div className='border-b border-border px-5 py-4'>
          <h2 className='text-lg font-semibold text-foreground'>Blocking findings</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Findings that must be resolved or explicitly approved before release.
          </p>
        </div>
        <div className='overflow-x-auto'>
          <table className='min-w-[820px] w-full border-collapse text-left text-sm'>
            <thead className='bg-background-secondary text-xs uppercase tracking-normal text-muted-foreground'>
              <tr>
                <th scope='col' className='px-4 py-3 font-semibold'>Severity</th>
                <th scope='col' className='px-4 py-3 font-semibold'>Finding</th>
                <th scope='col' className='px-4 py-3 font-semibold'>Rule</th>
                <th scope='col' className='px-4 py-3 font-semibold'>Assignee</th>
                <th scope='col' className='px-4 py-3 font-semibold'>Age</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {findings.map(finding => (
                <tr key={finding.id} className='hover:bg-background-secondary/70'>
                  <td className='px-4 py-3'><SeverityPill severity={finding.severity} /></td>
                  <td className='px-4 py-3'>
                    <span className='block font-medium text-foreground'>{finding.title}</span>
                    <span className='mt-1 block font-mono text-xs text-muted-foreground'>{finding.location}</span>
                  </td>
                  <td className='px-4 py-3 text-muted-foreground'>{finding.rule}</td>
                  <td className='px-4 py-3 text-muted-foreground'>{finding.assignee}</td>
                  <td className='px-4 py-3 text-muted-foreground'>{finding.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function SeverityPill({ severity }: { severity: ProjectFinding['severity'] }) {
  const classes = {
    Critical: 'border-status-error bg-status-error-bg text-status-error',
    High: 'border-status-warning bg-status-warning-bg text-status-warning',
    Medium: 'border-status-info bg-status-info-bg text-status-info',
  }[severity];

  return (
    <span className={cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold', classes)}>
      {severity}
    </span>
  );
}

function RepositoriesPanel({ repositories }: { repositories: ProjectRepository[] }) {
  return (
    <div className='grid gap-3'>
      {repositories.map(repository => (
        <Card key={repository.id} className='rounded-none border-y border-border bg-transparent py-0 shadow-none'>
          <CardContent className='flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h2 className='font-mono text-sm font-semibold text-foreground'>{repository.name}</h2>
              <p className='mt-1 text-sm text-muted-foreground'>
                {repository.branch} · {repository.lastCommit}
              </p>
            </div>
            <span className='inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-background-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground'>
              <GitBranch className='size-3.5' aria-hidden='true' />
              {repository.status}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DesignSystemsPanel() {
  const stats = projectDetailsFixture.designSystemStats;

  return (
    <Card className='rounded-none border-y border-border bg-transparent py-0 shadow-none'>
      <CardContent className='px-5 py-5'>
        <div className='flex items-start gap-3'>
          <Palette className='mt-1 size-5 text-primary' aria-hidden='true' />
          <div>
            <h2 className='text-lg font-semibold text-foreground'>{stats.name}</h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Design-system adoption and component compatibility for this project.
            </p>
          </div>
        </div>
        <div className='mt-5 grid gap-3 sm:grid-cols-3'>
          <StatCard label='Coverage' value={`${stats.coverage}%`} />
          <StatCard label='Deprecated components' value={`${stats.deprecated}`} />
          <StatCard label='Outdated components' value={`${stats.outdated}`} />
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-md border border-border bg-background-secondary px-4 py-3'>
      <p className='text-xs font-semibold uppercase tracking-normal text-muted-foreground'>{label}</p>
      <p className='mt-2 text-2xl font-semibold text-foreground'>{value}</p>
    </div>
  );
}

function RecentActivityCard({ activity }: { activity: ProjectActivity[] }) {
  return (
    <Card className='rounded-none border-y border-border bg-transparent py-0 shadow-none'>
      <CardContent className='px-5 py-5'>
        <h2 className='text-lg font-semibold text-foreground'>Recent activity</h2>
        <div className='mt-4 grid gap-3'>
          {activity.map(item => (
            <div key={item.id} className='flex gap-3 rounded-md border border-border bg-background px-3 py-3'>
              <span className={cn('mt-1 size-2 rounded-full', activityToneClass(item.tone))} aria-hidden='true' />
              <div className='min-w-0'>
                <p className='font-medium text-foreground'>{item.title}</p>
                <p className='mt-1 text-sm text-muted-foreground'>{item.detail}</p>
                <p className='mt-1 text-xs text-muted-foreground'>{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function activityToneClass(tone: ProjectActivity['tone']) {
  return {
    error: 'bg-status-error',
    warning: 'bg-status-warning',
    success: 'bg-status-success',
    muted: 'bg-muted-foreground',
  }[tone];
}
