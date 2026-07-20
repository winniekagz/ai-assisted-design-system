import { AnalysisLoadingState } from '@/features/loading';

export default function Loading() {
  return (
    <main className='grid min-h-screen place-items-center bg-background px-4 py-10'>
      <AnalysisLoadingState
        title='Loading ComponentIQ...'
        description='Preparing your workspace and design-system context.'
        progress={48}
      />
    </main>
  );
}
