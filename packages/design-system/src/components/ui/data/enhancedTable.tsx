import { ColumnDef } from '@tanstack/table-core';
import { BadgeStatus } from '../../../types/badgw';
import { Avatar } from '../avatar';
import { TableCell } from '../dataTable/Tablecell';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  rating: number;
  sales: number;
  supplier: string;
}

export interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  paymentMethod: string;
  priority: 'low' | 'medium' | 'high';
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  avatar?: string;
  department: string;
  joinDate: string;
}

// Sample data
export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    department: 'Engineering',
    joinDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'User',
    status: 'active',
    lastLogin: '2024-01-14T15:45:00Z',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    department: 'Marketing',
    joinDate: '2023-03-20',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'Manager',
    status: 'inactive',
    lastLogin: '2024-01-10T09:15:00Z',
    department: 'Sales',
    joinDate: '2022-11-10',
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    role: 'User',
    status: 'pending',
    lastLogin: '2024-01-12T14:20:00Z',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    department: 'HR',
    joinDate: '2024-01-05',
  },
  {
    id: '5',
    name: 'Charlie Wilson',
    email: 'charlie.wilson@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-01-13T11:00:00Z',
    department: 'Finance',
    joinDate: '2022-08-15',
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Laptop Pro',
    category: 'Electronics',
    price: 1299.99,
    stock: 15,
    status: 'in-stock',
    rating: 4.5,
    sales: 245,
    supplier: 'TechCorp',
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    category: 'Audio',
    price: 199.99,
    stock: 3,
    status: 'low-stock',
    rating: 4.2,
    sales: 189,
    supplier: 'AudioMax',
  },
  {
    id: '3',
    name: 'Smartphone X',
    category: 'Electronics',
    price: 899.99,
    stock: 0,
    status: 'out-of-stock',
    rating: 4.8,
    sales: 567,
    supplier: 'MobileTech',
  },
  {
    id: '4',
    name: 'Coffee Maker',
    category: 'Home & Kitchen',
    price: 89.99,
    stock: 25,
    status: 'in-stock',
    rating: 4.1,
    sales: 123,
    supplier: 'HomeGoods',
  },
  {
    id: '5',
    name: 'Running Shoes',
    category: 'Sports',
    price: 129.99,
    stock: 8,
    status: 'low-stock',
    rating: 4.6,
    sales: 89,
    supplier: 'SportGear',
  },
];

export const orders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'John Smith',
    product: 'Laptop Pro',
    amount: 1299.99,
    status: 'delivered',
    date: '2024-01-15',
    paymentMethod: 'Credit Card',
    priority: 'medium',
  },
  {
    id: 'ORD-002',
    customer: 'Sarah Johnson',
    product: 'Wireless Headphones',
    amount: 199.99,
    status: 'processing',
    date: '2024-01-16',
    paymentMethod: 'PayPal',
    priority: 'low',
  },
  {
    id: 'ORD-003',
    customer: 'Mike Davis',
    product: 'Smartphone X',
    amount: 899.99,
    status: 'shipped',
    date: '2024-01-14',
    paymentMethod: 'Credit Card',
    priority: 'high',
  },
  {
    id: 'ORD-004',
    customer: 'Lisa Wilson',
    product: 'Coffee Maker',
    amount: 89.99,
    status: 'pending',
    date: '2024-01-17',
    paymentMethod: 'Bank Transfer',
    priority: 'low',
  },
  {
    id: 'ORD-005',
    customer: 'David Brown',
    product: 'Running Shoes',
    amount: 129.99,
    status: 'cancelled',
    date: '2024-01-13',
    paymentMethod: 'Credit Card',
    priority: 'medium',
  },
];

// Column definitions for Users table
export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <TableCell
          content={user.name}
          subContent={user.email}
          icon={
            user.avatar ? (
              <Avatar src={user.avatar} alt={user.name} />
            ) : undefined
          }
          variant='default'
        />
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <TableCell
        content={row.getValue('role')}
        variant='badge'
        status={row.getValue('role') === 'Admin' ? 'success' : 'neutral'}
      />
    ),
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => (
      <TableCell content={row.getValue('department')} variant='default' />
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, { label: string; status: BadgeStatus }> =
        {
          active: { label: 'Active', status: 'success' },
          inactive: { label: 'Inactive', status: 'error' },
          pending: { label: 'Pending', status: 'pending' },
        };
      const { label, status: statusType } = statusMap[status] || {
        label: status,
        status: 'neutral',
      };
      return <TableCell content={label} variant='status' status={statusType} />;
    },
  },
  {
    accessorKey: 'lastLogin',
    header: 'Last Login',
    cell: ({ row }) => (
      <TableCell
        content={new Date(row.getValue('lastLogin')).toLocaleDateString()}
        subContent={new Date(row.getValue('lastLogin')).toLocaleTimeString()}
      />
    ),
  },
];

// Column definitions for Products table
export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Product',
    cell: ({ row }) => (
      <TableCell
        content={row.getValue('name')}
        subContent={row.getValue('category')}
      />
    ),
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => (
      <TableCell content={`$${row.getValue('price')}`} align='right' />
    ),
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: ({ row }) => {
      const stock = row.getValue('stock') as number;
      const status = row.getValue('status') as string;
      const statusMap: Record<string, BadgeStatus> = {
        'in-stock': 'success',
        'low-stock': 'pending',
        'out-of-stock': 'error',
      };
      return (
        <TableCell
          content={stock}
          variant='badge'
          status={statusMap[status] || 'neutral'}
        />
      );
    },
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => (
      <TableCell content={`${row.getValue('rating')} ⭐`} align='center' />
    ),
  },
  {
    accessorKey: 'sales',
    header: 'Sales',
    cell: ({ row }) => (
      <TableCell content={row.getValue('sales')} align='right' />
    ),
  },
  {
    accessorKey: 'supplier',
    header: 'Supplier',
    cell: ({ row }) => (
      <TableCell content={row.getValue('supplier')} variant='default' />
    ),
  },
];

// Column definitions for Orders table
export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: 'Order ID',
    cell: ({ row }) => (
      <TableCell content={row.getValue('id')} variant='default' />
    ),
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ row }) => (
      <TableCell content={row.getValue('customer')} variant='default' />
    ),
  },
  {
    accessorKey: 'product',
    header: 'Product',
    cell: ({ row }) => (
      <TableCell content={row.getValue('product')} variant='default' />
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <TableCell content={`$${row.getValue('amount')}`} align='right' />
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, { label: string; status: BadgeStatus }> =
        {
          pending: { label: 'Pending', status: 'pending' },
          processing: { label: 'Processing', status: 'completed' },
          shipped: { label: 'Shipped', status: 'success' },
          delivered: { label: 'Delivered', status: 'success' },
          cancelled: { label: 'Cancelled', status: 'error' },
        };
      const { label, status: statusType } = statusMap[status] || {
        label: status,
        status: 'neutral',
      };
      return <TableCell content={label} variant='status' status={statusType} />;
    },
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const priority = row.getValue('priority') as string;
      const priorityMap: Record<
        string,
        { label: string; status: BadgeStatus }
      > = {
        low: { label: 'Low', status: 'neutral' },
        medium: { label: 'Medium', status: 'pending' },
        high: { label: 'High', status: 'error' },
      };
      const { label, status: statusType } = priorityMap[priority] || {
        label: priority,
        status: 'neutral',
      };
      return <TableCell content={label} variant='badge' status={statusType} />;
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => (
      <TableCell
        content={new Date(row.getValue('date')).toLocaleDateString()}
        variant='default'
      />
    ),
  },
];
