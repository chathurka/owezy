'use client';

import { useEffect, useState } from 'react';
import { t } from '@/core/i18n';
import { Button, Card } from '@/shared/ui';
import {
  GroupOverview as Overview,
  getGroupOverviewViaBff,
} from '../data/groups-client';
import { GroupInvitePanel } from './group-invite-panel';
import styles from './groups-list.module.css';

type Props = { groupId: string };

export function GroupOverview({ groupId }: Props) {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getGroupOverviewViaBff(groupId);
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setError(t('groups.overview.error'));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [groupId]);

  return (
    <div className={styles.page}>
      <Button as="a" href="/groups" variant="ghost">
        {t('groups.create.back')}
      </Button>
      {error ? <p className={styles.error}>{error}</p> : null}
      {data ? (
        <>
          <h1 className="type-title">{data.name}</h1>
          <p className={`type-body ${styles.sub}`}>
            {data.role === 'owner'
              ? t('groups.role.owner')
              : t('groups.role.member')}
            {' · '}
            {t('groups.overview.members', { count: data.memberCount })}
          </p>
          <Card radius={22}>
            <p className="type-body">{t('groups.overview.emptyActivity')}</p>
          </Card>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <GroupInvitePanel
              groupId={data.id}
              inviteCode={data.inviteCode}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
