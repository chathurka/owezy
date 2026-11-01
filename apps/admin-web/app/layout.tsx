import { Inter } from 'next/font/google';
import '@/core/theme/globals.css';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans-face',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Owezy Admin',
  description: 'Owezy Admin Console',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
