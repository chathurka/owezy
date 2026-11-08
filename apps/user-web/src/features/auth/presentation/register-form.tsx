'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { t } from '@/core/i18n';
import { Button, TextField } from '@/shared/ui';
import {
  appleSignInViaBff,
  requestAppleIdentityToken,
} from '../data/apple-client';
import {
  googleSignInViaBff,
  requestGoogleIdToken,
} from '../data/google-client';
import { registerViaBff } from '../data/register-client';
import {
  ALLOWED_CURRENCIES,
  AllowedCurrency,
  passwordStrength,
  RegisterFieldErrors,
  validateRegisterInput,
} from '../domain/register';
import styles from './register-form.module.css';

type Props = {
  onRegistered?: (email: string) => void;
};

export function RegisterForm({ onRegistered }: Props) {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState<AllowedCurrency>('USD');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<RegisterFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [doneEmail, setDoneEmail] = useState<string | null>(null);

  const strength = useMemo(() => passwordStrength(password), [password]);

  async function onContinueWithGoogle() {
    setErrors({});
    setSubmitting(true);
    try {
      const googlePayload = await requestGoogleIdToken();
      await googleSignInViaBff(googlePayload);
      router.replace('/');
    } catch (error) {
      const code =
        error && typeof error === 'object' && 'code' in error
          ? String((error as { code?: string }).code)
          : undefined;
      if (code === 'GOOGLE_SIGN_IN_CANCELLED') {
        return;
      }
      setErrors({
        form:
          code === 'GOOGLE_NOT_CONFIGURED'
            ? 'auth.register.error.googleNotConfigured'
            : 'auth.register.error.google',
      });
    } finally {
      setSubmitting(false);
    }
  }

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
            ? 'auth.register.error.appleNotConfigured'
            : 'auth.register.error.apple',
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const input = {
      fullName,
      email,
      password,
      defaultCurrency,
      acceptedTerms,
    };
    const nextErrors = validateRegisterInput(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await registerViaBff(input);
      setDoneEmail(email.trim());
      onRegistered?.(email.trim());
    } catch {
      setErrors({ form: 'auth.register.error.generic' });
    } finally {
      setSubmitting(false);
    }
  }

  function resetToForm() {
    setDoneEmail(null);
    setEmail('');
    setErrors({});
  }

  if (doneEmail) {
    return (
      <div className={styles.shell}>
        <BrandPane />
        <main className={styles.formPane}>
          <div className={`${styles.form} ${styles.success}`}>
            <div className={styles.ok} aria-hidden>
              ✓
            </div>
            <div>
              <h1 className="type-title">{t('auth.register.successTitle')}</h1>
              <p className={`type-body ${styles.sub}`}>
                {t('auth.register.successBodyPrefix')} <strong>{doneEmail}</strong>
              </p>
            </div>
            <div className={styles.steps}>
              <div className={`type-label ${styles.step}`}>
                <span className={`type-micro ${styles.stepIndex}`}>1</span>
                {t('auth.register.stepConfirm')}
              </div>
              <div className={`type-label ${styles.step}`}>
                <span className={`type-micro ${styles.stepIndex}`}>2</span>
                {t('auth.register.stepGroup')}
              </div>
              <div className={`type-label ${styles.step}`}>
                <span className={`type-micro ${styles.stepIndex}`}>3</span>
                {t('auth.register.stepInvite')}
              </div>
            </div>
            <Button as="a" href="/" variant="primary" fullWidth>
              {t('auth.register.continueDashboard')}
            </Button>
            <Button type="button" variant="ghost" fullWidth onClick={resetToForm}>
              {t('auth.register.useDifferentEmail')}
            </Button>
          </div>
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
          {t('auth.register.signInPrompt')}{' '}
          <Link href="/login">{t('auth.register.signIn')}</Link>
        </div>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div>
            <h1 className="type-title">{t('auth.register.title')}</h1>
            <p className={`type-body ${styles.sub}`}>{t('auth.register.subtitle')}</p>
          </div>

          <div className={styles.socialRow}>
            <Button
              type="button"
              variant="ghost"
              size="compact"
              disabled={submitting}
              onClick={onContinueWithGoogle}
            >
              {t('auth.register.continueGoogle')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="compact"
              disabled={submitting}
              onClick={onContinueWithApple}
            >
              {t('auth.register.continueApple')}
            </Button>
          </div>
          <div className={`type-caption ${styles.or}`}>{t('auth.register.orEmail')}</div>

          <TextField
            label={t('auth.register.fullName')}
            autoComplete="name"
            placeholder={t('auth.register.fullNamePlaceholder')}
            value={fullName}
            error={errors.fullName ? t(errors.fullName) : undefined}
            onChange={(e) => setFullName(e.target.value)}
          />

          <TextField
            label={t('auth.register.email')}
            type="email"
            autoComplete="email"
            placeholder={t('auth.register.emailPlaceholder')}
            value={email}
            error={errors.email ? t(errors.email) : undefined}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className={styles.field}>
            <TextField
              label={t('auth.register.password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder={t('auth.register.passwordPlaceholder')}
              value={password}
              error={errors.password ? t(errors.password) : undefined}
              onChange={(e) => setPassword(e.target.value)}
              trailing={
                <button
                  type="button"
                  className={`type-caption ${styles.btnGhost}`}
                  style={{ width: 'auto', height: 'var(--touch-min)', padding: '0 var(--space-3)', border: 0, background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? t('auth.register.hidePasswordAria') : t('auth.register.showPasswordAria')}
                >
                  {showPassword ? t('auth.register.hidePassword') : t('auth.register.showPassword')}
                </button>
              }
            />
            <div className={styles.meter} aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={i < strength.score ? styles.meterOn : undefined} />
              ))}
            </div>
            <span className={`type-caption ${styles.hintRow}`}>
              <span>{t(strength.labelKey)}</span>
              <span>{t('auth.register.passwordHint')}</span>
            </span>
          </div>

          <label className={`type-label ${styles.field}`}>
            {t('auth.register.currency')}
            <select
              className={`type-body ${styles.input}`}
              value={defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value as AllowedCurrency)}
            >
              {ALLOWED_CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {currencyLabel(code)}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className={`type-label ${styles.terms}`}
            onClick={() => setAcceptedTerms((v) => !v)}
            role="checkbox"
            aria-checked={acceptedTerms}
          >
            <span
              className={`${styles.box} ${acceptedTerms ? styles.boxOn : ''} ${
                errors.acceptedTerms && !acceptedTerms ? styles.boxBad : ''
              }`}
            >
              {acceptedTerms ? '✓' : ''}
            </span>
            <span>
              {t('auth.register.terms')} <a href="#terms">{t('auth.register.termsLink')}</a>{' '}
              {t('auth.register.and')} <a href="#privacy">{t('auth.register.privacyLink')}</a>
            </span>
          </button>
          {errors.acceptedTerms ? (
            <span className={`type-caption ${styles.err}`}>{t(errors.acceptedTerms)}</span>
          ) : null}

          {errors.form ? <span className={`type-caption ${styles.err}`}>{t(errors.form)}</span> : null}

          <Button type="submit" variant="primary" fullWidth isLoading={submitting} disabled={submitting}>
            {submitting ? t('auth.register.submitting') : t('auth.register.submit')}
          </Button>
        </form>
        <Footer />
      </main>
    </div>
  );
}

function BrandPane() {
  const [headlineLine1, headlineLine2] = t('auth.register.brandHeadline').split('\n');
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
          <p className={`type-body ${styles.brandSub}`}>{t('auth.register.brandSub')}</p>
        </div>
        <div className={styles.feat}>
          <div className={styles.featTile}>⇄</div>
          <div>
            <b className="type-body-strong">{t('auth.register.featSplitTitle')}</b>
            <span className={`type-label ${styles.featMuted}`}>{t('auth.register.featSplitBody')}</span>
          </div>
        </div>
        <div className={styles.feat}>
          <div className={styles.featTile}>✓</div>
          <div>
            <b className="type-body-strong">{t('auth.register.featSettleTitle')}</b>
            <span className={`type-label ${styles.featMuted}`}>{t('auth.register.featSettleBody')}</span>
          </div>
        </div>
        <div className={styles.feat}>
          <div className={styles.featTile}>▣</div>
          <div>
            <b className="type-body-strong">{t('auth.register.featInsightsTitle')}</b>
            <span className={`type-label ${styles.featMuted}`}>{t('auth.register.featInsightsBody')}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Footer() {
  return (
    <div className={`type-caption ${styles.footer}`}>
      <span>{t('auth.register.footerCopyright')}</span>
      <a href="#privacy">{t('auth.register.footerPrivacy')}</a>
      <a href="#terms">{t('auth.register.footerTerms')}</a>
      <a href="#help">{t('auth.register.footerHelp')}</a>
    </div>
  );
}

function currencyLabel(code: AllowedCurrency): string {
  return t(`auth.register.currency.${code}`);
}
