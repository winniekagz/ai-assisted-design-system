# Pagination System

A comprehensive, flexible pagination system for React applications with multiple variants, built-in state management, and seamless integration with data tables.

## Features

- 🎨 **Multiple Variants**: Default, compact, and minimal styles
- 🔄 **Built-in State Management**: Complete pagination logic with hooks
- 📊 **Data Table Integration**: Seamless TanStack Table support
- 🎯 **Flexible**: Works with any data source (tables, lists, grids, cards)
- ♿ **Accessible**: Full ARIA support and keyboard navigation
- 📱 **Responsive**: Mobile-friendly design
- 🎛️ **Customizable**: Extensive configuration options
- ⚡ **Performance**: Optimized with React hooks

## Quick Start

### Basic Usage

```tsx
import { EnhancedPagination } from '@/components/ui/pagination/enhanced-pagination';

function MyComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <EnhancedPagination
      totalItems={1000}
      initialPage={currentPage}
      initialPageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
    />
  );
}
```

### With Data Table

```tsx
import { EnhancedDataTable } from '@/components/ui/dataTable/enhanced-data-table';

function MyDataTable() {
  return (
    <EnhancedDataTable
      data={users}
      columns={userColumns}
      enablePagination={true}
      pageSize={10}
      pageSizeOptions={[5, 10, 20, 50]}
    />
  );
}
```

## Components

### EnhancedPagination

The main pagination component with multiple variants and full state management.

#### Props

| Prop                   | Type                                  | Default                | Description                       |
| ---------------------- | ------------------------------------- | ---------------------- | --------------------------------- |
| `totalItems`           | `number`                              | **required**           | Total number of items to paginate |
| `initialPageSize`      | `number`                              | `10`                   | Initial items per page            |
| `initialPage`          | `number`                              | `1`                    | Initial page number               |
| `siblingCount`         | `number`                              | `1`                    | Number of sibling pages to show   |
| `boundaryCount`        | `number`                              | `1`                    | Number of boundary pages to show  |
| `pageSizeOptions`      | `number[]`                            | `[5, 10, 20, 50, 100]` | Available page size options       |
| `variant`              | `'default' \| 'compact' \| 'minimal'` | `'default'`            | Visual variant                    |
| `showPageSizeSelector` | `boolean`                             | `true`                 | Show page size dropdown           |
| `showItemCount`        | `boolean`                             | `true`                 | Show item count info              |
| `showPageInfo`         | `boolean`                             | `true`                 | Show page number info             |
| `onPageChange`         | `(page: number) => void`              | -                      | Page change callback              |
| `onPageSizeChange`     | `(pageSize: number) => void`          | -                      | Page size change callback         |
| `children`             | `React.ReactNode`                     | -                      | Custom content to display         |

#### Variants

**Default Variant**

```tsx
<EnhancedPagination
  totalItems={1000}
  variant='default'
  showPageSizeSelector={true}
  showItemCount={true}
  showPageInfo={true}
/>
```

**Compact Variant**

```tsx
<EnhancedPagination
  totalItems={1000}
  variant='compact'
  showPageSizeSelector={true}
  showItemCount={true}
  showPageInfo={false}
/>
```

**Minimal Variant**

```tsx
<EnhancedPagination
  totalItems={1000}
  variant='minimal'
  showPageSizeSelector={false}
  showItemCount={false}
  showPageInfo={false}
/>
```

### DataTablePagination

Legacy pagination component specifically designed for TanStack Table integration.

```tsx
import { DataTablePagination } from '@/components/ui/pagination/data-table-pagination';

<DataTablePagination
  currentPage={table.getState().pagination.pageIndex + 1}
  totalPages={table.getPageCount()}
  pageSize={table.getState().pagination.pageSize}
  totalItems={data.length}
  pageSizeOptions={[5, 10, 20, 50]}
  onPageChange={page => table.setPageIndex(page - 1)}
  onPageSizeChange={size => table.setPageSize(size)}
/>;
```

## Hooks

### useEnhancedPagination

A comprehensive pagination hook that provides complete state management and utilities.

```tsx
import { useEnhancedPagination } from '@/hooks/use-enhanced-pagination';

function MyComponent() {
  const pagination = useEnhancedPagination({
    totalItems: 1000,
    initialPageSize: 10,
    initialPage: 1,
    siblingCount: 1,
    boundaryCount: 1,
    pageSizeOptions: [5, 10, 20, 50, 100],
  });

  // Access pagination state
  const { currentPage, pageSize, totalPages, startItem, endItem } = pagination;

  // Use pagination actions
  const handleNext = () => pagination.goToNextPage();
  const handlePrevious = () => pagination.goToPreviousPage();
  const handlePageChange = (page: number) => pagination.setPage(page);

  // Get current page data
  const currentData = data.slice(startItem - 1, endItem);

  return (
    <div>
      {/* Your content */}
      <EnhancedPagination
        totalItems={1000}
        onPageChange={handlePageChange}
        onPageSizeChange={pagination.setPageSize}
      />
    </div>
  );
}
```

#### Hook Return Value

```typescript
interface UseEnhancedPaginationReturn {
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

  // TanStack Table integration
  paginationState: { pageIndex: number; pageSize: number };
  setPaginationState: (state: { pageIndex: number; pageSize: number }) => void;
}
```

### usePagination

Legacy hook for generating pagination items with ellipsis.

```tsx
import { usePagination } from '@/hooks/use-pagination';

const pagination = usePagination({
  currentPage: 5,
  totalPages: 20,
  siblingCount: 1,
  boundaryCount: 1,
});
```

## Usage Patterns

### 1. Simple List Pagination

```tsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const pagination = useEnhancedPagination({
    totalItems: users.length,
    initialPage: currentPage,
    initialPageSize: pageSize,
  });

  const currentUsers = users.slice(
    pagination.startItem - 1,
    pagination.endItem
  );

  return (
    <div>
      {currentUsers.map(user => (
        <UserCard key={user.id} user={user} />
      ))}

      <EnhancedPagination
        totalItems={users.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
```

### 2. Data Table Integration

```tsx
function UserTable() {
  const pagination = useEnhancedPagination({
    totalItems: users.length,
    initialPageSize: 10,
  });

  const table = useReactTable({
    data: users,
    columns: userColumns,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: pagination.setPaginationState,
    state: {
      pagination: pagination.paginationState,
    },
  });

  return (
    <div>
      <EnhancedDataTable
        table={table}
        data={users}
        columns={userColumns}
        enablePagination={true}
      />

      <EnhancedPagination
        totalItems={users.length}
        onPageChange={page => pagination.setPage(page)}
        onPageSizeChange={size => pagination.setPageSize(size)}
      />
    </div>
  );
}
```

### 3. Custom Pagination UI

```tsx
function CustomPagination() {
  const pagination = useEnhancedPagination({
    totalItems: 1000,
    initialPageSize: 5,
  });

  return (
    <div className='flex items-center justify-between'>
      <span>
        Showing {pagination.startItem}-{pagination.endItem} of{' '}
        {pagination.totalItems}
      </span>

      <div className='flex gap-2'>
        <Button
          onClick={pagination.goToPreviousPage}
          disabled={!pagination.hasPreviousPage}
        >
          Previous
        </Button>

        <span className='px-4 py-2'>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>

        <Button
          onClick={pagination.goToNextPage}
          disabled={!pagination.hasNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
```

### 4. Grid Layout with Pagination

```tsx
function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const pagination = useEnhancedPagination({
    totalItems: products.length,
    initialPage: currentPage,
    initialPageSize: pageSize,
  });

  const currentProducts = products.slice(
    pagination.startItem - 1,
    pagination.endItem
  );

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {currentProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <EnhancedPagination
        totalItems={products.length}
        variant='compact'
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
```

## Best Practices

### 1. State Management

- Use the `useEnhancedPagination` hook for complete state management
- Keep pagination state in sync with your data source
- Reset to page 1 when filtering or searching

### 2. Performance

- Use `useMemo` for expensive calculations
- Implement proper loading states
- Consider virtual scrolling for large datasets

### 3. Accessibility

- All pagination components include proper ARIA labels
- Keyboard navigation is fully supported
- Screen reader friendly

### 4. Responsive Design

- Use appropriate variants for different screen sizes
- Test pagination on mobile devices
- Consider touch-friendly button sizes

## Migration Guide

### From DataTablePagination to EnhancedPagination

**Before:**

```tsx
<DataTablePagination
  currentPage={table.getState().pagination.pageIndex + 1}
  totalPages={table.getPageCount()}
  pageSize={table.getState().pagination.pageSize}
  totalItems={data.length}
  onPageChange={page => table.setPageIndex(page - 1)}
  onPageSizeChange={size => table.setPageSize(size)}
/>
```

**After:**

```tsx
const pagination = useEnhancedPagination({
  totalItems: data.length,
  initialPageSize: 10,
});

<EnhancedPagination
  totalItems={data.length}
  onPageChange={page => pagination.setPage(page)}
  onPageSizeChange={size => pagination.setPageSize(size)}
/>;
```

## Examples

See the following examples for complete implementation patterns:

- [Enhanced Pagination Example](./examples/enhanced-pagination-example.tsx)
- [Data Table Integration](./examples/enhanced-data-table-example.tsx)
- [Storybook Stories](./stories/enhanced-pagination.stories.tsx)

## API Reference

For detailed API documentation, see the individual component files:

- [EnhancedPagination](./enhanced-pagination.tsx)
- [DataTablePagination](./data-table-pagination.tsx)
- [useEnhancedPagination](../../hooks/use-enhanced-pagination.ts)
- [usePagination](../../hooks/use-pagination.ts)
