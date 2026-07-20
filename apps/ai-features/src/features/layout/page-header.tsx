import type { ReactNode } from 'react';

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className='mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
      <div className='max-w-3xl'>
        <p className='text-sm font-medium uppercase text-primary'>{eyebrow}</p>
        <h1 className='mt-2 text-3xl font-semibold leading-tight text-foreground md:text-4xl'>
          {title}
        </h1>
        <p className='mt-3 text-sm leading-6 text-muted-foreground md:text-base'>
          {description}
        </p>
      </div>
      {actions && <div className='flex flex-wrap gap-2'>{actions}</div>}
    </header>
  );
}
