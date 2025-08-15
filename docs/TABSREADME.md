# Reusable Tab Component

A flexible and reusable tab component built with Radix UI that supports multiple variants and sizes.

## Features

- **Four Variants**: `underlined` (default), `outlined`, `contained`, and `rounded`
- **Multiple Sizes**: `sm`, `default`, and `lg`
- **TypeScript Support**: Fully typed with proper interfaces
- **Accessible**: Built on Radix UI for excellent accessibility
- **Customizable**: Support for custom styling via className props
- **Body1 Typography**: Uses the design system's body1 text style

## Variants

### Underlined (Default)

- Clean underline-based styling
- Active state shows primary color underline
- Hover state shows muted underline
- Perfect for content-heavy interfaces

### Outlined

- Border styling with rounded corners
- Active state shows primary color border
- 8px border radius for normal appearance

### Contained

- Background-based styling
- Active state uses primary background color
- Clean, modern appearance

### Rounded

- Badge-like appearance with rounded-full styling
- Active state uses primary background color
- Perfect for pill-style navigation

## Usage

```tsx
import { ReusableTabs, TabItem } from '@/components/ui/tab/tabs';

const tabItems: TabItem[] = [
  {
    value: 'account',
    label: 'Account',
    content: <div>Account settings content...</div>,
  },
  {
    value: 'password',
    label: 'Password',
    content: <div>Password management content...</div>,
  },
];

function MyComponent() {
  return (
    <ReusableTabs
      items={tabItems}
      variant='underlined'
      size='default'
      defaultValue='account'
    />
  );
}
```

## Props

### ReusableTabsProps

| Prop               | Type                                                     | Default            | Description                                       |
| ------------------ | -------------------------------------------------------- | ------------------ | ------------------------------------------------- |
| `items`            | `TabItem[]`                                              | -                  | Array of tab items with value, label, and content |
| `variant`          | `'underlined' \| 'outlined' \| 'contained' \| 'rounded'` | `'underlined'`     | Visual variant of the tabs                        |
| `size`             | `'sm' \| 'default' \| 'lg'`                              | `'default'`        | Size of the tab triggers                          |
| `defaultValue`     | `string`                                                 | First item's value | Default active tab                                |
| `className`        | `string`                                                 | -                  | Additional CSS classes for the tabs container     |
| `triggerClassName` | `string`                                                 | -                  | Additional CSS classes for tab triggers           |
| `contentClassName` | `string`                                                 | -                  | Additional CSS classes for tab content            |

### TabItem

| Prop      | Type              | Description                           |
| --------- | ----------------- | ------------------------------------- |
| `value`   | `string`          | Unique identifier for the tab         |
| `label`   | `string`          | Display text for the tab trigger      |
| `content` | `React.ReactNode` | Content to display when tab is active |

## Styling

The component uses the design system's:

- **Typography**: Body1 text style for tab labels
- **Colors**: Primary color for active states
- **Spacing**: Consistent padding and margins
- **Border Radius**: 8px for normal variants, rounded-full for rounded variant

## Examples

See the demo page at `/tab-demo` for comprehensive examples of all variants and sizes.
