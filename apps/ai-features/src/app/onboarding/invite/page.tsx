import { Suspense } from 'react';

import { InviteTeamScreen } from '@/features/onboarding/invite-team-screen';

// New optional step in the onboarding flow (split out of create-organization).
// Suspense boundary because the screen reads search params (?org=…).
export default function InviteTeamPage() {
  return (
    <Suspense>
      <InviteTeamScreen />
    </Suspense>
  );
}
