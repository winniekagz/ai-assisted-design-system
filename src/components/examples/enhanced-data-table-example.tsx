'use client';

import {
  AlertCircle,
  Download,
  Edit,
  Eye,
  Filter,
  Package,
  Plus,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  orderColumns,
  orders,
  Product,
  productColumns,
  products,
  User,
  userColumns,
  users,
} from '../ui/data/enhancedTable';
import { EnhancedDataTable } from '../ui/dataTable/enhanced-data-table';
import { Typography } from '../ui/typography';

// Sample data types

// Custom row actions component
const CustomRowActions = ({ user }: { user: User }) => (
  <div className='flex items-center gap-1'>
    <Button size='sm' variant='ghost' className='h-8 w-8 p-0'>
      <Eye className='h-4 w-4' />
    </Button>
    <Button size='sm' variant='ghost' className='h-8 w-8 p-0'>
      <Edit className='h-4 w-4' />
    </Button>
    <Button size='sm' variant='ghost' className='h-8 w-8 p-0 text-error'>
      <Trash2 className='h-4 w-4' />
    </Button>
  </div>
);

// Top toolbar component
// const TopToolbar = () => (
//   <div className='flex items-center gap-2'>
//     <Button size='sm' variant='outlined'>
//       <Filter className='h-4 w-4 mr-2' />
//       Filter
//     </Button>
//     <Button size='sm' variant='outlined'>
//       <Download className='h-4 w-4 mr-2' />
//       Export
//     </Button>
//     <Button size='sm' variant='contained'>
//       <Plus className='h-4 w-4 mr-2' />
//       Add User
//     </Button>
//   </div>
// );

// Main example component
export function EnhancedDataTableExample() {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const handleUserRowClick = (user: User) => {
    console.log('Clicked user:', user);
  };

  const handleProductRowClick = (product: Product) => {
    console.log('Clicked product:', product);
  };

  return (
    <div className='space-y-8 p-6'>
      <div className='space-y-2'>
        <Typography variant='h1'>Enhanced Data Table Examples</Typography>
        <Typography variant='body1' className='text-muted-foreground'>
          Comprehensive examples of the enhanced data table component with
          various features and use cases.
        </Typography>
      </div>

      {/* Users Table with Row Selection */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Users className='h-5 w-5' />
              <CardTitle>Users Management</CardTitle>
            </div>
            {/* <TopToolbar /> */}
          </div>
        </CardHeader>
        <CardContent>
          <EnhancedDataTable
            columns={userColumns}
            data={users}
            title='Users'
            variant='default'
            size='default'
            enableSearch={true}
            enableSorting={true}
            enableRowSelection={true}
            enablePagination={true}
            enableRowNumbers={true}
            enableActions={true}
            enableColumnVisibility={true}
            searchPlaceholder='Search users...'
            pageSize={5}
            onRowClick={handleUserRowClick}
            onRowSelectionChange={setSelectedUsers}
            renderRowActions={user => <CustomRowActions user={user} />}
          />
          {selectedUsers.length > 0 && (
            <div className='mt-4 p-4 bg-muted rounded-lg'>
              <Typography variant='h6'>
                Selected Users ({selectedUsers.length})
              </Typography>
              <ul className='mt-2 space-y-1'>
                {selectedUsers.map(user => (
                  <li key={user.id} className='text-sm'>
                    {user.name} - {user.email}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Table with Different Variant */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Package className='h-5 w-5' />
            <CardTitle>Products Inventory</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <EnhancedDataTable
            columns={productColumns}
            data={products}
            title='Products'
            variant='striped'
            size='default'
            enableSearch={true}
            enableSorting={true}
            enablePagination={true}
            enableRowNumbers={true}
            enableActions={true}
            enableColumnVisibility={true}
            searchPlaceholder='Search products...'
            pageSize={5}
            onRowClick={handleProductRowClick}
            onRowSelectionChange={setSelectedProducts}
          />
        </CardContent>
      </Card>

      {/* Orders Table with Compact Variant */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <TrendingUp className='h-5 w-5' />
            <CardTitle>Order Management</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <EnhancedDataTable
            columns={orderColumns}
            data={orders}
            title='Orders'
            variant='compact'
            size='sm'
            enableSearch={true}
            enableSorting={true}
            enablePagination={true}
            enableRowNumbers={true}
            enableActions={true}
            enableColumnVisibility={true}
            searchPlaceholder='Search orders...'
            pageSize={5}
          />
        </CardContent>
      </Card>

      {/* Bordered Table Example */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <AlertCircle className='h-5 w-5' />
            <CardTitle>Bordered Table Style</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <EnhancedDataTable
            columns={userColumns.slice(0, 3)} // Show only first 3 columns
            data={users.slice(0, 3)} // Show only first 3 users
            title='Bordered Users Table'
            variant='bordered'
            size='default'
            enableSearch={false}
            enableSorting={true}
            enablePagination={false}
            enableRowNumbers={true}
            enableActions={false}
            enableColumnVisibility={false}
          />
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Typography variant='h6'>Features Demonstrated:</Typography>
            <ul className='mt-2 space-y-1 text-sm text-muted-foreground'>
              <li>• Global search functionality</li>
              <li>• Column sorting and visibility controls</li>
              <li>• Row selection with callback</li>
              <li>• Custom row actions</li>
              <li>
                • Multiple table variants (default, striped, compact, bordered)
              </li>
              <li>• Different cell types (badge, status, avatar)</li>
              <li>• Pagination with customizable page sizes</li>
              <li>• Row click handlers</li>
              <li>• Custom top toolbar</li>
            </ul>
          </div>

          <div>
            <Typography variant='h6'>Available Variants:</Typography>
            <ul className='mt-2 space-y-1 text-sm text-muted-foreground'>
              <li>
                • <code>default</code> - Standard table with border
              </li>
              <li>
                • <code>bordered</code> - Table with thick borders
              </li>
              <li>
                • <code>striped</code> - Alternating row colors
              </li>
              <li>
                • <code>compact</code> - Smaller padding and text
              </li>
            </ul>
          </div>

          <div>
            <Typography variant='h6'>Available Sizes:</Typography>
            <ul className='mt-2 space-y-1 text-sm text-muted-foreground'>
              <li>
                • <code>sm</code> - Small padding and text
              </li>
              <li>
                • <code>default</code> - Standard size
              </li>
              <li>
                • <code>lg</code> - Large padding and text
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EnhancedDataTableExample;
