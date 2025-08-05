import * as React from 'react';

import { cn } from '@/lib/utils';

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
   * @default "white"
   */
  variant?: 'white' | 'transparent' | 'gray' | 'primary' | 'secondary';
  /**
   * The gap between child elements in pixels
   * @default 16
   */
  gap?: number;
  /**
   * The padding in pixels
   * @default 2
   */
  padding?: number;
  /**
   * The border radius in pixels
   * @default 10
   */
  radius?: number;
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
  variant = 'white',
  gap = 16,
  padding = 2,
  radius = 10,
  bordered = false,
  shadowed = false,
  className,
  ...props
}: ContainerProps) {
  const widthClasses = {
    full: 'w-full',
    fit: 'w-fit',
  };

  const variantClasses = {
    white: 'bg-white',
    transparent: 'bg-transparent',
    gray: 'bg-gray-50',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
  };

  const borderClasses = bordered ? 'border border-gray-200' : '';
  const shadowClasses = shadowed ? 'shadow-md' : 'shadow-none';

  return (
    <div
      data-slot='container'
      className={cn(
        'flex flex-col',
        widthClasses[width],
        variantClasses[variant],
        borderClasses,
        shadowClasses,
        className
      )}
      style={{
        gap: `${gap}px`,
        padding: `${padding}px`,
        borderRadius: `${radius}px`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export { Container };
export type { ContainerProps };
