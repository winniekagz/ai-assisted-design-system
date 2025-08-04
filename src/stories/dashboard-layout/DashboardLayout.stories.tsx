import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  BarChart3,
  FileText,
  HelpCircle,
  Key,
  LayoutDashboard,
  List,
  LogOut,
  Settings,
  UserCheck,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';

import {
  DashboardLayout,
  NavigationItem,
  SidebarFooterItem,
} from '@/components/layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

// Sample branding data
const sampleBranding = {
  logo: (
    <div className='h-8 w-8 bg-primary rounded-lg flex items-center justify-center'>
      <span className='text-white font-bold text-sm'>L</span>
    </div>
  ),
  title: 'Leja Dashboard',
  subtitle: 'Component Library',
  homeUrl: '/',
};

// Sample navigation items
const sampleNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className='h-4 w-4' />,
  },
  {
    id: 'transactions',
    title: 'Transactions',
    href: '/transactions',
    icon: <List className='h-4 w-4' />,
  },
  {
    id: 'analytics',
    title: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className='h-4 w-4' />,
  },
  {
    id: 'reports',
    title: 'Reports',
    href: '/reports',
    icon: <FileText className='h-4 w-4' />,
  },
  {
    id: 'admin',
    title: 'Admin',
    icon: <Settings className='h-4 w-4' />,
    children: [
      {
        id: 'team',
        title: 'Team',
        href: '/admin/team',
        icon: <UserCheck className='h-4 w-4' />,
      },
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

// Sample footer items
const sampleFooterItems: SidebarFooterItem[] = [
  {
    id: 'help',
    title: 'Help & Support',
    icon: <HelpCircle className='h-4 w-4' />,
    onClick: () => {
      console.log('Help clicked');
    },
  },
  {
    id: 'logout',
    title: 'Logout',
    icon: <LogOut className='h-4 w-4' />,
    onClick: () => {
      console.log('Logout clicked');
    },
  },
];

// Sample page content
const SamplePageContent = () => (
  <div className='space-y-6'>
    <div className='flex items-center justify-between'>
      <div>
        <Typography variant='h1' className='text-3xl font-bold'>
          Dashboard
        </Typography>
        <Typography variant='body1' className='text-muted-foreground'>
          Welcome to your dashboard
        </Typography>
      </div>
      <Button>New Transaction</Button>
    </div>

    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
          <BarChart3 className='h-4 w-4 text-muted-foreground' />
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
          <CardTitle className='text-sm font-medium'>Subscriptions</CardTitle>
          <List className='h-4 w-4 text-muted-foreground' />
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
          <FileText className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>+12,234</div>
          <p className='text-xs text-muted-foreground'>+19% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Active Now</CardTitle>
          <UserCheck className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>+573</div>
          <p className='text-xs text-muted-foreground'>+201 since last hour</p>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Your recent transactions and activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className='flex items-center space-x-4'>
              <div className='h-2 w-2 bg-primary rounded-full' />
              <div className='flex-1 space-y-1'>
                <p className='text-sm font-medium'>Transaction #{i}</p>
                <p className='text-sm text-muted-foreground'>
                  Completed {i} hour{i !== 1 ? 's' : ''} ago
                </p>
              </div>
              <div className='text-sm font-medium'>$1,234</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const meta = {
  title: 'Layout/DashboardLayout',
  component: DashboardLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Dashboard Layout Component

A comprehensive dashboard layout component that provides:

- **Responsive Sidebar**: Collapsible sidebar with navigation items
- **Top Navigation**: Optional top navigation bar
- **Branding Support**: Customizable logo and branding
- **Navigation Management**: Hierarchical navigation with support for nested items
- **Footer Actions**: Sidebar footer with action items
- **Mobile Responsive**: Works on all screen sizes

### Key Features

- **Collapsible Sidebar**: Toggle between expanded and collapsed states
- **Nested Navigation**: Support for navigation items with children
- **Custom Branding**: Flexible branding with logo, title, and subtitle
- **Footer Actions**: Sidebar footer with customizable action items
- **Mobile Overlay**: Responsive design with mobile overlay
- **TypeScript Support**: Fully typed with comprehensive interfaces

### Usage

\`\`\`tsx
import { DashboardLayout } from '@/components/layout';

const MyDashboard = () => {
  const navigation = {
    navigation: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
      // ... more items
    ],
  };

  const branding = {
    logo: <YourLogo />,
    title: 'Your App',
    subtitle: 'Dashboard',
  };

  return (
    <DashboardLayout
      navigation={navigation}
      branding={branding}
      sidebarFooter={footerItems}
    >
      <YourPageContent />
    </DashboardLayout>
  );
};
\`\`\`

### Props

| Prop | Type | Description |
|------|------|-------------|
| \`children\` | \`ReactNode\` | The main content to display |
| \`navigation\` | \`{ navigation: NavigationItem[] }\` | Navigation items for the sidebar |
| \`sidebarFooter\` | \`SidebarFooterItem[]\` | Optional footer items for the sidebar |
| \`branding\` | \`BrandingProps\` | Branding configuration (logo, title, subtitle) |
| \`className\` | \`string\` | Additional CSS classes |
| \`showTopNav\` | \`boolean\` | Whether to show the top navigation (default: true) |
| \`onNavigationChange\` | \`(item: NavigationItem) => void\` | Callback when navigation item is clicked |

### NavigationItem Interface

\`\`\`tsx
interface NavigationItem {
  id: string;
  title: string;
  href?: string;
  icon?: ReactNode;
  children?: NavigationItem[];
  disabled?: boolean;
  external?: boolean;
}
\`\`\`

### SidebarFooterItem Interface

\`\`\`tsx
interface SidebarFooterItem {
  id: string;
  title: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}
\`\`\`

### BrandingProps Interface

\`\`\`tsx
interface BrandingProps {
  logo: ReactNode;
  title?: string;
  subtitle?: string;
  homeUrl?: string;
}
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showTopNav: {
      control: 'boolean',
      description: 'Whether to show the top navigation bar',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the layout',
    },
  },
} satisfies Meta<typeof DashboardLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic usage story
export const Default: Story = {
  args: {
    children: <SamplePageContent />,
    navigation: { navigation: sampleNavigation },
    sidebarFooter: sampleFooterItems,
    branding: sampleBranding,
    showTopNav: true,
  },
};

// Story without top navigation
export const WithoutTopNav: Story = {
  args: {
    children: <SamplePageContent />,
    navigation: { navigation: sampleNavigation },
    sidebarFooter: sampleFooterItems,
    branding: sampleBranding,
    showTopNav: false,
  },
};

// Story with custom branding
export const CustomBranding: Story = {
  args: {
    children: <SamplePageContent />,
    navigation: { navigation: sampleNavigation },
    sidebarFooter: sampleFooterItems,
    branding: {
      logo: (
        <div className='h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
          <span className='text-white font-bold text-sm'>C</span>
        </div>
      ),
      title: 'Custom Brand',
      subtitle: 'Enterprise Dashboard',
    },
    showTopNav: true,
  },
};

// Story with minimal navigation
export const MinimalNavigation: Story = {
  args: {
    children: <SamplePageContent />,
    navigation: {
      navigation: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          href: '/dashboard',
          icon: <LayoutDashboard className='h-4 w-4' />,
        },
        {
          id: 'settings',
          title: 'Settings',
          href: '/settings',
          icon: <Settings className='h-4 w-4' />,
        },
      ],
    },
    branding: {
      logo: (
        <div className='h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center'>
          <span className='text-white font-bold text-sm'>M</span>
        </div>
      ),
      title: 'Minimal App',
    },
    showTopNav: true,
  },
};

// Interactive story with state management
export const Interactive: Story = {
  render: args => {
    const [currentPage, setCurrentPage] = useState('dashboard');

    const handleNavigationChange = (item: NavigationItem) => {
      setCurrentPage(item.id);
      console.log('Navigated to:', item.title);
    };

    return (
      <DashboardLayout {...args} onNavigationChange={handleNavigationChange}>
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <Typography variant='h1' className='text-3xl font-bold'>
                {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
              </Typography>
              <Typography variant='body1' className='text-muted-foreground'>
                Current page: {currentPage}
              </Typography>
            </div>
            <Button>Action</Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Navigation Demo</CardTitle>
              <CardDescription>
                Click on navigation items to see the current page change
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This demonstrates the interactive navigation functionality.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  },
  args: {
    children: <SamplePageContent />,
    navigation: { navigation: sampleNavigation },
    sidebarFooter: sampleFooterItems,
    branding: sampleBranding,
    showTopNav: true,
  },
};

// Story showing disabled navigation items
export const WithDisabledItems: Story = {
  args: {
    children: <SamplePageContent />,
    navigation: {
      navigation: [
        ...sampleNavigation,
        {
          id: 'disabled',
          title: 'Disabled Item',
          href: '/disabled',
          icon: <Settings className='h-4 w-4' />,
          disabled: true,
        },
      ],
    },
    sidebarFooter: [
      ...sampleFooterItems,
      {
        id: 'disabled-footer',
        title: 'Disabled Footer',
        icon: <Settings className='h-4 w-4' />,
        disabled: true,
      },
    ],
    branding: sampleBranding,
    showTopNav: true,
  },
};
