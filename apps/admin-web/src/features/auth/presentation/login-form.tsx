'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/core/i18n';
import { Alert, Button, TextField } from '@/components';
import { loginViaBff } from '../data/login-client';
import styles from './login-form.module.css';

type Props = { sessionExpired?: boolean };

export function LoginForm({ sessionExpired = false }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!email.includes('@')) {
      setError(t('auth.login.error.email'));
      return;
    }
    if (password.length < 8) {
      setError(t('auth.login.error.password'));
      return;
    }

    setSubmitting(true);
    try {
      const result = await loginViaBff({ email: email.trim(), password });
      if ('mfaRequired' in result && result.mfaRequired) {
        sessionStorage.setItem('owezy_mfa_token', result.mfaToken);
        router.push('/login/mfa');
        return;
      }
      router.replace('/');
    } catch (err) {
      const code =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code?: string }).code)
          : undefined;
      setError(
        code === 'INVALID_CREDENTIALS'
          ? t('auth.login.error.invalidCredentials')
          : code === 'NOT_ADMIN'
            ? t('auth.login.error.notAdmin')
            : t('auth.login.error.generic'),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.shell}>
      <form className={styles.card} onSubmit={onSubmit} noValidate>
        <h1 className={styles.title}>{t('auth.login.title')}</h1>
        <p className={styles.sub}>{t('auth.login.subtitle')}</p>
        {sessionExpired ? (
          <Alert variant="warning" message={t('auth.login.sessionExpired')} />
        ) : null}
        <TextField
          label={t('auth.login.email')}
          type="email"
          value={email}
          placeholder={t('auth.login.emailPlaceholder')}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label={t('auth.login.password')}
          type="password"
          value={password}
          placeholder={t('auth.login.passwordPlaceholder')}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <p className={styles.error}>{error}</p> : null}
        <Button type="submit" variant="primary" fullWidth disabled={submitting}>
          {submitting ? t('auth.login.submitting') : t('auth.login.submit')}
        </Button>
      </form>
    </main>
  );
}
