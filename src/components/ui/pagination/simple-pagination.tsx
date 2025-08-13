import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePagination } from '@/hooks/use-pagination';

export interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
  boundaryCount?: number;
  showPreviousNext?: boolean;
}

export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  siblingCount = 1,
  boundaryCount = 1,
  showPreviousNext = true,
}: SimplePaginationProps) {
  const pagination = usePagination({
    currentPage,
    totalPages,
    siblingCount,
    boundaryCount,
  });

  return (
    <Pagination className={className}>
      <PaginationContent>
        {/* Previous button */}
        {showPreviousNext && (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination.hasPreviousPage) {
                  onPageChange(pagination.previousPage);
                }
              }}
              className={cn(
                !pagination.hasPreviousPage && 'pointer-events-none opacity-50'
              )}
            />
          </PaginationItem>
        )}

        {/* Page numbers */}
        {pagination.items.map((item, index) => (
          <PaginationItem key={index}>
            {item === 'ellipsis' ? (
              <span className="flex h-9 w-9 items-center justify-center">
                <span className="text-muted-foreground">...</span>
              </span>
            ) : (
              <PaginationLink
                href="#"
                isActive={item === currentPage}
                onClick={(e) => {
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
        {showPreviousNext && (
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination.hasNextPage) {
                  onPageChange(pagination.nextPage);
                }
              }}
              className={cn(
                !pagination.hasNextPage && 'pointer-events-none opacity-50'
              )}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

