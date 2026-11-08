'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/core/i18n';
import { Button, TextField } from '@/components';
import { verifyMfaViaBff } from '../data/login-client';
import styles from './login-form.module.css';

export function MfaForm() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [mfaToken, setMfaToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('owezy_mfa_token');
    if (!token) {
      router.replace('/login');
      return;
    }
    setMfaToken(token);
  }, [router]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!mfaToken) return;
    setError(null);
    setSubmitting(true);
    try {
      await verifyMfaViaBff({ mfaToken, code: code.trim() });
      sessionStorage.removeItem('owezy_mfa_token');
      router.replace('/');
    } catch (err) {
      const codeValue =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code?: string }).code)
          : undefined;
      setError(
        codeValue === 'INVALID_MFA_CODE'
          ? t('auth.mfa.error.invalid')
          : t('auth.mfa.error.generic'),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.shell}>
      <form className={styles.card} onSubmit={onSubmit} noValidate>
        <h1 className={styles.title}>{t('auth.mfa.title')}</h1>
        <p className={styles.sub}>{t('auth.mfa.subtitle')}</p>
        <TextField
          label={t('auth.mfa.code')}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          inputMode="numeric"
          autoComplete="one-time-code"
        />
        {error ? <p className={styles.error}>{error}</p> : null}
        <Button type="submit" variant="primary" fullWidth disabled={submitting}>
          {submitting ? t('auth.mfa.submitting') : t('auth.mfa.submit')}
        </Button>
      </form>
    </main>
  );
}
