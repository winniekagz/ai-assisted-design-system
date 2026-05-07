import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  PaginationControl,
  type PaginationControlProps,
} from '@/components/ui/pagination/pagination';

const meta = {
  title: 'Components/Pagination',
  component: PaginationControl,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Atomic pagination controls built on ComponentIQ buttons and semantic tokens. Use the controlled currentPage prop and onPageChange callback to move between first, previous, numbered, next, and last pages.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['numbered', 'labeled', 'jump', 'table', 'simple'],
    },
    currentPage: { control: { type: 'number', min: 1 } },
    totalPages: { control: { type: 'number', min: 1 } },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
    boundaryCount: { control: { type: 'number', min: 0, max: 3 } },
    showFirstLast: { control: 'boolean' },
    showPageNumbers: { control: 'boolean' },
  },
} satisfies Meta<typeof PaginationControl>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledPagination(args: PaginationControlProps) {
  const [currentPage, setCurrentPage] = useState(args.currentPage);
  const [pageSize, setPageSize] = useState(args.pageSize ?? 50);

  return (
    <div className='w-[min(620px,calc(100vw-48px))] rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-4'>
      <PaginationControl
        {...args}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}

export const Numbered: Story = {
  render: args => <ControlledPagination {...args} />,
  args: {
    currentPage: 1,
    totalPages: 10,
    variant: 'numbered',
    siblingCount: 1,
    boundaryCount: 1,
    showFirstLast: false,
    onPageChange: () => {},
  },
};

export const PreviousNext: Story = {
  render: args => <ControlledPagination {...args} />,
  args: {
    currentPage: 1,
    totalPages: 8,
    variant: 'labeled',
    siblingCount: 0,
    boundaryCount: 1,
    showFirstLast: false,
    onPageChange: () => {},
  },
};

export const FirstBackNextLast: Story = {
  render: args => <ControlledPagination {...args} />,
  args: {
    currentPage: 3,
    totalPages: 20,
    variant: 'jump',
    showFirstLast: true,
    onPageChange: () => {},
  },
};

export const RowsPerPage: Story = {
  render: args => <ControlledPagination {...args} />,
  args: {
    currentPage: 1,
    totalPages: 6,
    totalItems: 300,
    pageSize: 50,
    pageSizeOptions: [10, 20, 50, 100],
    variant: 'table',
    showFirstLast: false,
    showPageSizeSelector: true,
    showItemRange: true,
    showPageNumbers: false,
    onPageChange: () => {},
  },
};

export const SimplePageName: Story = {
  render: args => <ControlledPagination {...args} />,
  args: {
    currentPage: 4,
    totalPages: 56,
    variant: 'simple',
    pageName: 'Page name',
    onPageChange: () => {},
  },
};

export const VariantBoard: Story = {
  render: () => {
    const [numberedPage, setNumberedPage] = useState(1);
    const [labeledPage, setLabeledPage] = useState(1);
    const [jumpPage, setJumpPage] = useState(3);
    const [tablePage, setTablePage] = useState(1);
    const [simplePage, setSimplePage] = useState(4);
    const [pageSize, setPageSize] = useState(50);

    return (
      <div className='grid w-[min(620px,calc(100vw-48px))] gap-4 rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-4'>
        <PaginationControl
          currentPage={numberedPage}
          totalPages={10}
          variant='numbered'
          onPageChange={setNumberedPage}
        />
        <PaginationControl
          currentPage={labeledPage}
          totalPages={8}
          variant='labeled'
          siblingCount={0}
          boundaryCount={1}
          onPageChange={setLabeledPage}
        />
        <PaginationControl
          currentPage={jumpPage}
          totalPages={20}
          variant='jump'
          showFirstLast
          onPageChange={setJumpPage}
        />
        <PaginationControl
          currentPage={tablePage}
          totalPages={6}
          totalItems={300}
          pageSize={pageSize}
          pageSizeOptions={[10, 20, 50, 100]}
          variant='table'
          showPageNumbers={false}
          onPageChange={setTablePage}
          onPageSizeChange={setPageSize}
        />
        <PaginationControl
          currentPage={simplePage}
          totalPages={56}
          variant='simple'
          pageName='Page name'
          onPageChange={setSimplePage}
        />
      </div>
    );
  },
};
