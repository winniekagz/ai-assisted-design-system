import { Badge, cn } from 'componentiq';
import type { ReactNode } from 'react';

export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className='mb-5'>
      <h2 className='text-xl font-semibold text-foreground'>{title}</h2>
      <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
    </div>
  );
}

export function DangerRow({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <div className='flex flex-col gap-3 rounded-md border border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between'>
      <div>
        <h3 className='text-sm font-semibold text-foreground'>{title}</h3>
        <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
      </div>
      {action}
    </div>
  );
}

export function Meta({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className='text-xs font-semibold uppercase tracking-normal text-muted-foreground'>{label}</dt>
      <dd className={cn('mt-1 text-sm text-foreground', mono && 'font-mono break-all')}>{value}</dd>
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className='rounded-md border border-border bg-background-secondary px-4 py-3'>
      <p className='text-xs font-semibold uppercase tracking-normal text-muted-foreground'>{label}</p>
      <p className='mt-2 text-2xl font-semibold text-foreground'>{value}</p>
    </div>
  );
}

export function StatusBadge({ label }: { label: string }) {
  const colorStatus =
    label === 'Connected'
      ? 'success'
      : label === 'Needs reconnect' || label === 'Needs attention'
        ? 'warning'
        : label === 'Disconnected'
          ? 'error'
          : 'neutral';

  return (
    <Badge status={label} colorStatus={colorStatus} variant='pastel' size='sm'>
      {label}
    </Badge>
  );
}
