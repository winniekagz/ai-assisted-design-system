import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CompactPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showPageInfo?: boolean;
}

export function CompactPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showPageInfo = true,
}: CompactPaginationProps) {
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {/* Page info */}
      {showPageInfo && (
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outlined"
          size="sm"
          onClick={() => {
            if (hasPreviousPage) {
              onPageChange(currentPage - 1);
            }
          }}
          disabled={!hasPreviousPage}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outlined"
          size="sm"
          onClick={() => {
            if (hasNextPage) {
              onPageChange(currentPage + 1);
            }
          }}
          disabled={!hasNextPage}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

