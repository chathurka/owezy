'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { t } from '@/core/i18n';
import { Button, TextField } from '@/shared/ui';
import {
  appleSignInViaBff,
  requestAppleIdentityToken,
} from '../data/apple-client';
import { loginViaBff } from '../data/login-client';
import { LoginFieldErrors, validateLoginInput } from '../domain/login';
import styles from './login-form.module.css';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<LoginFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function onContinueWithApple() {
    setErrors({});
    setSubmitting(true);
    try {
      const applePayload = await requestAppleIdentityToken();
      await appleSignInViaBff(applePayload);
      router.replace('/');
    } catch (error) {
      const code =
        error && typeof error === 'object' && 'code' in error
          ? String((error as { code?: string }).code)
          : undefined;
      setErrors({
        form:
          code === 'APPLE_NOT_CONFIGURED'
            ? 'auth.login.error.appleNotConfigured'
            : 'auth.login.error.apple',
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const input = { email, password };
    const nextErrors = validateLoginInput(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await loginViaBff({
        email: email.trim(),
        password,
      });
      // Remember-me is UI-only for MVP (refresh TTL stays 7d per ADR-0001).
      router.replace('/');
    } catch (error) {
      const code =
        error && typeof error === 'object' && 'code' in error
          ? String((error as { code?: string }).code)
          : undefined;
      setErrors({
        form:
          code === 'INVALID_CREDENTIALS'
            ? 'auth.login.error.invalidCredentials'
            : 'auth.login.error.generic',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.shell}>
      <BrandPane />
      <main className={styles.formPane}>
        <div className={`type-label ${styles.topLink}`}>
          {t('auth.login.createPrompt')}{' '}
          <Link href="/register">{t('auth.login.createAccount')}</Link>
        </div>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div>
            <h1 className="type-title">{t('auth.login.title')}</h1>
            <p className={`type-body ${styles.sub}`}>{t('auth.login.subtitle')}</p>
          </div>

          <div className={styles.socialRow}>
            <Button type="button" variant="ghost" size="compact" disabled>
              {t('auth.login.continueGoogle')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="compact"
              disabled={submitting}
              onClick={onContinueWithApple}
            >
              {t('auth.login.continueApple')}
            </Button>
          </div>
          <div className={`type-caption ${styles.or}`}>{t('auth.login.orEmail')}</div>

          <TextField
            label={t('auth.login.email')}
            type="email"
            autoComplete="email"
            placeholder={t('auth.login.emailPlaceholder')}
            value={email}
            error={errors.email ? t(errors.email) : undefined}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className={styles.field}>
            <div className={`type-label ${styles.passwordLabelRow}`}>
              <span>{t('auth.login.password')}</span>
              <a href="#forgot">{t('auth.login.forgotPassword')}</a>
            </div>
            <TextField
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder={t('auth.login.passwordPlaceholder')}
              value={password}
              error={errors.password ? t(errors.password) : undefined}
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
                      ? t('auth.login.hidePasswordAria')
                      : t('auth.login.showPasswordAria')
                  }
                >
                  {showPassword
                    ? t('auth.login.hidePassword')
                    : t('auth.login.showPassword')}
                </button>
              }
            />
          </div>

          <button
            type="button"
            className={`type-label ${styles.remember}`}
            onClick={() => setRemember((v) => !v)}
            role="checkbox"
            aria-checked={remember}
          >
            <span className={`${styles.box} ${remember ? styles.boxOn : ''}`}>
              {remember ? '✓' : ''}
            </span>
            <span>{t('auth.login.remember')}</span>
          </button>

          {errors.form ? (
            <span className={`type-caption ${styles.err}`}>{t(errors.form)}</span>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={submitting}
            disabled={submitting}
          >
            {submitting ? t('auth.login.submitting') : t('auth.login.submit')}
          </Button>

          <p className={`type-label ${styles.bottomLink}`}>
            {t('auth.login.noAccount')}{' '}
            <Link href="/register">{t('auth.login.signUpFree')}</Link>
          </p>
        </form>
        <Footer />
      </main>
    </div>
  );
}

function BrandPane() {
  const [headlineLine1, headlineLine2] = t('auth.login.brandHeadline').split('\n');
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
          <p className={`type-body ${styles.brandSub}`}>{t('auth.login.brandSub')}</p>
        </div>
      </div>
    </aside>
  );
}

function Footer() {
  return (
    <div className={`type-caption ${styles.footer}`}>
      <span>{t('auth.login.footerCopyright')}</span>
      <a href="#privacy">{t('auth.login.footerPrivacy')}</a>
      <a href="#terms">{t('auth.login.footerTerms')}</a>
      <a href="#help">{t('auth.login.footerHelp')}</a>
    </div>
  );
}
