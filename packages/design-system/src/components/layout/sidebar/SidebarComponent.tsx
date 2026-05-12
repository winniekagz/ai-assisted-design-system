'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { cn } from '../../../lib/utils';
import { TooltipProvider } from '../../ui/tooltip';
import {
  BrandingProps,
  NavigationItem,
  SidebarCTAConfig,
  SidebarFooterItem,
  SidebarUserConfig,
  SidebarVariant,
} from '../dashboard-layout';
import { SidebarAvatarItem } from './SidebarAvatarItem';
import { SidebarCTA } from './SidebarCTA';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarSearch } from './SidebarSearch';
import { SidebarSection } from './SidebarSection';
import { SidebarUserFooter } from './SidebarUserFooter';

// ─── Variant tokens ───────────────────────────────────────────────────────────
// All sidebar components consume these CSS custom properties so swapping
// variants is purely a token change — no structural difference.

const variantTokens: Record<SidebarVariant, React.CSSProperties> = {
  executive: {
    '--sb-bg': 'var(--bg-surface)',
    '--sb-border': 'var(--border-subtle)',
    '--sb-active': 'var(--bg-hover)',
    '--sb-active-text': 'var(--text-title)',
    '--sb-hover': 'var(--bg-hover)',
    '--sb-muted': 'var(--text-muted)',
    '--sb-accent': 'var(--color-primary)',
    '--sb-badge-bg': 'var(--bg-secondary)',
    '--sb-radius': 'var(--radius-md)',
  } as React.CSSProperties,
  playful: {
    '--sb-bg': 'var(--bg-surface)',
    '--sb-border': 'transparent',
    '--sb-active': 'var(--color-primary)',
    '--sb-active-text': 'var(--text-inverse)',
    '--sb-hover': 'var(--bg-hover)',
    '--sb-muted': 'var(--text-muted)',
    '--sb-accent': 'var(--color-primary)',
    '--sb-badge-bg': 'var(--color-primary)',
    '--sb-radius': 'var(--radius-lg)',
  } as React.CSSProperties,
};

interface SidebarComponentProps {
  navigation: NavigationItem[];
  sidebarFooter?: SidebarFooterItem[];
  branding: BrandingProps;
  isCollapsed: boolean;
  onToggle: () => void;
  onNavigationChange?: (item: NavigationItem) => void;
  variant?: SidebarVariant;
  showSearch?: boolean;
  sidebarUser?: SidebarUserConfig;
  sidebarCTA?: SidebarCTAConfig;
}

const SidebarComponent: React.FC<SidebarComponentProps> = ({
  navigation,
  sidebarFooter,
  branding,
  isCollapsed,
  onToggle,
  onNavigationChange,
  variant = 'executive',
  showSearch,
  sidebarUser,
  sidebarCTA,
}) => {
  const [activeItem, setActiveItem] = useState<string>('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleItemClick = useCallback(
    (item: NavigationItem) => {
      if (item.children) {
        setExpandedItems(prev => {
          const next = new Set(prev);
          next.has(item.id) ? next.delete(item.id) : next.add(item.id);
          return next;
        });
      } else if (item.href) {
        setActiveItem(item.id);
        onNavigationChange?.(item);
      }
    },
    [onNavigationChange]
  );

  // Group consecutive navigation items by their `section` label
  const sections = groupBySections(navigation);

  return (
    <TooltipProvider delayDuration={200}>
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--sb-border)]',
        'bg-[color:var(--sb-bg)] shadow-[var(--shadow-sm)]'
      )}
      style={variantTokens[variant]}
    >
      {/* ── Header ── */}
      <div className={cn('flex items-center gap-3 px-4 py-4', isCollapsed && 'justify-center px-2')}>
        <div className='flex items-center gap-3 min-w-0'>
          {branding.logo}
          {!isCollapsed && branding.title && (
            <span className='truncate text-[length:var(--font-size-body-sm)] font-semibold text-[color:var(--text-title)] [font-family:var(--font-heading)]'>
              {branding.title}
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className={cn(
            'ml-auto flex size-6 shrink-0 items-center justify-center rounded text-[color:var(--text-muted)] hover:text-[color:var(--text-title)] transition-colors',
            isCollapsed && 'ml-0'
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className='size-4' /> : <ChevronLeft className='size-4' />}
        </button>
      </div>

      {/* ── Search ── */}
      {showSearch && <SidebarSearch isCollapsed={isCollapsed} shortcut='⌘S' />}

      {/* ── Navigation ── */}
      <nav className='flex-1 overflow-y-auto px-2 py-2'>
        {sections.map((section, si) => (
          <SidebarSection
            key={section.label ?? `__no-section-${si}`}
            label={section.label}
            isCollapsed={isCollapsed}
          >
            {section.items.map(item =>
              item.type === 'avatar'
                ? (
                  <SidebarAvatarItem
                    key={item.id}
                    name={item.title}
                    src={item.avatarSrc}
                    fallback={item.avatarFallback}
                    badge={item.badge}
                    active={activeItem === item.id}
                    isCollapsed={isCollapsed}
                    onClick={() => handleItemClick(item)}
                  />
                )
                : (
                  <React.Fragment key={item.id}>
                    <SidebarNavItem
                      icon={item.icon}
                      title={item.title}
                      active={activeItem === item.id}
                      disabled={item.disabled}
                      badge={item.badge}
                      expandable={!!item.children?.length}
                      expanded={expandedItems.has(item.id)}
                      isCollapsed={isCollapsed}
                      onClick={() => handleItemClick(item)}
                    />
                    {item.children?.length && expandedItems.has(item.id) && !isCollapsed && (
                      <div className='flex flex-col gap-0.5 pb-1'>
                        {item.children.map(child => (
                          <SidebarNavItem
                            key={child.id}
                            icon={child.icon}
                            title={child.title}
                            active={activeItem === child.id}
                            disabled={child.disabled}
                            badge={child.badge}
                            level={1}
                            onClick={() => handleItemClick(child)}
                          />
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                )
            )}
          </SidebarSection>
        ))}
      </nav>

      {/* ── Footer items ── */}
      {sidebarFooter?.length ? (
        <div className='border-t border-[color:var(--sb-border,var(--border-subtle))] px-2 py-2'>
          {sidebarFooter.map(item => (
            <SidebarNavItem
              key={item.id}
              icon={item.icon}
              title={item.title}
              disabled={item.disabled}
              isCollapsed={isCollapsed}
              onClick={item.onClick}
            />
          ))}
        </div>
      ) : null}

      {/* ── CTA card ── */}
      {sidebarCTA && (
        <SidebarCTA
          title={sidebarCTA.title}
          description={sidebarCTA.description}
          action={sidebarCTA.action}
          onAction={sidebarCTA.onAction}
          isCollapsed={isCollapsed}
        />
      )}

      {/* ── User footer ── */}
      {sidebarUser && (
        <div className='border-t border-[color:var(--sb-border,var(--border-subtle))]'>
          <SidebarUserFooter
            name={sidebarUser.name}
            role={sidebarUser.role}
            avatarSrc={sidebarUser.avatarSrc}
            avatarFallback={sidebarUser.avatarFallback}
            progress={sidebarUser.progress}
            progressLabel={sidebarUser.progressLabel}
            isCollapsed={isCollapsed}
          />
        </div>
      )}
    </div>
    </TooltipProvider>
  );
};

export default SidebarComponent;

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface NavSection {
  label?: string;
  items: NavigationItem[];
}

function groupBySections(items: NavigationItem[]): NavSection[] {
  const sections: NavSection[] = [];
  let current: NavSection = { items: [] };

  for (const item of items) {
    if (item.section !== current.label) {
      if (current.items.length) sections.push(current);
      current = { label: item.section, items: [item] };
    } else {
      current.items.push(item);
    }
  }
  if (current.items.length) sections.push(current);
  return sections;
}
