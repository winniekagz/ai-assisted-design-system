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
import { NavigationItem, SidebarFooterItem } from './dashboard-layout';

// Default Navigation Items
export const defaultNavigation: NavigationItem[] = [
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

// Default Footer Items
export const defaultFooterItems: SidebarFooterItem[] = [
  {
    id: 'help',
    title: 'Help & Support',
    icon: <HelpCircle className='h-4 w-4' />,
    onClick: () => {
      // Handle help action
      console.log('Help clicked');
    },
  },
  {
    id: 'logout',
    title: 'Logout',
    icon: <LogOut className='h-4 w-4' />,
    onClick: () => {
      // Handle logout action
      console.log('Logout clicked');
    },
  },
];

// Navigation Builder Utility
export class NavigationBuilder {
  private items: NavigationItem[] = [];
  private footerItems: SidebarFooterItem[] = [];

  addItem(item: NavigationItem): NavigationBuilder {
    this.items.push(item);
    return this;
  }

  addFooterItem(item: SidebarFooterItem): NavigationBuilder {
    this.footerItems.push(item);
    return this;
  }

  addSection(title: string, items: NavigationItem[]): NavigationBuilder {
    this.items.push({
      id: `section-${title.toLowerCase().replace(/\s+/g, '-')}`,
      title,
      children: items,
    });
    return this;
  }

  build(): { navigation: NavigationItem[]; footer: SidebarFooterItem[] } {
    return {
      navigation: this.items,
      footer: this.footerItems,
    };
  }
}

// Example usage:
// const customNavigation = new NavigationBuilder()
//   .addItem({ id: "custom", title: "Custom", href: "/custom", icon: <CustomIcon /> })
//   .addSection("Admin", adminItems)
//   .addFooterItem({ id: "custom-footer", title: "Custom", icon: <CustomIcon /> })
//   .build();
