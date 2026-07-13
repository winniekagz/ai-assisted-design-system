import { NavigationBuilder } from '@/components/layout';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  BarChart3,
  Calendar,
  FileText,
  HelpCircle,
  Key,
  LayoutDashboard,
  List,
  LogOut,
  Mail,
  Settings,
  UserCheck,
  Wallet,
} from 'lucide-react';

const meta: Meta = {
  title: 'Layout/NavigationBuilder',
  parameters: {
    docs: {
      description: {
        component:
          'A utility class for building complex navigation structures with a fluent API.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Example navigation items
const adminItems = [
  {
    id: 'team',
    title: 'Team Management',
    href: '/admin/team',
    icon: <UserCheck className='h-4 w-4' />,
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
];

const analyticsItems = [
  {
    id: 'dashboard',
    title: 'Analytics Dashboard',
    href: '/analytics/dashboard',
    icon: <BarChart3 className='h-4 w-4' />,
  },
  {
    id: 'reports',
    title: 'Reports',
    href: '/analytics/reports',
    icon: <FileText className='h-4 w-4' />,
  },
];

const communicationItems = [
  {
    id: 'messages',
    title: 'Messages',
    href: '/communication/messages',
    icon: <Mail className='h-4 w-4' />,
  },
  {
    id: 'calendar',
    title: 'Calendar',
    href: '/communication/calendar',
    icon: <Calendar className='h-4 w-4' />,
  },
];

// Helper function to create serializable navigation data
const createSerializableNavigation = (navigation: any) => {
  const serializableNavigation = {
    navigation: navigation.navigation?.map((item: any) => ({
      id: item.id,
      title: item.title,
      href: item.href,
      icon: item.icon ? '[React Element]' : undefined,
      children: item.children?.map((child: any) => ({
        id: child.id,
        title: child.title,
        href: child.href,
        icon: child.icon ? '[React Element]' : undefined,
      })),
    })),
    footer: navigation.footer.map((item: any) => ({
      id: item.id,
      title: item.title,
      icon: item.icon ? '[React Element]' : undefined,
      onClick: item.onClick ? '[Function]' : undefined,
    })),
  };
  return serializableNavigation;
};

export const BasicNavigation: Story = {
  render: () => {
    const navigation = new NavigationBuilder()
      .addItem({
        id: 'dashboard',
        title: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className='h-4 w-4' />,
      })
      .addItem({
        id: 'transactions',
        title: 'Transactions',
        href: '/transactions',
        icon: <List className='h-4 w-4' />,
      })
      .addFooterItem({
        id: 'logout',
        title: 'Logout',
        icon: <LogOut className='h-4 w-4' />,
        onClick: () => console.log('Logout clicked'),
      })
      .build();

    const serializableNavigation = createSerializableNavigation(navigation);

    return (
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Basic Navigation</h2>
        <pre className='bg-gray-100 p-4 rounded text-sm'>
          {JSON.stringify(serializableNavigation, null, 2)}
        </pre>
      </div>
    );
  },
};

export const WithSections: Story = {
  render: () => {
    const navigation = new NavigationBuilder()
      .addItem({
        id: 'dashboard',
        title: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className='h-4 w-4' />,
      })
      .addSection('Admin', adminItems)
      .addSection('Analytics', analyticsItems)
      .addFooterItem({
        id: 'help',
        title: 'Help & Support',
        icon: <HelpCircle className='h-4 w-4' />,
        onClick: () => console.log('Help clicked'),
      })
      .addFooterItem({
        id: 'logout',
        title: 'Logout',
        icon: <LogOut className='h-4 w-4' />,
        onClick: () => console.log('Logout clicked'),
      })
      .build();

    const serializableNavigation = createSerializableNavigation(navigation);

    return (
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Navigation with Sections</h2>
        <pre className='bg-gray-100 p-4 rounded text-sm'>
          {JSON.stringify(serializableNavigation, null, 2)}
        </pre>
      </div>
    );
  },
};

export const WithFooterItems: Story = {
  render: () => {
    const navigation = new NavigationBuilder()
      .addItem({
        id: 'dashboard',
        title: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className='h-4 w-4' />,
      })
      .addItem({
        id: 'transactions',
        title: 'Transactions',
        href: '/transactions',
        icon: <List className='h-4 w-4' />,
      })
      .addFooterItem({
        id: 'help',
        title: 'Help & Support',
        icon: <HelpCircle className='h-4 w-4' />,
        onClick: () => console.log('Help clicked'),
      })
      .addFooterItem({
        id: 'logout',
        title: 'Logout',
        icon: <LogOut className='h-4 w-4' />,
        onClick: () => console.log('Logout clicked'),
      })
      .build();

    const serializableNavigation = createSerializableNavigation(navigation);

    return (
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>
          Navigation with Footer Items
        </h2>
        <pre className='bg-gray-100 p-4 rounded text-sm'>
          {JSON.stringify(serializableNavigation, null, 2)}
        </pre>
      </div>
    );
  },
};

export const ComplexNavigation: Story = {
  render: () => {
    const navigation = new NavigationBuilder()
      .addItem({
        id: 'dashboard',
        title: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className='h-4 w-4' />,
      })
      .addItem({
        id: 'transactions',
        title: 'Transactions',
        href: '/transactions',
        icon: <List className='h-4 w-4' />,
      })
      .addSection('Admin', adminItems)
      .addSection('Analytics', analyticsItems)
      .addSection('Communication', communicationItems)
      .addFooterItem({
        id: 'help',
        title: 'Help & Support',
        icon: <HelpCircle className='h-4 w-4' />,
        onClick: () => console.log('Help clicked'),
      })
      .addFooterItem({
        id: 'logout',
        title: 'Logout',
        icon: <LogOut className='h-4 w-4' />,
        onClick: () => console.log('Logout clicked'),
      })
      .build();

    const serializableNavigation = createSerializableNavigation(navigation);

    return (
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Complex Navigation</h2>
        <pre className='bg-gray-100 p-4 rounded text-sm'>
          {JSON.stringify(serializableNavigation, null, 2)}
        </pre>
      </div>
    );
  },
};

export const UsageExample: Story = {
  render: () => {
    const navigation = new NavigationBuilder()
      .addItem({
        id: 'dashboard',
        title: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className='h-4 w-4' />,
      })
      .addItem({
        id: 'transactions',
        title: 'Transactions',
        href: '/transactions',
        icon: <List className='h-4 w-4' />,
      })
      .addSection('Admin', adminItems)
      .addFooterItem({
        id: 'logout',
        title: 'Logout',
        icon: <LogOut className='h-4 w-4' />,
        onClick: () => console.log('Logout clicked'),
      })
      .build();

    return (
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Usage Example</h2>
        <div className='space-y-4'>
          <div>
            <h3 className='font-semibold'>
              Navigation Items: {navigation.navigation.length}
            </h3>
            <p className='text-sm text-muted-foreground'>
              Total navigation items including sections
            </p>
          </div>
          <div>
            <h3 className='font-semibold'>
              Footer Items: {navigation.footer.length}
            </h3>
            <p className='text-sm text-muted-foreground'>Footer action items</p>
          </div>
          <div>
            <h3 className='font-semibold'>
              Sections:{' '}
              {navigation.navigation.filter(item => item.children).length}
            </h3>
            <p className='text-sm text-muted-foreground'>
              Navigation sections with children
            </p>
          </div>
        </div>
      </div>
    );
  },
};
