import React, { forwardRef } from 'react';
import styles from './text-field.module.css';

export type TextFieldProps = {
  label?: string;
  error?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'>;

/**
 * Owezy admin text field — 40h, radius-md, 14px.
 *
 * Design source: owezy-admin-console assets/design-system (Inputs).
 * Tokens from @owezy/design-system/admin.
 *
 * ```tsx
 * <TextField label="Search" type="search" placeholder="Filter users…" />
 * <TextField label="Email" type="email" error={errors.email} />
 * ```
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, error, leading, trailing, id, ...rest }, ref) {
    const inputId = id ?? `field-${label?.toLowerCase().replace(/\s+/g, '-')}`;
    return (
      <div className={styles.root}>
        {label && (
          <label className={styles.label} htmlFor={inputId}>
            {label}
          </label>
        )}
        <div className={styles.inputWrap}>
          {leading && <span className={styles.leading}>{leading}</span>}
          <input
            ref={ref}
            id={inputId}
            className={[
              styles.input,
              error ? styles.hasError : '',
              leading ? styles.hasLeading : '',
              trailing ? styles.hasTrailing : '',
            ].filter(Boolean).join(' ')}
            {...rest}
          />
          {trailing && <span className={styles.trailing}>{trailing}</span>}
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  },
);
