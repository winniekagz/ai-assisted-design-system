import { useCallback, useMemo, useState } from 'react';

export interface UseEnhancedPaginationProps {
  totalItems: number;
  initialPageSize?: number;
  initialPage?: number;
  siblingCount?: number;
  boundaryCount?: number;
  pageSizeOptions?: number[];
}

export interface UseEnhancedPaginationReturn {
  // Current state
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;

  // Computed values
  startItem: number;
  endItem: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number;
  previousPage: number;

  // Pagination items for rendering
  paginationItems: (number | 'ellipsis')[];

  // Actions
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;

  // Page size options
  pageSizeOptions: number[];

  // Pagination state for TanStack Table
  paginationState: {
    pageIndex: number;
    pageSize: number;
  };

  // Set pagination state for TanStack Table
  setPaginationState: (state: { pageIndex: number; pageSize: number }) => void;
}

export function useEnhancedPagination({
  totalItems,
  initialPageSize = 10,
  initialPage = 1,
  siblingCount = 1,
  boundaryCount = 1,
  pageSizeOptions = [5, 10, 20, 50, 100],
}: UseEnhancedPaginationProps): UseEnhancedPaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Calculate total pages
  const totalPages = useMemo(
    () => Math.ceil(totalItems / pageSize),
    [totalItems, pageSize]
  );

  // Ensure current page is within bounds when page size changes
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Calculate start and end items
  const startItem = useMemo(
    () => (currentPage - 1) * pageSize + 1,
    [currentPage, pageSize]
  );

  const endItem = useMemo(
    () => Math.min(currentPage * pageSize, totalItems),
    [currentPage, pageSize, totalItems]
  );

  // Navigation state
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const nextPage = hasNextPage ? currentPage + 1 : currentPage;
  const previousPage = hasPreviousPage ? currentPage - 1 : currentPage;

  // Generate pagination items with ellipsis
  const paginationItems = useMemo(() => {
    const range = (start: number, end: number) => {
      const length = end - start + 1;
      return Array.from({ length }, (_, idx) => idx + start);
    };

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

  // Actions
  const setPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages]
  );

  const setPageSizeHandler = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    // Reset to first page when page size changes
    setCurrentPage(1);
  }, []);

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(nextPage);
    }
  }, [hasNextPage, nextPage]);

  const goToPreviousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage(previousPage);
    }
  }, [hasPreviousPage, previousPage]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  // TanStack Table pagination state
  const paginationState = useMemo(
    () => ({
      pageIndex: currentPage - 1, // TanStack uses 0-based indexing
      pageSize,
    }),
    [currentPage, pageSize]
  );

  const setPaginationState = useCallback(
    (state: { pageIndex: number; pageSize: number }) => {
      setCurrentPage(state.pageIndex + 1); // Convert back to 1-based indexing
      setPageSize(state.pageSize);
    },
    []
  );

  return {
    // Current state
    currentPage,
    pageSize,
    totalPages,
    totalItems,

    // Computed values
    startItem,
    endItem,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,

    // Pagination items for rendering
    paginationItems,

    // Actions
    setPage,
    setPageSize: setPageSizeHandler,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,

    // Page size options
    pageSizeOptions,

    // TanStack Table integration
    paginationState,
    setPaginationState,
  };
}
