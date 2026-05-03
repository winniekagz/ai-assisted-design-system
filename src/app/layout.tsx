import type { Metadata } from 'next';
import { ReactNode } from 'react';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'componentIq Component Library',
  description: 'A modern component library built with Next.js and Tailwind CSS',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-background text-foreground font-rubik'>
        {children}
      </body>
    </html>
  );
}
