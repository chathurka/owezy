import Link from 'next/link';
import { t } from '@/core/i18n';

export default function AccessDeniedPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 'var(--space-6)',
      }}
    >
      <div style={{ maxWidth: '28rem', display: 'grid', gap: 'var(--space-4)' }}>
        <h1 style={{ margin: 0, font: 'var(--type-title)', color: 'var(--text)' }}>
          {t('auth.accessDenied.title')}
        </h1>
        <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-muted)' }}>
          {t('auth.accessDenied.body')}
        </p>
        <Link href="/login">{t('auth.accessDenied.back')}</Link>
      </div>
    </main>
  );
}
