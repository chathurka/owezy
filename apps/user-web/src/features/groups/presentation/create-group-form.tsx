'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';
import { t } from '@/core/i18n';
import { Button, TextField } from '@/shared/ui';
import { createGroupViaBff } from '../data/groups-client';
import styles from './groups-list.module.css';

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return '11111111-1111-4111-8111-111111111111';
}

export function CreateGroupForm() {
  const router = useRouter();
  const clientId = useRef(newId());
  const [name, setName] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError(t('groups.create.error.name'));
      return;
    }
    setSubmitting(true);
    setError(undefined);
    try {
      await createGroupViaBff({ id: clientId.current, name: name.trim() });
      router.replace('/groups');
    } catch {
      setError(t('groups.create.error.generic'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <h1 className="type-title">{t('groups.create.title')}</h1>
      <p className={`type-body ${styles.sub}`}>{t('groups.create.subtitle')}</p>

      <form className={styles.form} onSubmit={onSubmit}>
        <TextField
          label={t('groups.create.name')}
          placeholder={t('groups.create.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
        {error ? <p className={styles.error}>{error}</p> : null}
        <Button type="submit" isLoading={submitting} disabled={submitting}>
          {submitting ? t('groups.create.submitting') : t('groups.create.submit')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/groups')}
        >
          {t('groups.create.back')}
        </Button>
      </form>
    </div>
  );
}
