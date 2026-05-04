import React from 'react';
import { SidebarHeader } from '../../ui/sidebar';
import { Button } from '../../ui/button';
import { ChevronRight } from '../../../lib/icon-registry';
import { ChevronLeft } from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function SidebarHeaderComponent({
  isCollapsed,
  branding,
  onToggle,
}: {
  isCollapsed: boolean;
  branding: { logo: React.ReactNode };
  onToggle: () => void;
}) {
  return (
    <SidebarHeader className='border-none'>
      <div
        className={cn(
          'flex items-center',
          isCollapsed ? 'justify-center' : 'justify-between'
        )}
      >
        {!isCollapsed && (
          <div className='flex items-center space-x-2'>{branding.logo}</div>
        )}
        {/* <Button
          variant='ghost'
          size='sm'
          onClick={onToggle}
          className='h-8 w-8 p-0'
        >
          {isCollapsed ? (
            <ChevronRight className='h-4 w-4' />
          ) : (
            <ChevronLeft className='h-4 w-4' />
          )}
        </Button> */}
      </div>
    </SidebarHeader>
  );
}
