'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { t } from '@/core/i18n';
import { Button, Card, TextField } from '@/shared/ui';
import {
  archiveGroupViaBff,
  updateGroupViaBff,
} from '../data/groups-client';
import styles from './groups-list.module.css';

type Props = { groupId: string; name: string };

export function GroupSettingsPanel({ groupId, name: initialName }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  async function onSave(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError(t('groups.settings.error.name'));
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      await updateGroupViaBff(groupId, { name: name.trim() });
    } catch {
      setError(t('groups.settings.error.generic'));
    } finally {
      setBusy(false);
    }
  }

  async function onArchive() {
    setBusy(true);
    setError(undefined);
    try {
      await archiveGroupViaBff(groupId);
      router.replace('/groups');
    } catch {
      setError(t('groups.settings.error.generic'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card radius={22}>
      <p className="type-body" style={{ fontWeight: 700 }}>
        {t('groups.settings.title')}
      </p>
      <form className={styles.form} onSubmit={onSave}>
        <TextField
          label={t('groups.settings.name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error ? <p className={styles.error}>{error}</p> : null}
        <Button type="submit" isLoading={busy} disabled={busy}>
          {t('groups.settings.save')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={busy}
          onClick={onArchive}
        >
          {t('groups.settings.archive')}
        </Button>
      </form>
    </Card>
  );
}
