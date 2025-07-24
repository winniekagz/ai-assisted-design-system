import { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className='min-h-screen bg-background text-foreground font-rubik'>
      {children}
    </div>
  );
}
