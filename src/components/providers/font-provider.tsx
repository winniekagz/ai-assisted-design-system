'use client';

import { ReactNode } from 'react';

interface FontProviderProps {
  children: ReactNode;
}

export function FontProvider({ children }: FontProviderProps) {
  return <div className='font-sans'>{children}</div>;
}
