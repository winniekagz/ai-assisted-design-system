# ComponentIQ

ComponentIQ is an AI-assisted design system demo and internal-tool concept built with Next.js, TypeScript, Tailwind CSS, and Storybook. It shows how a frontend platform team can combine component guidance, governance rules, accessibility checks, and safe AI-assisted workflows around a reusable component library.

## Product Goal

- Help engineers choose the right component before inventing new UI.
- Surface design token expectations and accessibility gaps early.
- Route duplication into governance decisions: compose, variant, pattern, proposal, or local implementation.
- Keep AI prompts on the server and treat generated output as draft-only until reviewed.

## Architecture

- `src/app`: Next.js App Router pages and API routes.
- `src/features`: product screens for assistant, audit, governance, safety, and component browsing.
- `src/components`: reusable component library used by the app and Storybook.
- `src/design-system/data`: component metadata, patterns, tokens, and governance rules.
- `src/ai`: prompts, schemas, server helpers, and mock fallbacks.
- `.storybook`: Storybook configuration for documenting the component library.

## Local Development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Storybook

Use Storybook to browse component states, variants, and usage examples:

```bash
npm run storybook
```

Open:

```text
http://localhost:6006
```

Build static Storybook docs:

```bash
npm run build-storybook
```

Storybook includes a theme toolbar powered by `ComponentIqProvider`, so designers can preview component tokens such as brand colors, radius, and font families.

## npm Package

The installable component library is published as:

```bash
npm i @winniekagendo/componentiq
```

## Package Link

```text
https://www.npmjs.com/package/@winniekagendo/componentiq
```

The npm package uses `README.npm.md` as its Storybook-focused documentation during CI publishing. The root `README.md` stays focused on the GitHub product docs.

## CI/CD

The repository includes GitHub Actions for:

- CI on pull requests and pushes to `main` or `master`
- npm publishing when a GitHub release is published or a `v*.*.*` tag is pushed

To publish from CI, add an npm automation or granular access token as the `NPM_TOKEN` repository secret.
