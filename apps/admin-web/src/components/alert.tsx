import React from 'react';
import styles from './alert.module.css';

export type AlertVariant = 'warning' | 'success' | 'info' | 'danger';
const ICONS: Record<AlertVariant, string> = { warning: '⚠', success: '✓', info: 'ℹ', danger: '✕' };

export type AlertProps = { message: string; variant?: AlertVariant; title?: string; onDismiss?: () => void; };

/**
 * Owezy admin inline alert — tighter than user-web (admin density).
 * Admin surface includes info variant using --info-soft / --info tokens.
 */
export function Alert({ message, variant = 'warning', title, onDismiss }: AlertProps) {
  return (
    <div className={`${styles.alert} ${styles[variant]}`} role="alert">
      <span className={styles.icon} aria-hidden>{ICONS[variant]}</span>
      <div className={styles.body}>
        {title && <div className={styles.title}>{title}</div>}
        <div>{message}</div>
      </div>
      {onDismiss && <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss">✕</button>}
    </div>
  );
}
