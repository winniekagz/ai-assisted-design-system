import { Suspense } from 'react';

import { InviteTeamScreen } from '@/features/onboarding';

export default function InviteTeamPage() {
  return (
    <Suspense>
      <InviteTeamScreen />
    </Suspense>
  );
}
