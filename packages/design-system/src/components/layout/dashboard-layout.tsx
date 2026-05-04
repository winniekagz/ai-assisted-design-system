'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  User,
} from 'lucide-react';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';

import SidebarComponent from './sidebar/SidebarComponent';
import TopNav from './topnav/TopNav';

// Types for navigation items
export interface NavigationItem {
  id: string;
  title: string;
  href?: string;
  icon?: ReactNode;
  children?: NavigationItem[];
  disabled?: boolean;
  external?: boolean;
}

export interface SidebarFooterItem {
  id: string;
  title: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface BrandingProps {
  logo: ReactNode;
  title?: string;
  subtitle?: string;
  homeUrl?: string;
}

export interface DashboardLayoutProps {
  children: ReactNode;
  navigation: { navigation: NavigationItem[] };
  sidebarFooter?: SidebarFooterItem[];
  branding: BrandingProps;
  className?: string;
  showTopNav?: boolean;
  onNavigationChange?: (item: NavigationItem) => void;
}

// Sidebar Component
interface SidebarProps {
  navigation: NavigationItem[];
  sidebarFooter?: SidebarFooterItem[];
  branding: BrandingProps;
  isCollapsed: boolean;
  onToggle: () => void;
  onNavigationChange?: (item: NavigationItem) => void;
}

// Top Navigation Component

// Main Dashboard Layout Component
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  navigation,
  sidebarFooter,
  branding,
  className,
  showTopNav = true,
  onNavigationChange,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen]);

  const handleSidebarCollapse = useCallback(() => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  const sidebarWidth = useMemo(() => {
    if (!isSidebarOpen) return 0;
    return isSidebarCollapsed ? 64 : 256;
  }, [isSidebarOpen, isSidebarCollapsed]);

  return (
    <div className={cn('flex h-screen bg-background', className)}>
      {/* Sidebar */}
      {isSidebarOpen && (
        <div
          className='fixed left-0 top-0 z-40 h-full p-4'
          style={{ width: sidebarWidth }}
        >
          <SidebarComponent
            navigation={navigation.navigation}
            sidebarFooter={sidebarFooter}
            branding={branding}
            isCollapsed={isSidebarCollapsed}
            onToggle={handleSidebarCollapse}
            onNavigationChange={onNavigationChange}
          />
        </div>
      )}

      {/* Main Content */}
      <div
        className='flex-1 flex flex-col'
        style={{ marginLeft: isSidebarOpen ? sidebarWidth : 0 }}
      >
        {/* Top Navigation */}
        {showTopNav && (
          <TopNav
            branding={branding}
            onMenuToggle={handleSidebarToggle}
            showMenuButton={!isSidebarOpen}
          />
        )}
        {/* Page Content */}
        <main className='flex-1 overflow-auto'>
          <div className='container mx-auto p-6'>{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden'
          onClick={handleSidebarToggle}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
