# ComponentIQ

ComponentIQ is a React component library documented with Storybook. The npm package ships the compiled component library from `dist` so consumers can install and import components directly.

## Install

```bash
npm i componentiq
```

## Usage

```tsx
import { Button, Card, Input, Typography } from 'componentiq';

export function Example() {
  return (
    <Card>
      <Typography variant='h3'>Create account</Typography>
      <Input placeholder='Email address' />
      <Button>Create</Button>
    </Card>
  );
}
```

The library uses React, TypeScript, and Tailwind CSS utility classes. Make sure your app is configured to process Tailwind classes used by your dependencies.

## Custom Design Tokens

Wrap your app with `ComponentIqProvider` to customize the component library for your brand. Tokens are converted to CSS variables, so the same components can adapt to different colors, radii, spacing, and font families.

```tsx
import {
  Button,
  ComponentIqProvider,
  type ComponentIqTokens,
} from 'componentiq';

const tokens: ComponentIqTokens = {
  colors: {
    primary: '#0F766E',
    primaryForeground: '#FFFFFF',
    background: '#F8FAFC',
    foreground: '#0F172A',
    surface: '#FFFFFF',
    border: '#CBD5E1',
    focus: '#0F766E',
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    headingFontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  },
  radius: {
    md: '10px',
    lg: '14px',
  },
};

export function App() {
  return (
    <ComponentIqProvider tokens={tokens}>
      <Button>Save changes</Button>
    </ComponentIqProvider>
  );
}
```

You can also start from a preset:

```tsx
import {
  ComponentIqProvider,
  componentIqThemes,
} from 'componentiq';

export function App({ children }: { children: React.ReactNode }) {
  return (
    <ComponentIqProvider tokens={componentIqThemes.ocean}>
      {children}
    </ComponentIqProvider>
  );
}
```

## Storybook

Storybook is the source of truth for browsing the component library, checking variants, and copying usage patterns.

Run Storybook locally:

```bash
npm install
npm run storybook
```

Open:

```text
http://localhost:6006
```

Build the static Storybook documentation:

```bash
npm run build-storybook
```

The generated static docs are written to:

```text
storybook-static/
```

## Available Components

The package exports common UI primitives and patterns, including:

- `Button`
- `Badge`
- `Card`
- `Input`
- `Select`
- `Checkbox`
- `Radio`
- `Textarea`
- `DatePicker`
- `Pagination`
- `EnhancedPagination`
- `EnhancedDataTable`
- `DashboardLayout`
- `Typography`

## Package Link

```text
https://www.npmjs.com/package/componentiq
```

## Repository

```text
https://github.com/winniekagz/ai-assisted-design-system
```
