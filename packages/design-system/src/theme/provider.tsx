'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { createComponentIqCssVariables } from './create-css-vars';
import type { ComponentIqTokens } from './tokens';

export interface ComponentIqProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  tokens?: ComponentIqTokens;
  asChild?: boolean;
}

export function ComponentIqProvider({
  tokens,
  className,
  style,
  children,
  ...props
}: ComponentIqProviderProps) {
  const tokenStyles = React.useMemo(
    () => createComponentIqCssVariables(tokens),
    [tokens]
  );

  return (
    <div
      className={cn('font-rubik text-foreground', className)}
      style={{ ...tokenStyles, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
