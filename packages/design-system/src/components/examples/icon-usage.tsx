import { Icon, Icons } from '@/lib/icon-registry';
import React from 'react';

export const IconUsageExample: React.FC = () => {
  return (
    <div className='p-6 space-y-4'>
      <h2 className='text-2xl font-bold mb-4'>Icon Registry Usage Examples</h2>

      {/* Using the Icon component with name prop */}
      <div className='space-y-2'>
        <h3 className='text-lg font-semibold'>Using Icon Component:</h3>
        <div className='flex gap-4 items-center'>
          <Icon name='Search' className='w-6 h-6' />
          <Icon name='Mail' className='w-6 h-6 text-blue-500' />
          <Icon name='Download' className='w-6 h-6 text-green-500' />
          <Icon name='Close' className='w-6 h-6 text-red-500' />
        </div>
      </div>

      {/* Using individual icons directly */}
      <div className='space-y-2'>
        <h3 className='text-lg font-semibold'>Using Individual Icons:</h3>
        <div className='flex gap-4 items-center'>
          <Icons.Search className='w-6 h-6' />
          <Icons.Mail className='w-6 h-6 text-blue-500' />
          <Icons.Download className='w-6 h-6 text-green-500' />
          <Icons.Close className='w-6 h-6 text-red-500' />
        </div>
      </div>

      {/* PNG Icons */}
      <div className='space-y-2'>
        <h3 className='text-lg font-semibold'>PNG Icons:</h3>
        <div className='flex gap-4 items-center'>
          <Icon name='BackIcon' className='w-6 h-6' />
          <Icon name='Google' className='w-6 h-6' />
          <Icon name='Settings' className='w-6 h-6' />
          <Icon name='PeopleFilled' className='w-6 h-6' />
        </div>
      </div>

      {/* Different sizes */}
      <div className='space-y-2'>
        <h3 className='text-lg font-semibold'>Different Sizes:</h3>
        <div className='flex gap-4 items-center'>
          <Icon name='Search' className='w-4 h-4' />
          <Icon name='Search' className='w-6 h-6' />
          <Icon name='Search' className='w-8 h-8' />
          <Icon name='Search' className='w-12 h-12' />
        </div>
      </div>
    </div>
  );
};
