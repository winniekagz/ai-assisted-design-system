# componentIq

componentIq is a React component library documented with Storybook. The npm package ships the compiled component library from `dist` so consumers can install and import components directly.

## Install

```bash
npm i @winniekagendo/componentiq
```

## Usage

```tsx
import { Button, Card, Input, Typography } from '@winniekagendo/componentiq';

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
https://www.npmjs.com/package/@winniekagendo/componentiq
```

## Repository

```text
https://github.com/winniekagz/ai-assisted-design-system
```

## CI/CD

The repository includes GitHub Actions for:

- CI on pull requests and pushes to `main` or `master`
- npm publishing when a GitHub release is published or a `v*.*.*` tag is pushed

To publish from CI, add an npm automation or granular access token as the `NPM_TOKEN` repository secret.
