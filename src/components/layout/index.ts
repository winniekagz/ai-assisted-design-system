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
} from './dashboard-layout';

// Navigation Configuration
export {
  NavigationBuilder,
  defaultFooterItems,
  defaultNavigation,
} from './navigation-config';

// Re-export types for convenience
export type {
  BrandingProps,
  NavigationItem,
  SidebarFooterItem,
} from './dashboard-layout';
