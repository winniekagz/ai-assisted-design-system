import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { EnhancedPagination } from '../components/ui/pagination/enhanced-pagination';
import { Typography } from '../components/ui/typography';

const meta = {
  title: 'Components/Enhanced Pagination',
  component: EnhancedPagination,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'minimal'],
    },
    showPageSizeSelector: { control: 'boolean' },
    showItemCount: { control: 'boolean' },
    showPageInfo: { control: 'boolean' },
    initialPageSize: {
      control: { type: 'select' },
      options: [5, 10, 20, 50, 100],
    },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
    boundaryCount: { control: { type: 'number', min: 0, max: 3 } },
  },
} satisfies Meta<typeof EnhancedPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data for demonstration
const mockData = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  description: `This is item number ${i + 1}`,
}));

// Wrapper component to demonstrate pagination with data
function PaginationWithData({ variant, ...props }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = mockData.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Pagination Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Display current page data */}
            <div className="space-y-2">
              <Typography variant="h6">Current Page Data:</Typography>
              <div className="grid gap-2">
                {currentData.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 border rounded-lg bg-muted/50"
                  >
                    <Typography variant="body2" className="font-medium">
                      {item.name}
                    </Typography>
                    <Typography variant="small" className="text-muted-foreground">
                      {item.description}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <EnhancedPagination
              totalItems={mockData.length}
              initialPage={currentPage}
              initialPageSize={pageSize}
              variant={variant}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              {...props}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Default pagination
export const Default: Story = {
  render: (args) => <PaginationWithData {...args} />,
  args: {
    totalItems: 1000,
    initialPageSize: 10,
    showPageSizeSelector: true,
    showItemCount: true,
    showPageInfo: true,
  },
};

// Compact pagination
export const Compact: Story = {
  render: (args) => <PaginationWithData {...args} />,
  args: {
    totalItems: 1000,
    initialPageSize: 10,
    variant: 'compact',
    showPageSizeSelector: true,
    showItemCount: true,
    showPageInfo: false,
  },
};

// Minimal pagination
export const Minimal: Story = {
  render: (args) => <PaginationWithData {...args} />,
  args: {
    totalItems: 1000,
    initialPageSize: 10,
    variant: 'minimal',
    showPageSizeSelector: false,
    showItemCount: false,
    showPageInfo: false,
  },
};

// Large dataset
export const LargeDataset: Story = {
  render: (args) => <PaginationWithData {...args} />,
  args: {
    totalItems: 10000,
    initialPageSize: 50,
    showPageSizeSelector: true,
    showItemCount: true,
    showPageInfo: true,
    siblingCount: 2,
    boundaryCount: 1,
  },
};

// Small dataset
export const SmallDataset: Story = {
  render: (args) => <PaginationWithData {...args} />,
  args: {
    totalItems: 25,
    initialPageSize: 5,
    showPageSizeSelector: true,
    showItemCount: true,
    showPageInfo: true,
  },
};

// Without page size selector
export const WithoutPageSizeSelector: Story = {
  render: (args) => <PaginationWithData {...args} />,
  args: {
    totalItems: 1000,
    initialPageSize: 10,
    showPageSizeSelector: false,
    showItemCount: true,
    showPageInfo: true,
  },
};

// Without item count
export const WithoutItemCount: Story = {
  render: (args) => <PaginationWithData {...args} />,
  args: {
    totalItems: 1000,
    initialPageSize: 10,
    showPageSizeSelector: true,
    showItemCount: false,
    showPageInfo: true,
  },
};

// Custom page size options
export const CustomPageSizeOptions: Story = {
  render: (args) => <PaginationWithData {...args} />,
  args: {
    totalItems: 1000,
    initialPageSize: 15,
    pageSizeOptions: [15, 30, 45, 60],
    showPageSizeSelector: true,
    showItemCount: true,
    showPageInfo: true,
  },
};

// With custom content
export const WithCustomContent: Story = {
  render: (args) => (
    <PaginationWithData {...args}>
      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <Typography variant="small" className="text-muted-foreground">
          Custom content area - you can add any additional information here
        </Typography>
      </div>
    </PaginationWithData>
  ),
  args: {
    totalItems: 1000,
    initialPageSize: 10,
    showPageSizeSelector: true,
    showItemCount: true,
    showPageInfo: true,
  },
};





