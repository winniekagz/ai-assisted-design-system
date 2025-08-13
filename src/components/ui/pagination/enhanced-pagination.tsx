import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/form-fields/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination/pagination';
import { Typography } from '@/components/ui/typography';
import { useEnhancedPagination } from '@/hooks/use-enhanced-pagination';
import { cn } from '@/lib/utils';
import React from 'react';

export interface EnhancedPaginationProps {
  totalItems: number;
  initialPageSize?: number;
  initialPage?: number;
  siblingCount?: number;
  boundaryCount?: number;
  pageSizeOptions?: number[];
  className?: string;
  showPageSizeSelector?: boolean;
  showItemCount?: boolean;
  showPageInfo?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  children?: React.ReactNode;
}

export function EnhancedPagination({
  totalItems,
  initialPageSize = 10,
  initialPage = 1,
  siblingCount = 1,
  boundaryCount = 1,
  pageSizeOptions = [5, 10, 20, 50, 100],
  className,
  showPageSizeSelector = true,
  showItemCount = true,
  showPageInfo = true,
  variant = 'default',
  onPageChange,
  onPageSizeChange,
  children,
}: EnhancedPaginationProps) {
  const pagination = useEnhancedPagination({
    totalItems,
    initialPageSize,
    initialPage,
    siblingCount,
    boundaryCount,
    pageSizeOptions,
  });

  const handlePageChange = (page: number) => {
    pagination.setPage(page);
    onPageChange?.(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    pagination.setPageSize(pageSize);
    onPageSizeChange?.(pageSize);
  };

  const renderPaginationContent = () => (
    <Pagination>
      <PaginationContent>
        {/* Previous button */}
        <PaginationItem>
          <PaginationPrevious
            href='#'
            onClick={e => {
              e.preventDefault();
              if (pagination.hasPreviousPage) {
                handlePageChange(pagination.previousPage);
              }
            }}
            className={cn(
              !pagination.hasPreviousPage && 'pointer-events-none opacity-50'
            )}
          />
        </PaginationItem>

        {/* Page numbers */}
        {pagination.paginationItems.map((item, index) => (
          <PaginationItem key={index}>
            {item === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href='#'
                isActive={item === pagination.currentPage}
                onClick={e => {
                  e.preventDefault();
                  handlePageChange(item);
                }}
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next button */}
        <PaginationItem>
          <PaginationNext
            href='#'
            onClick={e => {
              e.preventDefault();
              if (pagination.hasNextPage) {
                handlePageChange(pagination.nextPage);
              }
            }}
            className={cn(
              !pagination.hasNextPage && 'pointer-events-none opacity-50'
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        {renderPaginationContent()}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center justify-between', className)}>
        {showItemCount && (
          <Typography variant='body2' className='text-primary'>
            {pagination.startItem}-{pagination.endItem} of{' '}
            {pagination.totalItems}
          </Typography>
        )}

        <div className='flex items-center gap-4'>
          {showPageSizeSelector && (
            <div className='flex items-center gap-2'>
              <Typography variant='small' className='text-primary'>
                Rows:
              </Typography>
              <Select
                value={pagination.pageSize.toString()}
                onChange={e => handlePageSizeChange(Number(e.target.value))}
                size='sm'
                className='w-[70px]'
              >
                {pagination.pageSizeOptions.map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {renderPaginationContent()}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <Card className={cn('mt-4', className)}>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between'>
          {/* Item count and page info */}
          {showItemCount && (
            <div className='flex items-center gap-2 text-sm text-primary'>
              {showPageInfo && (
                <>
                  <span>
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <span>•</span>
                </>
              )}
              <span>
                {pagination.startItem}-{pagination.endItem} of{' '}
                {pagination.totalItems} items
              </span>
            </div>
          )}

          <div className='flex items-center gap-4'>
            {/* Page size selector */}
            {showPageSizeSelector && (
              <div className='flex items-center gap-2'>
                <Typography variant='body2' className='text-muted-foreground'>
                  Rows per page:
                </Typography>
                <Select
                  value={pagination.pageSize.toString()}
                  onChange={e => handlePageSizeChange(Number(e.target.value))}
                  size='sm'
                  className='w-[70px]'
                >
                  {pagination.pageSizeOptions.map(size => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {/* Pagination controls */}
            {renderPaginationContent()}
          </div>
        </div>

        {/* Custom content */}
        {children}
      </CardContent>
    </Card>
  );
}

// Export the hook for direct use
export { useEnhancedPagination };
