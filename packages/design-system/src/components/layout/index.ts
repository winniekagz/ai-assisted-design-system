// Main Layout Components
export {
  default as BrandingComponent,
  BrandingComponentSkeleton,
  type BrandingComponentProps,
  type BrandingData,
} from './branding-component';
export {
  default as DashboardLayout,
  type DashboardLayoutProps,
  type SidebarVariant,
  type SidebarUserConfig,
  type SidebarCTAConfig,
} from './dashboard-layout';

// Navigation Configuration
export {
  NavigationBuilder,
  defaultFooterItems,
  defaultNavigation,
} from './navigation-config';

// Sidebar — standalone (for custom layouts and side-by-side previews)
export { default as SidebarPanel } from './sidebar/SidebarComponent';

// Sidebar slots — composable building blocks
export { SidebarSearch } from './sidebar/SidebarSearch';
export { SidebarSection } from './sidebar/SidebarSection';
export { SidebarNavItem } from './sidebar/SidebarNavItem';
export { SidebarAvatarItem } from './sidebar/SidebarAvatarItem';
export { SidebarCTA } from './sidebar/SidebarCTA';
export { SidebarUserFooter } from './sidebar/SidebarUserFooter';

// Re-export types for convenience
export type {
  BrandingProps,
  NavigationItem,
  SidebarFooterItem,
} from './dashboard-layout';
