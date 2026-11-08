'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { t } from '@/core/i18n';
import { Button, TextField } from '@/shared/ui';
import { resetPasswordViaBff } from '../data/password-reset-client';
import { validateResetPasswordInput } from '../domain/password-reset';
import styles from './login-form.module.css';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(undefined);

    const input = { token, password };
    const nextErrors = validateResetPasswordInput(input);
    setPasswordError(nextErrors.password ? t(nextErrors.password) : undefined);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await resetPasswordViaBff(token, password);
      setSucceeded(true);
    } catch (error) {
      const code =
        error && typeof error === 'object' && 'code' in error
          ? String((error as { code?: string }).code)
          : undefined;
      setFormError(
        code === 'RESET_TOKEN_INVALID'
          ? t('auth.resetPassword.error.invalidToken')
          : t('auth.resetPassword.error.generic'),
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (succeeded) {
    return (
      <div className={styles.shell}>
        <BrandPane />
        <main className={styles.formPane}>
          <form className={`${styles.form} ${styles.success}`}>
            <div className={styles.ok}>✓</div>
            <h1 className="type-title">{t('auth.resetPassword.successTitle')}</h1>
            <p className={`type-body ${styles.sub}`}>
              {t('auth.resetPassword.successBody')}
            </p>
            <Button
              type="button"
              variant="primary"
              fullWidth
              onClick={() => router.replace('/login')}
            >
              {t('auth.resetPassword.backToSignIn')}
            </Button>
          </form>
          <Footer />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <BrandPane />
      <main className={styles.formPane}>
        <div className={`type-label ${styles.topLink}`}>
          <Link href="/login">← {t('auth.resetPassword.backToSignIn')}</Link>
        </div>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div>
            <h1 className="type-title">{t('auth.resetPassword.title')}</h1>
            <p className={`type-body ${styles.sub}`}>
              {t('auth.resetPassword.subtitle')}
            </p>
          </div>

          <div className={styles.field}>
            <TextField
              label={t('auth.resetPassword.password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder={t('auth.resetPassword.passwordPlaceholder')}
              value={password}
              error={passwordError}
              onChange={(e) => setPassword(e.target.value)}
              trailing={
                <button
                  type="button"
                  className={`type-caption ${styles.btnGhost}`}
                  style={{
                    width: 'auto',
                    height: 'var(--touch-min)',
                    padding: '0 var(--space-3)',
                    border: 0,
                    background: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword
                      ? t('auth.resetPassword.hidePasswordAria')
                      : t('auth.resetPassword.showPasswordAria')
                  }
                >
                  {showPassword
                    ? t('auth.resetPassword.hidePassword')
                    : t('auth.resetPassword.showPassword')}
                </button>
              }
            />
            <p className={`type-caption ${styles.hint}`}>
              {t('auth.resetPassword.passwordHint')}
            </p>
          </div>

          {formError ? (
            <span className={`type-caption ${styles.err}`}>{formError}</span>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={submitting}
            disabled={submitting}
          >
            {submitting
              ? t('auth.resetPassword.submitting')
              : t('auth.resetPassword.submit')}
          </Button>
        </form>
        <Footer />
      </main>
    </div>
  );
}

function BrandPane() {
  const [headlineLine1, headlineLine2] = t(
    'auth.resetPassword.brandHeadline',
  ).split('\n');
  return (
    <aside className={styles.brandPane}>
      <Link className={styles.brand} href="/login">
        <span className={styles.mark}>O</span>
        {t('app.name')}
      </Link>
      <div className={styles.brandCopy}>
        <div>
          <h2 className="type-display">
            {headlineLine1}
            <br />
            {headlineLine2}
          </h2>
          <p className={`type-body ${styles.brandSub}`}>
            {t('auth.resetPassword.brandSub')}
          </p>
        </div>
      </div>
    </aside>
  );
}

function Footer() {
  return (
    <div className={`type-caption ${styles.footer}`}>
      <span>{t('auth.resetPassword.footerCopyright')}</span>
      <a href="#privacy">{t('auth.resetPassword.footerPrivacy')}</a>
      <a href="#terms">{t('auth.resetPassword.footerTerms')}</a>
      <a href="#help">{t('auth.resetPassword.footerHelp')}</a>
    </div>
  );
}
