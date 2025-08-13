import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination/pagination';
import { DataTablePagination } from '../components/ui/pagination/data-table-pagination';
import { EnhancedPagination } from '../components/ui/pagination/enhanced-pagination';
import { usePagination } from '../hooks/use-pagination';

// Base Pagination Components Stories
const basePaginationMeta = {
  title: 'Components/Pagination/Base Components',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default basePaginationMeta;
type BaseStory = StoryObj<typeof basePaginationMeta>;

// Interactive Base Pagination
export const InteractiveBasePagination: BaseStory = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    const pagination = usePagination({
      currentPage,
      totalPages,
      siblingCount: 1,
      boundaryCount: 1,
    });

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href='#'
              onClick={e => {
                e.preventDefault();
                if (pagination.hasPreviousPage) {
                  setCurrentPage(pagination.previousPage);
                }
              }}
              className={
                !pagination.hasPreviousPage
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
            />
          </PaginationItem>

          {pagination.items.map((item, index) => (
            <PaginationItem key={index}>
              {item === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href='#'
                  isActive={item === currentPage}
                  onClick={e => {
                    e.preventDefault();
                    setCurrentPage(item);
                  }}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href='#'
              onClick={e => {
                e.preventDefault();
                if (pagination.hasNextPage) {
                  setCurrentPage(pagination.nextPage);
                }
              }}
              className={
                !pagination.hasNextPage ? 'pointer-events-none opacity-50' : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  },
};

// DataTablePagination Stories
const dataTablePaginationMeta = {
  title: 'Components/Pagination/DataTablePagination',
  component: DataTablePagination,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    pageSize: { control: { type: 'number', min: 1 } },
    totalItems: { control: { type: 'number', min: 1 } },
    showPageSizeSelector: { control: 'boolean' },
    showItemCount: { control: 'boolean' },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
    boundaryCount: { control: { type: 'number', min: 0, max: 3 } },
  },
} satisfies Meta<typeof DataTablePagination>;

export const DataTablePaginationStory = {
  ...dataTablePaginationMeta,
  render: (args: any) => {
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

// EnhancedPagination Stories
const enhancedPaginationMeta = {
  title: 'Components/Pagination/EnhancedPagination',
  component: EnhancedPagination,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    totalItems: { control: { type: 'number', min: 1 } },
    initialPageSize: { control: { type: 'number', min: 1 } },
    initialPage: { control: { type: 'number', min: 1 } },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'minimal'],
    },
    showPageSizeSelector: { control: 'boolean' },
    showItemCount: { control: 'boolean' },
    showPageInfo: { control: 'boolean' },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
    boundaryCount: { control: { type: 'number', min: 0, max: 3 } },
  },
} satisfies Meta<typeof EnhancedPagination>;

export const EnhancedPaginationStory = {
  ...enhancedPaginationMeta,
  render: (args: any) => {
    const [currentPage, setCurrentPage] = useState(args.initialPage || 1);
    const [pageSize, setPageSize] = useState(args.initialPageSize || 10);

    return (
      <EnhancedPagination
        {...args}
        initialPage={currentPage}
        initialPageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
  args: {
    totalItems: 100,
    initialPage: 1,
    initialPageSize: 10,
    variant: 'default',
    showPageSizeSelector: true,
    showItemCount: true,
    showPageInfo: true,
    siblingCount: 1,
    boundaryCount: 1,
    pageSizeOptions: [5, 10, 20, 50],
  },
};

// Compact Variant Story
export const CompactVariantStory = {
  ...enhancedPaginationMeta,
  render: (args: any) => {
    const [currentPage, setCurrentPage] = useState(args.initialPage || 1);
    const [pageSize, setPageSize] = useState(args.initialPageSize || 10);

    return (
      <EnhancedPagination
        {...args}
        initialPage={currentPage}
        initialPageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
  args: {
    totalItems: 100,
    initialPage: 1,
    initialPageSize: 10,
    variant: 'compact',
    showPageSizeSelector: true,
    showItemCount: true,
    showPageInfo: false,
    siblingCount: 1,
    boundaryCount: 1,
    pageSizeOptions: [5, 10, 20, 50],
  },
};

// Minimal Variant Story
export const MinimalVariantStory = {
  ...enhancedPaginationMeta,
  render: (args: any) => {
    const [currentPage, setCurrentPage] = useState(args.initialPage || 1);
    const [pageSize, setPageSize] = useState(args.initialPageSize || 10);

    return (
      <EnhancedPagination
        {...args}
        initialPage={currentPage}
        initialPageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    );
  },
  args: {
    totalItems: 100,
    initialPage: 1,
    initialPageSize: 10,
    variant: 'minimal',
    showPageSizeSelector: false,
    showItemCount: false,
    showPageInfo: false,
    siblingCount: 1,
    boundaryCount: 1,
    pageSizeOptions: [5, 10, 20, 50],
  },
};

// Example Stories
export const LargeDatasetExample = {
  ...dataTablePaginationMeta,
  render: (args: any) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage || 15);
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

export const CompactExample = {
  ...dataTablePaginationMeta,
  render: (args: any) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage || 1);
    const [pageSize, setPageSize] = useState(args.pageSize || 5);

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
    totalPages: 3,
    pageSize: 5,
    totalItems: 15,
    pageSizeOptions: [5, 10],
    showPageSizeSelector: false,
    showItemCount: false,
  },
};

export const WithoutPageSizeSelector = {
  ...dataTablePaginationMeta,
  render: (args: any) => {
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

export const WithoutItemCount = {
  ...dataTablePaginationMeta,
  render: (args: any) => {
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
