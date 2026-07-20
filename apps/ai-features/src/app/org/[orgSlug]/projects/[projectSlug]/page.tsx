import { ProjectDetailsScreen } from '@/features/projects/project-details-screen';

type PageProps = {
  params: Promise<{ orgSlug: string; projectSlug: string }>;
};

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { orgSlug, projectSlug } = await params;
  return <ProjectDetailsScreen orgSlug={orgSlug} projectSlug={projectSlug} />;
}
