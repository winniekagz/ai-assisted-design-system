import { useMemo } from 'react';

export interface UsePaginationProps {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
  boundaryCount?: number;
}

export type PaginationItemValue = number | 'ellipsis';

export interface UsePaginationReturn {
  items: PaginationItemValue[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number;
  previousPage: number;
  startPage: number;
  endPage: number;
}

export function usePagination({
  currentPage,
  totalPages,
  siblingCount = 1,
  boundaryCount = 1,
}: UsePaginationProps): UsePaginationReturn {
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const items = useMemo<PaginationItemValue[]>(() => {
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + boundaryCount * 2;

    if (totalPages <= totalBlocks) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(
      currentPage - siblingCount,
      boundaryCount
    );
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages - boundaryCount
    );

    const shouldShowLeftDots = leftSiblingIndex > boundaryCount + 2;
    const shouldShowRightDots =
      rightSiblingIndex < totalPages - boundaryCount - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = leftSiblingIndex + 1;
      const leftRange = range(1, leftItemCount);
      return [
        ...leftRange,
        'ellipsis',
        ...range(totalPages - boundaryCount + 1, totalPages),
      ];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = totalPages - rightSiblingIndex;
      const rightRange = range(rightSiblingIndex, totalPages);
      return [...range(1, boundaryCount), 'ellipsis', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [
        ...range(1, boundaryCount),
        'ellipsis',
        ...middleRange,
        'ellipsis',
        ...range(totalPages - boundaryCount + 1, totalPages),
      ];
    }

    return range(1, totalPages);
  }, [currentPage, totalPages, siblingCount, boundaryCount]);

  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const nextPage = hasNextPage ? currentPage + 1 : currentPage;
  const previousPage = hasPreviousPage ? currentPage - 1 : currentPage;
  const startPage = Math.max(1, (currentPage - 1) * siblingCount);
  const endPage = Math.min(totalPages, currentPage * siblingCount);

  return {
    items,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    startPage,
    endPage,
  };
}
