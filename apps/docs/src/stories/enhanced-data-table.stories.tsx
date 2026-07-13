import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Product,
  productColumns,
  products,
  User,
  userColumns,
  users,
} from '@/components/ui/data/table';
import { EnhancedDataTable } from '@/components/ui/dataTable/enhanced-data-table';
import { Typography } from '@/components/ui/typography';

const meta = {
  title: 'Components/Enhanced Data Table',
  component: EnhancedDataTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'bordered', 'striped', 'compact'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg'],
    },
    enableSearch: { control: 'boolean' },
    enableSorting: { control: 'boolean' },
    enableRowSelection: { control: 'boolean' },
    enablePagination: { control: 'boolean' },
    enableRowNumbers: { control: 'boolean' },
    enableActions: { control: 'boolean' },
    enableColumnVisibility: { control: 'boolean' },
  },
} satisfies Meta<typeof EnhancedDataTable>;

export default meta;

// Create separate story types for different data types
type UserStory = StoryObj<typeof EnhancedDataTable<User, unknown>>;
type ProductStory = StoryObj<typeof EnhancedDataTable<Product, unknown>>;

// Basic Users Table
export const BasicUsersTable: UserStory = {
  args: {
    columns: userColumns,
    data: users,
    title: 'Users',
    enableSearch: true,
    enableSorting: true,
    enablePagination: true,
    enableRowNumbers: true,
  },
};

// Products Table with Actions
export const ProductsTableWithActions: ProductStory = {
  args: {
    columns: productColumns,
    data: products,
    title: 'Products',
    enableSearch: true,
    enableSorting: true,
    enablePagination: true,
    enableActions: true,
    enableRowNumbers: true,
  },
};

// Compact Table
export const CompactTable: UserStory = {
  args: {
    columns: userColumns,
    data: users,
    title: 'Compact Users Table',
    variant: 'compact',
    size: 'sm',
    enableSearch: true,
    enableSorting: true,
    enablePagination: true,
  },
};

export const StripedTable: ProductStory = {
  args: {
    columns: productColumns,
    data: products,
    title: 'Striped Products Table',
    variant: 'striped',
    enableSearch: true,
    enableSorting: true,
    enablePagination: true,
    enableRowNumbers: true,
  },
};

// Bordered Table
export const BorderedTable: UserStory = {
  args: {
    columns: userColumns,
    data: users,
    title: 'Bordered Users Table',
    variant: 'bordered',
    enableSearch: true,
    enableSorting: true,
    enablePagination: true,
    enableActions: true,
  },
};

// Elevated Table
export const ElevatedTable: ProductStory = {
  args: {
    columns: productColumns,
    data: products,
    title: 'Elevated Products Table',
    variant: 'bordered',
    enableSearch: true,
    enableSorting: true,
    enablePagination: true,
    enableRowNumbers: true,
    enableActions: true,
  },
};

// Table with Row Selection
export const TableWithRowSelection: UserStory = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<User[]>([]);

    return (
      <div className='space-y-4'>
        <EnhancedDataTable
          columns={userColumns as any}
          data={users}
          title='Users with Row Selection'
          enableRowSelection={true}
          enableSearch={true}
          enableSorting={true}
          enablePagination={true}
          onRowSelectionChange={setSelectedRows}
        />
        {selectedRows.length > 0 && (
          <div className='p-4 bg-muted rounded-lg'>
            <Typography variant='h6'>
              Selected Users ({selectedRows.length})
            </Typography>
            <ul className='mt-2 space-y-1'>
              {selectedRows.map(user => (
                <li key={user.id} className='text-sm'>
                  {user.name} - {user.email}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
};

// Table with Custom Actions
export const TableWithCustomActions: UserStory = {
  render: () => {
    const customUserColumns: ColumnDef<User>[] = [
      ...userColumns,
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className='flex items-center gap-2'>
              <Button size='sm' variant='outlined'>
                <Eye className='h-4 w-4 mr-1' />
                View
              </Button>
              <Button size='sm' variant='outlined'>
                <Edit className='h-4 w-4 mr-1' />
                Edit
              </Button>
            </div>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
      },
    ];

    return (
      <EnhancedDataTable
        columns={customUserColumns}
        data={users}
        title='Users with Custom Actions'
        enableSearch={true}
        enableSorting={true}
        enablePagination={true}
        enableRowNumbers={true}
      />
    );
  },
};

// Table with Row Click Handler
export const TableWithRowClick: UserStory = {
  render: () => {
    const handleRowClick = (user: User) => {
      alert(`Clicked on user: ${user.name}`);
    };

    return (
      <EnhancedDataTable
        columns={userColumns}
        data={users}
        title='Clickable Users Table'
        enableSearch={true}
        enableSorting={true}
        enablePagination={true}
        enableRowNumbers={true}
        onRowClick={handleRowClick}
      />
    );
  },
};

// Large Table
export const LargeTable: UserStory = {
  args: {
    columns: userColumns,
    data: Array.from({ length: 50 }, (_, i) => ({
      ...users[i % users.length],
      id: (i + 1).toString(),
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    })),
    title: 'Large Users Table',
    enableSearch: true,
    enableSorting: true,
    enablePagination: true,
    enableRowNumbers: true,
    enableActions: true,
    pageSize: 20,
  },
};
