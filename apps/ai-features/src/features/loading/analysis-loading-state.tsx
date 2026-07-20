'use client';

export function AnalysisLoadingState({
  title = 'Analyzing your project...',
  description = 'Detecting framework, components, and design tokens. This usually takes under a minute.',
  progress = 64,
}: {
  title?: string;
  description?: string;
  progress?: number;
}) {
  return (
    <div className='mx-auto grid max-w-[420px] justify-items-center text-center'>
      <svg
        width='64'
        height='64'
        viewBox='0 0 88 88'
        className='motion-safe:animate-spin'
        aria-hidden='true'
      >
        <path
          d='M58 20 A28 28 0 1 0 58 68'
          fill='none'
          className='stroke-border'
          strokeWidth='9'
          strokeLinecap='round'
        />
        <path
          d='M58 20 A28 28 0 0 1 79 44'
          fill='none'
          className='stroke-primary'
          strokeWidth='9'
          strokeLinecap='round'
        />
      </svg>
      <h1
        role='status'
        aria-live='polite'
        className='mt-5 text-lg font-bold text-foreground'
      >
        {title}
      </h1>
      <p className='mt-2 text-[13px] leading-5 text-muted-foreground'>
        {description}
      </p>
      <div className='mt-[18px] h-1.5 w-full overflow-hidden rounded-full bg-background-secondary'>
        <div
          className='h-full rounded-full bg-primary motion-safe:animate-pulse'
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
