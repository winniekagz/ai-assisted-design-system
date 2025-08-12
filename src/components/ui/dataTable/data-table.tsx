import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../button';
import { Typography } from '../typography';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';
import { Input } from '../input';
import { Card } from '../card';
import { dataTableVariants } from './tableVariants';
import { DataTableColumnProps } from '../../../types/table';

// Types

export interface DataTableProps<T>
  extends VariantProps<typeof dataTableVariants> {
  data: T[];
  columns: DataTableColumnProps<T>[];
  title?: string;
  variant?: 'default' | 'bordered' | 'striped' | 'compact';
  size?: 'sm' | 'default' | 'lg';
  enableSearch?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableRowSelection?: boolean;
  enablePagination?: boolean;
  enableRowNumbers?: boolean;
  enableExpandable?: boolean;
  enableActions?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (row: T) => void;
  onRowSelectionChange?: (selectedRows: T[]) => void;
  renderRowActions?: (row: T) => React.ReactNode;
  renderExpandedContent?: (row: T) => React.ReactNode;
  className?: string;
}

// Internal state management

// Main DataTable Component
export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  title,
  variant,
  size,
  enableSearch = true,
  enableSorting = true,
  enableFiltering = true,
  enableRowSelection = false,
  enablePagination = true,
  enableRowNumbers = false,
  enableExpandable = false,
  enableActions = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data available',
  loading = false,
  onRowClick,
  onRowSelectionChange,
  renderRowActions,
  renderExpandedContent,
  className,
}: DataTableProps<T>) {
  const [state, setState] = React.useState<DataTableState<T>>({
    searchQuery: '',
    sortColumn: null,
    sortDirection: 'asc',
    selectedRows: new Set(),
    expandedRows: new Set(),
    currentPage: 1,
    pageSize: 10,
  });

  // Generate unique row IDs
  const getRowId = (row: T, index: number) =>
    row.id?.toString() || index.toString();

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!state.searchQuery) return data;

    return data.filter(row =>
      columns.some(column => {
        const value = row[column.accessorKey];
        if (value == null) return false;
        return value
          .toString()
          .toLowerCase()
          .includes(state.searchQuery.toLowerCase());
      })
    );
  }, [data, state.searchQuery, columns]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!state.sortColumn) return filteredData;

    const column = columns.find(col => col.id === state.sortColumn);
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[column.accessorKey];
      const bValue = b[column.accessorKey];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return state.sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [filteredData, state.sortColumn, state.sortDirection, columns]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    if (!enablePagination) return sortedData;

    const startIndex = (state.currentPage - 1) * state.pageSize;
    return sortedData.slice(startIndex, startIndex + state.pageSize);
  }, [sortedData, state.currentPage, state.pageSize, enablePagination]);

  // Handle sorting
  const handleSort = (columnId: string) => {
    setState(prev => ({
      ...prev,
      sortColumn: prev.sortColumn === columnId ? null : columnId,
      sortDirection:
        prev.sortColumn === columnId && prev.sortDirection === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  // Handle row selection
  const handleRowSelection = (rowId: string, checked: boolean) => {
    setState(prev => {
      const newSelectedRows = new Set(prev.selectedRows);
      if (checked) {
        newSelectedRows.add(rowId);
      } else {
        newSelectedRows.delete(rowId);
      }

      // Notify parent component
      const selectedData = data.filter((row, index) =>
        newSelectedRows.has(getRowId(row, index))
      );
      onRowSelectionChange?.(selectedData);

      return { ...prev, selectedRows: newSelectedRows };
    });
  };

  // Handle row expansion
  const handleRowExpansion = (rowId: string) => {
    setState(prev => {
      const newExpandedRows = new Set(prev.expandedRows);
      if (newExpandedRows.has(rowId)) {
        newExpandedRows.delete(rowId);
      } else {
        newExpandedRows.add(rowId);
      }
      return { ...prev, expandedRows: newExpandedRows };
    });
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    setState(prev => {
      const newSelectedRows = new Set<string>();
      if (checked) {
        paginatedData.forEach((row, index) => {
          newSelectedRows.add(getRowId(row, index));
        });
      }

      const selectedData = data.filter((row, index) =>
        newSelectedRows.has(getRowId(row, index))
      );
      onRowSelectionChange?.(selectedData);

      return { ...prev, selectedRows: newSelectedRows };
    });
  };

  const totalPages = Math.ceil(sortedData.length / state.pageSize);
  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row, index) =>
      state.selectedRows.has(getRowId(row, index))
    );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      {(title || enableSearch || enableFiltering) && (
        <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
          {title && (
            <Typography variant='h4' className='font-semibold'>
              {title}
            </Typography>
          )}

          <div className='flex flex-col sm:flex-row gap-2 w-full sm:w-auto'>
            {enableSearch && (
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4' />
                <Input
                  placeholder={searchPlaceholder}
                  value={state.searchQuery}
                  onChange={e =>
                    setState(prev => ({ ...prev, searchQuery: e.target.value }))
                  }
                  className='pl-10 w-full sm:w-64'
                />
              </div>
            )}

            {enableFiltering && (
              <Button variant='outlined' size='sm'>
                <Filter className='size-4 mr-2' />
                Filter
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <Card className={cn(dataTableVariants({ variant, size }))}>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-muted/50 border-b border-border'>
              <tr>
                {enableRowSelection && (
                  <th className='w-12 p-4'>
                    <input
                      type='checkbox'
                      checked={isAllSelected}
                      onChange={e => handleSelectAll(e.target.checked)}
                      className='rounded border-border'
                    />
                  </th>
                )}

                {enableRowNumbers && (
                  <th className='w-16 p-4 text-center'>
                    <Typography variant='small' weight='medium'>
                      #
                    </Typography>
                  </th>
                )}

                {enableExpandable && <th className='w-12 p-4' />}

                {columns.map(column => (
                  <th
                    key={column.id}
                    className={cn(
                      'p-4 text-left',
                      column.width && `w-[${column.width}]`,
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.sortable &&
                        enableSorting &&
                        'cursor-pointer hover:bg-muted/30'
                    )}
                    onClick={() =>
                      column.sortable && enableSorting && handleSort(column.id)
                    }
                  >
                    <div
                      className={cn(
                        'flex items-center gap-2',
                        column.align === 'center' && 'justify-center',
                        column.align === 'right' && 'justify-end'
                      )}
                    >
                      <Typography variant='small' weight='medium'>
                        {column.header}
                      </Typography>
                      {column.sortable && enableSorting && (
                        <ArrowUpDown className='size-4 text-muted-foreground' />
                      )}
                    </div>
                  </th>
                ))}

                {enableActions && (
                  <th className='w-16 p-4 text-center'>
                    <Typography variant='small' weight='medium'>
                      Actions
                    </Typography>
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (enableRowSelection ? 1 : 0) +
                      (enableRowNumbers ? 1 : 0) +
                      (enableExpandable ? 1 : 0) +
                      (enableActions ? 1 : 0)
                    }
                    className='p-8 text-center'
                  >
                    <Typography variant='body2' textColor='muted'>
                      Loading...
                    </Typography>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (enableRowSelection ? 1 : 0) +
                      (enableRowNumbers ? 1 : 0) +
                      (enableExpandable ? 1 : 0) +
                      (enableActions ? 1 : 0)
                    }
                    className='p-8 text-center'
                  >
                    <Typography variant='body2' textColor='muted'>
                      {emptyMessage}
                    </Typography>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => {
                  const rowId = getRowId(row, rowIndex);
                  const isSelected = state.selectedRows.has(rowId);
                  const isExpanded = state.expandedRows.has(rowId);

                  return (
                    <React.Fragment key={rowId}>
                      <tr
                        className={cn(
                          'border-b border-border transition-colors',
                          onRowClick && 'cursor-pointer hover:bg-muted/30',
                          isSelected && 'bg-primary/5'
                        )}
                        onClick={() => onRowClick?.(row)}
                      >
                        {enableRowSelection && (
                          <td className='p-4'>
                            <input
                              type='checkbox'
                              checked={isSelected}
                              onChange={e =>
                                handleRowSelection(rowId, e.target.checked)
                              }
                              className='rounded border-border'
                              onClick={e => e.stopPropagation()}
                            />
                          </td>
                        )}

                        {enableRowNumbers && (
                          <td className='p-4 text-center'>
                            <Typography variant='small' textColor='muted'>
                              {(state.currentPage - 1) * state.pageSize +
                                rowIndex +
                                1}
                            </Typography>
                          </td>
                        )}

                        {enableExpandable && (
                          <td className='p-4'>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={e => {
                                e.stopPropagation();
                                handleRowExpansion(rowId);
                              }}
                            >
                              {isExpanded ? (
                                <ChevronDown className='size-4' />
                              ) : (
                                <ChevronRight className='size-4' />
                              )}
                            </Button>
                          </td>
                        )}

                        {columns.map(column => (
                          <td
                            key={column.id}
                            className={cn(
                              'p-4',
                              column.align === 'center' && 'text-center',
                              column.align === 'right' && 'text-right'
                            )}
                          >
                            {column.cell ? (
                              column.cell(row[column.accessorKey], row)
                            ) : (
                              <Typography variant='body2'>
                                {row[column.accessorKey]?.toString() || '-'}
                              </Typography>
                            )}
                          </td>
                        ))}

                        {enableActions && (
                          <td className='p-4 text-center'>
                            {renderRowActions ? (
                              renderRowActions(row)
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant='ghost' size='icon'>
                                    <MoreHorizontal className='size-4' />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                  <DropdownMenuItem>View</DropdownMenuItem>
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem className='text-destructive'>
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </td>
                        )}
                      </tr>

                      {/* Expanded content */}
                      {enableExpandable &&
                        isExpanded &&
                        renderExpandedContent && (
                          <tr>
                            <td
                              colSpan={
                                columns.length +
                                (enableRowSelection ? 1 : 0) +
                                (enableRowNumbers ? 1 : 0) +
                                (enableExpandable ? 1 : 0) +
                                (enableActions ? 1 : 0)
                              }
                              className='p-4 bg-muted/20'
                            >
                              {renderExpandedContent(row)}
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {enablePagination && totalPages > 1 && (
        <div className='flex items-center justify-between'>
          <Typography variant='small' textColor='muted'>
            Showing {(state.currentPage - 1) * state.pageSize + 1} to{' '}
            {Math.min(state.currentPage * state.pageSize, sortedData.length)} of{' '}
            {sortedData.length} results
          </Typography>

          <div className='flex items-center gap-2'>
            <Button
              variant='outlined'
              size='sm'
              disabled={state.currentPage === 1}
              onClick={() =>
                setState(prev => ({
                  ...prev,
                  currentPage: prev.currentPage - 1,
                }))
              }
            >
              Previous
            </Button>

            <div className='flex items-center gap-1'>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={
                    page === state.currentPage ? 'contained' : 'outlined'
                  }
                  size='sm'
                  onClick={() =>
                    setState(prev => ({ ...prev, currentPage: page }))
                  }
                  className='w-8 h-8 p-0'
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant='outlined'
              size='sm'
              disabled={state.currentPage === totalPages}
              onClick={() =>
                setState(prev => ({
                  ...prev,
                  currentPage: prev.currentPage + 1,
                }))
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
