import { Inter } from 'next/font/google';
import { t } from '@/core/i18n';
import { ThemeProvider } from '@/core/theme/theme-provider';
import '@/core/theme/globals.css';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  // 800 required for .type-display / .type-title / .type-amount-lg / .type-amount
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans-face',
  display: 'swap',
});

export const metadata: Metadata = {
  title: t('app.name'),
  description: t('app.description'),
};

/** Inline script runs synchronously before first paint — prevents FOUC. */
const themeScript = `(function(){var t=localStorage.getItem('owezy-theme');var r=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches)?'dark':'light';document.documentElement.setAttribute('data-theme',r);})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
