'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { t } from '@/core/i18n';
import { Button, TextField } from '@/shared/ui';
import { updateProfileViaBff } from '@/features/profile/data/profile-client';
import {
  createGroupViaBff,
  joinGroupViaBff,
} from '../data/groups-client';
import styles from '../../auth/presentation/login-form.module.css';

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return '11111111-1111-4111-8111-111111111111';
}

export function GroupOnboardingForm() {
  const router = useRouter();
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  async function skip() {
    setSubmitting(true);
    setError(undefined);
    try {
      await updateProfileViaBff({ completeGroupOnboarding: true });
      router.replace('/');
    } catch {
      setError(t('onboarding.group.error.generic'));
    } finally {
      setSubmitting(false);
    }
  }

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError(t('onboarding.group.error.name'));
      return;
    }
    setSubmitting(true);
    setError(undefined);
    try {
      await createGroupViaBff({ id: newId(), name: name.trim() });
      router.replace('/');
    } catch {
      setError(t('onboarding.group.error.generic'));
    } finally {
      setSubmitting(false);
    }
  }

  async function onJoin(event: FormEvent) {
    event.preventDefault();
    if (inviteCode.trim().length < 4) {
      setError(t('onboarding.group.error.code'));
      return;
    }
    setSubmitting(true);
    setError(undefined);
    try {
      await joinGroupViaBff(inviteCode.trim());
      router.replace('/');
    } catch {
      setError(t('onboarding.group.error.generic'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.shell}>
      <main className={styles.formPane} style={{ margin: '0 auto' }}>
        <div className={styles.form}>
          <h1 className="type-title">{t('onboarding.group.title')}</h1>
          <p className={`type-body ${styles.sub}`}>
            {t('onboarding.group.subtitle')}
          </p>

          {mode === 'choose' ? (
            <>
              <Button type="button" onClick={() => setMode('create')}>
                {t('onboarding.group.create')}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setMode('join')}
              >
                {t('onboarding.group.join')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={submitting}
                onClick={() => void skip()}
              >
                {t('onboarding.group.skip')}
              </Button>
            </>
          ) : null}

          {mode === 'create' ? (
            <form onSubmit={onCreate}>
              <TextField
                label={t('onboarding.group.name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('onboarding.group.namePlaceholder')}
              />
              <Button type="submit" disabled={submitting}>
                {t('onboarding.group.createSubmit')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setMode('choose')}
              >
                {t('onboarding.group.back')}
              </Button>
            </form>
          ) : null}

          {mode === 'join' ? (
            <form onSubmit={onJoin}>
              <TextField
                label={t('onboarding.group.code')}
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder={t('onboarding.group.codePlaceholder')}
              />
              <Button type="submit" disabled={submitting}>
                {t('onboarding.group.joinSubmit')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setMode('choose')}
              >
                {t('onboarding.group.back')}
              </Button>
            </form>
          ) : null}

          {error ? (
            <p className="type-caption" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
