import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My',
  description: 'Plugin & hook system like WordPress',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
