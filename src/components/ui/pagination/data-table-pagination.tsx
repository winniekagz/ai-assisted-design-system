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
} from '@/components/ui/pagination';
import { Typography } from '@/components/ui/typography';
import { usePagination } from '@/hooks/use-pagination';
import { cn } from '@/lib/utils';

export interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
  showPageSizeSelector?: boolean;
  showItemCount?: boolean;
  siblingCount?: number;
  boundaryCount?: number;
}

export function DataTablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  className,
  showPageSizeSelector = true,
  showItemCount = true,
  siblingCount = 1,
  boundaryCount = 1,
}: DataTablePaginationProps) {
  const pagination = usePagination({
    currentPage,
    totalPages,
    siblingCount,
    boundaryCount,
  });

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <Card className={cn('mt-4', className)}>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between'>
          {/* Item count and page info */}
          {showItemCount && (
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <span>•</span>
              <span>
                {startItem}-{endItem} of {totalItems} items
              </span>
            </div>
          )}

          <div className='flex items-center gap-4'>
            {/* Page size selector */}
            {showPageSizeSelector && (
              <div className='flex items-center gap-2'>
                <Typography variant='small' className='text-muted-foreground'>
                  Rows per page:
                </Typography>
                <Select
                  value={pageSize.toString()}
                  onChange={e => onPageSizeChange(Number(e.target.value))}
                  size='sm'
                  className='w-[70px]'
                >
                  {pageSizeOptions.map(size => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {/* Pagination controls */}
            <Pagination>
              <PaginationContent>
                {/* Previous button */}
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={e => {
                      e.preventDefault();
                      if (pagination.hasPreviousPage) {
                        onPageChange(pagination.previousPage);
                      }
                    }}
                    className={cn(
                      !pagination.hasPreviousPage &&
                        'pointer-events-none opacity-50'
                    )}
                  />
                </PaginationItem>

                {/* Page numbers */}
                {pagination.items.map((item, index) => (
                  <PaginationItem key={index}>
                    {item === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href='#'
                        className='border-none bg-none'
                        isActive={item === currentPage}
                        onClick={e => {
                          e.preventDefault();
                          onPageChange(item);
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
                        onPageChange(pagination.nextPage);
                      }
                    }}
                    className={cn(
                      !pagination.hasNextPage &&
                        'pointer-events-none opacity-50'
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
