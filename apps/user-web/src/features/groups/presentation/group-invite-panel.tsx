'use client';

import { useEffect, useState } from 'react';
import { t } from '@/core/i18n';
import { Button, Card } from '@/shared/ui';
import {
  GroupInvitation,
  createInvitationViaBff,
  listInvitationsViaBff,
  revokeInvitationViaBff,
} from '../data/groups-client';
import styles from './groups-list.module.css';

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return '33333333-3333-4333-8333-333333333333';
}

type Props = { groupId: string; inviteCode: string };

export function GroupInvitePanel({ groupId, inviteCode }: Props) {
  const [items, setItems] = useState<GroupInvitation[]>([]);
  const [token, setToken] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const result = await listInvitationsViaBff(groupId);
    setItems(result.items);
  }

  useEffect(() => {
    refresh().catch(() => setError(t('groups.invite.error')));
  }, [groupId]);

  async function onCreate() {
    setBusy(true);
    setError(undefined);
    try {
      const created = await createInvitationViaBff(groupId, { id: newId() });
      setToken(created.token);
      await refresh();
    } catch {
      setError(t('groups.invite.error'));
    } finally {
      setBusy(false);
    }
  }

  async function onRevoke(id: string) {
    setBusy(true);
    setError(undefined);
    try {
      await revokeInvitationViaBff(groupId, id);
      await refresh();
    } catch {
      setError(t('groups.invite.error'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card radius={22}>
      <p className="type-body" style={{ fontWeight: 700 }}>
        {t('groups.invite.title')}
      </p>
      <p className={`type-caption ${styles.meta}`}>
        {t('groups.invite.code', { code: inviteCode })}
      </p>
      <div className={styles.actions}>
        <Button type="button" onClick={onCreate} isLoading={busy} disabled={busy}>
          {t('groups.invite.create')}
        </Button>
      </div>
      {token ? (
        <p className={`type-caption ${styles.meta}`}>
          {t('groups.invite.token', { token })}
        </p>
      ) : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.row}>
            <span className="type-caption">
              {item.status}
              {item.email ? ` · ${item.email}` : ''}
            </span>
            {item.status === 'pending' ? (
              <Button
                type="button"
                variant="ghost"
                size="small"
                disabled={busy}
                onClick={() => onRevoke(item.id)}
              >
                {t('groups.invite.revoke')}
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}
