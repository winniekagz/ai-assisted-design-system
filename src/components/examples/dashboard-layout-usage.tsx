'use client';

import {
  BrandingComponent,
  DashboardLayout,
  NavigationBuilder,
  defaultFooterItems,
  defaultNavigation,
  type BrandingData,
  type NavigationItem,
} from '@/components/layout';
import {
  BarChart3,
  Building2,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  Key,
  LogOut,
  Settings,
  Users,
  Wallet,
} from 'lucide-react';
import React from 'react';
import { Logo } from '../../lib/icon-registry';

// Example: Custom Navigation Configuration
const createCustomNavigation = () => {
  return new NavigationBuilder()
    .addItem({
      id: 'dashboard',
      title: 'Dashboard',
      href: '/dashboard',
      icon: <Home className='h-4 w-4' />,
    })
    .addItem({
      id: 'transactions',
      title: 'Transactions',
      href: '/transactions',
      icon: <CreditCard className='h-4 w-4' />,
    })
    .addSection('Analytics', [
      {
        id: 'reports',
        title: 'Reports',
        href: '/reports',
        icon: <FileText className='h-4 w-4' />,
      },
      {
        id: 'analytics',
        title: 'Analytics',
        href: '/analytics',
        icon: <BarChart3 className='h-4 w-4' />,
      },
    ])
    .addSection('Admin', [
      {
        id: 'team',
        title: 'Team Management',
        href: '/admin/team',
        icon: <Users className='h-4 w-4' />,
      },
      {
        id: 'settings',
        title: 'Settings',
        icon: <Settings className='h-4 w-4' />,
        children: [
          {
            id: 'api-keys',
            title: 'API Keys',
            href: '/admin/api-keys',
            icon: <Key className='h-4 w-4' />,
          },
          {
            id: 'balances',
            title: 'Account Balances',
            href: '/admin/balances',
            icon: <Wallet className='h-4 w-4' />,
          },
        ],
      },
    ])
    .addFooterItem({
      id: 'help',
      title: 'Help & Support',
      icon: <HelpCircle className='h-4 w-4' />,
      onClick: () => {
        console.log('Help clicked');
        // Handle help action
      },
    })
    .addFooterItem({
      id: 'logout',
      title: 'Logout',
      icon: <LogOut className='h-4 w-4' />,
      onClick: () => {
        console.log('Logout clicked');
        // Handle logout action
      },
    })
    .build();
};

// Example: Branding Data
const brandingData: BrandingData = {
  logo: Logo, // Replace with your logo path
  title: 'Leja Dashboard',
  subtitle: 'Payment Management System',
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/avatar.jpg', // Replace with user avatar path
  },
  company: {
    name: 'Leja Inc.',
    logo: '/company-logo.png',
  },
};

// Example: Dashboard Layout Usage
export const DashboardLayoutExample: React.FC = () => {
  const navigationData = createCustomNavigation();
  const { navigation, footer } = navigationData;

  const handleNavigationChange = (item: NavigationItem) => {
    console.log('Navigation changed:', item);
    // Handle navigation change (e.g., router.push(item.href))
  };

  const handleLogoClick = () => {
    console.log('Logo clicked');
    // Handle logo click (e.g., router.push("/"))
  };

  const handleUserClick = () => {
    console.log('User clicked');
    // Handle user click (e.g., open user menu)
  };

  return (
    <DashboardLayout
      navigation={navigationData}
      sidebarFooter={navigationData.footer}
      branding={{
        logo: (
          <BrandingComponent
            data={brandingData}
            onLogoClick={handleLogoClick}
            onUserClick={handleUserClick}
          />
        ),
        title: 'Dashboard',
        subtitle: 'Welcome back',
      }}
      onNavigationChange={handleNavigationChange}
      showTopNav={true}
    >
      {/* Your page content goes here */}
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Dashboard</h1>
          <p className='text-muted-foreground'>Welcome to your dashboard</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='p-6 bg-card rounded-lg border'>
            <h3 className='font-semibold'>Total Transactions</h3>
            <p className='text-2xl font-bold text-primary'>1,234</p>
          </div>

          <div className='p-6 bg-card rounded-lg border'>
            <h3 className='font-semibold'>Revenue</h3>
            <p className='text-2xl font-bold text-green-600'>$45,678</p>
          </div>

          <div className='p-6 bg-card rounded-lg border'>
            <h3 className='font-semibold'>Active Users</h3>
            <p className='text-2xl font-bold text-blue-600'>892</p>
          </div>

          <div className='p-6 bg-card rounded-lg border'>
            <h3 className='font-semibold'>Growth</h3>
            <p className='text-2xl font-bold text-purple-600'>+12.5%</p>
          </div>
        </div>

        <div className='p-6 bg-card rounded-lg border'>
          <h2 className='text-xl font-semibold mb-4'>Recent Activity</h2>
          <p className='text-muted-foreground'>
            This is where your dashboard content would go. The layout provides a
            responsive sidebar navigation with collapsible sections, user
            branding, and footer actions.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Example: Simple Usage with Default Navigation
export const SimpleDashboardExample: React.FC = () => {
  return (
    <DashboardLayout
      navigation={{ navigation: defaultNavigation }}
      sidebarFooter={defaultFooterItems}
      branding={{
        logo: <Building2 className='h-8 w-8 text-primary' />,
        title: 'Simple Dashboard',
        subtitle: 'Basic layout example',
      }}
    >
      <div className='p-6'>
        <h1 className='text-2xl font-bold mb-4'>Simple Dashboard</h1>
        <p className='text-muted-foreground'>
          This example uses the default navigation and footer items.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default DashboardLayoutExample;
