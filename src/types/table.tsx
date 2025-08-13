import { ColumnDef } from '@tanstack/react-table';

export type TablevariantProps = 'default' | 'bordered' | 'striped' | 'compact';
export type TableSizeProps = 'sm' | 'default' | 'lg';

export interface DataTableColumnProps<T> {
  id: string;
  header: string;
  accessorKey: keyof T;
  cell?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableStateProps<T> {
  searchQuery: string;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  selectedRows: Set<string>;
  expandedRows: Set<string>;
  currentPage: number;
  pageSize: number;
}
export interface EnhancedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  variant?: TablevariantProps;
  size?: TableSizeProps;
  enableSearch?: boolean;
  enableSorting?: boolean;
  enableRowSelection?: boolean;
  enablePagination?: boolean;
  enableRowNumbers?: boolean;
  enableActions?: boolean;
  enableColumnVisibility?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onRowClick?: (row: TData) => void;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  renderRowActions?: (row: TData) => React.ReactNode;
  className?: string;
}

// Ma
