'use client';

import { useEffect, useState } from 'react';
import { t } from '@/core/i18n';
import { Button, Card } from '@/shared/ui';
import { Group, listGroupsViaBff } from '../data/groups-client';
import styles from './groups-list.module.css';

export function GroupsList() {
  const [items, setItems] = useState<Group[] | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await listGroupsViaBff();
        if (!cancelled) setItems(result.items);
      } catch {
        if (!cancelled) setError(t('groups.create.error.generic'));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className="type-title">{t('groups.title')}</h1>
          <p className={`type-body ${styles.sub}`}>{t('groups.subtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button as="a" href="/groups/accept" variant="secondary">
            {t('groups.accept.title')}
          </Button>
          <Button as="a" href="/groups/new">
            {t('groups.new')}
          </Button>
        </div>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      {items && items.length === 0 ? (
        <div className={styles.empty}>
          <p className="type-body">{t('groups.empty')}</p>
          <div className={styles.actions}>
            <Button as="a" href="/groups/new">
              {t('groups.new')}
            </Button>
          </div>
        </div>
      ) : null}

      {items && items.length > 0 ? (
        <div className={styles.list}>
          {items.map((group) => (
            <a key={group.id} href={`/groups/${group.id}`} className={styles.list}>
              <Card radius={22}>
                <div className={styles.row}>
                  <div>
                    <p className="type-body" style={{ fontWeight: 700 }}>
                      {group.name}
                    </p>
                    <p className={`type-caption ${styles.meta}`}>
                      {group.role === 'owner'
                        ? t('groups.role.owner')
                        : t('groups.role.member')}
                      {group.memberCount
                        ? ` · ${t('groups.list.members', { count: group.memberCount })}`
                        : ''}
                    </p>
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
