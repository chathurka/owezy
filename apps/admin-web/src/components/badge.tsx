import React from 'react';
import styles from './badge.module.css';

export type BadgeVariant = 'owed' | 'owe' | 'primary' | 'neutral' | 'warning' | 'danger' | 'info';

export type BadgeProps = { label: string; variant?: BadgeVariant; };

/**
 * Owezy admin status badge — 12px, padding 3/8, radius 8.
 * Admin surface adds danger and info variants.
 *
 * Design source: owezy-admin-console assets/design-system/components/StatusBadge.
 */
export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{label}</span>;
}
