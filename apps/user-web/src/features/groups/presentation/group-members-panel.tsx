'use client';

import { useEffect, useState } from 'react';
import { t } from '@/core/i18n';
import { Button, Card } from '@/shared/ui';
import {
  GroupMember,
  listMembersViaBff,
  removeMemberViaBff,
} from '../data/groups-client';
import styles from './groups-list.module.css';

type Props = { groupId: string; canManage: boolean };

export function GroupMembersPanel({ groupId, canManage }: Props) {
  const [items, setItems] = useState<GroupMember[]>([]);
  const [error, setError] = useState<string | undefined>();

  async function refresh() {
    const result = await listMembersViaBff(groupId);
    setItems(result.items);
  }

  useEffect(() => {
    refresh().catch(() => setError(t('groups.members.error')));
  }, [groupId]);

  async function onRemove(userId: string) {
    try {
      await removeMemberViaBff(groupId, userId);
      await refresh();
    } catch {
      setError(t('groups.members.error'));
    }
  }

  return (
    <Card radius={22}>
      <p className="type-body" style={{ fontWeight: 700 }}>
        {t('groups.members.title')}
      </p>
      {error ? <p className={styles.error}>{error}</p> : null}
      <ul className={styles.list}>
        {items.map((member) => (
          <li key={member.userId} className={styles.row}>
            <div>
              <p className="type-body">{member.fullName}</p>
              <p className={`type-caption ${styles.meta}`}>
                {member.role === 'owner'
                  ? t('groups.role.owner')
                  : t('groups.role.member')}
              </p>
            </div>
            {canManage && member.role !== 'owner' ? (
              <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={() => onRemove(member.userId)}
              >
                {t('groups.members.remove')}
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}
