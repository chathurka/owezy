import React from 'react';
import styles from './amount.module.css';

export type AmountSign = 'positive' | 'negative' | 'neutral';

export type AmountProps = { value: string; sign: AmountSign; showSignPrefix?: boolean; label?: string; fontSize?: number; className?: string; };

/**
 * Owezy admin amount — enforces money colour rule (sign or label required).
 *
 * Design source: owezy-admin-console (DataTable amounts, KPI cards).
 */
export function Amount({ value, sign, showSignPrefix = true, label, fontSize = 14, className = '' }: AmountProps) {
  const prefix = !showSignPrefix || sign === 'neutral' ? '' : sign === 'positive' ? '+' : '−';
  return (
    <span className={`${styles.root} ${className}`}>
      <span className={`${styles.value} ${styles[sign]}`} style={{ fontSize }}>{prefix}{value}</span>
      {label && <span className={styles.label}>{label}</span>}
    </span>
  );
}
