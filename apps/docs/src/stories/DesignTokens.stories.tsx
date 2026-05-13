import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ComponentIqProvider, componentIqThemes } from 'componentiq';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function TokenRow({ name, value, children }: { name: string; value: string; children: React.ReactNode }) {
  return (
    <div className='flex items-center gap-[var(--spacing-md)] py-[var(--spacing-sm)] border-b border-[color:var(--border-subtle)] last:border-0'>
      <div className='shrink-0'>{children}</div>
      <div className='min-w-0 flex-1'>
        <p className='text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] font-mono text-[color:var(--text-paragraph)]'>{name}</p>
        <p className='text-[length:var(--font-size-xs)] text-[color:var(--text-muted)] font-[family-name:var(--font-rubik)]'>{value}</p>
      </div>
    </div>
  );
}

function Swatch({ bg, border }: { bg: string; border?: boolean }) {
  return (
    <div
      className={`size-10 rounded-[var(--radius-md)] shrink-0 ${border ? 'border border-[color:var(--border-subtle)]' : ''}`}
      style={{ background: bg }}
    />
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className='space-y-[var(--spacing-sm)]'>
      <div>
        <h3 className='text-[length:var(--font-size-heading-6)] font-[var(--font-weight-bold)] font-[family-name:var(--font-heading)] text-[color:var(--text-title)]'>{title}</h3>
        {description && <p className='text-[length:var(--font-size-sm)] text-[color:var(--text-secondary)] font-[family-name:var(--font-rubik)] mt-1'>{description}</p>}
      </div>
      <div className='rounded-[var(--radius-lg)] border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] px-[var(--spacing-md)] divide-y divide-[color:var(--border-subtle)]'>
        {children}
      </div>
    </section>
  );
}

// Placeholder component — tokens page doesn't need a real component
function TokensPage() { return null; }

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------
const meta = {
  title: 'Design System/Design Tokens',
  component: TokensPage,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Design tokens are the single source of truth for all visual decisions in the design system — colours, typography, spacing, border-radius, shadows, and motion.

## How tokens work

Every component in this library reads CSS custom properties (CSS variables) at runtime rather than hardcoding values. The \`ComponentIqProvider\` wrapper injects these variables as inline styles on a container \`<div>\`, making it trivial to retheme the entire system by passing a different tokens object.

\`\`\`
ComponentIqProvider (tokens prop → inline CSS vars)
  └── Your app
        └── Components (read CSS vars via var(--…))
\`\`\`

## Three layers

| Layer | File | Purpose |
|-------|------|---------|
| **Token contract** | \`packages/design-system/src/theme/tokens.ts\` | TypeScript interface — every possible token key |
| **Default values** | \`packages/design-system/src/theme/default-tokens.ts\` | The warm-earthy baseline (terracotta + teal) |
| **CSS mapping** | \`packages/design-system/src/theme/create-css-vars.ts\` | Converts token object → \`Record<\`--\${string}\`, string>\` |

## Using the provider

\`\`\`tsx
import { ComponentIqProvider, componentIqThemes } from 'componentiq';

// 1. Use a preset theme
<ComponentIqProvider tokens={componentIqThemes.default}>
  <App />
</ComponentIqProvider>

// 2. Override specific tokens
<ComponentIqProvider tokens={{
  ...componentIqThemes.default,
  colors: {
    ...componentIqThemes.default.colors,
    primary: '#6D28D9',   // purple brand
    focus:   '#6D28D9',
  },
}}>
  <App />
</ComponentIqProvider>

// 3. Nest providers for isolated regions
<ComponentIqProvider tokens={componentIqThemes.ocean}>
  <Sidebar />     {/* teal theme */}
</ComponentIqProvider>
\`\`\`

## CSS variable naming

The provider maps token keys to CSS vars following a predictable pattern:

| Token key | CSS variable |
|-----------|-------------|
| \`colors.primary\` | \`--color-primary\` |
| \`colors.surface\` | \`--bg-surface\` |
| \`colors.border\` | \`--border-default\` |
| \`colors.error\` | \`--helper-error\` |
| \`typography.fontFamily\` | \`--font-rubik\` |
| \`spacing.md\` | \`--spacing-md\` |
| \`radius.md\` | \`--radius-md\` |
| \`shadows.md\` | \`--shadow-md\` |
| \`motion.normal\` | \`--motion-normal\` |

Components reference these directly in their Tailwind classes:

\`\`\`tsx
// Input border — reads the CSS var injected by ComponentIqProvider
className='border-[color:var(--border-default)]'

// Checked fill — uses primary brand colour from the token
className='data-[state=checked]:bg-[color:var(--color-primary)]'

// Spacing — type-safe, scales with the token
className='px-[var(--spacing-md)]'
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TokensPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Live token showcase
// ---------------------------------------------------------------------------
const t = componentIqThemes.default;

export const Colors: Story = {
  render: () => (
    <div className='space-y-[var(--spacing-lg)] max-w-2xl'>
      <Section title='Brand colours' description='Primary and secondary drive all interactive states — selected borders, checked fills, focus rings.'>
        <TokenRow name='colors.primary → --color-primary' value={t.colors.primary}>
          <Swatch bg={t.colors.primary} />
        </TokenRow>
        <TokenRow name='colors.primaryForeground → --color-primary-fg' value={t.colors.primaryForeground!}>
          <Swatch bg={t.colors.primaryForeground!} border />
        </TokenRow>
        <TokenRow name='colors.secondary → --color-secondary' value={t.colors.secondary!}>
          <Swatch bg={t.colors.secondary!} />
        </TokenRow>
      </Section>

      <Section title='Backgrounds' description='Surface-level backgrounds give depth to cards, inputs, and hover states.'>
        <TokenRow name='colors.background → --bg-default' value={t.colors.background!}>
          <Swatch bg={t.colors.background!} border />
        </TokenRow>
        <TokenRow name='colors.surface → --bg-surface' value={t.colors.surface!}>
          <Swatch bg={t.colors.surface!} border />
        </TokenRow>
        <TokenRow name='colors.secondaryBackground → --bg-secondary' value={t.colors.secondaryBackground!}>
          <Swatch bg={t.colors.secondaryBackground!} border />
        </TokenRow>
        <TokenRow name='colors.hover → --bg-hover' value={t.colors.hover!}>
          <Swatch bg={t.colors.hover!} border />
        </TokenRow>
      </Section>

      <Section title='Text colours' description='A hierarchy of text shades ensures readable contrast at every level.'>
        <TokenRow name='colors.title → --text-title' value={t.colors.title!}>
          <Swatch bg={t.colors.title!} />
        </TokenRow>
        <TokenRow name='colors.foreground → --text-paragraph' value={t.colors.foreground!}>
          <Swatch bg={t.colors.foreground!} />
        </TokenRow>
        <TokenRow name='colors.textSecondary → --text-secondary' value={t.colors.textSecondary!}>
          <Swatch bg={t.colors.textSecondary!} />
        </TokenRow>
        <TokenRow name='colors.textMuted → --text-muted' value={t.colors.textMuted!}>
          <Swatch bg={t.colors.textMuted!} />
        </TokenRow>
        <TokenRow name='colors.textDisabled → --text-disabled' value={t.colors.textDisabled!}>
          <Swatch bg={t.colors.textDisabled!} border />
        </TokenRow>
      </Section>

      <Section title='Borders' description='Three border weights — subtle outlines, default borders, and focused/active rings.'>
        <TokenRow name='colors.borderSubtle → --border-subtle' value={t.colors.borderSubtle!}>
          <Swatch bg={t.colors.borderSubtle!} border />
        </TokenRow>
        <TokenRow name='colors.border → --border-default' value={t.colors.border!}>
          <Swatch bg={t.colors.border!} />
        </TokenRow>
        <TokenRow name='colors.focus → --border-focus' value={t.colors.focus!}>
          <Swatch bg={t.colors.focus!} />
        </TokenRow>
      </Section>

      <Section title='Status colours' description='Semantic colours for validation feedback. Each also has a pastel background companion (e.g. --helper-error-pastel).'>
        <TokenRow name='colors.error → --helper-error' value={t.colors.error!}>
          <Swatch bg={t.colors.error!} />
        </TokenRow>
        <TokenRow name='colors.warning → --helper-warning' value={t.colors.warning!}>
          <Swatch bg={t.colors.warning!} />
        </TokenRow>
        <TokenRow name='colors.success → --helper-success' value={t.colors.success!}>
          <Swatch bg={t.colors.success!} />
        </TokenRow>
        <TokenRow name='colors.information → --helper-information' value={t.colors.information!}>
          <Swatch bg={t.colors.information!} />
        </TokenRow>
      </Section>
    </div>
  ),
  parameters: { layout: 'padded' },
};

export const Typography: Story = {
  render: () => {
    const typ = t.typography;
    return (
      <div className='space-y-[var(--spacing-lg)] max-w-2xl'>
        <Section title='Font families' description='--font-rubik (body), --font-heading (titles), --font-mono (code).'>
          <TokenRow name='typography.fontFamily → --font-rubik' value={typ.fontFamily}>
            <span className='text-[length:var(--font-size-lg)] font-[family-name:var(--font-rubik)] text-[color:var(--text-title)]'>Aa</span>
          </TokenRow>
          <TokenRow name='typography.monoFontFamily → --font-mono' value={typ.monoFontFamily}>
            <span className='text-[length:var(--font-size-lg)] font-mono text-[color:var(--text-title)]'>Aa</span>
          </TokenRow>
        </Section>

        <Section title='Font sizes' description="All sizes are rem-based so they respect the user's browser font-size preference.">
          {([
            ['heading-1', typ.heading1Size],
            ['heading-2', typ.heading2Size],
            ['heading-3', typ.heading3Size],
            ['heading-4', typ.heading4Size],
            ['heading-5', typ.heading5Size],
            ['heading-6', typ.heading6Size],
            ['body (lg)', typ.largeFontSize],
            ['body', typ.bodySize],
            ['label (sm)', typ.labelSize],
            ['caption (xs)', typ.captionSize],
          ] as [string, string][]).map(([name, val]) => (
            <TokenRow key={name} name={`typography → --font-size-${name.replace(' ', '-')}`} value={val}>
              <span style={{ fontSize: val }} className='font-[family-name:var(--font-rubik)] text-[color:var(--text-title)] leading-none'>Aa</span>
            </TokenRow>
          ))}
        </Section>

        <Section title='Font weights' description='Used by components for hierarchy — bold for headings, medium for labels, regular for body.'>
          <TokenRow name='typography.headingWeight → --font-weight-bold' value={String(typ.headingWeight)}>
            <span style={{ fontWeight: typ.headingWeight }} className='text-[length:var(--font-size-lg)] font-[family-name:var(--font-rubik)] text-[color:var(--text-title)]'>Bold</span>
          </TokenRow>
          <TokenRow name='typography.mediumWeight → --font-weight-medium' value={String(typ.mediumWeight)}>
            <span style={{ fontWeight: typ.mediumWeight }} className='text-[length:var(--font-size-lg)] font-[family-name:var(--font-rubik)] text-[color:var(--text-title)]'>Medium</span>
          </TokenRow>
          <TokenRow name='typography.bodyWeight → --font-weight-regular' value={String(typ.bodyWeight)}>
            <span style={{ fontWeight: typ.bodyWeight }} className='text-[length:var(--font-size-lg)] font-[family-name:var(--font-rubik)] text-[color:var(--text-title)]'>Regular</span>
          </TokenRow>
        </Section>
      </div>
    );
  },
  parameters: { layout: 'padded' },
};

export const SpacingAndRadius: Story = {
  render: () => {
    const sp = t.spacing!;
    const r  = t.radius!;
    return (
      <div className='space-y-[var(--spacing-lg)] max-w-2xl'>
        <Section title='Spacing' description='Token-driven spacing keeps component padding and gaps consistent. Every component uses var(--spacing-*) rather than raw pixel values.'>
          {(Object.entries(sp) as [string, string][]).map(([key, val]) => (
            <TokenRow key={key} name={`spacing.${key} → --spacing-${key}`} value={val}>
              <div className='bg-[color:var(--color-primary)] rounded-sm shrink-0' style={{ width: val, height: '16px', minWidth: '4px' }} />
            </TokenRow>
          ))}
        </Section>

        <Section title='Border radius' description='Consistent rounding across all interactive elements — from subtle (sm) to pill (full).'>
          {(Object.entries(r) as [string, string][]).map(([key, val]) => (
            <TokenRow key={key} name={`radius.${key} → --radius-${key}`} value={val}>
              <div className='size-10 bg-[color:var(--color-primary)] shrink-0' style={{ borderRadius: val }} />
            </TokenRow>
          ))}
        </Section>
      </div>
    );
  },
  parameters: { layout: 'padded' },
};

export const ShadowsAndMotion: Story = {
  render: () => {
    const sh = t.shadows!;
    const mo = t.motion!;
    return (
      <div className='space-y-[var(--spacing-lg)] max-w-2xl'>
        <Section title='Shadows' description='Three elevation levels. Components like dropdowns and modals use shadow-md/lg for perceived depth.'>
          <TokenRow name='shadows.sm → --shadow-sm' value={sh.sm}>
            <div className='size-10 bg-[color:var(--bg-surface)] rounded-[var(--radius-md)] shrink-0' style={{ boxShadow: sh.sm }} />
          </TokenRow>
          <TokenRow name='shadows.md → --shadow-md' value={sh.md}>
            <div className='size-10 bg-[color:var(--bg-surface)] rounded-[var(--radius-md)] shrink-0' style={{ boxShadow: sh.md }} />
          </TokenRow>
          <TokenRow name='shadows.lg → --shadow-lg' value={sh.lg}>
            <div className='size-10 bg-[color:var(--bg-surface)] rounded-[var(--radius-md)] shrink-0' style={{ boxShadow: sh.lg }} />
          </TokenRow>
        </Section>

        <Section title='Motion' description='Duration tokens ensure transitions feel cohesive. All components use var(--motion-normal) for state transitions.'>
          {(Object.entries(mo) as [string, string][]).filter(([k]) => k !== 'easing').map(([key, val]) => (
            <TokenRow key={key} name={`motion.${key} → --motion-${key}`} value={val}>
              <div
                className='size-4 bg-[color:var(--color-primary)] rounded-full shrink-0 animate-pulse'
                style={{ animationDuration: val }}
              />
            </TokenRow>
          ))}
          <TokenRow name='motion.easing → --motion-easing' value={mo.easing}>
            <div className='size-4 bg-[color:var(--color-secondary)] rounded-full shrink-0' />
          </TokenRow>
        </Section>
      </div>
    );
  },
  parameters: { layout: 'padded' },
};

export const ThemePresets: Story = {
  render: () => (
    <div className='space-y-[var(--spacing-lg)]'>
      <p className='text-[length:var(--font-size-sm)] text-[color:var(--text-secondary)] font-[family-name:var(--font-rubik)] max-w-prose'>
        The library ships three preset themes. Pass any to <code className='font-mono bg-[color:var(--bg-secondary)] px-1 rounded'>ComponentIqProvider</code> or
        spread and override individual keys for bespoke branding.
      </p>
      <div className='grid grid-cols-1 gap-[var(--spacing-md)] sm:grid-cols-3'>
        {(Object.entries(componentIqThemes) as [keyof typeof componentIqThemes, typeof componentIqThemes.default][]).map(([name, tokens]) => (
          <ComponentIqProvider key={name} tokens={tokens} className='rounded-[var(--radius-lg)] border border-[color:var(--border-subtle)] p-[var(--spacing-md)] space-y-[var(--spacing-sm)]'>
            <p className='text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] font-[family-name:var(--font-rubik)] text-[color:var(--text-secondary)] capitalize'>{name}</p>
            <div className='flex gap-[var(--spacing-xs)]'>
              <div className='size-8 rounded-full' style={{ background: tokens.colors.primary }} />
              <div className='size-8 rounded-full' style={{ background: tokens.colors.secondary! }} />
              <div className='size-8 rounded-full border border-[color:var(--border-subtle)]' style={{ background: tokens.colors.surface! }} />
            </div>
            <p className='text-[length:var(--font-size-xs)] font-mono text-[color:var(--text-muted)]'>primary: {tokens.colors.primary}</p>
            <p className='text-[length:var(--font-size-xs)] font-mono text-[color:var(--text-muted)]'>secondary: {tokens.colors.secondary}</p>
            <p className='text-[length:var(--font-size-xs)] font-[family-name:var(--font-rubik)] text-[color:var(--text-muted)]'>font: {tokens.typography.fontFamily.split(',')[0]}</p>
          </ComponentIqProvider>
        ))}
      </div>
    </div>
  ),
  parameters: { layout: 'padded' },
};
