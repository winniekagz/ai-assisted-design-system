'use client';

import { Button } from 'componentiq';

export function ProjectsPagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  // eslint-disable-next-line no-unused-vars
  onPageChange(page: number): void;
}) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  return (
    <div className='flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between'>
      <p className='text-sm text-muted-foreground'>
        Showing {start}-{end} of {total} projects
      </p>
      <div className='flex gap-2'>
        <Button type='button' variant='outlined' size='sm' disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <Button type='button' variant='outlined' size='sm' disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
