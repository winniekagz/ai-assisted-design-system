# Claude Code task — Implement the Projects Experience (Catalogue + Project Details)

Repo: `/home/winnie/Desktop/projects/ai-assisted-design-system`
Target app: `apps/ai-features`

## Context
Read `design_handoff_projects_experience/README.md` first — full spec. `projects-design-reference.html` in the same folder is an interactive HTML **design reference only** (open in a browser; use its "Preview" controls to see List view, Project Details, roles, and list states) — do not copy its markup/inline styles. Recreate it as real React using the existing `componentiq` design system and tokens.

Before writing code, inspect:
- `apps/ai-features/src/app/org/[orgSlug]/projects/page.tsx` (current stub you're replacing)
- `apps/ai-features/src/features/org/dashboard-screen.tsx` and `apps/ai-features/src/features/org/fixtures/dashboard.ts` (fixture pattern + status-panel/tabs styling conventions to match)
- `apps/ai-features/src/features/org/invites-screen.tsx` (real table/EmptyState/Skeleton/Toast usage)
- `apps/ai-features/src/features/dashboard/app-shell.tsx` (page header + nav conventions)
- `packages/design-system/src/index.ts` (everything exported from `componentiq`) and `packages/design-system/src/components/ui/{card,badge,data/table,dataTable/enhanced-data-table,pagination,tab/tabs,empty-state,skeleton,sidebar,form-fields/input,dropdown/dropdown-menu,breadcrumbs,toast}.tsx`
- `packages/design-system/src/theme/default-tokens.ts` (token values — use the CSS-var/Tailwind bridge, never hardcode hex)

## What to build

### A. Projects catalogue — `apps/ai-features/src/features/projects/projects-screen.tsx`
Replace the stub in `app/org/[orgSlug]/projects/page.tsx` with this screen. Header (title + copy + New project/Import actions), status summary pills (filter shortcuts), search input + filter dropdown chips (Status/Team/Design system/Audit state/Framework), a compact table (Project/Status/Blocking/Latest audit/Design system/Activity + row actions), pagination, and Empty/Loading states. Design-system column shows a compact glyph state ("✓ Current"/"⚠ Outdated"/"Base Design System"/"None") with the exact version revealed only on row hover (title attribute or a muted sub-line), not shown by default.

### B. Project Details — `apps/ai-features/src/features/projects/project-details-screen.tsx`
Two-column: fixed sidebar (`Sidebar` component or a simple nav list) + main panel. Sidebar items: Overview, Findings, Repositories, Design systems, Rules, Audit history, Settings — **clicking a sidebar item swaps the main panel's content via client-side state (e.g. `useState<SidebarSection>`), it must not trigger a route change**. Above the swappable section, always render: project header (name/status/description/meta/actions), deployment status panel, latest audit summary.

Sidebar-driven panels:
- Overview & Findings → same blocking-findings table.
- Repositories → repo cards (name, branch, last commit, status).
- Design systems → design-system name + coverage/deprecated/outdated stat row.
- Rules, Audit history, Settings → `EmptyState` "coming soon" stub, sidebar wiring still functional.

Recent Activity card renders at the bottom of every sidebar section.

## Data
- Wire real data (org/project identity, membership/role) wherever `OrgFrame`/existing hooks already provide it.
- Everything else (project list rows, findings, repositories, design-system stats, activity) is a typed, clearly marked fixture — follow the `// FIXTURE:` convention already used in `apps/ai-features/src/features/org/fixtures/dashboard.ts`. Put new fixtures in `apps/ai-features/src/features/projects/fixtures/`.
- Model `ProjectStatus` ('healthy' | 'needs_attention' | 'blocked' | 'not_configured' | 'archived') and the sidebar section ('overview' | 'findings' | 'repositories' | 'design_systems' | 'rules' | 'audit_history' | 'settings') as typed unions, not strings.

## Constraints
- Reuse existing `componentiq` components/tokens first; no new chart or table library — use `data/table.tsx` or `enhanced-data-table.tsx` already in the package.
- No behavior changes outside these two screens.
- Any action without a real backing endpoint (Run audit, New project, Import, filter dropdowns if unwired) must be visibly disabled with a short explanation, not connected to a fake endpoint.
- Loading = per-section skeletons, never a full-page spinner.
- Transient confirmations use the `Toast` primitive; blocking errors stay inline with `role="alert"`.
- Status must never be color-only — pair every status pill with an icon and text label.
- Full keyboard navigation, visible focus states, semantic headings, real `<table>`/`<th>` markup, `aria-label` on icon-only buttons/sidebar icons.

## Acceptance criteria
- Catalogue renders populated/empty/loading states and all 5 status types without type errors.
- Project Details sidebar swaps content client-side (verify no route/URL change on sidebar click, only on "Open" from the catalogue or "← All projects").
- `pnpm -w build` / `tsc` / lint pass.
- No new npm dependencies.
- Fixture boundaries clearly marked in code.

## After implementing, report
1. Files changed/added
2. Which data is real vs. fixture
3. Which actions are disabled/unsupported and why
4. Accessibility work done
5. Remaining backend requirements (real project list, findings, repo, and design-system-stat APIs)
6. How to test locally (states + sidebar sections to click through)
