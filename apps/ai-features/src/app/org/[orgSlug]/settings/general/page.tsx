import { PlaceholderOrgScreen } from '@/features/org/placeholder-screen';

type PageProps = { params: Promise<{ orgSlug: string }> };

export default async function GeneralSettingsPage({ params }: PageProps) {
  const { orgSlug } = await params;
  return (
    <PlaceholderOrgScreen
      orgSlug={orgSlug}
      title='General settings'
      description='Organization profile and workspace settings will be managed here.'
    />
  );
}
