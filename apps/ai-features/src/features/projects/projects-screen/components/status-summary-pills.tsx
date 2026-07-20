'use client';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  cn,
} from 'componentiq';
import {
  AlertCircle,
  CheckCircle2,
  FolderKanban,
  ShieldAlert,
} from 'lucide-react';

import type { ProjectRow, ProjectStatus } from '@/features/projects/types';

export function StatusSummaryPills({
  activeStatus,
  projects,
  onSelect,
}: {
  activeStatus: ProjectStatus | 'all';
  projects: ProjectRow[];
  // eslint-disable-next-line no-unused-vars
  onSelect(status: ProjectStatus | 'all'): void;
}) {
  const counts = {
    all: projects.length,
    blocked: projects.filter(project => project.status === 'blocked').length,
    needs_attention: projects.filter(project => project.status === 'needs_attention').length,
    healthy: projects.filter(project => project.status === 'healthy').length,
  };

  const pills = [
    { status: 'all' as const, label: `${counts.all} Projects`, icon: FolderKanban },
    { status: 'blocked' as const, label: `${counts.blocked} Blocked`, icon: ShieldAlert },
    { status: 'needs_attention' as const, label: `${counts.needs_attention} Need Attention`, icon: AlertCircle },
    { status: 'healthy' as const, label: `${counts.healthy} Healthy`, icon: CheckCircle2 },
  ];

  return (
    <Tabs
      value={activeStatus}
      onValueChange={value => onSelect(value as ProjectStatus | 'all')}
    >
      <TabsList
        aria-label='Project status summary filters'
        className='flex flex-wrap items-center gap-5 border-b border-border bg-transparent'
      >
        {pills.map(pill => {
          const Icon = pill.icon;

          return (
            <TabsTrigger
              key={pill.status}
              value={pill.status}
              className={cn(
                'inline-flex items-center gap-2 border-b-2 border-transparent px-0.5 py-2 text-[13.5px] font-semibold text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'data-[state=active]:border-primary data-[state=active]:text-foreground'
              )}
            >
              <Icon className='size-4' aria-hidden='true' />
              {pill.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
