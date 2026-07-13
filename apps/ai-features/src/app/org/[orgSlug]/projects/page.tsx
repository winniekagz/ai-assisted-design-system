import { PlaceholderOrgScreen } from '@/features/org/placeholder-screen';

type PageProps = { params: Promise<{ orgSlug: string }> };

export default async function ProjectsPage({ params }: PageProps) {
  const { orgSlug } = await params;
  return (
    <PlaceholderOrgScreen
      orgSlug={orgSlug}
      title='Projects'
      description='Projects will connect organization rules to consuming applications.'
    />
  );
}
