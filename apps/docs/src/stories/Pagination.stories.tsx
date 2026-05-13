import type { Meta, StoryObj } from '@storybook/nextjs-vite';
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
        component: `
Token-driven pagination controls with five layout variants. The component is fully controlled — pair \`currentPage\` with \`onPageChange\` and optionally \`pageSize\` with \`onPageSizeChange\`.

### When to use
- Tables, lists, or search results with more rows than fit on one screen.
- Use **numbered** for general pagination where users benefit from seeing page numbers.
- Use **table** variant when rows-per-page selection is also needed.
- Use **simple** for mobile layouts or anywhere horizontal space is tight.

### Usage
\`\`\`tsx
import { PaginationControl } from 'componentiq';

const [page, setPage] = useState(1);

// Numbered pages
<PaginationControl
  variant="numbered"
  currentPage={page}
  totalPages={20}
  onPageChange={setPage}
/>

// Table variant with page-size selector
const [size, setSize] = useState(25);
<PaginationControl
  variant="table"
  currentPage={page}
  totalPages={Math.ceil(500 / size)}
  totalItems={500}
  pageSize={size}
  pageSizeOptions={[10, 25, 50, 100]}
  showPageSizeSelector
  showItemRange
  onPageChange={setPage}
  onPageSizeChange={setSize}
/>
\`\`\`

### Props cheat sheet
| Prop | Type | Default | Notes |
|------|------|---------|-------|
| \`variant\` | \`"numbered" \\| "labeled" \\| "jump" \\| "table" \\| "simple"\` | "numbered" | Layout style |
| \`currentPage\` | number | — | **required** — 1-based current page |
| \`totalPages\` | number | — | **required** — total number of pages |
| \`onPageChange\` | \`(page: number) => void\` | — | **required** — fires on page change |
| \`siblingCount\` | number | 1 | Pages shown on each side of current |
| \`boundaryCount\` | number | 1 | Pages shown at start and end |
| \`showFirstLast\` | boolean | false | Show first/last jump buttons |
| \`pageSize\` | number | — | Rows per page (table variant) |
| \`pageSizeOptions\` | number[] | — | Available page sizes |
| \`showPageSizeSelector\` | boolean | false | Show rows-per-page dropdown |
| \`showItemRange\` | boolean | false | Show "X–Y of Z" range label |
| \`pageName\` | string | — | Custom label for simple variant |
      `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['numbered', 'labeled', 'jump', 'table', 'simple'],
      description: 'Layout style for the pagination control.',
      table: { type: { summary: "'numbered' | 'labeled' | 'jump' | 'table' | 'simple'" }, defaultValue: { summary: "'numbered'" } },
    },
    currentPage: {
      control: { type: 'number', min: 1 },
      description: '1-based current page index.',
      table: { type: { summary: 'number' } },
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages.',
      table: { type: { summary: 'number' } },
    },
    siblingCount: {
      control: { type: 'number', min: 0, max: 3 },
      description: 'Number of page buttons shown on each side of the current page.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '1' } },
    },
    boundaryCount: {
      control: { type: 'number', min: 0, max: 3 },
      description: 'Number of page buttons shown at the start and end of the list.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '1' } },
    },
    showFirstLast: {
      control: 'boolean',
      description: 'Show jump-to-first and jump-to-last buttons.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    showPageNumbers: {
      control: 'boolean',
      description: 'Show individual page number buttons.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } },
    },
    onPageChange: { table: { disable: true } },
    onPageSizeChange: { table: { disable: true } },
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
