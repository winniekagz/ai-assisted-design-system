'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';
import React from 'react';
import { Typography } from '../ui/typography';

export interface BrandingData {
  logo?:
    | React.ComponentType<React.SVGProps<SVGSVGElement>>
    | (() => React.ReactElement);
  title: string;
  subtitle?: string;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
  };
  company?: {
    name: string;
    logo?: string;
  };
}

export interface BrandingComponentProps {
  data: BrandingData;
  className?: string;
  showUserInfo?: boolean;
  showCompanyInfo?: boolean;
  onLogoClick?: () => void;
  onUserClick?: () => void;
}

export const BrandingComponent: React.FC<BrandingComponentProps> = ({
  data,
  className,

  onLogoClick,
}) => {
  const renderLogo = () => {
    if (!data.logo) {
      return <Shield className='h-8 w-8 text-primary' />;
    }

    // Check if it's a function (from icon registry)
    if (typeof data.logo === 'function') {
      const LogoComponent = data.logo as () => React.ReactElement;
      return <LogoComponent />;
    }

    // Check if it's a React component
    if (React.isValidElement(data.logo)) {
      return data.logo;
    }

    // Assume it's a React component type
    const LogoComponent = data.logo as React.ComponentType<
      React.SVGProps<SVGSVGElement>
    >;
    return <LogoComponent className='h-[56px] w-[56px] object-contain' />;
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 border-none',
        className
      )}
    >
      {/* Logo and Title */}
      <div className='flex items-center space-x-3'>
        <Button
          variant='ghost'
          size='sm'
          onClick={onLogoClick}
          className='p-0 h-auto min-w-0'
        >
          {renderLogo()}
        </Button>

        <div className='flex flex-col'>
          <Typography variant={'body2'} className='text-neutral-600'>
            {data.title}
          </Typography>
          {data.subtitle && (
            <Typography variant={'body2'} className='text-neutral-500'>
              {data.subtitle}
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

// Loading State Component
export const BrandingComponentSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 border-none',
        className
      )}
    >
      <div className='flex items-center space-x-3'>
        <Skeleton className='h-8 w-8 rounded' />
        <div className='flex flex-col space-y-1'>
          <Skeleton className='h-5 w-32' />
          <Skeleton className='h-4 w-24' />
        </div>
      </div>

      <div className='flex items-center space-x-3'>
        <Skeleton className='h-8 w-8 rounded-full' />
        <div className='hidden sm:flex flex-col space-y-1'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-3 w-16' />
        </div>
      </div>
    </div>
  );
};

export default BrandingComponent;
