'use client';

import React from 'react';
import { SidebarFooter } from '../../ui/sidebar';
import { SidebarNavItem } from './SidebarNavItem';

export default function SidebarFooterComponent({
  sidebarFooter,
}: {
  sidebarFooter: {
    id: string;
    title: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }[];
  isCollapsed: boolean;
}) {
  return (
    <SidebarFooter className='border-none px-3 py-2'>
      <ul className='w-full space-y-1'>
        {sidebarFooter.map(item => (
          <SidebarNavItem
            key={item.id}
            title={item.title}
            icon={item.icon}
            disabled={item.disabled}
            onClick={item.onClick}
            className='h-10'
          />
        ))}
      </ul>
    </SidebarFooter>
  );
}
