# Handoff: Projects Experience (Catalogue + Project Details)

## Overview
Two connected surfaces for ComponentIQ: the **Projects catalogue** (a Stripe/GitHub-style compact table of all engineering projects — search, filters, status summary pills) and the **Project Details** command-centre (opened from a table row) with a left sidebar (Overview / Findings / Repositories / Design systems / Rules / Audit history / Settings) whose selection swaps the main content area. This is a catalogue, not an analytics dashboard — every row/section exists to answer "does this need attention, should I open it."

## About the Design Files
`projects-design-reference.html` is an interactive HTML **design reference** (inline-styled Design Component prototype) — not production code. Use the "Preview" controls at the top to switch List ↔ Detail, role, and list state (populated/empty/loading). Recreate the layout/copy/behavior as real React using the existing `componentiq` package — do not copy inline styles/markup directly.

## Fidelity
High-fidelity. Spacing, copy, colors, and the sidebar-driven content-swap behavior in the reference are final intent — implement using real design-system components + CSS-var tokens instead of literal hex/px.

## Repository context
- Repo root: `/home/winnie/Desktop/projects/ai-assisted-design-system`
- Target app: `apps/ai-features`
- Existing project-scoped placeholder route: `apps/ai-features/src/app/org/[orgSlug]/projects/page.tsx` (currently a stub — replace with the real catalogue)
- Reuse conventions from: `apps/ai-features/src/features/org/dashboard-screen.tsx` (fixture pattern, `ProjectHeader`, status-panel styling, tabs), `apps/ai-features/src/features/org/invites-screen.tsx` (real table + EmptyState + Skeleton usage), `apps/ai-features/src/features/dashboard/app-shell.tsx` (`PageHeader`, sidebar/nav conventions), `apps/ai-features/src/features/org/fixtures/dashboard.ts` (fixture-marking convention to follow for new fixtures)
- Design-system components to reuse (from `packages/design-system/src/components/ui`): `card.tsx`, `badge/*` (status pills), `data/table.tsx` or `dataTable/enhanced-data-table.tsx` (catalogue table + pagination), `pagination/*`, `tab/tabs.tsx` (detail-page section tabs), `empty-state.tsx`, `skeleton.tsx`, `sidebar.tsx` (project details left nav), `form-fields/input.tsx` (search), `dropdown/dropdown-menu.tsx` (filter chips), `breadcrumbs.tsx`, `toast.tsx` (transient confirmations)
- Tokens: `packages/design-system/src/theme/default-tokens.ts` — use the CSS-var bridge (`bg-[color:var(--...)]`), never hardcode hex, same convention as `dialog.tsx`/`empty-state.tsx`.

## Screens

### 1. Projects catalogue (`/org/[orgSlug]/projects`)
- Header: "Projects" H1 + supporting copy ("Manage engineering projects connected to ComponentIQ...") + primary "New project" button + secondary "Import" button.
- Summary pills (not KPI cards): "128 Projects" / "12 Blocked" / "18 Need Attention" / "96 Healthy" — each pill is a filter shortcut (clicking applies that status filter to the table below).
- Search bar (placeholder: "Search by project, repository, team, design system, tag, or framework") + filter chips: Status, Team, Design system, Audit state, Framework (dropdown menus, not a filter sidebar).
- Table columns: **Project** (name + repo path, monospace, muted), **Status** (pill: Healthy/green, Needs Attention/amber, Blocked/red, Not Configured/gray, Archived/gray — icon + color + label, never color-only), **Blocking** (count, red when >0), **Latest audit** (state + relative time), **Design system** (compact glyph state — "✓ Current" / "⚠ Outdated" / "Base Design System" / "None" — NOT the raw version string; reveal the exact version in a muted sub-line on row hover), **Activity** (one-line latest event), trailing row actions (secondary "Run audit" appears on hover, primary "Open ›" always visible). Whole row is clickable to open Project Details.
- Empty state: "No projects yet" + explanation + "Create project" (primary) / "Import existing repository" (secondary).
- Loading: per-section skeletons (search bar bar + N table-row bars), never a single spinner.
- Pagination: "Showing 1–6 of 128 projects" + Previous/Next.

### 2. Project Details (`/org/[orgSlug]/projects/[projectSlug]`)
Two-column layout: fixed-width left sidebar (nav) + main content area that changes based on the selected sidebar item — **this is the key interaction**: sidebar selection swaps the main panel's content, it does not navigate to a new page shell.

- Sidebar items: Overview, Findings, Repositories, Design systems, Rules, Audit history, Settings (icons + labels; active item gets a subtle background + darker text). A "← All projects" link sits above the nav, going back to the catalogue.
- Main content, always visible above the sidebar-driven section: Project header (name, status pill, description, team/repo-count/design-system/last-audited meta line, "Project settings" + "Run audit" actions), Deployment status panel (colored left-border card, headline + one-line explanation + primary action), Latest audit summary card.
- Sidebar-driven sections (swap in the space below the audit summary, replacing each other — implement literally as conditional rendering keyed to the active sidebar item, matching the reference's `detailTab` state):
  - **Overview** → same as **Findings** view in the reference (findings table: Severity/Finding+location/Rule/Assignee/Age).
  - **Findings** → blocking-findings table (as above).
  - **Repositories** → stacked repo cards: name (monospace) + branch + last-commit time + status pill, for each repo under this project (supports multiple repos per project, e.g. checkout-web / checkout-api / checkout-mobile).
  - **Design systems** → primary design-system name + 3-stat row (coverage %, deprecated-component count, outdated-component count).
  - **Rules**, **Audit history**, **Settings** → not built in the reference; stub with a simple "coming soon" `EmptyState` for now, same sidebar wiring.
- Recent Activity card at the bottom of every sidebar section (project-level events: audit failed, override requested, components resolved — not developer productivity).

### Role-awareness
Manager/Maintainer: full catalogue + full detail sidebar. Developer: same page structure (do not fork into separate routes) — de-emphasize team-ownership and design-system-adoption framing per the original dashboard's role rules; sidebar and table stay the same shape.

## Interactions
- Summary pill click → applies table filter.
- Filter chips → dropdown menus (checkbox-style multi-select is fine).
- Row click / "Open ›" → navigate to Project Details.
- "Run audit" (row-level and detail-page) → trigger real audit action where the endpoint exists; otherwise visibly disabled with an explanation, never wired to a fake endpoint.
- Sidebar item click → client-side content swap within Project Details (no full navigation/page reload).
- Any transient confirmation → real `Toast` primitive; blocking errors stay inline with `role="alert"`.

## Design Tokens (`packages/design-system/src/theme/default-tokens.ts`)
- Primary `#8D493A` (primary scale 50–950), Secondary `#347887`
- Surfaces: background `#FDFAF9`, surface `#FFFFFF`, secondary bg `#F9FAFB`, hover `#F3F4F6`
- Text: primary `#111827`, secondary `#4B5563`, muted `#6B7280`, disabled `#9CA3AF`
- Borders: `#D1D5DB` default / `#E5E7EB` subtle (reference used a flatter `#EAEAEA` card border — either acceptable, prefer token)
- Status: error `#B42318`/`#FEF3F2`, warning `#B54708`/`#FFFAEB`, success `#067647`/`#ECFDF3`, info `#175CD3`/`#EFF8FF`
- Typography: Rubik, weights 400/500/700; radius `sm 4 / md 8 / lg 12 / full 9999`; shadow `sm` for card elevation; spacing scale `xs4/sm8/md16/lg24/xl32/2xl48`

## Assets
`lucide-react` icons only (already a dependency) — swap the reference's emoji glyphs (📄⚠️📦🎨📋⏱️⚙️) for real lucide icons matching sidebar semantics (e.g. `LayoutDashboard`, `ShieldAlert`, `GitBranch`/`Package`, `Palette`, `ListChecks`, `History`, `Settings`). No chart library needed.

## Files
- `projects-design-reference.html` — interactive design reference (open in browser; use Preview controls to see List/Detail/roles/list-states).
