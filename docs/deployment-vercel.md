# Vercel Deploy Targets

This repository is an npm workspace monorepo. Vercel projects must be configured
so workspace packages remain available during install and build.

## Storybook

Use the repository root as the Vercel project root.

```txt
Root Directory: .
Framework Preset: Other
Install Command: npm ci
Build Command: npm run build-storybook
Output Directory: apps/docs/storybook-static
```

The root `vercel.json` contains these settings. Do not set the Storybook project
root to `apps/docs` unless Vercel is configured to include source files outside
the root directory.

## AI Features App

Recommended setup: use the repository root as the Vercel project root and
override the build settings in the Vercel project dashboard.

```txt
Root Directory: .
Framework Preset: Next.js
Install Command: npm ci
Build Command: npm run build --workspace=@winniekagendo/ai-features
Output Directory: apps/ai-features/.next
```

Alternative setup: set the project root to `apps/ai-features` and enable
Vercel's monorepo option to include source files outside the root directory.
That app has its own `apps/ai-features/vercel.json` for this mode.

If Vercel reports this error:

```txt
npm error workspace @winniekagendo/ai-features@1.0.0
npm error location /vercel/path0/apps/ai-features
npm error Missing script: "build-storybook"
```

the AI Features Vercel project is using the Storybook build command. Change the
project's Build Command to `npm run build` when the Root Directory is
`apps/ai-features`, or use the recommended repo-root settings above.
