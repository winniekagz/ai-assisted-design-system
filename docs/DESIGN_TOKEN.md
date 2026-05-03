# Design Tokens System

A comprehensive, modularized design tokens system for the componentIq Component Library, built to work seamlessly with shadcn/ui and Tailwind CSS v4.

## Overview

This design tokens system provides a consistent foundation for design decisions across your application. It includes:

- **Colors**: Light and dark theme color palettes with semantic naming
- **Spacing**: Consistent spacing scale based on 4px grid system
- **Sizing**: Component and layout sizing tokens
- **Border**: Border radius, width, and style definitions
- **Elevation**: Shadow and depth tokens
- **Opacity**: Transparency values for overlays and states
- **Motion**: Animation durations, easing, and transitions
- **Breakpoints**: Responsive design breakpoints
- **States**: Interactive state definitions

## File Structure

```
src/styles/tokens/
├── index.ts          # Main exports and utilities
├── colors.ts         # Color tokens (light/dark themes)
├── spacing.ts        # Spacing tokens
├── sizing.ts         # Sizing tokens
├── border.ts         # Border tokens
├── elevation.ts      # Elevation/shadow tokens
├── opacity.ts        # Opacity tokens
├── motion.ts         # Motion/animation tokens
├── breakpoints.ts    # Breakpoint tokens
├── states.ts         # Interactive state tokens
├── tokens.css        # Generated CSS custom properties
└── README.md         # This documentation
```

## Usage

### 1. Importing Tokens

```typescript
// Import all tokens
import { designTokens } from '@/styles/tokens';

// Import specific token categories
import { lightColors, darkColors } from '@/styles/tokens/colors';
import { spacing } from '@/styles/tokens/spacing';
import { motion } from '@/styles/tokens/motion';

// Import utility functions
import { generateCSSVariables, generateTailwindConfig } from '@/styles/tokens';
```

### 2. Using CSS Custom Properties

The tokens are automatically available as CSS custom properties:

```css
.my-component {
  background-color: var(--primary-500);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: var(--duration-normal) var(--easing-standard);
}
```

### 3. Using with Tailwind CSS

The tokens are integrated with Tailwind CSS v4:

```jsx
<div className="bg-primary-500 p-4 rounded-lg shadow-md transition-all duration-normal">
  Content
</div>
```

### 4. Using with shadcn/ui Components

```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function MyComponent() {
  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-normal">
      <Button 
        className="bg-primary-500 hover:bg-primary-600 text-white"
        style={{
          '--button-hover-bg': 'var(--primary-600)',
          '--button-active-bg': 'var(--primary-700)',
        } as React.CSSProperties}
      >
        Click me
      </Button>
    </Card>
  );
}
```

## Color System

### Light Theme Colors

```typescript
import { lightColors } from '@/styles/tokens/colors';

// Primary colors (green theme)
lightColors.primary[500] // #009966 (main)
lightColors.primary[600] // #008759 (dark)

// Secondary colors (pink theme)
lightColors.secondary[500] // #F9286C (main)
lightColors.secondary[600] // #D12164 (dark)

// Semantic colors
lightColors.error[500]   // #D32F2F
lightColors.warning[500] // #EF6C00
lightColors.info[500]    // #0288D1
lightColors.success[500] // #2E7D32
```

### Dark Theme Colors

```typescript
import { darkColors } from '@/styles/tokens/colors';

// Dark theme uses inverted color relationships
darkColors.primary[500] // #9BDDBF (light green)
darkColors.secondary[500] // #FE93B7 (light pink)
```

## Spacing System

The spacing system is based on a 4px grid:

```typescript
import { spacing } from '@/styles/tokens/spacing';

spacing[1]  // 0.25rem (4px)
spacing[4]  // 1rem (16px)
spacing[8]  // 2rem (32px)
spacing[16] // 4rem (64px)

// Semantic spacing
spacing.xs   // 0.25rem
spacing.sm   // 0.5rem
spacing.md   // 1rem
spacing.lg   // 1.5rem
spacing.xl   // 2rem
```

## Motion System

```typescript
import { motion } from '@/styles/tokens/motion';

// Durations
motion.duration.fast   // 100ms
motion.duration.normal // 200ms
motion.duration.slow   // 300ms

// Easing functions
motion.easing.material.standard // cubic-bezier(0.4, 0.0, 0.2, 1)

// Transitions
motion.transition.all // all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)
motion.transition.colors // color, background-color, border-color transitions

// Animations
motion.animation.fadeIn // fadeIn 200ms cubic-bezier(0.4, 0.0, 0.2, 1)
motion.animation.slideInUp // slideInUp 300ms cubic-bezier(0.4, 0.0, 0.2, 1)
```

## Breakpoints

```typescript
import { breakpoints, breakpointUtils } from '@/styles/tokens/breakpoints';

// Standard breakpoints
breakpoints.sm  // 640px
breakpoints.md  // 768px
breakpoints.lg  // 1024px
breakpoints.xl  // 1280px
breakpoints['2xl'] // 1536px

// Utility functions
breakpointUtils.up('md')     // @media (min-width: 768px)
breakpointUtils.down('lg')   // @media (max-width: 1024px)
breakpointUtils.between('md', 'lg') // @media (min-width: 768px) and (max-width: 1024px)

// Device-specific
breakpointUtils.mobile       // @media (max-width: 768px)
breakpointUtils.desktop      // @media (min-width: 1024px)
```

## States System

```typescript
import { states } from '@/styles/tokens/states';

// Interactive states
states.interactive.hover.opacity // 0.9
states.interactive.focus.ring // 0 0 0 3px rgba(0, 153, 102, 0.1)

// Component-specific states
states.component.button.hover.backgroundColor // var(--button-hover-bg)
states.component.input.focus.borderColor // var(--border-focus)
```

## Utility Functions

### Generate CSS Variables

```typescript
import { generateCSSVariables } from '@/styles/tokens';

const lightThemeCSS = generateCSSVariables('light');
const darkThemeCSS = generateCSSVariables('dark');
```

### Generate Tailwind Config

```typescript
import { generateTailwindConfig } from '@/styles/tokens';

const tailwindConfig = generateTailwindConfig();
// Use this in your tailwind.config.js
```

### Get Token Value

```typescript
import { getTokenValue, designTokens } from '@/styles/tokens';

const primaryColor = getTokenValue(designTokens, 'colors.light.primary.500');
const spacingValue = getTokenValue(designTokens, 'spacing.4');
```

## Integration with shadcn/ui

### 1. Update your `tailwind.config.js`

```javascript
const { generateTailwindConfig } = require('./src/styles/tokens');

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      ...generateTailwindConfig().theme.extend,
    },
  },
  plugins: [],
};
```

### 2. Use in component variants

```typescript
// components/ui/button.tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-primary-50 hover:bg-primary-600',
        secondary: 'bg-secondary-500 text-secondary-50 hover:bg-secondary-600',
        destructive: 'bg-error-500 text-error-50 hover:bg-error-600',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary-500',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

### 3. Use in CSS-in-JS

```typescript
import { designTokens } from '@/styles/tokens';

const styles = {
  button: {
    backgroundColor: designTokens.colors.light.primary[500],
    padding: designTokens.spacing[4],
    borderRadius: designTokens.border.radius.lg,
    transition: designTokens.motion.transition.all,
    '&:hover': {
      backgroundColor: designTokens.colors.light.primary[600],
      transform: designTokens.states.interactive.hover.transform,
    },
  },
};
```

## Best Practices

### 1. Use Semantic Names

```typescript
// ✅ Good
const primaryColor = designTokens.colors.light.primary[500];
const cardPadding = designTokens.spacing[6];

// ❌ Avoid
const greenColor = '#009966';
const padding24 = '1.5rem';
```

### 2. Use CSS Custom Properties

```css
/* ✅ Good */
.my-component {
  background-color: var(--primary-500);
  padding: var(--spacing-4);
}

/* ❌ Avoid */
.my-component {
  background-color: #009966;
  padding: 1rem;
}
```

### 3. Leverage Component-Specific Tokens

```typescript
// ✅ Good
const buttonStyles = {
  padding: designTokens.spacing.button.padding.md,
  borderRadius: designTokens.border.radius.button.md,
  transition: designTokens.motion.transition.button.default,
};
```

### 4. Use Breakpoint Utilities

```typescript
// ✅ Good
const responsiveStyles = {
  [breakpointUtils.up('md')]: {
    padding: designTokens.spacing[8],
  },
  [breakpointUtils.up('lg')]: {
    padding: designTokens.spacing[12],
  },
};
```

## Customization

### Adding New Colors

```typescript
// src/styles/tokens/colors.ts
export const lightColors = {
  // ... existing colors
  custom: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',
    900: '#0c4a6e',
  },
} as const;
```

### Adding New Spacing Values

```typescript
// src/styles/tokens/spacing.ts
export const spacing = {
  // ... existing spacing
  '13': '3.25rem', // 52px
  '15': '3.75rem', // 60px
} as const;
```

### Adding New Motion Presets

```typescript
// src/styles/tokens/motion.ts
export const motion = {
  // ... existing motion
  custom: {
    duration: {
      extraSlow: '1000ms',
    },
    easing: {
      custom: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
  },
} as const;
```

## Migration Guide

### From Hardcoded Values

```typescript
// Before
const styles = {
  backgroundColor: '#009966',
  padding: '1rem',
  borderRadius: '0.5rem',
};

// After
import { designTokens } from '@/styles/tokens';

const styles = {
  backgroundColor: designTokens.colors.light.primary[500],
  padding: designTokens.spacing[4],
  borderRadius: designTokens.border.radius.lg,
};
```

### From CSS Variables

```css
/* Before */
:root {
  --my-primary: #009966;
  --my-spacing: 1rem;
}

/* After */
/* Use the generated CSS variables */
.my-component {
  background-color: var(--primary-500);
  padding: var(--spacing-4);
}
```

## Contributing

When adding new tokens:

1. Add the token to the appropriate module
2. Update the TypeScript types
3. Add the token to the CSS variables generator
4. Update this documentation
5. Test with both light and dark themes

## Support

For questions or issues with the design tokens system, please refer to:

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Design Tokens Specification](https://design-tokens.github.io/community-group/format/) 