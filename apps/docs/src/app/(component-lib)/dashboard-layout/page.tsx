'use client';

import {
  BrandingComponent,
  DashboardLayout,
  NavigationBuilder,
} from '@/components/layout';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Activity,
  BarChart3,
  DollarSign,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  ShoppingCart,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import { useState } from 'react';
// Import SVG as React component
import DashPageHeader from '@/components/ui/layouts/DashPageHeader';
import { Logo } from '@/lib/icon-registry';

const LogoMark = () => (
  <img
    src={Logo}
    alt=''
    aria-hidden='true'
    className='h-[56px] w-[56px] object-contain'
  />
);

export default function DashLayoutDemo() {
  const [activeItem, setActiveItem] = useState('dashboard');

  // Create navigation using NavigationBuilder
  const navigation = new NavigationBuilder()
    .addItem({
      id: 'dashboard',
      title: 'Dashboard',
      href: '/dashboard',
      icon: <Home className='h-4 w-4' />,
    })
    .addItem({
      id: 'analytics',
      title: 'Analytics',
      href: '/analytics',
      icon: <BarChart3 className='h-4 w-4' />,
    })
    .addItem({
      id: 'users',
      title: 'Users',
      href: '/users',
      icon: <Users className='h-4 w-4' />,
    })
    .addItem({
      id: 'orders',
      title: 'Orders',
      href: '/orders',
      icon: <ShoppingCart className='h-4 w-4' />,
    })
    .addItem({
      id: 'messages',
      title: 'Messages',
      href: '/messages',
      icon: <MessageSquare className='h-4 w-4' />,
    })
    .addSection('Admin', [
      {
        id: 'settings',
        title: 'Settings',
        href: '/settings',
        icon: <Settings className='h-4 w-4' />,
      },
      {
        id: 'reports',
        title: 'Reports',
        href: '/reports',
        icon: <FileText className='h-4 w-4' />,
      },
    ])
    .addFooterItem({
      id: 'help',
      title: 'Help & Support',
      icon: <HelpCircle className='h-4 w-4' />,
    })
    .build();

  // Footer items
  const footerItems = [
    {
      id: 'profile',
      title: 'Profile',
      icon: <User className='h-4 w-4' />,
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: <LogOut className='h-4 w-4' />,
    },
  ];

  // Branding data
  const brandingData = {
    logo: LogoMark,
    title: 'componentIq Dashboard',
    subtitle: 'Admin Panel',
    user: {
      name: 'John Doe',
      email: 'john.doe@componentiq.com',
      avatar: '/api/placeholder/32/32',
    },
  };

  const handleNavigationChange = (item: unknown) => {
    if (typeof item === 'object' && item !== null && 'id' in item) {
      setActiveItem((item as { id: string }).id);
      console.log('Navigation changed:', item);
    } else {
      console.warn('Invalid item passed to handleNavigationChange:', item);
    }
  };

  const handleLogoClick = () => {
    console.log('Logo clicked');
  };

  const handleUserClick = () => {
    console.log('User clicked');
  };

  return (
    <DashboardLayout
      navigation={navigation}
      sidebarFooter={footerItems}
      branding={{
        logo: (
          <BrandingComponent
            data={brandingData}
            onLogoClick={handleLogoClick}
            onUserClick={handleUserClick}
          />
        ),
        title: 'Dashboard',
        subtitle: 'Welcome back, John!',
      }}
      onNavigationChange={handleNavigationChange}
      showTopNav={false}
    >
      <div className='space-y-6'>
        {/* Header */}
        <DashPageHeader
          titleVariant={'h1'}
          titleClassName='text-gray-300 font-medium '
          title='Dashboard'
          subtitle='Welcome back, John!'
        />
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Revenue
              </CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>$45,231.89</div>
              <p className='text-xs text-muted-foreground'>
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Subscriptions
              </CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>+2350</div>
              <p className='text-xs text-muted-foreground'>
                +180.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Sales</CardTitle>
              <TrendingUp className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>+12,234</div>
              <p className='text-xs text-muted-foreground'>
                +19% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Active Now</CardTitle>
              <Activity className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>+573</div>
              <p className='text-xs text-muted-foreground'>
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>You have 265 orders this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[
                  {
                    id: 1,
                    customer: 'John Doe',
                    amount: '$299.00',
                    status: 'completed',
                  },
                  {
                    id: 2,
                    customer: 'Jane Smith',
                    amount: '$199.00',
                    status: 'pending',
                  },
                  {
                    id: 3,
                    customer: 'Bob Johnson',
                    amount: '$599.00',
                    status: 'processing',
                  },
                  {
                    id: 4,
                    customer: 'Alice Brown',
                    amount: '$399.00',
                    status: 'completed',
                  },
                ].map(order => (
                  <div
                    key={order.id}
                    className='flex items-center justify-between'
                  >
                    <div className='space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        {order.customer}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {order.amount}
                      </p>
                    </div>
                    <Badge
                      variant='pastel'
                      status={
                        order.status === 'completed' ? 'success' : 'pending'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>You have 3 unread messages.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[
                  {
                    id: 1,
                    sender: 'Sarah Wilson',
                    message: 'Can you help me with...',
                    time: '2 min ago',
                  },
                  {
                    id: 2,
                    sender: 'Mike Davis',
                    message: 'The new feature looks great!',
                    time: '1 hour ago',
                  },
                  {
                    id: 3,
                    sender: 'Lisa Chen',
                    message: 'When will the update be...',
                    time: '3 hours ago',
                  },
                ].map(message => (
                  <div key={message.id} className='flex items-start space-x-3'>
                    <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
                      <User className='h-4 w-4 text-primary-foreground' />
                    </div>
                    <div className='flex-1 space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        {message.sender}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {message.message}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <Button
                variant='outlined'
                className='h-20 flex flex-col items-center justify-center'
              >
                <Users className='h-6 w-6 mb-2' />
                <span className='text-sm'>Add User</span>
              </Button>
              <Button
                variant='outlined'
                className='h-20 flex flex-col items-center justify-center'
              >
                <ShoppingCart className='h-6 w-6 mb-2' />
                <span className='text-sm'>New Order</span>
              </Button>
              <Button
                variant='outlined'
                className='h-20 flex flex-col items-center justify-center'
              >
                <FileText className='h-6 w-6 mb-2' />
                <span className='text-sm'>Generate Report</span>
              </Button>
              <Button
                variant='outlined'
                className='h-20 flex flex-col items-center justify-center'
              >
                <Settings className='h-6 w-6 mb-2' />
                <span className='text-sm'>Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
