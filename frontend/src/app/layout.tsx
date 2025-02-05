import React, { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import AppWrappers from './AppWrappers';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body id={'root'}>
        <AppWrappers>{children}</AppWrappers>
        <Analytics />
      </body>
    </html>
  );
}