import { OrganizationDashboardScreen } from '@/features/org/dashboard-screen';

type PageProps = {
  params: Promise<{ orgSlug: string }>;
};

export default async function OrganizationDashboardPage({ params }: PageProps) {
  const { orgSlug } = await params;
  return <OrganizationDashboardScreen orgSlug={orgSlug} />;
}
