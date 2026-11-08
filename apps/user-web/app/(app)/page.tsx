import Link from 'next/link';
import { t } from '@/core/i18n';

export default function HomePage() {
  return (
    <main style={{ padding: 'var(--space-8)' }}>
      <h1 className="type-title">{t('app.name')}</h1>
      <p className="type-body">{t('app.description')}</p>
      <p style={{ marginTop: 'var(--space-4)' }}>
        <Link href="/settings">{t('settings.title')}</Link>
      </p>
    </main>
  );
}
