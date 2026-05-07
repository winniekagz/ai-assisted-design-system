import { Card, CardContent } from '@/components/ui/card';
import {
  PaginationControl,
  type PaginationControlVariant,
} from '@/components/ui/pagination/pagination';
import { Typography } from '@/components/ui/typography';
import { useEnhancedPagination } from '@/hooks/use-enhanced-pagination';
import { cn } from '@/lib/utils';
import React from 'react';

export interface EnhancedPaginationProps {
  totalItems: number;
  initialPageSize?: number;
  initialPage?: number;
  currentPage?: number;
  pageSize?: number;
  siblingCount?: number;
  boundaryCount?: number;
  pageSizeOptions?: number[];
  className?: string;
  showPageSizeSelector?: boolean;
  showItemCount?: boolean;
  showPageInfo?: boolean;
  showFirstLast?: boolean;
  variant?: PaginationControlVariant | 'default' | 'compact' | 'minimal';
  pageName?: string;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onFirstPage?: () => void;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  onLastPage?: () => void;
  children?: React.ReactNode;
}

function getControlVariant(
  variant: EnhancedPaginationProps['variant']
): PaginationControlVariant {
  if (variant === 'default' || variant === undefined) {
    return 'table';
  }

  if (variant === 'compact') {
    return 'numbered';
  }

  if (variant === 'minimal') {
    return 'simple';
  }

  return variant;
}

export function EnhancedPagination({
  totalItems,
  initialPageSize = 10,
  initialPage = 1,
  currentPage,
  pageSize,
  siblingCount = 1,
  boundaryCount = 1,
  pageSizeOptions = [5, 10, 20, 50, 100],
  className,
  showPageSizeSelector = true,
  showItemCount = true,
  showPageInfo = true,
  showFirstLast,
  variant = 'default',
  pageName,
  onPageChange,
  onPageSizeChange,
  onFirstPage,
  onPreviousPage,
  onNextPage,
  onLastPage,
  children,
}: EnhancedPaginationProps) {
  const pagination = useEnhancedPagination({
    totalItems,
    initialPageSize: pageSize ?? initialPageSize,
    initialPage: currentPage ?? initialPage,
    siblingCount,
    boundaryCount,
    pageSizeOptions,
  });

  const activePage = currentPage ?? pagination.currentPage;
  const activePageSize = pageSize ?? pagination.pageSize;
  const totalPages = Math.max(1, Math.ceil(totalItems / activePageSize));
  const startItem = totalItems > 0 ? (activePage - 1) * activePageSize + 1 : 0;
  const endItem = Math.min(activePage * activePageSize, totalItems);
  const controlVariant = getControlVariant(variant);

  const handlePageChange = (page: number) => {
    pagination.setPage(page);
    onPageChange?.(page);
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    pagination.setPageSize(nextPageSize);
    onPageSizeChange?.(nextPageSize);
  };

  const controls = (
    <PaginationControl
      currentPage={activePage}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={activePageSize}
      pageSizeOptions={pageSizeOptions}
      siblingCount={siblingCount}
      boundaryCount={boundaryCount}
      variant={controlVariant}
      pageName={pageName}
      showFirstLast={showFirstLast}
      showPageSizeSelector={showPageSizeSelector}
      showItemRange={showItemCount}
      showPageNumbers={controlVariant !== 'simple'}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      onFirstPage={onFirstPage}
      onPreviousPage={onPreviousPage}
      onNextPage={onNextPage}
      onLastPage={onLastPage}
    />
  );

  if (variant === 'compact' || variant === 'minimal') {
    return (
      <div className={cn('flex w-full items-center justify-center', className)}>
        {controls}
      </div>
    );
  }

  return (
    <Card className={cn('mt-4 border-[color:var(--border-subtle)]', className)}>
      <CardContent className='p-4'>
        <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
          {showItemCount && showPageInfo && (
            <div className='min-w-fit text-sm text-[color:var(--text-secondary)]'>
              <Typography variant='small'>
                Page {activePage} of {totalPages} · {startItem}-{endItem} of{' '}
                {totalItems} items
              </Typography>
            </div>
          )}

          <div className='min-w-0 flex-1'>{controls}</div>
        </div>

        {children && <div className='mt-4'>{children}</div>}
      </CardContent>
    </Card>
  );
}

export { useEnhancedPagination };
