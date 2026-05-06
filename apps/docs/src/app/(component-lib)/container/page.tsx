import React from 'react';
import { ContainerExample } from '@/components/examples/ContainerExample';
import { CardExample } from '@/components/examples/CardExample';
import { Typography } from '@/components/ui/typography';

export default function page() {
  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-4xl font-bold mb-8'>Button Component Demo</h1>
      <Typography variant={'h5'} className='text-muted-foreground mb-8'>
        This demo showcases the Container component with design tokens
        integration, various variants, states, and accessibility features.
      </Typography>
      <CardExample />
      {/* <ContainerExample /> */}

      <ContainerExample />
    </div>
  );
}
