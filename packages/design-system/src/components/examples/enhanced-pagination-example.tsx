'use client';
import { useMemo, useState } from 'react';
import { Badge } from '../ui/badge/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import {
  EnhancedPagination,
  useEnhancedPagination,
} from '../ui/pagination/enhanced-pagination';
import { Typography } from '../ui/typography';

// Mock data interface
interface DataItem {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  role: string;
  lastLogin: string;
}

// Mock data
const generateMockData = (count: number): DataItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: ['active', 'inactive', 'pending'][
      Math.floor(Math.random() * 3)
    ] as DataItem['status'],
    role: ['Admin', 'User', 'Manager', 'Editor'][Math.floor(Math.random() * 4)],
    lastLogin: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
  }));
};

const mockData = generateMockData(250);

// Status badge component
const StatusBadge = ({ status }: { status: DataItem['status'] }) => {
  const statuses = {
    active: 'success',
    inactive: 'inactive',
    pending: 'warning',
  } as const;

  return (
    <Badge variant='pastel' status={statuses[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Example component using enhanced pagination
export function EnhancedPaginationExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return mockData;

    return mockData.filter(
      item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Use the enhanced pagination hook
  const pagination = useEnhancedPagination({
    totalItems: filteredData.length,
    initialPage: currentPage,
    initialPageSize: pageSize,
    pageSizeOptions: [5, 10, 20, 50],
  });

  // Get current page data
  const currentData = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, pagination.currentPage, pagination.pageSize]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    pagination.setPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
    pagination.setPageSize(newPageSize);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Pagination Example</CardTitle>
          <Typography variant='body2' className='text-muted-foreground'>
            This example demonstrates how to use the enhanced pagination
            component with a data table. The pagination logic is abstracted and
            can be reused across multiple pages.
          </Typography>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Search and controls */}
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-2'>
              <Typography variant='small' className='text-muted-foreground'>
                Search:
              </Typography>
              <Input
                placeholder='Search users...'
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                className='w-64'
              />
            </div>
            <div className='flex items-center gap-2'>
              <Typography variant='small' className='text-muted-foreground'>
                Total Results:
              </Typography>
              <Badge variant='outlined'>{filteredData.length}</Badge>
            </div>
          </div>

          {/* Data table */}
          <div className='border rounded-lg overflow-hidden'>
            <div className='bg-muted/50 px-4 py-3 border-b'>
              <Typography variant='small' className='font-medium'>
                Users ({pagination.startItem}-{pagination.endItem} of{' '}
                {filteredData.length})
              </Typography>
            </div>

            <div className='divide-y'>
              {currentData.map(item => (
                <div
                  key={item.id}
                  className='px-4 py-3 hover:bg-muted/30 transition-colors'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <div>
                        <Typography variant='body2' className='font-medium'>
                          {item.name}
                        </Typography>
                        <Typography
                          variant='small'
                          className='text-muted-foreground'
                        >
                          {item.email}
                        </Typography>
                      </div>
                    </div>

                    <div className='flex items-center gap-4'>
                      <div className='text-right'>
                        <Typography variant='small' className='font-medium'>
                          {item.role}
                        </Typography>
                        <Typography
                          variant='small'
                          className='text-muted-foreground'
                        >
                          Last login: {item.lastLogin}
                        </Typography>
                      </div>
                      <StatusBadge status={item.status} />
                      <Button variant='ghost' size='sm'>
                        Actions
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced pagination */}
          <EnhancedPagination
            totalItems={filteredData.length}
            initialPage={currentPage}
            initialPageSize={pageSize}
            pageSizeOptions={[5, 10, 20, 50]}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showPageSizeSelector={true}
            showItemCount={true}
            showPageInfo={true}
          />
        </CardContent>
      </Card>

      {/* Alternative pagination variants */}
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Compact Variant</CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedPagination
              totalItems={filteredData.length}
              initialPage={currentPage}
              initialPageSize={pageSize}
              variant='compact'
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Minimal Variant</CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedPagination
              totalItems={filteredData.length}
              initialPage={currentPage}
              initialPageSize={pageSize}
              variant='minimal'
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Example of how to use the pagination hook directly
export function DirectHookExample() {
  const [data] = useState(generateMockData(100));

  const pagination = useEnhancedPagination({
    totalItems: data.length,
    initialPageSize: 5,
    pageSizeOptions: [5, 10, 15],
  });

  const currentData = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, pagination.currentPage, pagination.pageSize]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Direct Hook Usage</CardTitle>
        <Typography variant='body2' className='text-muted-foreground'>
          Example of using the useEnhancedPagination hook directly without the
          component.
        </Typography>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Custom pagination UI */}
        <div className='flex items-center justify-between'>
          <Typography variant='small' className='text-muted-foreground'>
            Showing {pagination.startItem}-{pagination.endItem} of{' '}
            {pagination.totalItems}
          </Typography>

          <div className='flex items-center gap-2'>
            <Button
              variant='outlined'
              size='sm'
              onClick={pagination.goToPreviousPage}
              disabled={!pagination.hasPreviousPage}
            >
              Previous
            </Button>

            <span className='px-2 text-sm'>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <Button
              variant='outlined'
              size='sm'
              onClick={pagination.goToNextPage}
              disabled={!pagination.hasNextPage}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Data display */}
        <div className='space-y-2'>
          {currentData.map(item => (
            <div key={item.id} className='p-2 border rounded'>
              <Typography variant='small'>{item.name}</Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default EnhancedPaginationExample;
