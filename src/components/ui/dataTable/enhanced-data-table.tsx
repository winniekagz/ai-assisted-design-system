'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  Edit,
  Eye,
  MoreHorizontal,
  Search,
  Trash2,
} from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { useTableState } from '../../../hooks/useTable';
import {
  sizeClasses,
  variantClasses,
} from '../../../styles/components/table/table';
import { EnhancedDataTableProps } from '../../../types/table';
import { Button } from '../button';
import { Card, CardContent, CardHeader, CardTitle } from '../card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../dropdown/dropdown-menu';
import { Input } from '../input';
import { DataTablePagination } from '../pagination/data-table-pagination';
import { Typography } from '../typography';
import { TableCell } from './Tablecell';

// Main Enhanced Data Table Component
export function EnhancedDataTable<TData, TValue>({
  columns,
  data,
  title,
  variant = 'default',
  size = 'default',
  enableSearch = true,
  enableSorting = true,
  enableRowSelection = false,
  enablePagination = true,
  enableRowNumbers = false,
  enableActions = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data available',
  loading = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  onRowClick,
  onRowSelectionChange,
  renderRowActions,
  className,
}: EnhancedDataTableProps<TData, TValue>) {
  const {
    pagination,
    setPagination,
    setSorting,
    sorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setGlobalFilter,
    globalFilter,
    setRowSelection,
  } = useTableState();

  // Add row numbers column if enabled
  const columnsWithRowNumbers = React.useMemo(() => {
    if (!enableRowNumbers) return columns;

    const rowNumberColumn: ColumnDef<TData, TValue> = {
      id: 'rowNumber',
      header: '#',
      cell: ({ row }) => (
        <TableCell
          content={row.index + 1 + pagination.pageIndex * pagination.pageSize}
          variant='default'
          align='center'
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 60,
    };

    return [rowNumberColumn, ...columns];
  }, [columns, enableRowNumbers, pagination.pageIndex, pagination.pageSize]);

  // Add actions column if enabled
  const columnsWithActions = React.useMemo(() => {
    if (!enableActions) return columnsWithRowNumbers;

    const actionsColumn: ColumnDef<TData, TValue> = {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className='flex items-center gap-2'>
            {renderRowActions ? (
              renderRowActions(rowData)
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem>
                    <Eye className='mr-2 h-4 w-4' />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className='mr-2 h-4 w-4' />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className='text-error'>
                    <Trash2 className='mr-2 h-4 w-4' />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
      size: 100,
    };

    return [...columnsWithRowNumbers, actionsColumn];
  }, [columnsWithRowNumbers, enableActions, renderRowActions]);

  const table = useReactTable({
    data,
    columns: columnsWithActions,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },
    enableSorting,
    enableRowSelection,
    enableGlobalFilter: true,
  });

  // Handle row selection change
  React.useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map(row => row.original);
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, onRowSelectionChange, table]);

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Top Toolbar */}
      {enableSearch && (
        <Card>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                {title && (
                  <CardTitle className='text-lg font-semibold'>
                    {title}
                  </CardTitle>
                )}
              </div>
              <div className='flex items-center gap-2'>
                {enableSearch && (
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                    <Input
                      placeholder={searchPlaceholder}
                      value={globalFilter ?? ''}
                      onChange={event => setGlobalFilter(event.target.value)}
                      className='pl-9 w-[300px]'
                    />
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Table */}
      <Card className={cn(variantClasses[variant], sizeClasses[size])}>
        <CardContent className='p-0'>
          <div className='rounded-md border'>
            <table className='w-full caption-bottom text-sm'>
              <thead className='border-b bg-muted/50'>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className={cn(
                          'h-12 px-4 text-left align-middle font-medium text-neutral-900 ',
                          header.column.getCanSort() &&
                            'cursor-pointer select-none'
                        )}
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              'flex items-center gap-2',
                              header.column.getCanSort() &&
                                'hover:text-foreground'
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <ArrowUpDown className='h-4 w-4' />
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => (
                    <tr
                      key={row.id}
                      className={cn(
                        'border-b transition-colors hover:bg-muted/50',
                        onRowClick && 'cursor-pointer'
                      )}
                      onClick={() => onRowClick?.(row.original)}
                    >
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className='p-4 align-middle'
                          style={{ width: cell.column.getSize() }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columnsWithActions.length}
                      className='h-24 text-center'
                    >
                      <div className='flex flex-col items-center justify-center gap-2'>
                        <Typography
                          variant='body1'
                          className='text-muted-foreground'
                        >
                          {loading ? 'Loading...' : emptyMessage}
                        </Typography>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Toolbar */}
      {enablePagination && (
        <DataTablePagination
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          pageSize={table.getState().pagination.pageSize}
          totalItems={table.getFilteredRowModel().rows.length}
          pageSizeOptions={pageSizeOptions}
          onPageChange={page => table.setPageIndex(page - 1)}
          onPageSizeChange={newPageSize => table.setPageSize(newPageSize)}
        />
      )}
    </div>
  );
}
