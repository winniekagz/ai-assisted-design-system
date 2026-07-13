import { redirect } from 'next/navigation';

type PageProps = { params: Promise<{ orgSlug: string }> };

export default async function OrganizationIndexPage({ params }: PageProps) {
  const { orgSlug } = await params;
  redirect(`/org/${orgSlug}/dashboard`);
}
