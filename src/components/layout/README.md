# Dashboard Layout Components

A comprehensive, reusable dashboard layout system built with shadcn/ui components and TypeScript. This layout provides a responsive sidebar navigation, top navigation bar, and flexible branding system.

## 🚀 Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Collapsible Sidebar**: Toggle sidebar visibility and collapse state
- **Nested Navigation**: Support for multi-level navigation items
- **Custom Branding**: Flexible branding component with user info
- **Footer Actions**: Configurable sidebar footer with actions
- **TypeScript**: Full type safety with comprehensive interfaces
- **Accessibility**: Built with accessibility best practices
- **Customizable**: Easy to customize styling and behavior

## 📦 Components

### DashboardLayout

The main layout component that orchestrates the entire dashboard structure.

```tsx
import { DashboardLayout } from '@/components/layout';

<DashboardLayout
  navigation={navigationItems}
  sidebarFooter={footerItems}
  branding={brandingConfig}
  onNavigationChange={handleNavigation}
>
  {/* Your page content */}
</DashboardLayout>;
```

### BrandingComponent

A flexible branding component that displays logo, title, and user information.

```tsx
import { BrandingComponent } from '@/components/layout';

<BrandingComponent
  data={brandingData}
  onLogoClick={handleLogoClick}
  onUserClick={handleUserClick}
/>;
```

### NavigationBuilder

A utility class for building complex navigation structures with a fluent API.

```tsx
import { NavigationBuilder } from '@/components/layout';

const navigation = new NavigationBuilder()
  .addItem({ id: 'dashboard', title: 'Dashboard', href: '/dashboard' })
  .addSection('Admin', adminItems)
  .addFooterItem({ id: 'logout', title: 'Logout' })
  .build();
```

## 🎯 Usage Examples

### Basic Usage

```tsx
import {
  DashboardLayout,
  defaultNavigation,
  defaultFooterItems,
} from '@/components/layout';

export default function DashboardPage() {
  return (
    <DashboardLayout
      navigation={defaultNavigation}
      sidebarFooter={defaultFooterItems}
      branding={{
        logo: <YourLogo />,
        title: 'My Dashboard',
        subtitle: 'Welcome back',
      }}
    >
      <div className='p-6'>
        <h1>Dashboard Content</h1>
        {/* Your page content */}
      </div>
    </DashboardLayout>
  );
}
```

### Custom Navigation

```tsx
import { NavigationBuilder } from '@/components/layout';
import { Home, Users, Settings } from 'lucide-react';

const customNavigation = new NavigationBuilder()
  .addItem({
    id: 'dashboard',
    title: 'Dashboard',
    href: '/dashboard',
    icon: <Home className='h-4 w-4' />,
  })
  .addSection('Admin', [
    {
      id: 'users',
      title: 'Users',
      href: '/admin/users',
      icon: <Users className='h-4 w-4' />,
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings className='h-4 w-4' />,
      children: [
        {
          id: 'general',
          title: 'General',
          href: '/admin/settings/general',
        },
      ],
    },
  ])
  .build();
```

### Advanced Branding

```tsx
import { BrandingComponent } from '@/components/layout';

const brandingData = {
  logo: '/logo.png',
  title: 'Leja Dashboard',
  subtitle: 'Payment Management System',
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/avatar.jpg',
  },
  company: {
    name: 'Leja Inc.',
    logo: '/company-logo.png',
  },
};

<BrandingComponent
  data={brandingData}
  showUserInfo={true}
  showCompanyInfo={true}
  onLogoClick={() => router.push('/')}
  onUserClick={() => openUserMenu()}
/>;
```

## 📋 API Reference

### DashboardLayout Props

| Prop                 | Type                             | Required | Description                             |
| -------------------- | -------------------------------- | -------- | --------------------------------------- |
| `children`           | `ReactNode`                      | ✅       | Page content to render                  |
| `navigation`         | `NavigationItem[]`               | ✅       | Navigation items for sidebar            |
| `sidebarFooter`      | `SidebarFooterItem[]`            | ❌       | Footer items for sidebar                |
| `branding`           | `BrandingProps`                  | ✅       | Branding configuration                  |
| `className`          | `string`                         | ❌       | Additional CSS classes                  |
| `showTopNav`         | `boolean`                        | ❌       | Show top navigation bar (default: true) |
| `onNavigationChange` | `(item: NavigationItem) => void` | ❌       | Navigation change handler               |

### NavigationItem Interface

```tsx
interface NavigationItem {
  id: string;
  title: string;
  href?: string;
  icon?: ReactNode;
  children?: NavigationItem[];
  disabled?: boolean;
  external?: boolean;
}
```

### SidebarFooterItem Interface

```tsx
interface SidebarFooterItem {
  id: string;
  title: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}
```

### BrandingProps Interface

```tsx
interface BrandingProps {
  logo: ReactNode;
  title?: string;
  subtitle?: string;
  homeUrl?: string;
}
```

## 🎨 Customization

### Styling

The layout uses Tailwind CSS classes and can be customized by passing `className` props or modifying the component styles.

### Navigation Builder

Use the `NavigationBuilder` class to create complex navigation structures:

```tsx
const navigation = new NavigationBuilder()
  .addItem({ id: 'item1', title: 'Item 1', href: '/item1' })
  .addSection('Section', sectionItems)
  .addFooterItem({ id: 'footer1', title: 'Footer 1' })
  .build();
```

### Event Handlers

Handle navigation changes, logo clicks, and user interactions:

```tsx
const handleNavigationChange = (item: NavigationItem) => {
  if (item.href) {
    router.push(item.href);
  }
};

const handleLogoClick = () => {
  router.push('/');
};

const handleUserClick = () => {
  // Open user menu or profile
};
```

## 🔧 Configuration

### Default Navigation

The layout comes with pre-configured navigation items:

```tsx
import { defaultNavigation, defaultFooterItems } from '@/components/layout';
```

### Custom Icons

Use any icon library (Lucide React recommended):

```tsx
import { Home, Users, Settings } from 'lucide-react';

const navigation = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <Home className='h-4 w-4' />,
  },
];
```

## 🚀 Best Practices

1. **Type Safety**: Always use TypeScript interfaces for navigation and branding data
2. **Accessibility**: The layout includes proper ARIA attributes and keyboard navigation
3. **Responsive Design**: Test on different screen sizes
4. **Performance**: Use React.memo for custom components if needed
5. **Consistency**: Follow the established patterns for navigation structure

## 📱 Responsive Behavior

- **Desktop**: Full sidebar with top navigation
- **Tablet**: Collapsible sidebar with hamburger menu
- **Mobile**: Overlay sidebar with backdrop

## 🎯 Examples

See `src/components/examples/dashboard-layout-usage.tsx` for complete usage examples including:

- Basic dashboard layout
- Custom navigation configuration
- Advanced branding setup
- Event handling examples
