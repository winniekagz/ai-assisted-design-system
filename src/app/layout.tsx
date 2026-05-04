import type { Metadata } from 'next';
import { ReactNode } from 'react';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'ComponentIQ — AI-assisted design system',
  description:
    'ComponentIQ helps teams choose components, follow tokens, audit UI, and govern reuse—AI-assisted, review-first.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
try {
  var storedTheme = window.localStorage.getItem('componentiq-theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
} catch {}
`,
          }}
        />
      </head>
      <body className='min-h-screen bg-background text-foreground font-rubik'>
        {children}
      </body>
    </html>
  );
}
