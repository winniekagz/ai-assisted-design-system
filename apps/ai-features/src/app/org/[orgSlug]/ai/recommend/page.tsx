import { PlaceholderOrgScreen } from '@/features/org/placeholder-screen';

type PageProps = { params: Promise<{ orgSlug: string }> };

export default async function RecommendPage({ params }: PageProps) {
  const { orgSlug } = await params;
  return (
    <PlaceholderOrgScreen
      orgSlug={orgSlug}
      title='Component recommendation'
      description='Recommendations will use this organization’s components, guardrails, and review preferences.'
    />
  );
}
