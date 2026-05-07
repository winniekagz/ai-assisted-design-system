import { Card, CardContent } from '@/components/ui/card';
import { PaginationControl } from '@/components/ui/pagination/pagination';
import { cn } from '@/lib/utils';

export interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
  showPageSizeSelector?: boolean;
  showItemCount?: boolean;
  showFirstLast?: boolean;
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
  showFirstLast = false,
  siblingCount = 1,
  boundaryCount = 1,
}: DataTablePaginationProps) {
  return (
    <Card className={cn('mt-4 border-[color:var(--border-subtle)]', className)}>
      <CardContent className='p-3'>
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          siblingCount={siblingCount}
          boundaryCount={boundaryCount}
          variant='table'
          showFirstLast={showFirstLast}
          showPageSizeSelector={showPageSizeSelector}
          showItemRange={showItemCount}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </CardContent>
    </Card>
  );
}
