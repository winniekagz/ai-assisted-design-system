# componentIq

componentIq is a reusable React UI component library built with TypeScript and Tailwind CSS.

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

## Theming

Use `ComponentIqProvider` and `componentIqThemes` to apply design tokens across the component library.

```tsx
import { ComponentIqProvider, componentIqThemes } from 'componentiq';

export function App({ children }: { children: React.ReactNode }) {
  return (
    <ComponentIqProvider tokens={componentIqThemes.ocean}>
      {children}
    </ComponentIqProvider>
  );
}
```

## Repository

https://github.com/winniekagz/ai-assisted-design-system
