'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { t } from '@/core/i18n';
import { Button, TextField } from '@/shared/ui';
import { acceptInvitationViaBff } from '../data/groups-client';
import styles from './groups-list.module.css';

export function AcceptInvitationForm() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (token.trim().length < 16) {
      setError(t('groups.accept.error.token'));
      return;
    }
    setSubmitting(true);
    setError(undefined);
    try {
      const group = await acceptInvitationViaBff(token.trim());
      router.replace(`/groups/${group.id}`);
    } catch {
      setError(t('groups.accept.error.generic'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <h1 className="type-title">{t('groups.accept.title')}</h1>
      <p className={`type-body ${styles.sub}`}>{t('groups.accept.subtitle')}</p>
      <form className={styles.form} onSubmit={onSubmit}>
        <TextField
          label={t('groups.accept.token')}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          autoComplete="off"
        />
        {error ? <p className={styles.error}>{error}</p> : null}
        <Button type="submit" isLoading={submitting} disabled={submitting}>
          {t('groups.accept.submit')}
        </Button>
      </form>
    </div>
  );
}
