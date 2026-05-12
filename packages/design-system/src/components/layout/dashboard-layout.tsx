'use client';

import { cn } from '@/lib/utils';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';

import SidebarComponent from './sidebar/SidebarComponent';
import TopNav from './topnav/TopNav';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NavigationItem {
  id: string;
  title: string;
  href?: string;
  icon?: ReactNode;
  children?: NavigationItem[];
  disabled?: boolean;
  external?: boolean;
  /** Count or tag shown as a pill on the right side of the item */
  badge?: string | number;
  /** Groups consecutive items under a section heading */
  section?: string;
  /** 'avatar' renders a SidebarAvatarItem instead of a nav button */
  type?: 'nav' | 'avatar';
  avatarSrc?: string;
  avatarFallback?: string;
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

export type SidebarVariant = 'executive' | 'playful';

export interface SidebarUserConfig {
  name: string;
  role?: string;
  avatarSrc?: string;
  avatarFallback?: string;
  progress?: number;
  progressLabel?: string;
}

export interface SidebarCTAConfig {
  title: string;
  description?: string;
  action: string;
  onAction?: () => void;
}

export interface DashboardLayoutProps {
  children: ReactNode;
  navigation: { navigation: NavigationItem[] };
  sidebarFooter?: SidebarFooterItem[];
  branding: BrandingProps;
  className?: string;
  showTopNav?: boolean;
  showSearch?: boolean;
  onNavigationChange?: (item: NavigationItem) => void;
  /** Controls sidebar personality tokens — executive (clean) or playful (bold) */
  variant?: SidebarVariant;
  /** User profile shown at the bottom of the sidebar */
  sidebarUser?: SidebarUserConfig;
  /** Upgrade / onboarding CTA card (playful variant) */
  sidebarCTA?: SidebarCTAConfig;
}

// ─── Layout ──────────────────────────────────────────────────────────────────

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  navigation,
  sidebarFooter,
  branding,
  className,
  showTopNav = true,
  showSearch = false,
  onNavigationChange,
  variant = 'executive',
  sidebarUser,
  sidebarCTA,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleSidebarCollapse = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  const sidebarWidth = useMemo(() => {
    if (!isSidebarOpen) return 0;
    return isSidebarCollapsed ? 64 : 256;
  }, [isSidebarOpen, isSidebarCollapsed]);

  return (
    <div className={cn('flex h-screen bg-background', className)}>
      {isSidebarOpen && (
        <div
          className='fixed left-0 top-0 z-40 h-full'
          style={{ width: sidebarWidth }}
        >
          <SidebarComponent
            navigation={navigation.navigation}
            sidebarFooter={sidebarFooter}
            branding={branding}
            isCollapsed={isSidebarCollapsed}
            onToggle={handleSidebarCollapse}
            onNavigationChange={onNavigationChange}
            variant={variant}
            showSearch={showSearch}
            sidebarUser={sidebarUser}
            sidebarCTA={sidebarCTA}
          />
        </div>
      )}

      <div
        className='flex flex-1 flex-col'
        style={{ marginLeft: isSidebarOpen ? sidebarWidth : 0 }}
      >
        {showTopNav && (
          <TopNav
            branding={branding}
            onMenuToggle={handleSidebarToggle}
            showMenuButton={!isSidebarOpen}
          />
        )}
        <main className='flex-1 overflow-auto'>
          <div className='container mx-auto p-6'>{children}</div>
        </main>
      </div>

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
