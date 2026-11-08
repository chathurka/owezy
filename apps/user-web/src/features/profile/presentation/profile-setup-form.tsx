'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { t } from '@/core/i18n';
import { Button, TextField } from '@/shared/ui';
import {
  getProfileViaBff,
  updateProfileViaBff,
} from '../data/profile-client';
import {
  ProfileSetupFieldErrors,
  validateProfileSetupInput,
} from '../domain/profile';
import styles from '../../auth/presentation/login-form.module.css';

type Props = {
  initialFullName?: string;
  initialPhone?: string;
  initialPaymentHandle?: string;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

export function ProfileSetupForm({
  initialFullName = '',
  initialPhone = '',
  initialPaymentHandle = '',
}: Props) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [paymentHandle, setPaymentHandle] = useState(initialPaymentHandle);
  const [errors, setErrors] = useState<ProfileSetupFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const profile = await getProfileViaBff();
        if (cancelled) return;
        if (profile.profileSetupCompletedAt) {
          router.replace('/');
          return;
        }
        if (!fullName && profile.fullName) setFullName(profile.fullName);
        if (!phone && profile.phone) setPhone(profile.phone);
        if (!paymentHandle && profile.paymentHandle) {
          setPaymentHandle(profile.paymentHandle);
        }
      } catch {
        // Stay on setup; submit will surface errors if unauthenticated.
      }
    })();
    return () => {
      cancelled = true;
    };
    // Prefill once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initials = useMemo(() => initialsFromName(fullName), [fullName]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const input = {
      fullName,
      phone: phone.trim() || undefined,
      paymentHandle: paymentHandle.trim() || undefined,
      completeSetup: true,
    };
    const nextErrors = validateProfileSetupInput(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await updateProfileViaBff({
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
        paymentHandle: paymentHandle.trim() || undefined,
        completeSetup: true,
      });
      router.replace('/');
    } catch {
      setErrors({ form: 'profile.setup.error.generic' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.brandPane} aria-hidden="true">
        <Link href="/" className={styles.brand}>
          <span className={styles.mark}>O</span>
          {t('app.name')}
        </Link>
        <div>
          <h2 className={styles.brandHeadline}>{t('profile.setup.brandHeadline')}</h2>
          <p className={styles.brandSub}>{t('profile.setup.brandSub')}</p>
        </div>
      </aside>
      <main className={styles.formPane}>
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div>
            <h1 className="type-title">{t('profile.setup.title')}</h1>
            <p className={`type-body ${styles.sub}`}>
              {t('profile.setup.subtitle')}
            </p>
          </div>

          <div
            aria-hidden="true"
            style={{
              width: 'var(--space-12)',
              height: 'var(--space-12)',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--primary)',
              color: 'var(--on-primary)',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 700,
            }}
          >
            {initials}
          </div>

          <TextField
            label={t('profile.setup.fullName')}
            autoComplete="name"
            placeholder={t('profile.setup.fullNamePlaceholder')}
            value={fullName}
            error={errors.fullName ? t(errors.fullName) : undefined}
            onChange={(e) => setFullName(e.target.value)}
          />

          <TextField
            label={t('profile.setup.phone')}
            type="tel"
            autoComplete="tel"
            placeholder={t('profile.setup.phonePlaceholder')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <TextField
            label={t('profile.setup.paymentHandle')}
            autoComplete="username"
            placeholder={t('profile.setup.paymentHandlePlaceholder')}
            value={paymentHandle}
            onChange={(e) => setPaymentHandle(e.target.value)}
          />

          {errors.form ? (
            <p className="type-caption" role="alert">
              {t(errors.form)}
            </p>
          ) : null}

          <Button type="submit" disabled={submitting}>
            {submitting
              ? t('profile.setup.submitting')
              : t('profile.setup.submit')}
          </Button>
        </form>
      </main>
    </div>
  );
}
