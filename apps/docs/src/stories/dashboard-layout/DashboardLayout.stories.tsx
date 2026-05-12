import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  BarChart3,
  Bell,
  Briefcase,
  CheckCircle2,
  CreditCard,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Link2,
  LogOut,
  Package,
  Settings,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

import {
  DashboardLayout,
  NavigationItem,
  SidebarFooterItem,
  SidebarPanel,
} from '@/components/layout';
import { Badge } from '@/components/ui/badge/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const logo = (letter: string, color = 'var(--color-primary)') => (
  <div
    className='flex size-8 shrink-0 items-center justify-center rounded-lg text-white font-bold text-sm'
    style={{ background: color }}
  >
    {letter}
  </div>
);

function PageContent({ title = 'Dashboard', subtitle }: { title?: string; subtitle?: string }) {
  return (
    <div className='space-y-6'>
      <div>
        <Typography variant='h3'>{title}</Typography>
        {subtitle && <Typography variant='body2' textColor='muted'>{subtitle}</Typography>}
      </div>
      <div className='grid gap-4 md:grid-cols-3'>
        {[
          { label: 'Revenue', value: '$48,295', change: '+12%' },
          { label: 'Active users', value: '3,291', change: '+4%' },
          { label: 'Components', value: '47', change: '+3' },
        ].map(m => (
          <Card key={m.label} className='border border-border bg-card'>
            <CardHeader>
              <CardTitle className='text-sm font-medium text-muted-foreground'>{m.label}</CardTitle>
            </CardHeader>
            <CardContent className='flex items-end justify-between'>
              <p className='text-2xl font-bold'>{m.value}</p>
              <Badge variant='pastel' status='success'>{m.change}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className='border border-border bg-card'>
        <CardContent className='p-8 text-center text-muted-foreground text-sm'>
          Page content renders here
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Navigation configs ───────────────────────────────────────────────────────

// 1 · Mercoa-style (minimal executive, no sections)
const mercoaNav: NavigationItem[] = [
  { id: 'dashboard',   title: 'Dashboard',    href: '#', icon: <LayoutDashboard className='size-4' /> },
  { id: 'accounts',    title: 'Accounts',     href: '#', icon: <Wallet className='size-4' /> },
  { id: 'cards',       title: 'Cards',        href: '#', icon: <CreditCard className='size-4' /> },
  { id: 'transaction', title: 'Transaction',  href: '#', icon: <FileText className='size-4' /> },
  { id: 'spend',       title: 'Spend Groups', href: '#', icon: <Tag className='size-4' /> },
  { id: 'insights',    title: 'Insights',     href: '#', icon: <Sparkles className='size-4' /> },
  { id: 'payees',      title: 'Payees',       href: '#', icon: <Users className='size-4' /> },
  { id: 'invoices',    title: 'Invoices',     href: '#', icon: <Package className='size-4' /> },
  { id: 'connect',     title: 'Connections',  href: '#', icon: <Link2 className='size-4' /> },
];
const mercoaFooter: SidebarFooterItem[] = [
  { id: 'help',     title: 'Help',     icon: <HelpCircle className='size-4' />, onClick: () => {} },
  { id: 'settings', title: 'Settings', icon: <Settings className='size-4' />,   onClick: () => {} },
];

// 2 · Prody-style (playful, sections, badges, CTA)
const prodyNav: NavigationItem[] = [
  { id: 'dash',       title: 'Dashboard',  href: '#', icon: <LayoutDashboard className='size-4' />, section: 'Main' },
  { id: 'projects',   title: 'Projects',   href: '#', icon: <Briefcase className='size-4' />,      section: 'Main', badge: '3/5' },
  { id: 'analytics',  title: 'Analytics',  href: '#', icon: <BarChart3 className='size-4' />,      section: 'Main' },
  { id: 'reports',    title: 'Reports',    href: '#', icon: <FileText className='size-4' />,       section: 'Main', badge: 'New' },
  { id: 'extensions', title: 'Extensions', href: '#', icon: <Zap className='size-4' />,            section: 'Main' },
  { id: 'companies',  title: 'Companies',  href: '#', icon: <Briefcase className='size-4' />,      section: 'People', badge: 17 },
  { id: 'people',     title: 'People',     href: '#', icon: <Users className='size-4' />,          section: 'People', badge: 164 },
];
const prodyFooter: SidebarFooterItem[] = [
  { id: 'help',  title: 'Help center',   icon: <HelpCircle className='size-4' />, onClick: () => {} },
  { id: 'notif', title: 'Notifications', icon: <Bell className='size-4' />,       onClick: () => {} },
];

// 3 · Grouped + avatar list
const groupedNav: NavigationItem[] = [
  { id: 'dash',      title: 'Dashboard',    href: '#', icon: <LayoutDashboard className='size-4' />, section: 'Main' },
  { id: 'contracts', title: 'Contracts',    href: '#', icon: <FileText className='size-4' />,       section: 'Main' },
  { id: 'payments',  title: 'Payments',     href: '#', icon: <Wallet className='size-4' />,         section: 'Main' },
  { id: 'notif',     title: 'Notifications',href: '#', icon: <Bell className='size-4' />,           section: 'Main' },
  { id: 'ester',  title: 'Ester Howard', type: 'avatar', avatarFallback: 'EH', section: 'Messages' },
  { id: 'jacob',  title: 'Jacob Jones',  type: 'avatar', avatarFallback: 'JJ', section: 'Messages' },
  { id: 'cody',   title: 'Cody Fisher',  type: 'avatar', avatarFallback: 'CF', section: 'Messages' },
];

// 4 · SaaS / enterprise (collapsible sub-items)
const saasNav: NavigationItem[] = [
  { id: 'dash', title: 'Dashboard', href: '#', icon: <LayoutDashboard className='size-4' />, section: 'Overview' },
  {
    id: 'products', title: 'Products', icon: <ShoppingCart className='size-4' />, section: 'Catalog',
    children: [
      { id: 'all-products', title: 'All products', href: '#' },
      { id: 'inventory',    title: 'Inventory',    href: '#' },
      { id: 'pricing',      title: 'Pricing',      href: '#' },
    ],
  },
  { id: 'customers', title: 'Customers', href: '#', icon: <Users className='size-4' />,       section: 'Catalog', badge: 12 },
  { id: 'orders',    title: 'Orders',    href: '#', icon: <Package className='size-4' />,     section: 'Catalog', badge: 3  },
  { id: 'analytics', title: 'Analytics', href: '#', icon: <BarChart3 className='size-4' />,   section: 'Insights' },
  { id: 'reports',   title: 'Reports',   href: '#', icon: <FileText className='size-4' />,    section: 'Insights' },
  { id: 'security',  title: 'Security',  href: '#', icon: <Shield className='size-4' />,      section: 'Settings' },
  { id: 'settings',  title: 'Settings',  href: '#', icon: <Settings className='size-4' />,    section: 'Settings' },
];
const saasFooter: SidebarFooterItem[] = [
  { id: 'help',   title: 'Help center', icon: <HelpCircle className='size-4' />, onClick: () => {} },
  { id: 'logout', title: 'Log out',     icon: <LogOut className='size-4' />,     onClick: () => {} },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/Layout/DashboardLayout',
  component: DashboardLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Full-page shell combining a collapsible token-driven sidebar with an optional top navigation bar.

Two personalities share the same component tree — only the CSS token set changes:

| Variant | Active state | Radius | Best for |
|---|---|---|---|
| \`executive\` | Subtle gray fill | \`radius-md\` | Finance, enterprise, B2B SaaS |
| \`playful\` | Primary-colour pill | \`radius-lg\` | Product tools, consumer apps |

### Sidebar slots
| Prop | What it adds |
|---|---|
| \`showSearch\` | Inline search field below the brand |
| \`sidebarUser\` | User avatar + name + role + optional progress bar |
| \`sidebarCTA\` | Upgrade / onboarding card (playful variant) |
| \`sidebarFooter\` | Utility links (help, settings, logout) above the user row |

### Navigation sections & item types
\`\`\`tsx
const nav: NavigationItem[] = [
  // Regular item with badge
  { id: 'orders', title: 'Orders', icon: <Package />, badge: 3, section: 'Catalog' },

  // Expandable group
  { id: 'products', title: 'Products', icon: <ShoppingCart />, section: 'Catalog',
    children: [{ id: 'all', title: 'All products', href: '/products' }] },

  // Avatar row (contact / message thread)
  { id: 'ester', title: 'Ester Howard', type: 'avatar', avatarFallback: 'EH', section: 'Messages' },
];
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['executive', 'playful'],
      description: 'Sidebar personality — swaps active-state tokens and border radius.',
      table: { type: { summary: "'executive' | 'playful'" }, defaultValue: { summary: "'executive'" } },
    },
    showSearch:  { control: 'boolean', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    showTopNav:  { control: 'boolean', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true'  } } },
    navigation:        { table: { disable: true } },
    branding:          { table: { disable: true } },
    sidebarFooter:     { table: { disable: true } },
    sidebarUser:       { table: { disable: true } },
    sidebarCTA:        { table: { disable: true } },
    onNavigationChange:{ table: { disable: true } },
  },
} satisfies Meta<typeof DashboardLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Individual layout stories ────────────────────────────────────────────────

/** Clean, minimal executive sidebar — flat nav, user header, help + settings at the bottom. Inspired by Mercoa. */
export const Executive: Story = {
  render: () => (
    <DashboardLayout
      variant='executive'
      branding={{ logo: logo('K'), title: 'Kevin Dukkon' }}
      navigation={{ navigation: mercoaNav }}
      sidebarFooter={mercoaFooter}
      showSearch
      showTopNav={false}
      sidebarUser={{ name: 'Kevin Dukkon', role: 'hey@kevdu.co' }}
    >
      <PageContent title='Dashboard' subtitle='Welcome back, Kevin' />
    </DashboardLayout>
  ),
  parameters: { docs: { description: { story: 'Flat, no-section navigation with user profile at the bottom. No top nav — sidebar-only wayfinding.' } } },
};

/** Bold primary active pills, section labels, badge counts, search, CTA card. Inspired by Prody. */
export const Playful: Story = {
  render: () => (
    <DashboardLayout
      variant='playful'
      branding={{ logo: logo('P', '#E85D4A'), title: 'Prody' }}
      navigation={{ navigation: prodyNav }}
      sidebarFooter={prodyFooter}
      showSearch
      sidebarUser={{
        name: 'Ember Crest',
        role: 'ember@prody.io',
        progress: 60,
        progressLabel: 'Starter — 3 of 5 projects created',
      }}
      sidebarCTA={{
        title: 'Get full access 🚀',
        description: 'Unlock unlimited projects and team seats.',
        action: 'Upgrade plan',
      }}
    >
      <PageContent title='Dashboard' subtitle='Your projects at a glance' />
    </DashboardLayout>
  ),
  parameters: { docs: { description: { story: 'Bold primary-filled active items, section labels, badge counts, user progress and CTA upgrade card.' } } },
};

/** Section labels (MAIN / MESSAGES) with avatar rows for a contact list. */
export const WithAvatarSections: Story = {
  render: () => (
    <DashboardLayout
      variant='executive'
      branding={{ logo: logo('C'), title: 'ComponentIQ' }}
      navigation={{ navigation: groupedNav }}
      showSearch
      showTopNav={false}
      sidebarUser={{ name: 'John Doe', role: 'Designer' }}
    >
      <PageContent title='Dashboard' />
    </DashboardLayout>
  ),
  parameters: { docs: { description: { story: 'MAIN section has standard nav items; MESSAGES section renders avatar rows — matching the grouped sidebar pattern.' } } },
};

/** Full enterprise layout with nested sub-items, four sections, badges, and both top nav + sidebar. */
export const EnterpriseSaaS: Story = {
  render: () => (
    <DashboardLayout
      variant='executive'
      branding={{ logo: logo('S', '#6366F1'), title: 'Storefront' }}
      navigation={{ navigation: saasNav }}
      sidebarFooter={saasFooter}
      showSearch
      sidebarUser={{ name: 'Sarah Chen', role: 'Admin' }}
    >
      <PageContent title='Products' subtitle='Manage your catalog' />
    </DashboardLayout>
  ),
  parameters: { docs: { description: { story: 'Four navigation sections with collapsible sub-items (Products), badge counts on Orders and Customers, and a footer with help + logout.' } } },
};

/** No top nav — pure sidebar navigation for data-dense apps. */
export const SidebarOnly: Story = {
  render: () => (
    <DashboardLayout
      variant='executive'
      branding={{ logo: logo('M', '#10B981'), title: 'Mercoa' }}
      navigation={{ navigation: mercoaNav }}
      sidebarFooter={mercoaFooter}
      showTopNav={false}
      sidebarUser={{ name: 'Kevin Dukkon', role: 'hey@kevdu.co' }}
    >
      <PageContent title='Transactions' />
    </DashboardLayout>
  ),
  parameters: { docs: { description: { story: 'Set `showTopNav={false}` when the sidebar is the sole wayfinding element — common in finance and data apps.' } } },
};

// ─── Side-by-side comparison (expanded ↔ collapsed) ──────────────────────────

/** Shows both expanded and icon-only collapsed states simultaneously — use this to review collapse behaviour. */
export const ExpandedVsCollapsed: Story = {
  render: () => (
    <div className='flex h-screen gap-6 bg-[color:var(--bg-secondary)] p-6'>
      {/* Expanded */}
      <div className='flex flex-col gap-3'>
        <span className='text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]'>Expanded — 256 px</span>
        <div className='h-[600px] w-64'>
          <SidebarPanel
            variant='executive'
            branding={{ logo: logo('K'), title: 'Kevin Dukkon' }}
            navigation={mercoaNav}
            sidebarFooter={mercoaFooter}
            sidebarUser={{ name: 'Kevin Dukkon', role: 'hey@kevdu.co' }}
            showSearch
            isCollapsed={false}
            onToggle={() => {}}
          />
        </div>
      </div>
      {/* Collapsed */}
      <div className='flex flex-col gap-3'>
        <span className='text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]'>Collapsed — 64 px</span>
        <div className='h-[600px] w-16'>
          <SidebarPanel
            variant='executive'
            branding={{ logo: logo('K'), title: 'Kevin Dukkon' }}
            navigation={mercoaNav}
            sidebarFooter={mercoaFooter}
            sidebarUser={{ name: 'Kevin Dukkon', role: 'hey@kevdu.co' }}
            isCollapsed
            onToggle={() => {}}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: { description: { story: 'Expanded (256 px) and collapsed (64 px icon-only) states rendered side by side. Click the chevron inside either panel to interact.' } },
  },
};

// ─── Variant comparison (executive ↔ playful) ─────────────────────────────────

/** Two sidebars with the same navigation, different personality tokens — executive vs playful. */
export const ExecutiveVsPlayful: Story = {
  render: () => (
    <div className='flex h-screen gap-6 bg-[color:var(--bg-secondary)] p-6 overflow-auto'>
      {(['executive', 'playful'] as const).map(variant => (
        <div key={variant} className='flex flex-col gap-3'>
          <span className='text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]'>{variant}</span>
          <div className='h-[680px] w-64'>
            <SidebarPanel
              variant={variant}
              branding={
                variant === 'playful'
                  ? { logo: logo('P', '#E85D4A'), title: 'Prody' }
                  : { logo: logo('K'), title: 'ComponentIQ' }
              }
              navigation={prodyNav}
              sidebarFooter={prodyFooter}
              showSearch
              isCollapsed={false}
              onToggle={() => {}}
              sidebarUser={
                variant === 'playful'
                  ? { name: 'Ember Crest', role: 'ember@prody.io', progress: 60, progressLabel: 'Starter — 3 of 5 projects' }
                  : { name: 'Ember Crest', role: 'ember@prody.io' }
              }
              sidebarCTA={
                variant === 'playful'
                  ? { title: 'Get full access 🚀', description: 'Unlock unlimited projects.', action: 'Upgrade plan' }
                  : undefined
              }
            />
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: { description: { story: 'Identical navigation rendered with `executive` and `playful` tokens side by side. The only difference is the `variant` prop.' } },
  },
};

// ─── Multi-panel (Pantera Capital style) ──────────────────────────────────────

const panteraLenderNav: NavigationItem[] = [
  { id: 'activity',  title: 'Activity',  href: '#', icon: <Bell className='size-4' />,          badge: 4 },
  { id: 'dashboard', title: 'Dashboard', href: '#', icon: <LayoutDashboard className='size-4' /> },
  { id: 'deals',     title: 'Deal feed', href: '#', icon: <Tag className='size-4' /> },
  {
    id: 'portfolio', title: 'Portfolio', icon: <Briefcase className='size-4' />,
    children: [
      { id: 'overview', title: 'Overview',      href: '#' },
      { id: 'live',     title: 'Live deals',    href: '#' },
      { id: 'pending',  title: 'Pending deals', href: '#' },
      { id: 'matured',  title: 'Matured',       href: '#' },
    ],
  },
  { id: 'thesis',  title: 'Investment thesis', href: '#', icon: <Star className='size-4' /> },
  { id: 'wallets', title: 'Wallets',           href: '#', icon: <Wallet className='size-4' />, badge: 2 },
];

const panteraBorrowerNav: NavigationItem[] = [
  { id: 'activity',  title: 'Activity',   href: '#', icon: <Bell className='size-4' />,         badge: 4 },
  { id: 'dashboard', title: 'Dashboard',  href: '#', icon: <LayoutDashboard className='size-4' /> },
  { id: 'deals',     title: 'Deals',      href: '#', icon: <Tag className='size-4' /> },
  { id: 'wallets',   title: 'Wallets',    href: '#', icon: <Wallet className='size-4' />,        badge: 2 },
  { id: 'scorecard', title: 'Score card', href: '#', icon: <CheckCircle2 className='size-4' /> },
  { id: 'funded',    title: 'Get funded', href: '#', icon: <Zap className='size-4' /> },
];

const companyNav: NavigationItem[] = [
  { id: 'info',    title: 'Company info',     href: '#', icon: <Briefcase className='size-4' /> },
  { id: 'bank',    title: 'Bank account',     href: '#', icon: <Wallet className='size-4' /> },
  { id: 'members', title: 'Members',          href: '#', icon: <Users className='size-4' /> },
  { id: 'int',     title: 'Integration',      href: '#', icon: <Link2 className='size-4' /> },
  { id: 'payment', title: 'Payment gateway',  href: '#', icon: <CreditCard className='size-4' /> },
  { id: 'verify',  title: 'Verification',     href: '#', icon: <Shield className='size-4' /> },
  { id: 'quest',   title: 'Questionnaire',    href: '#', icon: <FileText className='size-4' /> },
  { id: 'terms',   title: 'Terms of business',href: '#', icon: <Package className='size-4' /> },
];

function PanelHeader({ name, subtitle, avatarLetter }: { name: string; subtitle: string; avatarLetter: string }) {
  return (
    <div className='flex items-center gap-3 border-b border-[color:var(--border-subtle)] px-4 py-4'>
      <div className='flex size-9 shrink-0 items-center justify-center rounded-lg bg-[color:var(--bg-secondary)] text-xs font-bold text-[color:var(--text-title)]'>
        {avatarLetter}
      </div>
      <div className='min-w-0'>
        <p className='truncate text-sm font-semibold text-[color:var(--text-title)]'>{name}</p>
        <p className='truncate text-xs text-[color:var(--text-muted)]'>{subtitle}</p>
      </div>
    </div>
  );
}

/** Three sidebar panels side by side — entity-level navigation pattern used in platforms like Pantera Capital. */
export const MultiPanel: Story = {
  render: () => (
    <div className='flex h-screen gap-0 bg-[color:var(--bg-secondary)]'>
      {/* Lender panel */}
      <div className='flex h-full w-56 flex-col overflow-hidden rounded-2xl m-4 shadow-sm bg-[color:var(--bg-surface)]'>
        <PanelHeader name='Pantera Capital' subtitle='Lender · Retail' avatarLetter='P' />
        <nav className='flex-1 overflow-y-auto px-2 py-3 space-y-0.5'>
          {panteraLenderNav.map(item => (
            <SidebarPanel
              key={item.id}
              variant='executive'
              branding={{ logo: <></> }}
              navigation={[item]}
              isCollapsed={false}
              onToggle={() => {}}
            />
          ))}
        </nav>
        <div className='border-t border-[color:var(--border-subtle)] px-4 py-3'>
          <div className='flex items-center gap-2'>
            <div className='flex size-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-primary)] text-[10px] font-bold text-white'>JT</div>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-xs font-semibold text-[color:var(--text-title)]'>Joe Turner</p>
              <p className='truncate text-[10px] text-[color:var(--text-muted)]'>joe.turner@pantera-...</p>
            </div>
          </div>
          <div className='mt-2 h-1 w-full rounded-full bg-[color:var(--bg-secondary)]'>
            <div className='h-full w-[70%] rounded-full bg-[color:var(--color-primary)]' />
          </div>
          <p className='mt-1 text-[10px] text-[color:var(--text-muted)]'>Complete your profile</p>
        </div>
      </div>

      {/* Borrower panel */}
      <div className='flex h-full w-56 flex-col overflow-hidden rounded-2xl m-4 ml-0 shadow-sm bg-[color:var(--bg-surface)]'>
        <PanelHeader name='SpaceBorn' subtitle='Borrower' avatarLetter='S' />
        <nav className='flex-1 overflow-y-auto px-2 py-3'>
          {panteraBorrowerNav.map(item => (
            <SidebarPanel
              key={item.id}
              variant='executive'
              branding={{ logo: <></> }}
              navigation={[item]}
              isCollapsed={false}
              onToggle={() => {}}
            />
          ))}
        </nav>
        <div className='border-t border-[color:var(--border-subtle)] px-4 py-3'>
          <div className='flex items-center gap-2'>
            <div className='flex size-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-primary)] text-[10px] font-bold text-white'>DF</div>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-xs font-semibold text-[color:var(--text-title)]'>Daniel Fleming</p>
              <p className='truncate text-[10px] text-[color:var(--text-muted)]'>fleming@spaceborn...</p>
            </div>
          </div>
          <div className='mt-2 h-1 w-full rounded-full bg-[color:var(--bg-secondary)]'>
            <div className='h-full w-1/2 rounded-full bg-[color:var(--color-primary)]' />
          </div>
          <p className='mt-1 text-[10px] text-[color:var(--text-muted)]'>Complete your profile</p>
        </div>
      </div>

      {/* Company settings panel */}
      <div className='flex h-full w-52 flex-col overflow-hidden rounded-2xl m-4 ml-0 shadow-sm bg-[color:var(--bg-surface)]'>
        <div className='border-b border-[color:var(--border-subtle)] px-4 py-4'>
          <p className='text-lg font-bold text-[color:var(--text-title)]'>Company</p>
        </div>
        <nav className='flex-1 overflow-y-auto px-2 py-3'>
          <SidebarPanel
            variant='executive'
            branding={{ logo: <></> }}
            navigation={companyNav}
            isCollapsed={false}
            onToggle={() => {}}
          />
        </nav>
      </div>

      {/* Main content placeholder */}
      <div className='flex-1 flex items-center justify-center text-[color:var(--text-muted)] text-sm'>
        Select an item to view
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: { description: { story: 'Three entity panels side by side — lender, borrower, and company settings — each with its own navigation and user footer. Common pattern in marketplace and platform products.' } },
  },
};

// ─── Custom layout ────────────────────────────────────────────────────────────

/**
 * Custom layout: design system documentation tool.
 * Combines executive variant with a two-column content area —
 * sidebar on the left, token browser on the right, component preview in the center.
 */
export const CustomDesignToolLayout: Story = {
  render: () => {
    const [active, setActive] = useState('components');

    const toolNav: NavigationItem[] = [
      { id: 'overview',   title: 'Overview',    href: '#', icon: <LayoutDashboard className='size-4' />, section: 'Design system' },
      { id: 'components', title: 'Components',  href: '#', icon: <Package className='size-4' />,       section: 'Design system', badge: 32 },
      { id: 'tokens',     title: 'Tokens',      href: '#', icon: <Sparkles className='size-4' />,      section: 'Design system' },
      { id: 'patterns',   title: 'Patterns',    href: '#', icon: <Star className='size-4' />,          section: 'Design system' },
      { id: 'governance', title: 'Governance',  href: '#', icon: <Shield className='size-4' />,        section: 'AI features' },
      { id: 'audit',      title: 'Audit',       href: '#', icon: <CheckCircle2 className='size-4' />,  section: 'AI features', badge: 3 },
    ];

    return (
      <div className='flex h-screen bg-[color:var(--bg-secondary)]'>
        {/* Left sidebar */}
        <div className='h-full w-56 shrink-0 p-3'>
          <SidebarPanel
            variant='executive'
            branding={{ logo: logo('C', '#6366F1'), title: 'ComponentIQ' }}
            navigation={toolNav}
            showSearch
            isCollapsed={false}
            onToggle={() => {}}
            sidebarUser={{ name: 'Winnie Kagendo', role: 'Design lead' }}
          />
        </div>

        {/* Center — component preview */}
        <div className='flex-1 overflow-auto p-6'>
          <div className='mb-4 flex items-center justify-between'>
            <Typography variant='h4'>Button</Typography>
            <div className='flex gap-2'>
              <Badge variant='pastel' status='stable'>Stable</Badge>
              <Badge variant='outlined' status='reviewed'>Reviewed</Badge>
              <Badge variant='outlined' status='complete'>Docs complete</Badge>
            </div>
          </div>
          <div className='grid gap-4'>
            <Card className='border border-border bg-card'>
              <CardHeader><CardTitle className='text-sm'>Live preview</CardTitle></CardHeader>
              <CardContent className='flex flex-wrap gap-3 p-6 bg-[color:var(--bg-default)] rounded-b-lg'>
                {['contained', 'outlined', 'text', 'destructive'].map(v => (
                  <button
                    key={v}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      v === 'contained'  ? 'bg-[color:var(--color-primary)] text-white' :
                      v === 'outlined'   ? 'border border-[color:var(--color-primary)] text-[color:var(--color-primary)] bg-transparent' :
                      v === 'text'       ? 'text-[color:var(--color-primary)] bg-transparent hover:bg-[color:var(--bg-hover)]' :
                      'bg-[color:var(--helper-error)] text-white'
                    }`}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </CardContent>
            </Card>
            <Card className='border border-border bg-card'>
              <CardHeader><CardTitle className='text-sm'>Usage notes</CardTitle></CardHeader>
              <CardContent className='text-sm text-muted-foreground space-y-2'>
                <p>Use <strong>contained</strong> for the primary action on a surface — one per view.</p>
                <p>Use <strong>outlined</strong> for secondary actions alongside a contained button.</p>
                <p>Use <strong>destructive</strong> for irreversible actions — confirm before applying.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right — token browser */}
        <div className='h-full w-64 shrink-0 overflow-y-auto border-l border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-4'>
          <p className='mb-3 text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]'>Tokens in use</p>
          <div className='space-y-3'>
            {[
              { name: '--color-primary',   value: '#6366F1', label: 'Fill / border' },
              { name: '--text-inverse',     value: '#FFFFFF', label: 'Label on fill' },
              { name: '--radius-md',        value: '6px',     label: 'Corner radius' },
              { name: '--spacing-md',       value: '16px',    label: 'Padding' },
              { name: '--motion-normal',    value: '200ms',   label: 'Transition' },
            ].map(t => (
              <div key={t.name} className='flex items-center gap-3 rounded-md bg-[color:var(--bg-secondary)] p-2'>
                <div
                  className='size-6 shrink-0 rounded border border-[color:var(--border-subtle)]'
                  style={{ background: /^#/.test(t.value) ? t.value : 'var(--bg-hover)' }}
                />
                <div className='min-w-0'>
                  <p className='truncate text-[10px] font-mono text-[color:var(--text-title)]'>{t.name}</p>
                  <p className='text-[10px] text-[color:var(--text-muted)]'>{t.label} · {t.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: `
Custom three-column design tool layout: executive sidebar on the left, component preview in the center, and a live token browser on the right.
Demonstrates how \`SidebarPanel\` can be dropped into any layout without \`DashboardLayout\`.
        `,
      },
    },
  },
};

// ─── All states gallery ───────────────────────────────────────────────────────

/** Renders every sidebar variant and state as a horizontal gallery — ideal for design reviews. */
export const AllStatesGallery: Story = {
  render: () => {
    const panels: Array<{
      label: string;
      width: number;
      collapsed?: boolean;
      node: React.ReactNode;
    }> = [
      {
        label: 'Executive · expanded',
        width: 256,
        node: (
          <SidebarPanel
            variant='executive'
            branding={{ logo: logo('K'), title: 'Kevin Dukkon' }}
            navigation={mercoaNav}
            sidebarFooter={mercoaFooter}
            sidebarUser={{ name: 'Kevin Dukkon', role: 'hey@kevdu.co' }}
            showSearch
            isCollapsed={false}
            onToggle={() => {}}
          />
        ),
      },
      {
        label: 'Executive · collapsed',
        width: 64,
        node: (
          <SidebarPanel
            variant='executive'
            branding={{ logo: logo('K'), title: 'Kevin Dukkon' }}
            navigation={mercoaNav}
            sidebarFooter={mercoaFooter}
            sidebarUser={{ name: 'Kevin Dukkon', role: 'hey@kevdu.co' }}
            isCollapsed
            onToggle={() => {}}
          />
        ),
      },
      {
        label: 'Playful · expanded',
        width: 256,
        node: (
          <SidebarPanel
            variant='playful'
            branding={{ logo: logo('P', '#E85D4A'), title: 'Prody' }}
            navigation={prodyNav}
            sidebarFooter={prodyFooter}
            showSearch
            sidebarUser={{ name: 'Ember Crest', role: 'ember@prody.io', progress: 60, progressLabel: 'Starter — 3 of 5 projects' }}
            sidebarCTA={{ title: 'Get full access 🚀', description: 'Unlock unlimited projects.', action: 'Upgrade plan' }}
            isCollapsed={false}
            onToggle={() => {}}
          />
        ),
      },
      {
        label: 'Sections + avatars',
        width: 256,
        node: (
          <SidebarPanel
            variant='executive'
            branding={{ logo: logo('C'), title: 'ComponentIQ' }}
            navigation={groupedNav}
            showSearch
            sidebarUser={{ name: 'John Doe', role: 'Designer' }}
            isCollapsed={false}
            onToggle={() => {}}
          />
        ),
      },
      {
        label: 'Enterprise SaaS',
        width: 256,
        node: (
          <SidebarPanel
            variant='executive'
            branding={{ logo: logo('S', '#6366F1'), title: 'Storefront' }}
            navigation={saasNav}
            sidebarFooter={saasFooter}
            showSearch
            sidebarUser={{ name: 'Sarah Chen', role: 'Admin' }}
            isCollapsed={false}
            onToggle={() => {}}
          />
        ),
      },
    ];

    return (
      <div className='min-h-screen bg-[color:var(--bg-secondary)] p-8'>
        <div className='mb-6'>
          <Typography variant='h4'>Layout states gallery</Typography>
          <Typography variant='body2' textColor='muted'>All sidebar variants and states — click to interact with each panel.</Typography>
        </div>
        <div className='flex flex-wrap gap-6 items-start'>
          {panels.map(p => (
            <div key={p.label} className='flex flex-col gap-2'>
              <span className='text-xs font-semibold uppercase tracking-wider text-[color:var(--text-muted)]'>{p.label}</span>
              <div className='h-[640px] overflow-hidden rounded-xl shadow-md' style={{ width: p.width }}>
                {p.node}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
    docs: { description: { story: 'Every sidebar variant and state rendered as a gallery. Each panel is interactive — click nav items, toggle collapse, etc.' } },
  },
};

