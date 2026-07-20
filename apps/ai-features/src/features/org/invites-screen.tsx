'use client';

import { CheckCircle2, Copy, Loader2, MoreHorizontal, Send, UserPlus } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';

import { ASSIGNABLE_ROLES } from '@winniekagendo/componentiq-shared-types';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmptyState,
  Input,
  Select,
  toast,
} from 'componentiq';

import { PageHeader } from '@/features/layout';
import { useCreateInvite } from '@/hooks/mutations/use-create-invite';
import { useInvites } from '@/hooks/queries/use-invites';
import { inviteManagementAvailable, useResendInvite, useRevokeInvite } from './use-manage-invite';
import { formatDate } from './utils';
import { OrgFrame } from './org-frame';
import type { OrganizationInvite, Role } from './types';

const roles = [...ASSIGNABLE_ROLES] satisfies Role[];

const EXPIRING_SOON_DAYS = 3;

/**
 * Admin invites — the create form is preserved; the history is an
 * actionable table with real status semantics (color + dot), expiry
 * urgency, summary chips, an EmptyState, and a per-row menu
 * (resend / revoke with a focus-trapped confirm dialog). Permission gating
 * is unchanged.
 */
export function InvitesScreen({ orgSlug }: { orgSlug: string }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('ENGINEER');
  const [developmentInviteLink, setDevelopmentInviteLink] = useState('');
  const [error, setError] = useState('');

  const invitesQuery = useInvites(orgSlug);
  const createInvite = useCreateInvite(orgSlug);
  const invites = (invitesQuery.data ?? []) as OrganizationInvite[];

  const counts = useMemo(() => {
    const pending = invites.filter(i => i.status === 'PENDING');
    return {
      pending: pending.length,
      accepted: invites.filter(i => i.status === 'ACCEPTED').length,
      expiringSoon: pending.filter(i => daysUntil(i.expiresAt) <= EXPIRING_SOON_DAYS).length,
    };
  }, [invites]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setDevelopmentInviteLink('');
    try {
      const result = await createInvite.mutateAsync({ email, role });
      const inviteStatus =
        result.emailDelivery.status === 'sent'
          ? `Invite email sent to ${result.invite.email}.`
          : "Invite saved. We'll email it once your sending domain is connected — or copy the link.";
      toast({
        variant: result.emailDelivery.status === 'sent' ? 'success' : 'warning',
        title: inviteStatus,
      });
      setDevelopmentInviteLink(result.developmentInviteLink ?? '');
      setEmail('');
      setRole('ENGINEER');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invite could not be created.');
    }
  }

  return (
    <OrgFrame orgSlug={orgSlug}>
      {({ membership }) => {
        const canManage = membership.role === 'OWNER' || membership.role === 'ADMIN';
        return (
          <>
            <PageHeader
              eyebrow='Settings · Team'
              title='Invites'
              description="Invite engineers and maintainers to collaborate on your organization's design-system rules and AI workflows."
            />

            {invites.length > 0 && (
              <div className='mb-6 flex flex-wrap gap-2.5'>
                <Chip label='pending' value={counts.pending} />
                <Chip label='accepted' value={counts.accepted} tone='success' />
                {counts.expiringSoon > 0 && (
                  <Chip label='expiring soon' value={counts.expiringSoon} tone='warning' />
                )}
              </div>
            )}

            <div className='grid gap-6 xl:grid-cols-[400px_1fr]'>
              <Card className='border border-border bg-card'>
                <CardHeader>
                  <CardTitle className='text-lg'>Invite people</CardTitle>
                </CardHeader>
                <CardContent>
                  {!canManage ? (
                    <p className='text-sm text-muted-foreground'>
                      You do not have permission to invite members. Contact an organization admin if
                      you need access.
                    </p>
                  ) : (
                    <form className='grid gap-4' onSubmit={submit}>
                      <Input
                        type='email'
                        label='Email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder='engineer@example.com'
                      />
                      <Select label='Role' value={role} onChange={e => setRole(e.target.value as Role)}>
                        {roles.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                      {error && (
                        <p role='alert' aria-live='assertive' className='text-sm text-status-error'>
                          {error}
                        </p>
                      )}
                      <Button type='submit' loading={createInvite.isPending} startIcon={<Send />}>
                        Create invite
                      </Button>
                    </form>
                  )}

                  {developmentInviteLink && <CopyLinkField link={developmentInviteLink} />}
                </CardContent>
              </Card>

              <Card className='border border-border bg-card'>
                <CardHeader>
                  <CardTitle className='text-lg'>Invite history</CardTitle>
                </CardHeader>
                <CardContent>
                  {invitesQuery.isLoading && (
                    <div className='grid min-h-32 place-items-center' role='status' aria-live='polite'>
                      <Loader2 className='size-5 animate-spin text-primary' aria-hidden='true' />
                    </div>
                  )}
                  {invitesQuery.error && (
                    <p role='alert' className='text-sm text-status-error'>
                      Invites could not be loaded.
                    </p>
                  )}
                  {!invitesQuery.isLoading && !invitesQuery.error && invites.length === 0 && (
                    <EmptyState
                      icon={<UserPlus className='size-5' aria-hidden='true' />}
                      title='No invites yet'
                      description={
                        canManage
                          ? 'Bring your team in to start reviewing components together.'
                          : "An admin hasn't invited anyone yet."
                      }
                    />
                  )}
                  {!invitesQuery.isLoading && !invitesQuery.error && invites.length > 0 && (
                    <InviteTable orgSlug={orgSlug} invites={invites} canManage={canManage} />
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        );
      }}
    </OrgFrame>
  );
}

/* ---------------------------------------------------------------- table ---- */

function InviteTable({
  orgSlug,
  invites,
  canManage,
}: {
  orgSlug: string;
  invites: OrganizationInvite[];
  canManage: boolean;
}) {
  return (
    <div className='overflow-hidden rounded-md border border-border'>
      <table className='w-full border-collapse text-left'>
        <caption className='sr-only'>Organization invites and their status</caption>
        <thead>
          <tr className='bg-background-secondary text-[10.5px] uppercase tracking-[0.05em] text-muted-foreground'>
            <th scope='col' className='px-4 py-2.5 font-semibold'>
              Person
            </th>
            <th scope='col' className='px-4 py-2.5 font-semibold'>
              Role
            </th>
            <th scope='col' className='px-4 py-2.5 font-semibold'>
              Status
            </th>
            <th scope='col' className='px-2 py-2.5'>
              <span className='sr-only'>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {invites.map(invite => (
            <InviteRow key={invite.id} orgSlug={orgSlug} invite={invite} canManage={canManage} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InviteRow({
  orgSlug,
  invite,
  canManage,
}: {
  orgSlug: string;
  invite: OrganizationInvite;
  canManage: boolean;
}) {
  const resend = useResendInvite(orgSlug);
  const revoke = useRevokeInvite(orgSlug);
  const [confirmingRevoke, setConfirmingRevoke] = useState(false);

  const status = statusMeta(invite);

  return (
    <tr className='border-t border-border/60 align-middle'>
      <td className='px-4 py-3'>
        <div className='flex items-center gap-2.5'>
          <span className='grid size-7 shrink-0 place-items-center rounded-full bg-background-secondary text-[11px] font-medium text-muted-foreground'>
            {invite.email.charAt(0).toUpperCase()}
          </span>
          <span className='text-sm font-medium text-foreground'>{invite.email}</span>
        </div>
      </td>
      <td className='px-4 py-3'>
        <Badge variant='pastel' status='active'>
          {invite.role}
        </Badge>
      </td>
      <td className='px-4 py-3'>
        <span className={`inline-flex items-center gap-2 text-[12.5px] ${status.text}`}>
          <span className={`size-[7px] rounded-full ${status.dot}`} aria-hidden='true' />
          {status.label}
          {status.action === 'resend' && canManage && (
            <button
              type='button'
              disabled={!inviteManagementAvailable}
              title={inviteManagementAvailable ? undefined : 'Resending invites is not available yet.'}
              onClick={() => resend.mutate(invite.id)}
              className='font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline'
            >
              {resend.isPending ? 'Resending…' : 'Resend'}
            </button>
          )}
        </span>
      </td>
      <td className='px-2 py-3 text-right'>
        {canManage && invite.status === 'PENDING' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='size-9'
                aria-label={`Manage invite for ${invite.email}`}
              >
                <MoreHorizontal className='size-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                disabled={!inviteManagementAvailable}
                onSelect={() => resend.mutate(invite.id)}
              >
                Resend email
              </DropdownMenuItem>
              <DropdownMenuItem
                variant='destructive'
                disabled={!inviteManagementAvailable}
                onSelect={() => setConfirmingRevoke(true)}
              >
                Revoke invite
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Dialog open={confirmingRevoke} onOpenChange={setConfirmingRevoke}>
          <DialogContent size='sm'>
            <DialogHeader>
              <DialogTitle>Revoke this invite?</DialogTitle>
              <DialogDescription>
                {invite.email} will no longer be able to use this invite link. You can always invite
                them again later.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type='button' variant='text'>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type='button'
                variant='destructive'
                loading={revoke.isPending}
                disabled={!inviteManagementAvailable}
                onClick={() => {
                  revoke.mutate(invite.id, { onSettled: () => setConfirmingRevoke(false) });
                }}
              >
                Revoke
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </td>
    </tr>
  );
}

/* -------------------------------------------------------------- helpers ---- */

function Chip({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: number;
  tone?: 'default' | 'success' | 'warning';
}) {
  const toneClasses = {
    default: 'border-border bg-background-secondary text-foreground',
    success: 'border-status-success/40 bg-status-success-bg text-status-success',
    warning: 'border-status-warning/40 bg-status-warning-bg text-status-warning',
  }[tone];
  return (
    <span className={`rounded-md border px-3 py-1.5 text-xs ${toneClasses}`}>
      <b>{value}</b> {label}
    </span>
  );
}

function CopyLinkField({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className='mt-4 rounded-md border border-border bg-background-secondary p-3'>
      <p className='text-sm font-medium'>Invite link</p>
      <div className='mt-2 flex gap-2'>
        <input
          readOnly
          value={link}
          aria-label='Invite link'
          className='min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm'
        />
        <Button
          type='button'
          variant='outlined'
          size='icon'
          aria-label='Copy invite link'
          onClick={() => {
            navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <CheckCircle2 className='size-4 text-status-success' /> : <Copy className='size-4' />}
        </Button>
      </div>
    </div>
  );
}

function daysUntil(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
}

function statusMeta(invite: OrganizationInvite): {
  label: string;
  text: string;
  dot: string;
  action?: 'resend';
} {
  switch (invite.status) {
    case 'ACCEPTED':
      return { label: 'Accepted', text: 'text-status-success', dot: 'bg-status-success' };
    case 'EXPIRED':
      return { label: 'Expired', text: 'text-status-error', dot: 'bg-status-error', action: 'resend' };
    case 'REVOKED':
      return { label: 'Revoked', text: 'text-muted-foreground', dot: 'bg-muted-foreground' };
    case 'PENDING':
    default: {
      const days = daysUntil(invite.expiresAt);
      if (days <= EXPIRING_SOON_DAYS) {
        return {
          label: `Pending · expires in ${Math.max(days, 0)}d`,
          text: 'text-status-warning',
          dot: 'bg-status-warning',
        };
      }
      return {
        label: `Pending · expires ${formatDate(invite.expiresAt)}`,
        text: 'text-status-warning',
        dot: 'bg-status-warning',
      };
    }
  }
}
