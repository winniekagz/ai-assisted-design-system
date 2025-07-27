# Button Component Documentation

## Overview

A highly customizable button component built with shadcn/ui and design tokens integration. Features multiple variants, sizes, states, and accessibility features.

## Features

- ✅ **Multiple Variants**: contained, outlined, text, secondary, destructive, ghost, link
- ✅ **Flexible Sizing**: sm, default (30px × 10px), lg, xl, icon
- ✅ **Icon Support**: startIcon, endIcon (with backward compatibility)
- ✅ **Full Width Option**: fullWidth prop for responsive layouts
- ✅ **Loading State**: Built-in loading spinner
- ✅ **Accessibility**: Full ARIA support
- ✅ **Design Token Integration**: Uses your exact color values
- ✅ **Type Safe**: Full TypeScript support

## Props

```typescript
interface ButtonProps {
  // Variants
  variant?:
    | 'contained'
    | 'outlined'
    | 'text'
    | 'secondary'
    | 'destructive'
    | 'ghost'
    | 'link';

  // Sizes
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'icon';

  // Layout
  fullWidth?: boolean;

  // Icons
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  leftIcon?: React.ReactNode; // Alias for startIcon (backward compatibility)
  rightIcon?: React.ReactNode; // Alias for endIcon (backward compatibility)

  // States
  loading?: boolean;
  disabled?: boolean;

  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  'aria-haspopup'?: boolean;

  // Composition
  asChild?: boolean;

  // Standard button props
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

## Usage Examples

### Basic Variants

```tsx
import { Button } from '@/components/ui/button'

// Contained (default filled button)
<Button variant="contained">Contained</Button>

// Outlined (bordered button)
<Button variant="outlined">Outlined</Button>

// Text (minimal button)
<Button variant="text">Text</Button>

// Secondary
<Button variant="secondary">Secondary</Button>

// Destructive
<Button variant="destructive">Delete</Button>
```

### Sizes

```tsx
// Small
<Button size="sm">Small</Button>

// Default (30px × 10px padding)
<Button size="default">Default</Button>

// Large
<Button size="lg">Large</Button>

// Extra Large
<Button size="xl">Extra Large</Button>

// Icon only
<Button size="icon" aria-label="Settings">
  <Settings />
</Button>
```

### Icons

```tsx
import { Download, ArrowRight, Heart } from 'lucide-react'

// Start icon
<Button startIcon={<Download />}>Download</Button>

// End icon
<Button endIcon={<ArrowRight />}>Continue</Button>

// Both icons
<Button startIcon={<Heart />} endIcon={<ArrowRight />}>
  Like & Share
</Button>

// Backward compatibility
<Button leftIcon={<Download />} rightIcon={<ArrowRight />}>
  Download & Continue
</Button>
```

### Full Width

```tsx
// Full width button
<Button fullWidth>Full Width Button</Button>

// Full width with icon
<Button fullWidth startIcon={<Download />}>
  Download All Files
</Button>
```

### States

```tsx
// Normal state
<Button>Normal</Button>

// Disabled state
<Button disabled>Disabled</Button>

// Loading state
<Button loading>Loading...</Button>

// Disabled loading
<Button loading disabled>Processing...</Button>
```

### Accessibility

```tsx
// With aria-label
<Button aria-label="Add new item" startIcon={<Plus />}>
  Add Item
</Button>

// With aria-describedby
<Button aria-describedby="button-desc">Submit</Button>
<div id="button-desc" className="sr-only">
  This button submits the form and saves your data
</div>

// With aria-expanded
<Button aria-expanded="false" aria-haspopup="true">
  Settings Menu
</Button>

// With aria-pressed
<Button aria-pressed="false" startIcon={<Heart />}>
  Like
</Button>
```

### Composition

```tsx
// As a link
<Button asChild>
  <a href="/dashboard">Go to Dashboard</a>
</Button>

// As a form submit
<Button type="submit">Submit Form</Button>

// Custom styling
<Button className="bg-gradient-to-r from-blue-500 to-purple-500">
  Custom Styled
</Button>
```

## Design Token Integration

The button component automatically uses your design tokens:

```css
/* From tokens.css */
--primary-500: #009966; /* Contained button background */
--secondary-500: #f9286c; /* Secondary button background */
--error-500: #d32f2f; /* Destructive button background */
--background-default: #f5f5f5; /* Outlined button background */
--text-primary: rgba(0, 0, 0, 0.87); /* Button text color */
```

## Customization

### Custom Variants

```tsx
// Extend the buttonVariants
const customButtonVariants = cva(buttonVariants({}), {
  variants: {
    variant: {
      ...buttonVariants.variants?.variant,
      custom: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    },
  },
});
```

### Custom Sizes

```tsx
// Add custom sizes
const customSizes = {
  ...buttonVariants.variants?.size,
  '2xl': 'h-14 px-10 py-4 text-xl rounded-lg gap-4',
};
```

### Custom Icons

```tsx
// Use any React component as icon
<Button startIcon={<CustomIcon className="w-5 h-5" />}>
  Custom Icon
</Button>

// Use emoji as icon
<Button startIcon={<span>🚀</span>}>Launch</Button>
```

## Best Practices

### 1. Always Provide Accessible Labels

```tsx
// Good
<Button aria-label="Delete user account">Delete</Button>

// Better
<Button aria-label="Delete user account" aria-describedby="delete-warning">
  Delete
</Button>
<div id="delete-warning">This action cannot be undone</div>
```

### 2. Use Appropriate Variants

```tsx
// Primary action
<Button variant="contained">Save Changes</Button>

// Secondary action
<Button variant="outlined">Cancel</Button>

// Destructive action
<Button variant="destructive">Delete</Button>

// Navigation
<Button variant="text">Learn More</Button>
```

### 3. Consider Loading States

```tsx
// Show loading state during async operations
const [isSubmitting, setIsSubmitting] = useState(false)

<Button
  loading={isSubmitting}
  disabled={isSubmitting}
  onClick={handleSubmit}
>
  {isSubmitting ? 'Saving...' : 'Save Changes'}
</Button>
```

### 4. Use Full Width Responsively

```tsx
// Full width on mobile, auto width on desktop
<Button fullWidth className='md:w-auto'>
  Submit Form
</Button>
```

## Reusability Features

1. **Composable**: Use `asChild` to render as any element
2. **Extensible**: Easy to add new variants and sizes
3. **Accessible**: Built-in ARIA support
4. **Type Safe**: Full TypeScript support
5. **Design Token Driven**: Uses your design system
6. **Backward Compatible**: Supports old prop names

## Performance

- No runtime overhead
- CSS-in-JS with class-variance-authority
- Optimized for tree-shaking
- Minimal bundle size impact
