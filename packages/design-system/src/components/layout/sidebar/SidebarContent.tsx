'use client';

import React from 'react';
import { SidebarContent } from '../../ui/sidebar';
import { ScrollArea } from '../../ui/scroll-area';
import { NavigationItem } from '../dashboard-layout';

export default function SidebarContentComponent({
  navigation,
  renderNavigationItem,
}: {
  navigation: NavigationItem[];
  renderNavigationItem: (
    item: NavigationItem,
    level?: number
  ) => React.ReactNode;
  isCollapsed?: boolean;
  activeItem?: string;
  expandedItems?: Set<string>;
  handleItemClick?: (item: NavigationItem) => void;
}) {
  console.log('SidebarContentComponent navigation:', navigation);

  return (
    <SidebarContent className='border-none px-3 py-2'>
      <ScrollArea className='h-full px-3 py-4'>
        <div className='space-y-2'>
          {navigation?.length === 0 ? (
            <div className='text-sm text-gray-500'>No navigation items</div>
          ) : (
            navigation?.map(item => (
              <div
                key={item.id}
                className='w-full h-10 px-3 flex items-center gap-3 rounded hover:bg-primary/10 cursor-pointer'
              >
                {renderNavigationItem(item)}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </SidebarContent>
  );
}
