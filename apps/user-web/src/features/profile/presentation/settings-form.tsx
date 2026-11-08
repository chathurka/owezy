'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ALLOWED_LOCALES, AppLocale, setLocale, t } from '@/core/i18n';
import { Button, TextField } from '@/shared/ui';
import {
  ALLOWED_CURRENCIES,
  AllowedCurrency,
} from '@/features/auth/domain/register';
import {
  getProfileViaBff,
  updateProfileViaBff,
} from '../data/profile-client';

export function SettingsForm() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentHandle, setPaymentHandle] = useState('');
  const [defaultCurrency, setDefaultCurrency] =
    useState<AllowedCurrency>('USD');
  const [preferredLocale, setPreferredLocale] = useState<AppLocale>('en');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [nameError, setNameError] = useState<string | undefined>();

  useEffect(() => {
    void (async () => {
      try {
        const profile = await getProfileViaBff();
        setFullName(profile.fullName);
        setPhone(profile.phone ?? '');
        setPaymentHandle(profile.paymentHandle ?? '');
        if (
          ALLOWED_CURRENCIES.includes(
            profile.defaultCurrency as AllowedCurrency,
          )
        ) {
          setDefaultCurrency(profile.defaultCurrency as AllowedCurrency);
        }
        if (ALLOWED_LOCALES.includes(profile.preferredLocale as AppLocale)) {
          setPreferredLocale(profile.preferredLocale as AppLocale);
          setLocale(profile.preferredLocale);
        }
      } catch {
        setError(t('settings.error.load'));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSuccess(false);
    setError(undefined);
    if (!fullName.trim()) {
      setNameError(t('profile.setup.error.fullName'));
      return;
    }
    setNameError(undefined);
    setSubmitting(true);
    try {
      await updateProfileViaBff({
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
        paymentHandle: paymentHandle.trim() || undefined,
        defaultCurrency,
        preferredLocale,
      });
      setLocale(preferredLocale);
      setSuccess(true);
    } catch {
      setError(t('settings.error.save'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="type-body">{t('settings.loading')}</p>;
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: 'grid',
        gap: 'var(--space-4)',
        maxWidth: '480px',
      }}
    >
      <div>
        <h1 className="type-title">{t('settings.title')}</h1>
        <p className="type-body">{t('settings.subtitle')}</p>
      </div>

      <TextField
        label={t('profile.setup.fullName')}
        value={fullName}
        error={nameError}
        onChange={(e) => setFullName(e.target.value)}
      />
      <TextField
        label={t('profile.setup.phone')}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <TextField
        label={t('profile.setup.paymentHandle')}
        value={paymentHandle}
        onChange={(e) => setPaymentHandle(e.target.value)}
      />

      <label className="type-label">
        {t('profile.setup.currency')}
        <select
          value={defaultCurrency}
          onChange={(e) =>
            setDefaultCurrency(e.target.value as AllowedCurrency)
          }
          style={{
            display: 'block',
            width: '100%',
            marginTop: 'var(--space-2)',
            height: 'var(--touch-min)',
            borderRadius: 'var(--radius-16)',
            border: '1.5px solid var(--border-strong)',
            padding: '0 var(--space-4)',
            background: 'var(--surface)',
            color: 'var(--text)',
          }}
        >
          {ALLOWED_CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {t(`auth.register.currency.${code}`)}
            </option>
          ))}
        </select>
      </label>

      <label className="type-label">
        {t('profile.setup.language')}
        <select
          value={preferredLocale}
          onChange={(e) => setPreferredLocale(e.target.value as AppLocale)}
          style={{
            display: 'block',
            width: '100%',
            marginTop: 'var(--space-2)',
            height: 'var(--touch-min)',
            borderRadius: 'var(--radius-16)',
            border: '1.5px solid var(--border-strong)',
            padding: '0 var(--space-4)',
            background: 'var(--surface)',
            color: 'var(--text)',
          }}
        >
          {ALLOWED_LOCALES.map((code) => (
            <option key={code} value={code}>
              {t(`profile.setup.language.${code}`)}
            </option>
          ))}
        </select>
      </label>

      {success ? (
        <p className="type-caption" role="status">
          {t('settings.success')}
        </p>
      ) : null}
      {error ? (
        <p className="type-caption" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={submitting}>
        {submitting ? t('settings.saving') : t('settings.save')}
      </Button>
    </form>
  );
}
