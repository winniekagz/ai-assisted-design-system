# Dashboard Layout Usage Guide

## Quick Start

The Dashboard Layout component provides a complete dashboard structure with sidebar navigation, top navigation, and main content area.

### Basic Usage

```tsx
import { DashboardLayout } from '@/components/layout';
import { LayoutDashboard, Settings } from 'lucide-react';

const MyDashboard = () => {
  const navigation = {
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
  };

  const branding = {
    logo: <YourLogo />,
    title: 'Your App',
    subtitle: 'Dashboard',
  };

  return (
    <DashboardLayout navigation={navigation} branding={branding}>
      <YourPageContent />
    </DashboardLayout>
  );
};
```

## Features

### ✅ Collapsible Sidebar

- Toggle between expanded and collapsed states
- Responsive design for mobile devices
- Smooth animations

### ✅ Nested Navigation

- Support for navigation items with children
- Hierarchical menu structure
- Disabled state support

### ✅ Custom Branding

- Flexible logo support (React components, SVGs, images)
- Customizable title and subtitle
- Home URL configuration

### ✅ Footer Actions

- Sidebar footer with action items
- Click handlers for custom actions
- Disabled state support

### ✅ Top Navigation

- Optional top navigation bar
- Menu toggle for mobile
- Branding display

## Props Reference

| Prop                 | Type                               | Required | Description                         |
| -------------------- | ---------------------------------- | -------- | ----------------------------------- |
| `children`           | `ReactNode`                        | ✅       | Main content to display             |
| `navigation`         | `{ navigation: NavigationItem[] }` | ✅       | Navigation items for sidebar        |
| `branding`           | `BrandingProps`                    | ✅       | Branding configuration              |
| `sidebarFooter`      | `SidebarFooterItem[]`              | ❌       | Footer action items                 |
| `showTopNav`         | `boolean`                          | ❌       | Show top navigation (default: true) |
| `className`          | `string`                           | ❌       | Additional CSS classes              |
| `onNavigationChange` | `(item: NavigationItem) => void`   | ❌       | Navigation click handler            |

## Navigation Structure

```tsx
interface NavigationItem {
  id: string; // Unique identifier
  title: string; // Display text
  href?: string; // Link URL
  icon?: ReactNode; // Icon component
  children?: NavigationItem[]; // Nested items
  disabled?: boolean; // Disable the item
  external?: boolean; // External link
}
```

## Branding Configuration

```tsx
interface BrandingProps {
  logo: ReactNode; // Logo component
  title?: string; // App title
  subtitle?: string; // App subtitle
  homeUrl?: string; // Home page URL
}
```

## Footer Actions

```tsx
interface SidebarFooterItem {
  id: string; // Unique identifier
  title: string; // Display text
  icon?: ReactNode; // Icon component
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disable the item
}
```

## Examples

### Minimal Setup

```tsx
<DashboardLayout
  navigation={{ navigation: basicNav }}
  branding={{ logo: <Logo />, title: 'App' }}
>
  <PageContent />
</DashboardLayout>
```

### With Footer Actions

```tsx
<DashboardLayout
  navigation={{ navigation: navItems }}
  branding={branding}
  sidebarFooter={[
    {
      id: 'help',
      title: 'Help',
      icon: <HelpCircle className='h-4 w-4' />,
      onClick: () => openHelp(),
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: <LogOut className='h-4 w-4' />,
      onClick: () => logout(),
    },
  ]}
>
  <PageContent />
</DashboardLayout>
```

### Without Top Navigation

```tsx
<DashboardLayout
  navigation={{ navigation: navItems }}
  branding={branding}
  showTopNav={false}
>
  <PageContent />
</DashboardLayout>
```

### With Nested Navigation

```tsx
const navigation = {
  navigation: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className='h-4 w-4' />,
    },
    {
      id: 'admin',
      title: 'Admin',
      icon: <Settings className='h-4 w-4' />,
      children: [
        {
          id: 'users',
          title: 'Users',
          href: '/admin/users',
          icon: <Users className='h-4 w-4' />,
        },
        {
          id: 'settings',
          title: 'Settings',
          href: '/admin/settings',
          icon: <Settings className='h-4 w-4' />,
        },
      ],
    },
  ],
};
```

## Styling

The component uses Tailwind CSS classes and can be customized with:

- `className` prop for additional styles
- CSS custom properties for theming
- Responsive design built-in

## Accessibility

- Keyboard navigation support
- Screen reader friendly
- ARIA labels and roles
- Focus management

## Mobile Support

- Responsive design
- Mobile overlay for sidebar
- Touch-friendly interactions
- Swipe gestures (if implemented)

## Tips

1. **Icons**: Use consistent icon sizes (typically `h-4 w-4`)
2. **Navigation**: Keep navigation items organized and logical
3. **Branding**: Use high-quality logos and clear titles
4. **Performance**: Lazy load content for better performance
5. **Testing**: Test on different screen sizes and devices
