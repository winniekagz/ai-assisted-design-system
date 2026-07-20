'use client';

import Link from 'next/link';
import { Loader2, UserPlus } from 'lucide-react';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from 'componentiq';
import { PageHeader } from '@/features/layout';
import { useMembers } from '@/hooks/queries/use-members';
import { formatDate } from './utils';
import { OrgFrame } from './org-frame';

const inviteRoles = new Set(['OWNER', 'ADMIN']);

export function MembersScreen({ orgSlug }: { orgSlug: string }) {
  const membersQuery = useMembers(orgSlug);
  const members = membersQuery.data ?? [];

  return (
    <OrgFrame orgSlug={orgSlug}>
      {({ membership }) => (
        <>
          <PageHeader
            eyebrow='Settings'
            title='Members'
            description='View the people who can access this organization’s design-system rules and AI workflows.'
            actions={
              inviteRoles.has(membership.role) ? (
                <Button asChild startIcon={<UserPlus />}>
                  <Link href={`/org/${orgSlug}/settings/invites`}>Invite member</Link>
                </Button>
              ) : null
            }
          />
          <Card className='border border-border bg-card'>
            <CardHeader>
              <CardTitle className='text-lg'>Organization members</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-3'>
              {membersQuery.isLoading && (
                <div className='grid min-h-32 place-items-center'>
                  <Loader2 className='size-5 animate-spin text-primary' />
                </div>
              )}
              {membersQuery.error && (
                <p className='text-sm text-error-600'>Members could not be loaded.</p>
              )}
              {!membersQuery.isLoading && !membersQuery.error && members.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No members found.</p>
              ) : null}
              {!membersQuery.isLoading && !membersQuery.error ? (
                members.map(member => (
                  <div
                    key={member.id}
                    className='grid gap-3 rounded-md border border-border bg-background-secondary p-4 md:grid-cols-[1fr_auto_auto]'
                  >
                    <div>
                      <p className='font-medium'>{member.user.name ?? member.user.email}</p>
                      <p className='text-sm text-muted-foreground'>{member.user.email}</p>
                    </div>
                    <Badge variant='pastel' status='active'>{member.role}</Badge>
                    <p className='text-sm text-muted-foreground'>
                      Joined {formatDate(member.createdAt)}
                    </p>
                  </div>
                ))
              ) : null}
            </CardContent>
          </Card>
        </>
      )}
    </OrgFrame>
  );
}
