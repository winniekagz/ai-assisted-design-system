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

## Backend API

The NestJS backend lives in `apps/api`. It exposes REST endpoints on port `4000`,
uses PostgreSQL through Prisma, and treats organization-specific component rules
and guardrails as the source of truth for AI workflows.

### Authentication and Organization Authorization

ComponentIQ uses Clerk for authentication and internal organization membership
for authorization. This keeps identity separate from product permissions and
allows each organization to own its own design-system rules, roles, guardrails,
prompts, review preferences, and AI workflow access.

The backend validates Clerk bearer tokens, syncs the Clerk user to an internal
`User`, resolves organization access by ID or slug, checks membership, and then
enforces a simple role-to-permission map. Existing ID-based organization API
routes remain supported; the Next.js app uses slug-based routes such as
`/org/[orgSlug]/dashboard` for cleaner workspace URLs.

Invites are V1-only records. The API generates a secure random token, stores
only its hash, returns a copyable invite link, and does not send email yet.

For local app development, configure each runtime in the directory that loads
its environment file:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/ai-features/.env.example apps/ai-features/.env.local
```

Set `CLERK_SECRET_KEY` in the API env file and
`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in the frontend env file. Do not place the
Clerk secret key in the frontend app.

### Frontend State Management

The Next.js app uses TanStack Query as the shared server-state layer. Query keys
live in `apps/ai-features/src/lib/query/query-keys.ts`, API domain functions live
in `apps/ai-features/src/lib/api`, and reusable query/mutation hooks live in
`apps/ai-features/src/hooks`. The onboarding V1 routes currently use shared
queries for `/me`, organizations, organization detail, members, and invites.
Those domain functions call the NestJS API directly with Clerk bearer tokens;
the onboarding flow does not maintain parallel Next.js proxy routes.
As components, guardrails, audits, and recommendations receive organization UI,
they should be added through the same domain/query pattern so caching, retries,
loading states, and invalidation stay consistent across pages.

Zustand is used only for the selected-workspace UI fallback. Do not duplicate
backend records, roles, invites, audit inputs, recommendation history, or invite
tokens into Zustand or local storage. Keep sensitive form inputs local to the
component and clear them after successful submission when appropriate.

React Context is used only for stable providers such as Clerk and
`QueryClientProvider`. Backend authorization remains the source of truth; frontend
role checks are display hints only.

The Next.js app uses `.next` for development output and `.next-build` for
production builds, so a verification build cannot invalidate a running dev
server's generated manifests.

Shared API contracts live in `packages/shared-types`. Share request/response
types, enum-like constants, and browser-safe domain summaries there so frontend
apps and the API agree on payload shapes. Keep Nest modules, controllers,
services, Prisma Client usage, validation decorators, and provider secrets inside
`apps/api`.

Run the API and PostgreSQL with Docker:

```bash
cp .env.example .env
npm run docker:up
```

Run database migrations and seed the demo organization:

```bash
npm run db:migrate
npm run db:seed
```

For local development without Docker, point `DATABASE_URL` at your PostgreSQL
instance and run:

```bash
npm run dev:api
```

Useful API endpoints:

- `POST /organizations`
- `GET /organizations`
- `GET /organizations/:id`
- `POST /organizations/:orgId/projects`
- `GET /organizations/:orgId/projects`
- `POST /organizations/:orgId/components`
- `GET /organizations/:orgId/components`
- `GET /components/:id`
- `POST /components/:componentId/rules`
- `GET /components/:componentId/rules`
- `POST /organizations/:orgId/guardrails`
- `GET /organizations/:orgId/guardrails`
- `PATCH /guardrails/:id`
- `POST /ai/recommend-component`
- `POST /ai/audit`
- `POST /ai/setup-guidance`
- `POST /ai/generate-pr-note`
- `GET /organizations/:orgId/audits`
- `GET /audits/:id`
- `GET /organizations/:orgId/recommendations`
- `GET /recommendations/:id`

`AI_PROVIDER=mock` is the default and requires no API key. It returns structured
demo responses while still loading each organization's guardrails, component
catalog, and component rules before producing recommendations or audit findings.
Set `AI_PROVIDER=openai` and provide `OPENAI_API_KEY` to use the OpenAI provider.

The backend intentionally keeps AI as a decision-support layer. Recommendations
and audits are generated only from the provided organization rules, component
catalog, and guardrails; AI output is saved as review evidence, not as final
approval authority.

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
npm i componentiq
```

## Package Link

```text
https://www.npmjs.com/package/componentiq
```

The npm package uses `README.npm.md` as its Storybook-focused documentation during CI publishing. The root `README.md` stays focused on the GitHub product docs.

## CI/CD

The repository includes GitHub Actions for:

- CI on pull requests and pushes to `main` or `master`
- npm publishing when a GitHub release is published or a `v*.*.*` tag is pushed

To publish from CI, add an npm automation or granular access token as the `NPM_TOKEN` repository secret.
