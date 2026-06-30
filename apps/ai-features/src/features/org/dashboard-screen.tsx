'use client';

import { ClipboardCheck, Component, ShieldCheck, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from 'componentiq';
import { FirstRunWelcome } from '@/features/dashboard/first-run-welcome';
import { PageHeader } from '@/features/dashboard/app-shell';
import { OrgFrame } from './org-frame';

const actions = [
  { href: 'guardrails', label: 'Manage guardrails', icon: ShieldCheck },
  { href: 'settings/invites', label: 'Invite team member', icon: Users },
  { href: 'ai/recommend', label: 'Run recommendation', icon: Sparkles },
  { href: 'ai/audit', label: 'Run pre-PR audit', icon: ClipboardCheck },
];

export function OrganizationDashboardScreen({ orgSlug }: { orgSlug: string }) {
  return (
    <OrgFrame orgSlug={orgSlug}>
      {({ organization, membership, me }) => (
        <>
          <FirstRunWelcome
            orgSlug={orgSlug}
            userId={me.user.id}
            name={me.user.name}
            role={membership.role}
          />
          <PageHeader
            eyebrow='Organization'
            title={organization.name}
            description='Your organization workspace for design-system rules, components, guardrails, and AI-assisted workflows.'
            actions={<Badge variant='pastel' status='active'>{membership.role}</Badge>}
          />
          <div className='grid gap-6 xl:grid-cols-[1fr_360px]'>
            <Card className='border border-border bg-card'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <Component className='size-5 text-primary' />
                  Workspace status
                </CardTitle>
              </CardHeader>
              <CardContent className='grid gap-4 md:grid-cols-3'>
                <Metric label='Projects' value={organization.projects?.length ?? 0} />
                <Metric label='Components' value={organization.components?.length ?? 0} />
                <Metric label='Guardrails' value={organization.guardrails?.length ?? 0} />
              </CardContent>
            </Card>
            <Card className='border border-border bg-card'>
              <CardHeader>
                <CardTitle className='text-lg'>Quick actions</CardTitle>
              </CardHeader>
              <CardContent className='grid gap-2'>
                {actions.map(action => {
                  const Icon = action.icon;
                  return (
                    <Button key={action.href} asChild variant='outlined' fullWidth startIcon={<Icon />}>
                      <Link href={`/org/${orgSlug}/${action.href}`}>{action.label}</Link>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
          <Card className='mt-6 border border-border bg-card'>
            <CardContent className='p-6'>
              <h2 className='text-lg font-semibold'>No project data yet</h2>
              <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                Add projects, components, and guardrails to ground AI recommendations
                in this organization’s standards.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </OrgFrame>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className='rounded-md border border-border bg-background-secondary p-4'>
      <p className='text-sm text-muted-foreground'>{label}</p>
      <p className='mt-2 text-2xl font-semibold'>{value}</p>
    </div>
  );
}
