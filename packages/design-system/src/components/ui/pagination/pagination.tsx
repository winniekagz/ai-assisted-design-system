import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/form-fields/select';
import { usePagination } from '@/hooks/use-pagination';
import { cn } from '@/lib/utils';

export type PaginationControlVariant =
  | 'numbered'
  | 'labeled'
  | 'jump'
  | 'table'
  | 'simple';

export interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
  boundaryCount?: number;
  variant?: PaginationControlVariant;
  pageName?: string;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  showFirstLast?: boolean;
  showPageNumbers?: boolean;
  showPageSizeSelector?: boolean;
  showItemRange?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  onFirstPage?: () => void;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  onLastPage?: () => void;
}

function clampPage(page: number, totalPages: number) {
  return Math.max(1, Math.min(page, Math.max(1, totalPages)));
}

function getItemRange(currentPage: number, pageSize = 10, totalItems = 0) {
  if (totalItems <= 0) {
    return { startItem: 0, endItem: 0 };
  }

  return {
    startItem: (currentPage - 1) * pageSize + 1,
    endItem: Math.min(currentPage * pageSize, totalItems),
  };
}

export function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
  className,
  siblingCount = 1,
  boundaryCount = 1,
  variant = 'numbered',
  pageName = 'Page name',
  totalItems,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  showFirstLast = variant === 'jump',
  showPageNumbers = variant !== 'jump' && variant !== 'table',
  showPageSizeSelector = variant === 'table',
  showItemRange = variant === 'table',
  previousLabel = variant === 'simple' ? 'Back' : 'Previous',
  nextLabel = 'Next',
  onFirstPage,
  onPreviousPage,
  onNextPage,
  onLastPage,
}: PaginationControlProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = clampPage(currentPage, safeTotalPages);
  const pagination = usePagination({
    currentPage: safeCurrentPage,
    totalPages: safeTotalPages,
    siblingCount,
    boundaryCount,
  });
  const { startItem, endItem } = getItemRange(
    safeCurrentPage,
    pageSize,
    totalItems
  );

  const goToPage = (page: number) => {
    onPageChange(clampPage(page, safeTotalPages));
  };

  const goToFirst = () => {
    onFirstPage?.();
    goToPage(1);
  };

  const goToPrevious = () => {
    onPreviousPage?.();
    goToPage(safeCurrentPage - 1);
  };

  const goToNext = () => {
    onNextPage?.();
    goToPage(safeCurrentPage + 1);
  };

  const goToLast = () => {
    onLastPage?.();
    goToPage(safeTotalPages);
  };

  const isFirstPage = safeCurrentPage <= 1;
  const isLastPage = safeCurrentPage >= safeTotalPages;
  const isLabeled = variant === 'labeled';
  const isJump = variant === 'jump';
  const isTable = variant === 'table';
  const isSimple = variant === 'simple';

  return (
    <nav
      aria-label='Pagination'
      className={cn(
        'flex w-full flex-wrap items-center justify-center gap-2 text-[color:var(--text-primary)]',
        isTable && 'justify-between gap-3',
        className
      )}
    >
      {isTable && showPageSizeSelector && (
        <div className='flex min-w-fit items-center gap-2 text-sm'>
          <span className='text-[color:var(--text-primary)]'>
            Rows per page
          </span>
          <Select
            value={pageSize.toString()}
            onChange={event => onPageSizeChange?.(Number(event.target.value))}
            size='sm'
            className='h-10 w-20 bg-[color:var(--bg-surface)]'
            aria-label='Rows per page'
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
        </div>
      )}

      {isTable && showItemRange && typeof totalItems === 'number' && (
        <p className='min-w-fit text-sm text-[color:var(--text-primary)]'>
          {startItem}-{endItem} of {totalItems} rows
        </p>
      )}

      <div
        className={cn(
          'flex items-center gap-2',
          (variant === 'numbered' || isTable) &&
            'rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-1 shadow-sm',
          isSimple && 'min-w-[320px] justify-between'
        )}
      >
        {showFirstLast && (
          <PaginationIconButton
            ariaLabel='Go to first page'
            disabled={isFirstPage}
            onClick={goToFirst}
          >
            <ChevronsLeft className='size-4' />
          </PaginationIconButton>
        )}

        <PaginationMoveButton
          ariaLabel='Go to previous page'
          disabled={isFirstPage}
          label={isLabeled || isSimple ? previousLabel : undefined}
          onClick={goToPrevious}
        >
          <ChevronLeft className='size-4' />
        </PaginationMoveButton>

        {showPageNumbers &&
          pagination.items.map((item, index) =>
            item === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                aria-hidden='true'
                className='grid size-9 place-items-center text-[color:var(--text-primary)]'
              >
                <MoreHorizontal className='size-4' />
              </span>
            ) : (
              <PaginationPageButton
                key={item}
                page={item}
                isActive={item === safeCurrentPage}
                onClick={() => goToPage(item)}
              />
            )
          )}

        {isJump && (
          <div className='flex items-center gap-2 px-1 text-sm'>
            <span className='grid size-10 place-items-center rounded-md border border-[color:var(--color-primary)] bg-[color:var(--bg-surface)] font-medium text-[color:var(--text-primary)]'>
              {safeCurrentPage}
            </span>
            <span className='text-[color:var(--text-primary)]'>
              of {safeTotalPages}
            </span>
          </div>
        )}

        {isSimple && (
          <span className='px-4 text-sm font-medium text-[color:var(--text-primary)]'>
            {pageName}
          </span>
        )}

        <PaginationMoveButton
          ariaLabel='Go to next page'
          disabled={isLastPage}
          label={isLabeled || isSimple ? nextLabel : undefined}
          labelPosition='before'
          onClick={goToNext}
        >
          <ChevronRight className='size-4' />
        </PaginationMoveButton>

        {showFirstLast && (
          <PaginationIconButton
            ariaLabel='Go to last page'
            disabled={isLastPage}
            onClick={goToLast}
          >
            <ChevronsRight className='size-4' />
          </PaginationIconButton>
        )}
      </div>
    </nav>
  );
}

function PaginationIconButton({
  ariaLabel,
  disabled,
  onClick,
  children,
}: {
  ariaLabel: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type='button'
      variant='outlined'
      size='icon'
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className='size-10 border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] text-[color:var(--text-primary)] shadow-sm hover:bg-[color:var(--bg-hover)] disabled:text-[color:var(--text-primary)] disabled:opacity-100'
    >
      {children}
    </Button>
  );
}

function PaginationMoveButton({
  ariaLabel,
  disabled,
  label,
  labelPosition = 'after',
  onClick,
  children,
}: {
  ariaLabel: string;
  disabled: boolean;
  label?: string;
  labelPosition?: 'before' | 'after';
  onClick: () => void;
  children: React.ReactNode;
}) {
  if (!label) {
    return (
      <PaginationIconButton
        ariaLabel={ariaLabel}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </PaginationIconButton>
    );
  }

  return (
    <Button
      type='button'
      variant='outlined'
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className='h-10 gap-2 border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] px-3 text-[color:var(--text-primary)] shadow-sm hover:bg-[color:var(--bg-hover)] disabled:text-[color:var(--text-primary)] disabled:opacity-100'
    >
      {labelPosition === 'before' && <span>{label}</span>}
      {children}
      {labelPosition === 'after' && <span>{label}</span>}
    </Button>
  );
}

function PaginationPageButton({
  page,
  isActive,
  onClick,
}: {
  page: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type='button'
      variant={isActive ? 'contained' : 'outlined'}
      size='icon'
      aria-label={`Go to page ${page}`}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
      className={cn(
        'size-9 border-[color:var(--border-subtle)] shadow-none',
        isActive
          ? 'bg-[color:var(--color-primary)] text-[color:var(--color-primary-fg,var(--text-inverse))] hover:bg-[color:var(--color-primary)]'
          : 'bg-[color:var(--bg-surface)] text-[color:var(--text-primary)] hover:bg-[color:var(--bg-hover)]'
      )}
    >
      {page}
    </Button>
  );
}
