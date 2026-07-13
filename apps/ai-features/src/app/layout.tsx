import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppProviders } from './providers';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'ComponentIQ AI — AI-powered design system tools',
  description: 'AI assistant, audit, and governance for your design system.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
