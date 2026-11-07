import React from 'react';
import styles from './badge.module.css';

export type BadgeVariant = 'owed' | 'owe' | 'primary' | 'neutral' | 'warning';

export type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

/**
 * Owezy status badge — 11/700, padding 4/9, radius 10.
 *
 * Design source: owezy-web DesignSystem.dc.html §04 Badges & avatars.
 * Variants: owed (Settled), owe (Owes), primary (Paid), neutral (Free plan).
 *
 * ```tsx
 * <Badge label="Settled" variant="owed" />
 * <Badge label="Owes" variant="owe" />
 * <Badge label="Paid" variant="primary" />
 * ```
 */
export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{label}</span>;
}
