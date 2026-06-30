import { InvitesScreen } from '@/features/org/invites-screen';

type PageProps = {
  params: Promise<{ orgSlug: string }>;
};

export default async function InvitesPage({ params }: PageProps) {
  const { orgSlug } = await params;
  return <InvitesScreen orgSlug={orgSlug} />;
}
