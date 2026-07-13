import { MembersScreen } from '@/features/org/members-screen';

type PageProps = {
  params: Promise<{ orgSlug: string }>;
};

export default async function MembersPage({ params }: PageProps) {
  const { orgSlug } = await params;
  return <MembersScreen orgSlug={orgSlug} />;
}
