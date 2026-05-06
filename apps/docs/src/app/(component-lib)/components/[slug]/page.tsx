import { ComponentDetailScreen } from '@/features/components/component-detail-screen';

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ComponentDetailScreen slug={slug} />;
}
