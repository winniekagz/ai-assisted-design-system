import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { AcceptInviteScreen } from '@/features/onboarding';
import { validateInvite } from '@/lib/api/invites';
import { createQueryClient } from '@/lib/query/query-client';
import { queryKeys } from '@/lib/query/query-keys';

export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function AcceptInvitePage({ searchParams }: PageProps) {
  const { token } = await searchParams;
  const queryClient = createQueryClient();

  if (token) {
    try {
      await queryClient.prefetchQuery({
        queryKey: queryKeys.invitePreview(token),
        queryFn: () => validateInvite(token),
      });
    } catch {
      queryClient.removeQueries({ queryKey: queryKeys.invitePreview(token) });
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AcceptInviteScreen />
    </HydrationBoundary>
  );
}
