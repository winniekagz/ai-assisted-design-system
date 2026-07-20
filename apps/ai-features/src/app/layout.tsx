import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppProviders } from './providers';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'ComponentIQ AI — AI-powered design system tools',
  description: 'AI assistant, audit, and governance for your design system.',
  icons: {
    icon: [
      {
        url: '/brand/componentiq-favicon-32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/brand/componentiq-favicon-16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: '/brand/componentiq-icon-512.png',
  },
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
