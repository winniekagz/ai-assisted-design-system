# Storybook Vercel Deployment

This repo deploys the static Storybook build from `apps/docs/storybook-static` to Vercel.

## Local Build

```bash
npm ci
npm run build-storybook
```

The root `vercel.json` tells Vercel to run `npm run build-storybook` and publish `apps/docs/storybook-static`.

## GitHub Actions CI/CD

The `Storybook Vercel Deploy` workflow creates:

- preview deployments for pull requests from this repository
- production deployments for pushes to `main` or `master`
- manual production deployments through `workflow_dispatch`

Add these GitHub repository secrets before the workflow can deploy:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

You can find the org and project IDs after linking the project with Vercel CLI:

```bash
npx vercel@latest link
```

The workflow still runs type-checking and the package build before each deploy. The Vercel build step then runs the Storybook build from `vercel.json`, so broken docs do not ship.
