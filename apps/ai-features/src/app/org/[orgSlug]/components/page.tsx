import { PlaceholderOrgScreen } from '@/features/org/placeholder-screen';

type PageProps = { params: Promise<{ orgSlug: string }> };

export default async function ComponentsPage({ params }: PageProps) {
  const { orgSlug } = await params;
  return (
    <PlaceholderOrgScreen
      orgSlug={orgSlug}
      title='Components'
      description='Component catalogs will stay scoped to this organization’s design system.'
    />
  );
}
