import { PlaceholderOrgScreen } from '@/features/org/placeholder-screen';

type PageProps = { params: Promise<{ orgSlug: string }> };

export default async function GuardrailsPage({ params }: PageProps) {
  const { orgSlug } = await params;
  return (
    <PlaceholderOrgScreen
      orgSlug={orgSlug}
      title='Guardrails'
      description='Guardrails define the standards AI reviews and recommendations should follow.'
    />
  );
}
