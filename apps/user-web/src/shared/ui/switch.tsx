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
 * Owezy switch — 48×28, primary on / borderStrong off.
 *
 * Design source: owezy-web DesignSystem.dc.html §04 Icon buttons & switches.
 * Tokens from @owezy/design-system/user; never hardcode colours.
 *
 * ```tsx
 * <Switch value={dark} onChange={(v) => setDark(v)} label="Dark mode" />
 * ```
 */
export function Switch({ value, onChange, label, caption, disabled = false }: SwitchProps) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={[styles.root, disabled ? styles.disabled : ''].filter(Boolean).join(' ')}
    >
      <input
        id={id}
        type="checkbox"
        className={styles.nativeInput}
        checked={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={[styles.track, value ? styles.on : ''].filter(Boolean).join(' ')}
        aria-hidden
      >
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
