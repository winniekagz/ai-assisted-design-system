'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import React, { useCallback, useMemo, useState } from 'react';
import {
  BrandingProps,
  NavigationItem,
  SidebarFooterItem,
} from '../dashboard-layout';
import SidebarHeaderComponent from './SidebarHeader';
import SidebarContentComponent from './SidebarContent';
import { RenderNavigationItem } from './RenderNavigationItem';
import SidebarFooterComponent from './SidebarFooter';

interface SidebarProps {
  navigation: NavigationItem[];
  sidebarFooter?: SidebarFooterItem[];
  branding: BrandingProps;
  isCollapsed: boolean;
  onToggle: () => void;
  onNavigationChange?: (item: NavigationItem) => void;
}

const SidebarComponent: React.FC<SidebarProps> = ({
  navigation,
  sidebarFooter,
  branding,
  isCollapsed,
  onToggle,
  onNavigationChange,
}) => {
  const [activeItem, setActiveItem] = useState<string>('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  console.log(navigation, 'navigation in SidebarComponent');
  const handleItemClick = useCallback(
    (item: NavigationItem) => {
      if (item.children) {
        setExpandedItems(prev => {
          const newSet = new Set(prev);
          newSet.has(item.id) ? newSet.delete(item.id) : newSet.add(item.id);
          return newSet;
        });
      } else if (item.href) {
        setActiveItem(item.id);
        onNavigationChange?.(item);
      }
    },
    [onNavigationChange]
  );

  return (
    <Sidebar className={cn('w-[256px]', 'flex flex-col h-full border-none')}>
      <SidebarHeaderComponent
        branding={branding}
        isCollapsed={isCollapsed}
        onToggle={onToggle}
      />

      <SidebarContentComponent
        navigation={navigation}
        renderNavigationItem={(item, level = 0) =>
          RenderNavigationItem({
            item,
            level,
            handleItemClick,
            isCollapsed,
            activeItem,
            expandedItems,
          })
        }
        isCollapsed={isCollapsed}
        activeItem={activeItem}
        expandedItems={expandedItems}
        handleItemClick={handleItemClick}
      />

      {Array.isArray(sidebarFooter) && sidebarFooter.length > 0 && (
        <SidebarFooterComponent
          sidebarFooter={sidebarFooter}
          isCollapsed={isCollapsed}
        />
      )}
    </Sidebar>
  );
};

export default SidebarComponent;
