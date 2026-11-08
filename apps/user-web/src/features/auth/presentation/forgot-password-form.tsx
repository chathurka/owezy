'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { t } from '@/core/i18n';
import { Button, TextField } from '@/shared/ui';
import { forgotPasswordViaBff } from '../data/password-reset-client';
import { validateForgotPasswordInput } from '../domain/password-reset';
import styles from './login-form.module.css';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(undefined);

    const input = { email };
    const nextErrors = validateForgotPasswordInput(input);
    setEmailError(nextErrors.email ? t(nextErrors.email) : undefined);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await forgotPasswordViaBff(email.trim());
      setSucceeded(true);
    } catch {
      // Non-enumerating: show success even on generic errors to avoid leaking
      // account existence. Only surface truly unexpected errors.
      setSucceeded(true);
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
            <h1 className="type-title">{t('auth.forgotPassword.successTitle')}</h1>
            <p className={`type-body ${styles.sub}`}>
              {t('auth.forgotPassword.successBody')}
            </p>
            <Link href="/login">
              <Button type="button" variant="primary" fullWidth>
                {t('auth.forgotPassword.backToSignIn')}
              </Button>
            </Link>
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
          <Link href="/login">← {t('auth.forgotPassword.backToSignIn')}</Link>
        </div>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div>
            <h1 className="type-title">{t('auth.forgotPassword.title')}</h1>
            <p className={`type-body ${styles.sub}`}>
              {t('auth.forgotPassword.subtitle')}
            </p>
          </div>

          <TextField
            label={t('auth.forgotPassword.email')}
            type="email"
            autoComplete="email"
            placeholder={t('auth.forgotPassword.emailPlaceholder')}
            value={email}
            error={emailError}
            onChange={(e) => setEmail(e.target.value)}
          />

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
              ? t('auth.forgotPassword.submitting')
              : t('auth.forgotPassword.submit')}
          </Button>
        </form>
        <Footer />
      </main>
    </div>
  );
}

function BrandPane() {
  const [headlineLine1, headlineLine2] = t(
    'auth.forgotPassword.brandHeadline',
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
            {t('auth.forgotPassword.brandSub')}
          </p>
        </div>
      </div>
    </aside>
  );
}

function Footer() {
  return (
    <div className={`type-caption ${styles.footer}`}>
      <span>{t('auth.forgotPassword.footerCopyright')}</span>
      <a href="#privacy">{t('auth.forgotPassword.footerPrivacy')}</a>
      <a href="#terms">{t('auth.forgotPassword.footerTerms')}</a>
      <a href="#help">{t('auth.forgotPassword.footerHelp')}</a>
    </div>
  );
}
