import * as React from 'react';

import { cn } from '@/lib/utils';

type SpacingToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type RadiusToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
type LegacySpacingValue = 0 | 2 | 4 | 8 | 12 | 16 | 20 | 24 | 32;
type LegacyRadiusValue = 0 | 2 | 4 | 8 | 10 | 12 | 16;

interface ContainerProps extends React.ComponentProps<'div'> {
  /**
   * The content to be rendered inside the container
   */
  children?: React.ReactNode;
  /**
   * The width variant of the container
   * @default "fit"
   */
  width?: 'full' | 'fit';
  /**
   * The background color variant
   * @default "surface"
   */
  variant?:
    | 'surface'
    | 'transparent'
    | 'secondary'
    | 'primary'
    | 'brand'
    | 'white'
    | 'gray';
  /**
   * The gap between child elements.
   * @default "md"
   */
  gap?: SpacingToken | LegacySpacingValue;
  /**
   * The padding.
   * @default "xs"
   */
  padding?: SpacingToken | LegacySpacingValue;
  /**
   * The border radius.
   * @default "md"
   */
  radius?: RadiusToken | LegacyRadiusValue;
  /**
   * Whether to show a border
   * @default false
   */
  bordered?: boolean;
  /**
   * Whether to show a shadow
   * @default false
   */
  shadowed?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

function Container({
  children,
  width = 'fit',
  variant = 'surface',
  gap = 'md',
  padding = 'xs',
  radius = 'md',
  bordered = false,
  shadowed = false,
  className,
  ...props
}: ContainerProps) {
  const normalizeSpacing = (
    value: SpacingToken | LegacySpacingValue
  ): SpacingToken => {
    if (typeof value === 'string') return value;
    if (value <= 4) return 'xs';
    if (value <= 8) return 'sm';
    if (value <= 16) return 'md';
    if (value <= 24) return 'lg';
    return 'xl';
  };

  const normalizeRadius = (
    value: RadiusToken | LegacyRadiusValue
  ): RadiusToken => {
    if (typeof value === 'string') return value;
    if (value <= 2) return 'xs';
    if (value <= 4) return 'sm';
    if (value <= 10) return 'md';
    if (value <= 12) return 'lg';
    return 'xl';
  };

  const gapToken = normalizeSpacing(gap);
  const paddingToken = normalizeSpacing(padding);
  const radiusToken = normalizeRadius(radius);

  const widthClasses = {
    full: 'w-full',
    fit: 'w-fit',
  };

  const variantClasses = {
    surface: 'bg-[color:var(--bg-surface)] text-[color:var(--text-paragraph)]',
    white: 'bg-[color:var(--bg-surface)] text-[color:var(--text-paragraph)]',
    transparent: 'bg-transparent',
    secondary:
      'bg-[color:var(--bg-secondary)] text-[color:var(--text-paragraph)]',
    gray: 'bg-[color:var(--bg-secondary)] text-[color:var(--text-paragraph)]',
    primary: 'bg-[color:var(--color-primary)] text-[color:var(--text-inverse)]',
    brand: 'bg-[color:var(--color-primary)] text-[color:var(--text-inverse)]',
  };

  const spacingClasses = {
    xs: 'gap-[var(--spacing-xs)]',
    sm: 'gap-[var(--spacing-sm)]',
    md: 'gap-[var(--spacing-md)]',
    lg: 'gap-[var(--spacing-lg)]',
    xl: 'gap-[var(--spacing-xl)]',
    '2xl': 'gap-[var(--spacing-2xl)]',
  };

  const paddingClasses = {
    xs: 'p-[var(--spacing-xs)]',
    sm: 'p-[var(--spacing-sm)]',
    md: 'p-[var(--spacing-md)]',
    lg: 'p-[var(--spacing-lg)]',
    xl: 'p-[var(--spacing-xl)]',
    '2xl': 'p-[var(--spacing-2xl)]',
  };

  const radiusClasses = {
    xs: 'rounded-[var(--radius-xs)]',
    sm: 'rounded-[var(--radius-sm)]',
    md: 'rounded-[var(--radius-md)]',
    lg: 'rounded-[var(--radius-lg)]',
    xl: 'rounded-[var(--radius-xl)]',
    full: 'rounded-[var(--radius-full)]',
  };

  const borderClasses = bordered
    ? 'border border-[color:var(--border-default)]'
    : '';
  const shadowClasses = shadowed ? 'shadow-[var(--shadow-md)]' : 'shadow-none';

  return (
    <div
      data-slot='container'
      className={cn(
        'flex flex-col',
        widthClasses[width],
        variantClasses[variant],
        spacingClasses[gapToken],
        paddingClasses[paddingToken],
        radiusClasses[radiusToken],
        borderClasses,
        shadowClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Container };
export type { ContainerProps };
