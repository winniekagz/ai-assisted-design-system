import { auth } from '@clerk/nextjs/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { OnboardingScreen } from '@/features/onboarding/onboarding-screen';
import { getMe } from '@/lib/api/users';
import { createQueryClient } from '@/lib/query/query-client';
import { queryKeys } from '@/lib/query/query-keys';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const queryClient = createQueryClient();
  const session = await auth();

  if (session.userId) {
    try {
      await queryClient.prefetchQuery({
        queryKey: queryKeys.me,
        queryFn: async () => {
          const clerkSessionToken = await session.getToken();
          return getMe(clerkSessionToken);
        },
      });
    } catch {
      queryClient.removeQueries({ queryKey: queryKeys.me });
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OnboardingScreen />
    </HydrationBoundary>
  );
}
