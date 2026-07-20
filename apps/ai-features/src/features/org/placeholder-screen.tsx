'use client';

import { Card, CardContent } from 'componentiq';
import { PageHeader } from '@/features/layout';
import { OrgFrame } from './org-frame';

export function PlaceholderOrgScreen({
  orgSlug,
  title,
  description,
}: {
  orgSlug: string;
  title: string;
  description: string;
}) {
  return (
    <OrgFrame orgSlug={orgSlug}>
      {() => (
        <>
          <PageHeader eyebrow='Organization' title={title} description={description} />
          <Card className='border border-border bg-card'>
            <CardContent className='p-6'>
              <p className='text-sm leading-6 text-muted-foreground'>
                This area is reserved for the V1 organization workspace. Product data
                will stay scoped to this organization and authorized by role.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </OrgFrame>
  );
}
