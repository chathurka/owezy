'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { t } from '@/core/i18n';
import { Button, TextField } from '@/shared/ui';
import {
  resendVerificationViaBff,
  verifyEmailViaBff,
} from '../data/verify-email-client';
import styles from './login-form.module.css';

const RESEND_COOLDOWN_SECS = 60;

export function VerifyEmailForm({ email }: { email?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [codeError, setCodeError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState<string | undefined>();
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-verify when ?token= query param is present
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      void autoVerify(tokenParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function autoVerify(token: string) {
    setSubmitting(true);
    try {
      await verifyEmailViaBff(token);
      setSucceeded(true);
    } catch (error) {
      setFormError(
        isInvalidTokenError(error)
          ? t('auth.verifyEmail.error.invalid')
          : t('auth.verifyEmail.error.generic'),
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setCodeError(undefined);
    setFormError(undefined);

    const trimmed = code.trim();
    if (!/^\d{6}$/.test(trimmed)) {
      setCodeError(t('auth.verifyEmail.error.code'));
      return;
    }

    setSubmitting(true);
    try {
      await verifyEmailViaBff(trimmed);
      setSucceeded(true);
    } catch (error) {
      if (isInvalidTokenError(error)) {
        setFormError(t('auth.verifyEmail.error.invalid'));
      } else {
        setFormError(t('auth.verifyEmail.error.generic'));
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function onResend() {
    if (resendCooldown > 0 || !email) return;
    setResendMessage(undefined);

    await resendVerificationViaBff(email);
    setResendMessage(t('auth.verifyEmail.resendSent'));

    setResendCooldown(RESEND_COOLDOWN_SECS);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  if (succeeded) {
    return (
      <div className={styles.shell}>
        <BrandPane />
        <main className={styles.formPane}>
          <form className={`${styles.form} ${styles.success}`}>
            <div className={styles.ok}>✓</div>
            <h1 className="type-title">{t('auth.verifyEmail.successTitle')}</h1>
            <p className={`type-body ${styles.sub}`}>
              {t('auth.verifyEmail.successBody')}
            </p>
            <Button
              type="button"
              variant="primary"
              fullWidth
              onClick={() => router.replace('/')}
            >
              {t('auth.verifyEmail.continueDashboard')}
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
          <Link href="/login">← Back to sign in</Link>
        </div>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div>
            <h1 className="type-title">{t('auth.verifyEmail.title')}</h1>
            <p className={`type-body ${styles.sub}`}>
              {t('auth.verifyEmail.subtitle')}
            </p>
          </div>

          <TextField
            label={t('auth.verifyEmail.codeLabel')}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder={t('auth.verifyEmail.codePlaceholder')}
            value={code}
            error={codeError}
            onChange={(e) => setCode(e.target.value)}
          />

          {formError ? (
            <span className={`type-caption ${styles.err}`}>{formError}</span>
          ) : null}

          {resendMessage ? (
            <span className={`type-caption`} style={{ color: 'var(--owned)' }}>
              {resendMessage}
            </span>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={submitting}
            disabled={submitting}
          >
            {submitting
              ? t('auth.verifyEmail.submitting')
              : t('auth.verifyEmail.submit')}
          </Button>

          {email ? (
            <p className={`type-label ${styles.bottomLink}`}>
              {t('auth.verifyEmail.resendPrompt')}{' '}
              {resendCooldown > 0 ? (
                <span style={{ color: 'var(--text-muted)' }}>
                  {t('auth.verifyEmail.resendCooldown').replace(
                    '{seconds}',
                    String(resendCooldown),
                  )}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onResend}
                  style={{
                    background: 'none',
                    border: 0,
                    color: 'var(--primary-text)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    font: 'inherit',
                  }}
                >
                  {t('auth.verifyEmail.resend')}
                </button>
              )}
            </p>
          ) : null}
        </form>
        <Footer />
      </main>
    </div>
  );
}

function isInvalidTokenError(error: unknown): boolean {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    (error as { code?: string }).code === 'VERIFICATION_TOKEN_INVALID'
  );
}

function BrandPane() {
  const [headlineLine1, headlineLine2] = t(
    'auth.verifyEmail.brandHeadline',
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
            {t('auth.verifyEmail.brandSub')}
          </p>
        </div>
      </div>
    </aside>
  );
}

function Footer() {
  return (
    <div className={`type-caption ${styles.footer}`}>
      <span>{t('auth.verifyEmail.footerCopyright')}</span>
      <a href="#privacy">{t('auth.verifyEmail.footerPrivacy')}</a>
      <a href="#terms">{t('auth.verifyEmail.footerTerms')}</a>
      <a href="#help">{t('auth.verifyEmail.footerHelp')}</a>
    </div>
  );
}
