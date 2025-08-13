import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DataTablePagination } from '../components/ui/pagination/data-table-pagination';

const meta = {
  title: 'Components/Data Table Pagination',
  component: DataTablePagination,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
    },
    totalPages: {
      control: { type: 'number', min: 1 },
    },
    pageSize: {
      control: { type: 'number', min: 1 },
    },
    totalItems: {
      control: { type: 'number', min: 1 },
    },
    showPageSizeSelector: {
      control: 'boolean',
    },
    showItemCount: {
      control: 'boolean',
    },
    siblingCount: {
      control: { type: 'number', min: 0, max: 3 },
    },
    boundaryCount: {
      control: { type: 'number', min: 0, max: 3 },
    },
  },
} satisfies Meta<typeof DataTablePagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story with state management
export const Interactive: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(args.currentPage || 1);
    const [pageSize, setPageSize] = useState(args.pageSize || 10);

    return (
      <DataTablePagination
        {...args}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
  args: {
    currentPage: 1,
    totalPages: 10,
    pageSize: 10,
    totalItems: 100,
    pageSizeOptions: [5, 10, 20, 50, 100],
    showPageSizeSelector: true,
    showItemCount: true,
    siblingCount: 1,
    boundaryCount: 1,
  },
};

// Basic pagination
export const Basic: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
    pageSize: 10,
    totalItems: 50,
    pageSizeOptions: [10, 20, 50],
    showPageSizeSelector: true,
    showItemCount: true,
  },
};

// Large dataset pagination
export const LargeDataset: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(args.currentPage || 1);
    const [pageSize, setPageSize] = useState(args.pageSize || 20);

    return (
      <DataTablePagination
        {...args}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
  args: {
    currentPage: 15,
    totalPages: 50,
    pageSize: 20,
    totalItems: 1000,
    pageSizeOptions: [10, 20, 50, 100],
    showPageSizeSelector: true,
    showItemCount: true,
    siblingCount: 2,
    boundaryCount: 1,
  },
};

// Compact pagination
export const Compact: Story = {
  args: {
    currentPage: 1,
    totalPages: 3,
    pageSize: 5,
    totalItems: 15,
    pageSizeOptions: [5, 10],
    showPageSizeSelector: false,
    showItemCount: false,
  },
};

// Without page size selector
export const WithoutPageSizeSelector: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(args.currentPage || 1);

    return (
      <DataTablePagination
        {...args}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    );
  },
  args: {
    currentPage: 1,
    totalPages: 8,
    pageSize: 10,
    totalItems: 80,
    pageSizeOptions: [10, 20, 50],
    showPageSizeSelector: false,
    showItemCount: true,
  },
};

// Without item count
export const WithoutItemCount: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(args.currentPage || 1);
    const [pageSize, setPageSize] = useState(args.pageSize || 10);

    return (
      <DataTablePagination
        {...args}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
  args: {
    currentPage: 1,
    totalPages: 6,
    pageSize: 10,
    totalItems: 60,
    pageSizeOptions: [10, 20, 50],
    showPageSizeSelector: true,
    showItemCount: false,
  },
};

// Custom sibling and boundary counts
export const CustomCounts: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState(args.currentPage || 1);
    const [pageSize, setPageSize] = useState(args.pageSize || 10);

    return (
      <DataTablePagination
        {...args}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
  args: {
    currentPage: 10,
    totalPages: 20,
    pageSize: 10,
    totalItems: 200,
    pageSizeOptions: [10, 20, 50],
    showPageSizeSelector: true,
    showItemCount: true,
    siblingCount: 2,
    boundaryCount: 2,
  },
};


