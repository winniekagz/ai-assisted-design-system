import Link from 'next/link';

export default function NotFound() {
  return (
    <main className='grid min-h-screen place-items-center bg-background px-4'>
      <div className='max-w-md text-center'>
        <p className='text-sm font-medium uppercase text-primary'>Not found</p>
        <h1 className='mt-2 text-3xl font-semibold'>This page is unavailable</h1>
        <p className='mt-3 text-sm leading-6 text-muted-foreground'>
          The organization area or page you requested could not be found.
        </p>
        <Link
          href='/'
          className='mt-6 inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground'
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
