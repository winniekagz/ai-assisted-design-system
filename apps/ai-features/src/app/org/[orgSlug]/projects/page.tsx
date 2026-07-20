import { ProjectsScreen } from '@/features/projects/projects-screen';

type PageProps = { params: Promise<{ orgSlug: string }> };

export default async function ProjectsPage({ params }: PageProps) {
  const { orgSlug } = await params;
  return <ProjectsScreen orgSlug={orgSlug} />;
}
