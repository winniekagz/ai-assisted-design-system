import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-4xl font-bold mb-8'>Leja Component Library</h1>
      <p className='text-muted-foreground mb-8'>
        A modern component library built with Next.js and Tailwind CSS,
        featuring design tokens and accessibility best practices.
      </p>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Link
          href='/button-demo'
          className='p-6 border rounded-lg hover:bg-accent transition-colors'
        >
          <h2 className='text-xl font-semibold mb-2'>Button Component</h2>
          <p className='text-muted-foreground'>
            Explore the button component with various variants, states, and
            accessibility features.
          </p>
        </Link>

        <Link
          href='/badge-demo'
          className='p-6 border rounded-lg hover:bg-accent transition-colors'
        >
          <h2 className='text-xl font-semibold mb-2'>Badge Component</h2>
          <p className='text-muted-foreground'>
            Explore the badge component with status indicators, variants, and
            custom configurations.
          </p>
        </Link>

        <Link
          href='/table'
          className='p-6 border rounded-lg hover:bg-accent transition-colors'
        >
          <h2 className='text-xl font-semibold mb-2'>Enhanced Data Tables</h2>
          <p className='text-muted-foreground'>
            See enhanced data tables with badges, status indicators, and
            comprehensive features.
          </p>
        </Link>

        {/* Add more component demos here as they become available */}
      </div>
    </div>
  );
}
