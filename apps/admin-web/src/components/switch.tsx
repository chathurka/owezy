'use client';

import React, { useId } from 'react';
import styles from './switch.module.css';

export type SwitchProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  caption?: string;
  disabled?: boolean;
};

/**
 * Owezy admin switch — 44×24, primary on / borderStrong off.
 *
 * Design source: owezy-admin-console DesignSystem.html.
 * Tokens from @owezy/design-system/admin.
 */
export function Switch({ value, onChange, label, caption, disabled = false }: SwitchProps) {
  const id = useId();
  return (
    <label htmlFor={id} className={[styles.root, disabled ? styles.disabled : ''].filter(Boolean).join(' ')}>
      <input id={id} type="checkbox" className={styles.nativeInput} checked={value} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className={[styles.track, value ? styles.on : ''].filter(Boolean).join(' ')} aria-hidden>
        <span className={styles.thumb} />
      </span>
      {(label || caption) && (
        <span className={styles.labelGroup}>
          {label && <span className={styles.labelText}>{label}</span>}
          {caption && <span className={styles.captionText}>{caption}</span>}
        </span>
      )}
    </label>
  );
}
