# Tabs

Responsive tab navigation built on Radix Tabs.

## Install

```tsx
import { ReusableTabs } from 'componentiq';
```

## Basic Usage

```tsx
<ReusableTabs
  variant='pill'
  defaultValue='dashboard'
  items={[
    { value: 'dashboard', label: 'Dashboard', content: <Dashboard /> },
    { value: 'settings', label: 'Settings', content: <Settings /> },
    { value: 'payment', label: 'Payment', content: <Payment /> },
  ]}
/>
```

## Variants

- `pill`: rounded container with rounded active trigger.
- `segmented`: compact time-period or filter selector.
- `underline`: navigation tabs with an active bottom border.
- `underlined`, `outlined`, `contained`, and `rounded`: legacy variants kept for compatibility.

## Responsive Behavior

Tabs are scrollable by default. The tab list stays on one row and uses horizontal overflow when the viewport or parent container is too narrow. This keeps labels readable and prevents tab rows from changing layout height on mobile.

```tsx
<ReusableTabs scrollable items={items} />
```

## Tab Items

```ts
interface TabItem {
  value: string;
  label: string;
  content?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}
```
