import React from 'react';
import styles from './alert.module.css';

export type AlertVariant = 'warning' | 'success' | 'info' | 'danger';

const ICONS: Record<AlertVariant, string> = {
  warning: '⚠',
  success: '✓',
  info: 'ℹ',
  danger: '✕',
};

export type AlertProps = {
  message: string;
  variant?: AlertVariant;
  title?: string;
  onDismiss?: () => void;
};

/**
 * Owezy inline alert — radius 18, padding 12/14.
 *
 * Design source: owezy-web DesignSystem.dc.html §04 Alerts & toasts.
 * Tokens from @owezy/design-system/user; never hardcode colours.
 *
 * ```tsx
 * <Alert message="You are 80% through your food budget." variant="warning" />
 * <Alert message="Payment recorded." variant="success" onDismiss={() => {}} />
 * ```
 */
export function Alert({ message, variant = 'warning', title, onDismiss }: AlertProps) {
  return (
    <div className={`${styles.alert} ${styles[variant]}`} role="alert">
      <span className={styles.icon} aria-hidden>
        {ICONS[variant]}
      </span>
      <div className={styles.body}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.message}>{message}</div>
      </div>
      {onDismiss && (
        <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss">
          ✕
        </button>
      )}
    </div>
  );
}
