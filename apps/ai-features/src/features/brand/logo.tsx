import type { ImgHTMLAttributes } from 'react';

type LogoSurface = 'auto' | 'dark' | 'light';

type ComponentIqLogoProps = ImgHTMLAttributes<HTMLImageElement> & {
  surface?: LogoSurface;
  size?: number;
};

const symbolBySurface: Record<Exclude<LogoSurface, 'auto'>, string> = {
  dark: '/brand/componentiq-symbol-darkbg.png',
  light: '/brand/componentiq-symbol-lightbg.png',
};

export function ComponentIqLogo({
  surface = 'auto',
  size = 36,
  alt = 'ComponentIQ',
  className,
  ...props
}: ComponentIqLogoProps) {
  const image = (
    <img
      src={surface === 'dark' ? symbolBySurface.dark : symbolBySurface.light}
      alt={alt}
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );

  if (surface !== 'auto') {
    return image;
  }

  return (
    <picture>
      <source media='(prefers-color-scheme: dark)' srcSet={symbolBySurface.dark} />
      {image}
    </picture>
  );
}

export function ComponentIqLockup({
  className,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src='/brand/componentiq-full-lockup.png'
      alt='ComponentIQ'
      width={160}
      height={44}
      className={className}
      {...props}
    />
  );
}
